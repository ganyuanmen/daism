
import {saveFollow,removeFollow,getFollow} from '../../../../lib/mysql/folllow'
import {createAccept} from '../../../../lib/activity'
import { getUser } from "../../../../lib/mysql/user";
import {signAndSend,broadcast} from '../../../../lib/net'
import { getOne } from "../../../../lib/mysql/message";
import { execute, executeID, getData } from "../../../../lib/mysql/common";
import { getInboxFromUrl,getLocalInboxFromUrl } from '../../../../lib/mysql/message';
import { LRUCache } from 'lru-cache'
import { getTootContent,findFirstURI } from '../../../../lib/utils'
import { getOneByMessageId } from '../../../../lib/mysql/message';

//'../../lib/utils'

const crypto = require('crypto');

const options = {max: 64,maxSize: 5000,
	sizeCalculation: (value, key) => {
	  return 1
	},
	dispose: (value, key) => {
	  console.info('delete key:',key,new Date().getTime())
	},
  
	// how long to live in ms
	ttl: 1000 * 60 * 35,
	allowStale: false,
	updateAgeOnGet: false,
	updateAgeOnHas: false,
	fetchMethod: async (
	  key,
	  staleValue,
	  { options, signal, context }
	) => {},
  }
  
  const cache = new LRUCache(options)

/**
 * 收件箱 接收其它activity 软件推送过来的信息
 * 只接收对方的关注， 不关注其他人
 */

export default async function handler(req, res) {

	if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
	let postbody
	try {
		if(typeof req.body==='string') postbody=JSON.parse(req.body)
		else postbody=req.body 
	} catch (error) {
		console.error("inbox error ",error,req.body)
	}
	
	if(typeof(postbody)!=='object') return res.status(405).json({errMsg:'body json error'})
	if(!postbody.type || !postbody.actor) return res.status(404).json({errMsg:'Invalid JSON'})	
	const _type=postbody.type.toLowerCase();
	if(_type==='delete' && !postbody?.object?.id) {
		console.log("no delete content--->")
		return 	res.status(202).send('Accepted');
	}
	const name = req.query.id;
	console.info(`${new Date().toLocaleString()}:inbox-----${name}-${_type}-${postbody.actor}`);
	if( process.env.IS_DEBUGGER==='1') { 
		console.info(postbody);
		// console.info(req.headers)
	}
	
	const validTypes = ['follow', 'accept', 'undo', 'create', 'update', 'delete','announce'];
    if (!validTypes.includes(_type))   return res.status(200).json({ errMsg: 'No need to handle' });

	let actor = cache.get(postbody.actor);
	if (actor) {
		console.info("命中..............")
	} else {
		console.info(`begin getInboxFromUrl from ${name}:`,postbody.actor)
		try {
		    actor=await getInboxFromUrl(postbody.actor); 
			if(!cache.get(postbody.actor)){
				console.info("setting time:",new Date().getTime())
				cache.set(postbody.actor, actor); // 将新数据存入缓存
			}
		} catch (error) {
			return res.status(500).json({errMsg:error.message})	
		}
	  	

	}

	if(!actor || !actor?.pubkey || !actor?.account) { 
		console.log("actor not found",actor)
		return res.status(404).json({errMsg:'actor not found'});
	}

	try {
		const isVerified = await verifySignature(req,actor,name);
	
		if (isVerified) {
		  	console.log("Signature verified successfully!");
		  // 在这里处理你的ActivityPub消息
			switch (postbody.type.toLowerCase()) {
				case 'accept': 
					accept(postbody,process.env.LOCAL_DOMAIN,actor).then(()=>{});
					break;
				case 'reject':break;
				case 'undo':   //对方取消关注
					undo(postbody).then(()=>{});
					break;
				case 'block':break;
				case 'delete':
					handle_delete(postbody?.object?.id);
					break;
				case 'update':
					handle_update(postbody);
					break;
				case 'create': 	
					createMess(postbody,name,actor).then(()=>{}); 
					break;
				case 'announce':
					handle_announce(postbody,name,actor).then(()=>{});;
					break;
				case 'like':break;
				
				case 'add':break;
				case 'remove': break;
				case 'follow':  //关注
					follow(postbody,name,process.env.LOCAL_DOMAIN,actor).then(()=>{});
				break;
			}
		  	res.status(202).send('Accepted'); // 或者 200 OK，取决于你的用例
		} else {
		  console.warn("Signature verification failed");
		  return res.status(401).json({ error: 'Invalid signature' });
		}
	
	  } catch (error) {
		console.error("Error during signature verification:", error);
		return res.status(500).json({ error: 'Internal server error' });
	  }

	
}

async function handle_announce(postbody,name,actor){
	if(postbody?.object && typeof(postbody.object)==='string' && postbody.object.startsWith('http')) {
		let sql="INSERT IGNORE INTO a_message(manager,message_id,actor_name,avatar,actor_account,actor_url,content,actor_inbox,receive_account,is_send,is_discussion,link_url,top_img,send_type,vedio_url,content_link) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		let paras;
		if(postbody.attributedTo){
			let user=await getLocalInboxFromUrl(postbody.attributedTo);
			if(!user.name) user=await getInboxFromUrl(postbody.attributedTo);
			if(!user.name) return;
			paras=[user.manager??'', postbody.object,user.name,user.avatar,user.account,user.url,
			postbody?.content?postbody.content:`<a href='${postbody.object}' >${postbody.object}</a>`,user.inbox,`${name}@${process.env.LOCAL_DOMAIN}`,0,1,postbody.object,postbody?.topImg,9,postbody?.vedioUrl,postbody?.contentLink]	;
		} else 
		{
			paras=['', postbody.object,actor?.name,actor?.avatar,actor?.account,actor?.url,
				`<a href='${postbody.object}' >${postbody.object}</a>`,actor?.inbox,`${name}@${process.env.LOCAL_DOMAIN}`,0,1,postbody.object,'',9,'',''];	
		}
		executeID(sql,paras).then((insertId)=>{
			if(!postbody?.content) addAnnoceLink(postbody.object, insertId)
		})
	}
	return;
}

function handle_update(postbody) {
	if(!postbody?.object?.id) return;
	const content=(postbody?.object?.content?new String(postbody.object.content).toString():'')
	const imgpath=(postbody?.object?.imgpath?new String(postbody.object.imgpath).toString():'')
	execute("update a_message set content=?,top_img=? where message_id=?",[content,imgpath,postbody?.object?.id]);
	return;
}	


async function handle_delete(rid) {
	if(!rid) return;
	if(rid.includes('communities/enki'))  //远程删除嗯文
		execute("delete from a_message where message_id=?",[rid]);
	else if(rid.includes('commont/enki/')) {  //远程删除回复
		const row=await getData(`select ppid from a_messagesc_commont where message_id=?`,[rid],true)
		if(row.ppid){
			let lok=await execute("delete from a_messagesc_commont where message_id=?",[rid]); //删除回复
			if(lok) {
		   		execute(`UPDATE a_messagesc SET total=total-1 WHERE message_id=?`,[row.ppid]); //更新所有父记录
				execute(`UPDATE a_message SET total=total-1 WHERE message_id=?`,[row.ppid]); //更新所有父记录
			}
		}
		

	}
	else if(rid.includes('commont/enkier/')) {  //远程删除回复
		const row=await getData(`select ppid from a_message_commont where message_id=?`,[rid],true)
		if(row.ppid){
			let lok=await execute("delete from a_message_commont where message_id=?",[rid]); //删除回复
			if(lok)
		    	execute(`UPDATE a_message SET total=total-1 WHERE message_id=?`,[row.ppid]); //更新所有父记录
		}

		

	}
	else { //非enki 嗯文
		execute("delete from a_message where message_id=?",[rid]); //试删除嗯文
		const row=await getData(`select ppid from a_message_commont where message_id=?`,[rid],true)
		if(row.ppid){ //删除回复，如果有
			let lok=await execute("delete from a_message_commont where message_id=?",[rid]);
			if(lok){
				execute(`UPDATE a_message SET total=total-1 WHERE message_id=?`,[row.ppid]); //更新所有父记录
			}
	
		}
   }
	
	return;
}	

async function createMess(postbody,name,actor){ //对方的推送
	
	const content=(postbody?.object?.content?new String(postbody.object.content).toString():'')
	const imgpath=(postbody?.object?.imgpath?new String(postbody.object.imgpath).toString():'')
	
	if(!actor?.account) return;
	const strs=actor?.account.split('@') ;
	let localUser=await getUser('actor_account',`${name}@${process.env.LOCAL_DOMAIN}`,'manager');
	if(!localUser.manager) return;
	const replyType=postbody.object.inReplyTo || postbody.object.inReplyToAtomUri || null;  //inReplyTo:
	if(!replyType ) //不是回复
	{
		let linkUrl=postbody.object.url || postbody.object.atomUri
		let sql="INSERT IGNORE INTO a_message(manager,message_id,actor_name,avatar,actor_account,actor_url,content,actor_inbox,receive_account,is_send,is_discussion,link_url,top_img,send_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		let paras=[actor?.manager??'', postbody.object.id,strs[0],actor?.avatar,actor?.account,postbody.actor,content,actor?.inbox,`${name}@${process.env.LOCAL_DOMAIN}`,0,1,linkUrl,imgpath,1]	
		executeID(sql,paras).then((insertId)=>{addLink(content, insertId); //生成链接卡片
		})
	}
	else { //回复
		if(replyType.includes('communities/enki')){ //是enki 服务推送的
		const ids=replyType.split('/');
		const id=ids[ids.length-1];
			const sctype=ids[ids.length-2]==='enki'?'sc':'';
			let re=await getOneByMessageId(id,replyType,sctype)
			if(re['is_discussion']==1 && re?.message_id) //允许讨论
			{
				const sql=`INSERT IGNORE INTO a_message${sctype}_commont(manager,pid,ppid,message_id,actor_name,avatar,actor_account,actor_url,content,type_index,vedio_url,top_img,bid) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`
				const paras=[
					postbody?.object?.manager??'',
					re['id'],
					re?.message_id,
					postbody.object.id,
					strs[0],
					actor?.avatar,
					actor?.account,
					postbody.actor,
					content,
					postbody?.object?.typeIndex??'',
					postbody?.object?.vedioUrl??'',
					postbody?.object?.topImg??'',
					postbody?.object?.bid??''
				];

				
				execute(sql,paras).then(()=>{});
				
			}
		}
		else { // 非enki 服务推送的
			let message=await getOne({replyType,sctype:''})
			if(message?.id)
			execute(`INSERT IGNORE INTO a_message_commont(ppid,pid,message_id,actor_name,avatar,actor_account,actor_url,content,bid) values(?,?,?,?,?,?,?,?,?)`,
				[replyType,message['id'],postbody.object.id,strs[0],actor?.avatar,actor?.account,postbody.actor,content,Math.floor(Date.now()/1000)]).then(()=>{});
			}
	}
	
}


async function undo(postbody){  //别人取消关注 
	if(!postbody.object || !postbody.object.id) return 'activity error!';
	await removeFollow(postbody.object.id)
	broadcast({type:'removeFollow',domain:process.env.LOCAL_DOMAIN,actor:{},user:{},followId:postbody.object.id})  //广播信息
	return 'undo handle ok'
}

async function accept(postbody,domain,actor) //我关注他人的确认
{
	// let actor=await getInboxFromUrl(postbody.actor); 
	// if( process.env.IS_DEBUGGER==='1') console.info("accept actor",actor)
	let user=await getLocalInboxFromUrl(postbody.object.actor);
	// if( process.env.IS_DEBUGGER==='1') console.info("accept user",actor)
	let re= await saveFollow({actor,user,followId:postbody.object.id})  //关注他人的确认
	broadcast({type:'follow',domain,user,actor,followId:postbody.object.id})  //广播信息
	return "accept handle ok"
}

async function follow(postbody,name,domain,actor) //别人的关注
{
	// let actor=await getInboxFromUrl(postbody.actor); //主动关注者
	// if( process.env.IS_DEBUGGER==='1') { 
	// 	console.info("follow get actor:-----------------------------------------------")
	// 	console.info(actor)
	// }
	//  user=await getLocalInboxFromUrl(postbody.object.actor);

	let user=await getLocalInboxFromUrl(postbody.object) //被动关注者
	if( process.env.IS_DEBUGGER==='1') { 
		console.info("follow get user:-----------------------------------------------------")
		console.info(user)
	}
	if(!actor?.inbox) return  `no found for ${postbody.actor}`;
	if(user.name.toLowerCase()!==name.toLowerCase() || user.domain.toLowerCase()!==domain.toLowerCase()) return 'activity error ';
	let thebody=createAccept(postbody,name,domain);
	let follow=await getFollow({actorAccount:user.account,userAccount:actor?.account}); // 注：是actor 关注user
	let localUser=await getUser('actor_account',user.account,'privkey,dao_id')
	if(follow['follow_id']) { 
	console.info("已关注"); //已关注
	await removeFollow(follow['follow_id'])
	} 
	
	let lok=await saveFollow({actor:user,user:actor,followId:postbody.id});// 被他人关注 
	if(lok)
	{
		console.info("follow save is ok")
		broadcast({type:'follow',domain,actor:user,user:actor,followId:postbody.id})  //广播信息
		signAndSend(actor?.inbox,name,domain,thebody,localUser.privkey);
		return 'follow handle ok!'
	}  
	else  return 'server handle error';

}

function stringToJson(str) {
    const obj = {};
    // 使用正则表达式来匹配键值对
    const regex = /(\w+)="([^"]+)"/g;
    let match;

    // 使用循环找到所有匹配项
    while ((match = regex.exec(str)) !== null) {
        const key = match[1];      // 键
        const value = match[2];    // 值

        // 将键值对添加到对象中
        obj[key] = value;
    }

    return obj;
}


async function verifySignature(req,actor,name) {
	const signatureHeader = req.headers['signature'];
	const host = req.headers.host;
	const date = req.headers.date;
	const digest = req.headers.digest;
	const contentType = req.headers['content-type'];
  
	if (!host || !date || !digest || !contentType) {
		console.warn("Missing required headers for signature verification");
		return false;
	}
  
	
	// console.log("1req.url:",req.url)
	let inboxFragment =req.url; // `/api/activitepub/inbox/${name}`;
	// console.log("2inboxFragment:",inboxFragment)
	// if(!req.headers.host || !req.headers.date || !req.headers.digest || !req.headers['signature']) {
	// 	console.info("no signature item error")
	// 	return res.status(403).json({errMsg:'signature error'});
	// }
	// let stringToSign = `(request-target): post ${inboxFragment}\nhost: ${req.headers.host}\ndate: ${req.headers.date}\ndigest: ${req.headers.digest}\ncontent-type: application/activity+json`;
	// console.log("3stringToSign:",stringToSign)
	// const verify = crypto.createVerify('RSA-SHA256');
	// verify.update(stringToSign);
	// verify.end();

	// let tempAr=req.headers['signature'].split(",");
	// const jsonObj = stringToJson(tempAr[tempAr.length-1]);
	// console.log("4jsonObj:",jsonObj)
	// const isVerified = verify.verify(actor?.pubkey, jsonObj.signature, 'base64'); // 验证签名
	// console.log("5verify:",actor?.pubkey, jsonObj.signature)
	// if(!isVerified) {
	// 	console.info("checks signature error")
	// 	 return res.status(403).json({errMsg:'signature error'});
	// }


	// const inboxFragment = '/inbox'; //  假设 inbox 的路径是 /inbox
  
	try {
	  const { keyId, algorithm, headers, signature } = parseSignatureHeader(signatureHeader);
  
	  // 1. 获取Actor公钥
	  const publicKey = actor?.pubkey;
  
	  // 2. 构建签名字符串
	  const stringToSign = createStringToSign(req, inboxFragment, headers);
		// console.log("stringToSign",stringToSign)
	  // 3. 验证签名
	  const isVerified = await verifyRsaSignature(stringToSign, signature, publicKey, algorithm);
	  return isVerified;
  
	} catch (error) {
	  console.error("Error in verifySignature:", error);
	  return false;
	}
  }
  
  // Helper function to parse the Signature header
  function parseSignatureHeader(signatureHeader) {
	const parts = signatureHeader.split(',').map(part => part.trim());
	const params = {};
  
	for (const part of parts) {
	  const [key, value] = part.split('=').map(s => s.trim());
	  if (key && value) {
		const unquotedValue = value.replace(/^"(.*)"$/, '$1'); // Remove quotes
		params[key] = unquotedValue;
	  }
	}
  
	if (!params.keyId || !params.algorithm || !params.headers || !params.signature) {
	  throw new Error('Missing required parameters in Signature header');
	}
  
	return {
	  keyId: params.keyId,
	  algorithm: params.algorithm,
	  headers: params.headers,
	  signature: params.signature,
	};
  }
  
  function createStringToSign(req, inboxFragment, signedHeaders) {
	  const headers = signedHeaders.split(" ");
	  let stringToSign = "";
  
	  for (const header of headers) {
		  switch (header) {
			  case "(request-target)":
				  stringToSign += `(request-target): post ${inboxFragment}\n`;
				  break;
			  default:
				  stringToSign += `${header}: ${req.headers[header]}\n`;
		  }
	  }
  
	  return stringToSign.trim(); // Remove trailing newline
  }
  
  
  async function verifyRsaSignature(stringToSign, signature, publicKey, algorithm) {
	try {
	  const verify = crypto.createVerify(algorithm.toUpperCase()); // Use algorithm from header
	  verify.update(stringToSign);
	  verify.end();
  
	  const isVerified = verify.verify(publicKey, signature, 'base64');
	  return isVerified;
	} catch (error) {
	  console.error("Error during RSA signature verification:", error);
	  return false;
	}
  }

  

async function addAnnoceLink(url, id) {

        let tootContent = await getTootContent(url, process.env.LOCAL_DOMAIN)
        if (tootContent) {
            await execute('update a_message set content_link=? where id=?', [tootContent, id]);
        } 
  
}


async function addLink(content, id) {
    const furl = findFirstURI(content)
    const sql = `update a_message set content_link=? where id=?`
    if (furl) {
        let tootContent = await getTootContent(furl, process.env.LOCAL_DOMAIN)
        if (tootContent) {
            await execute(sql, [tootContent, id]);
        } else {
            await execute(sql, ['', id]);
        }
    }else {
        await execute(sql, ['', id]);
    }
}





	// console.log("1req.url:",req.url)
	// let inboxFragment = `/api/activitepub/inbox/${name}`;
	// console.log("2inboxFragment:",inboxFragment)
	// if(!req.headers.host || !req.headers.date || !req.headers.digest || !req.headers['signature']) {
	// 	console.info("no signature item error")
	// 	return res.status(403).json({errMsg:'signature error'});
	// }
	// let stringToSign = `(request-target): post ${inboxFragment}\nhost: ${req.headers.host}\ndate: ${req.headers.date}\ndigest: ${req.headers.digest}\ncontent-type: application/activity+json`;
	// console.log("3stringToSign:",stringToSign)
	// const verify = crypto.createVerify('RSA-SHA256');
	// verify.update(stringToSign);
	// verify.end();

	// let tempAr=req.headers['signature'].split(",");
	// const jsonObj = stringToJson(tempAr[tempAr.length-1]);
	// console.log("4jsonObj:",jsonObj)
	// const isVerified = verify.verify(actor?.pubkey, jsonObj.signature, 'base64'); // 验证签名
	// console.log("5verify:",actor?.pubkey, jsonObj.signature)
	// if(!isVerified) {
	// 	console.info("checks signature error")
	// 	 return res.status(403).json({errMsg:'signature error'});
	// }