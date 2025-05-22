import { getData,execute } from './common'
import { httpGet,signAndSend } from "../net"; 
import { getUser } from './user';
import {getFollowers_send} from '../mysql/folllow';
import {createAnnounce} from '../../lib/activity'
import { sendfollow } from '../utils/sendfollow';
import { sendcommont } from '../utils/sendcommont';

 
////pi,menutype,daoid,w,actorid:嗯文人ID,account,order,eventnum
// menutype 1 我的社区，2 公区社区 3 个人社区
//eventnum 社区: 0 非活动，1活动, 个人：1:首页 2:我的嗯文 3:我的收藏 4:我的接收嗯文 ,8 过滤（where 为过滤值）
// v: 1 我关注的社区
export async function messagePageData({pi,menutype,daoid,w,actorid,account,order,eventnum,v})
{
	let sql=`select a.* from v_message${parseInt(menutype)===3?'':'sc'} a where 1=1`;
	let sctype='';
	switch(parseInt(menutype))
	{
		case 1: //我的社区
			if(parseInt(v)===3) sql=`select a.* from v_messagesc a join a_bookmarksc b on a.message_id=b.pid where b.account='${account}'`; //我的收藏
			else if(parseInt(v)===6) sql=`select a.* from v_messagesc a join a_heartsc b on a.message_id=b.pid where b.account='${account}'`; //喜欢
			else if(parseInt(v)===1) sql=`select a.* from v_messagesc a join a_follow b on a.actor_account=b.actor_account WHERE b.user_account='${account}'`; //我关注的社区
			else{ 
				if(daoid.includes(',')) sql=`select a.* from v_messagesc a where dao_id in(${daoid})`;
				else sql=`select a.* from v_messagesc a where dao_id=${daoid}`;
				if(parseInt(eventnum)===1) sql=`${sql} and _type=1`;
				else if(parseInt(eventnum)===8) sql=`select a.* from v_messagesc a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`; //过滤
			}
			sctype='sc'
			break;
		case 2: //公区社区
			if(parseInt(daoid)>0) sql=`select * from v_messagesc a where dao_id=${daoid}`; //单个dao
			else if(parseInt(eventnum)===1) sql="select * from v_messagesc a where _type=1"; //活动
			else if(parseInt(eventnum)===8) sql=`select * from v_messagesc a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`; //过滤
			else if(parseInt(eventnum)===9) sql=`select * from v_messagesc a where actor_id=${actorid}`; //个人发布的
			sctype='sc';
			break;
		default: //个人
			if(parseInt(eventnum)===1) sql=`select a.* from v_message a where (send_type=0 and actor_account='${account}') or receive_account='${account}'`; //首页
			else if(parseInt(eventnum)===2) sql=`select a.* from vv_message a where actor_account='${account}'`; //我发布的嗯文
			else if(parseInt(eventnum)===3) sql=`select a.* from vv_message a join a_bookmark b on a.message_id=b.pid where b.account='${account}'`; //我的收藏
			else if(parseInt(eventnum)===4) sql=`select a.* from v_message a where receive_account='${account}'`; //我的接收嗯文
			else if(parseInt(eventnum)===5)	sql='select a.* from v_message a where send_type=0 and property_index=1'; //公开
			else if(parseInt(eventnum)===6) sql=`select a.* from vv_message a join a_heart b on a.message_id=b.pid where b.account='${account}'`; //喜欢
			else if(parseInt(eventnum)===7) sql=`select a.* from v_message a where receive_account='${account}' and send_type=2`; //@
			else if(parseInt(eventnum)===8) sql=`select a.* from vv_message a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`; //过滤
			break;
	}
	// if(w) where=where?`${where} and title like '%${w}%'`:`where title like '%${w}%'`;

	// let sql=`select * from v_message${sctype} ${where} order by ${order} desc limit ${pi*12},12`;
	let re=await getData(`${sql} order by ${order} desc limit ${pi*12},12`,[]);

	if(parseInt(menutype)===1 || parseInt(menutype)===2 || parseInt(v)===9999){

		re=re.filter(obj => obj.is_top===0);
		if(parseInt(pi)===0){ //首页
			let re1=await getData(`${sql} and a.is_top=1 order by ${order} desc`,[]);
			re= [...re1, ...re]
		}
	} 

	
	// if(parseInt(menutype)===3 && parseInt(eventnum)===3){ //从sc取出收藏
	// 	sql=`select * from v_messagesc where id in(select pid from a_bookmarksc where account='${account}') order by ${order} desc limit ${pi*12},12`;
	// 	const re1=await getData(sql,[]);
	// 	re=[...re,...re1]
	// 	re.sort((a, b) => {
	// 		return b.reply_time.localeCompare(a.reply_time); 
	// 		// return a.reply_time < b.reply_time; 
	// 	  });
	// }else if(parseInt(menutype)===3 && parseInt(eventnum)===5){
	// 	sql=`select * from v_messagesc where id in(select pid from a_heartsc where account='${account}') order by ${order} desc limit ${pi*12},12`;
	// 	const re1=await getData(sql,[]);
	// 	re=[...re,...re1]
	// 	re.sort((a, b) => {
	// 		return b.reply_time.localeCompare(a.reply_time); 
	// 		// return a.reply_time < b.reply_time; 
	// 	  });
	// }

	return re; 
}

export async function getEnkiTotal({account,actorid}) {
	let sql='SELECT COUNT(*) AS total FROM a_message WHERE LOWER(actor_account)=? UNION ALL SELECT COUNT(*) AS total FROM a_messagesc WHERE actor_id=? UNION ALL SELECT COUNT(*) AS total FROM a_sendmessage WHERE LOWER(receive_account)=?';
	let re=await getData(sql,[account,actorid,account]);
	return re; 
}

//dao 注册帐号列表
export async function daoPageData({pi,w})
{
	let sql
	if(w) sql=`SELECT dao_id,actor_account,avatar FROM a_account WHERE dao_id>0 and actor_name like '%${w}%' order by id limit ${pi*10},10`;
	else sql=`SELECT dao_id,actor_account,avatar FROM a_account WHERE dao_id>0 order by id limit ${pi*10},10`;
	let re=await getData(sql,[]);
	return re; 
}

//element.user_account--->receive_account
//`https://${process.env.LOCAL_DOMAIN}/communities/${sctype}/${id}`--->linkUrl
export async function insertMessage(account,message_id,pathtype,contentType,idx)
{
	let sctype=pathtype==='enkier'?'':'sc';
	let re=await getData(`SELECT message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,title,content,top_img FROM v_message${sctype} where message_id=?`
	,[message_id],true);

	let linkUrl=`https://${process.env.LOCAL_DOMAIN}/communities/${pathtype}/${message_id}`
	let sql;
	let paras;
	if(contentType==='Create') {
		sql="INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,link_url,title,content,is_send,is_discussion,top_img,receive_account,send_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		paras=[re.message_id,re.manager,re.actor_name,re.avatar,re.actor_account,re.actor_url,re.actor_inbox,linkUrl,re.title,re.content,0,1,re.top_img,account,1]
		execute(sql,paras);
	} else if(contentType==='Update' && sctype==='sc' && idx===0)
	{
		
		sql="update a_message set content=?,top_img=? where message_id=? and receive_account!=''";
		paras=[re.content,re.top_img,re.message_id];
		execute(sql,paras)

	} 
	// else if(contentType==='Delete' && idx===0 )
	// {
	// 	sql="delete from a_message where message_id=?";
	// 	paras=[re.message_id]
	// }

	
}
 //获取回复总数
export async function getReplyTotal({sctype,pid})
{
	let sql=`select count(*) as total from a_message${sctype}_commont where pid=?`
	let re=await getData(sql,[pid])
	return re[0].total

}


//所有回复
export async function replyPageData({pi,sctype,pid})
{

	let sql=`select * from v_message${sctype}_commont where pid=? order by bid DESC,createtime ASC limit ${pi*20},20`
	let re=await getData(sql,[pid]);
	return re; 
}

//取置顶
export async function setTopMessage({id,sctype,flag})
{
    return await execute(`update a_message${sctype} set is_top=? where message_id=?`,[flag,id]);
	
}


//删除 注： 此处的path 仅表示从哪里删除，与sctype 无关
export async function messageDel({mid,type,path,sctype,pid,rAccount,account})
{
    if(parseInt(type)===0) {
		let lok;
		if(path==='enki'){
			lok=await execute(`delete from a_messagesc where message_id =?`,[mid]);
		} else if(path==='enkier'){
			if(rAccount) lok=execute(`delete from a_sendmessage where message_id =? and receive_account=?`,[mid,rAccount]);
			else lok=execute(`delete from a_message where message_id =?`,[mid]);
		}
		if(lok && !rAccount){ //主嗯文
			sendfollow(account,'','','',mid,sctype==='sc'?'enki':'enkier','','Delete'); 
		}
	}
    else{ 
		let lok=await execute(`call del_commont(?,?,?)`,[sctype,mid,pid]); //删除回复
		if(lok){
		//	const data=await getData("select actor_account from a_message where message_id=?",[pid],true);
		//	if(data?.actor_account) 
				sendcommont(account,mid,sctype==='sc'?'enki':'enkier') 
		}	
	}
}

//获取所有已注册的dao
export async function getAllSmartCommon()
{
    let re= await getData('select * from v_allsmartcommon',[]);
    return re || []
}


//获取点赞数量及是否已点赞heart  获取收藏数量及是否已收藏bookmark  account:人id pid:嗯文id
export async function getHeartAndBook({pid,account,table,sctype})
{
    let sql=`SELECT a.total,IFNULL(b.pid,'') pid FROM (SELECT COUNT(*) total FROM a_${table}${sctype} WHERE pid=?) a LEFT JOIN (SELECT pid FROM a_${table}${sctype} WHERE pid=? and account=?) b ON 1=1`;
	let re= await getData(sql,[pid,pid,account]);
    return re || []
}


//点赞、取消点赞 heart  收藏、取消收藏 bookmark  account:人id pid:嗯文id
export async function handleHeartAndBook({account,pid,flag,table,sctype})
{
    if(flag==0) return await execute(`delete from a_${table}${sctype} where pid=? and account=?`,[pid,account]);
    else return await execute(`insert into a_${table}${sctype}(account,pid) values(?,?)`,[account,pid]);
}
//转发 linkurl 用于远程

export async function setAnnounce({account,id,content,sctype,topImg,vedioUrl,toUrl,linkurl})
{	
	let lok=await execute('call send_annoce(?,?,?)',[sctype,id,account]);
	if(lok){
		try{		
			const re=await getData("select domain,actor_name,privkey from v_account where actor_account=?"
			,[account],true);
			let sendbody;
			getFollowers_send({account}).then(async data=>{
				data.forEach(element => {
					if(!sendbody) sendbody=createAnnounce(re.actor_name,process.env.LOCAL_DOMAIN,linkurl,content,topImg,vedioUrl,toUrl) ;
					signAndSend(element.user_inbox,re.actor_name,re.domain,sendbody,re.privkey);
				});
			})
		}catch(e1){ console.error(e1)}
	}
  
}

//获取捐赠的嗫后一条
export async function getLastDonate({did})
{
	const sql='SELECT * FROM t_donate WHERE donor_address=? ORDER BY block_num DESC LIMIT 1';
	let re= await getData(sql,[did]);
	return  re[0] || {};
}

//获取一条嗯文
export async function getOne({id,sctype})
{
    let re= await getData(`select * from v_message${sctype} where message_id=?`,[id]);
	if(re.length) return  re[0]
	else return {}
}

//获取一条嗯文
export async function getOneByMessageId(id1,id2,sctype)
{
    let re= await getData(`select * from v_message${sctype} where message_id=? or message_id=?`,[id1,id2]);
	if(re.length) return  re[0]
	else return {}
}

//获取是否已转发
export async function getAnnoce({id,account})
{
    let re= await getData(`select 1 from a_annoce where pid=? and account=?`,[id,account]);
    return  re || []
}

//查找我关注过的人
async function findFollow(actor_account,user_account){
	let sql="select id from a_follow where actor_account=? and user_account=?";
	let re=await getData(sql,[actor_account,user_account])
	if(re && re.length>0 ) return re[0].id; //找到
	else return 0;
}

//actor_account 查找的帐号 user_account 本地帐号
export async function fromAccount({actor_account,user_account}){
	let obj={};
	if(actor_account.includes(process.env.LOCAL_DOMAIN)){ //本地帐号
		// {name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
		let sql='SELECT actor_name `name`, actor_inbox inbox,domain,actor_account account,actor_url url,avatar,pubkey FROM v_account where actor_account=? || actor_url=?';
		let re=await getData(sql,[actor_account,actor_account]);
		if(re[0]){
			obj=re[0]
			obj['id']=await findFollow(actor_account,user_account)
		} 
	} else { //非本地， 需要从远程服务器下载
		if(actor_account.startsWith('http')) obj=await getInboxFromUrl(actor_account);
		else obj=await getInboxFromAccount(actor_account);
	
		if(obj.inbox){ //找到帐号后是否已经关注
			obj['id']=await findFollow(actor_account,user_account)
		}

	}
	return obj;

}

export async function getInboxFromAccount(account) {
	let reobj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
	try {
		let strs=account.split('@')
		let obj={name:strs[0],domain:strs[1],inbox:''}
		let re=await httpGet(`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
		// let re=await httpGet(`http://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
		if(re.code!==200) return obj;
		re=re.message;
		if(!re) return obj;
		let url,type;
		for(let i=0;i<re.links.length;i++)
		{
			if(re.links[i].rel==='self')
			{
				url=re.links[i].href;
				type=re.links[i].type
				break;
			}
		}
		reobj=await getInboxFromUrl1(url,type);
	}catch(e){
		console.error(e)
	}finally{
		return reobj;
	}

}

export async function getLocalInboxFromAccount(account) {
	let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let user=await getUser('actor_account',account,'actor_url,avatar,pubkey');
	if(!user['actor_url']) return obj;
	const [userName,domain]=account.split('@');

	return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`,account,url:user['actor_url'],pubkey:user['pubkey'],avatar:user['avatar']}
}

export async function getLocalInboxFromUrl(url){
	let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:'',manager:''}
	let user=await getUser('actor_url',url,'actor_account,avatar,pubkey,manager');
	// if( process.env.IS_DEBUGGER==='1') { console.info("user",user)	}
	if(!user['actor_account']) return obj;
	const [userName,domain]=user.actor_account.split('@');

	return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`
	,account:user['actor_account'],url,pubkey:user['pubkey'],avatar:user['avatar'],manager:user['manager']}
}

export async function getInboxFromUrl(url,type='application/activity+json'){
	const myURL = new URL(url);
	let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:'',manager:''}
	let re= await httpGet(url,{"Content-Type": type})
	if(re.code!==200) return obj;
	re=re.message
	if(!re) return obj;
	if(re.name) obj.name=re.name;
	if(re.inbox) { 
	obj.inbox=re.inbox; 
	obj.desc=re.summary;
	obj.manager=re.manager;
	obj.pubkey=re.publicKey.publicKeyPem;
	obj.url=re.id;
	obj.account=`${re.name}@${myURL.hostname}`
	}
	if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
	else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

	return obj 
}


async function getInboxFromUrl1(url,type='application/activity+json'){
	const myURL = new URL(url);
	let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:'',manager:''}
	let re= await httpGet(url,{"Content-Type": type})
	if(re.code!==200) return obj;
	re=re.message
	if(!re) return obj;
	if(re.name) obj.name=re.name;
	if(re.inbox) { 
	obj.inbox=re.inbox; 
	obj.desc=re.summary;
	obj.manager=re.manager;
	obj.pubkey=re.publicKey.publicKeyPem;
	obj.url=re.id;
	obj.account=`${re.name}@${myURL.hostname}`
	}
	if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
	else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

	return obj 
}

//getData中 从网页获取个人信息 
export async function getUserFromUrl({url}){
	const myURL = new URL(url);
	let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let re= await httpGet(url,{"Content-Type": 'application/activity+json'})
	if(re.code!==200) return obj;
	re=re.message
	if(!re) return obj;
	if(re.name) obj.name=re.name;
	if(re.inbox) { 
	obj.inbox=re.inbox; 
	obj.desc=re.summary;
	obj.pubkey=re.publicKey.publicKeyPem;
	obj.url=re.id;
	obj.account=`${re.name}@${myURL.hostname}`
	}
	if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
	else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

	return obj 
}
