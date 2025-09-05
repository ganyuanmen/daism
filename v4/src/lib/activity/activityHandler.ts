import { NextRequest } from "next/server";
import { execute, getData } from "../mysql/common";
import { getFollow, removeFollow, saveFollow } from "../mysql/folllow";
import { getInboxFromUrl, getLocalInboxFromUrl, getOne, getOneByMessageId, getUserFromUrl } from "../mysql/message";
import { getUser } from "../mysql/user";
import { broadcast, getSigneActor } from "../net";
import { findFirstURI, getTootContent } from "../utils";
import type { ActivityPubBody, NoteMessage,Attachment } from "./createMessage";
import crypto from 'crypto';
import { createAccept } from "@/lib/activity";
import { sendSignedActivity } from "./sendSignedActivity";


interface SignatureParams {
    keyId: string;
    algorithm: string;
    headers: string;
    signature: string;
  }
  

  
//更改
export async function handle_update(postbody: ActivityPubBody) {
    if (typeof postbody.object === 'object' && postbody.object.id){

        const object = postbody.object as NoteMessage;   
        const content = object.content ? String(object.content) : '';
        const imgpath = object.imgpath ? String(object.imgpath) : '';
        const vedioUrl = object.vedioURL ? String(object.vedioURL) : '';
    
        execute(
        "update a_message set content=?,top_img=?,vedio_url=? where message_id=?",
        [content, imgpath, vedioUrl, object.id]
        ).then(() => { addLink(content, object.id??'', 'update'); });
    }
}
  //建新的嗯文 ,对方的推送
export async function createMess(postbody:ActivityPubBody,name:string,actor:ActorInfo){
    if (typeof postbody.object === 'object' && postbody.object.content){
        const noteObj = postbody.object as NoteMessage;
        let imgpath='';
        let vedioURL='';
        if(noteObj.attachment && Array.isArray(noteObj.attachment)){
            noteObj.attachment.forEach((element:Attachment) =>{
                if(element.mediaType && element.mediaType.startsWith("image")) imgpath=element?.url as string;
                else if(element.mediaType && element.mediaType.startsWith("video")) vedioURL=element?.url as string;
            })
        }
        
        if(!actor.account) return;
        const[actorName,domain] =actor.account.split('@') ;
        const localUser=await getUser('actor_account',`${name}@${process.env.LOCAL_DOMAIN}`,'manager');
        if(!localUser.manager) return;
        const replyType=noteObj.inReplyTo || noteObj.inReplyToAtomUri || null;  //inReplyTo:
        if(!replyType ) //不是回复
        {
            const linkUrl=noteObj.url || noteObj.atomUri
            execute("call inbox_in(?,?,?,?,?,?,?,?,?,?,?,?,?)",[
                actor.manager??'',noteObj.id,actorName,actor.avatar,actor.account,postbody.actor,noteObj.content,actor.inbox,
                `${name}@${process.env.NEXT_PUBLIC_DOMAIN}`,linkUrl,imgpath,vedioURL,1]).then(()=>{
                    addLink(noteObj.content??'', noteObj.id??'','create');
                })

            
            
        }
        else { //回复
            let sctype='';
            let re:EnkiMessType;
            if(replyType.includes('communities/enki')){ //是enki 服务推送的
            const ids=replyType.split('/');
            const id=ids[ids.length-1];
                sctype=ids[ids.length-2]==='enki'?'sc':'';
                re=await getOneByMessageId(id,replyType,sctype) as EnkiMessType;
            }
            else { // 非enki 服务推送的
                re=await getOne({id:replyType,sctype:''}) as EnkiMessType;
            }
                
            if(re.message_id && re?.is_discussion===1 ) //允许讨论
            {
                const paras=[
                    noteObj.manager??'',
                    re.message_id??'',
                    noteObj.id,
                    domain,
                    actor.avatar,
                    actor.account,
                    postbody.actor,
                    noteObj.content,
                    noteObj.typeIndex??'0',
                    vedioURL,
                    imgpath,
                    noteObj.bid??Math.floor(Date.now()/1000)
                ];
                const sql=`INSERT IGNORE INTO a_message${sctype}_commont(manager,pid,message_id,actor_name,avatar,actor_account,actor_url,content,type_index,vedio_url,top_img,bid) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
                execute(sql,paras);
                
            }
        }
    }
}


//转发
export async function handle_announce(postbody: ActivityPubBody, name: string, actor: ActorInfo) {
    if (postbody.object && typeof postbody.object === 'string' && postbody.object.startsWith('http')) {
      let paras: any[];
      
      if (postbody.attributedTo) {
        let user = await getLocalInboxFromUrl(postbody.attributedTo) as ActorInfo;
        if (!user.name) user = await getInboxFromUrl(postbody.attributedTo) as ActorInfo;
        if (!user.name) return;
        
        paras = [
          user.manager ?? '',
          postbody.object,
          user.name,
          user?.avatar,
          user.account,
          user.url,
          postbody.content ? postbody.content : `<a href='${postbody.object}' >${postbody.object}</a>`,
          user.inbox,
          `${name}@${process.env.NEXT_PUBLIC_DOMAIN}`,
          postbody.object,
          postbody.topImg ?? '',
          postbody.vedioUrl ?? '',
          9
        ];
      } 
      else 
      {
        paras = [
          '',
          postbody.object,
          actor?.name,
          actor?.avatar,
          actor.account,
          actor.url,
          postbody?.content ? postbody.content : `<a href='${postbody.object}' >${postbody.object}</a>`,
          actor.inbox,
          `${name}@${process.env.NEXT_PUBLIC_DOMAIN}`,
          postbody.object,
          postbody?.topImg ?? '',
          postbody?.vedioUrl ?? '',
          9
        ];
      }
      
      await execute("call inbox_in(?,?,?,?,?,?,?,?,?,?,?,?,?)", paras);
      
      if(postbody.content){
        addLink(postbody.content, postbody.object, 'announce');
      }
    } 
  }

//删除
export async function handle_delete(rid?: string) {
    if (!rid) return;
    
    if (rid.includes('communities/enki')) {
     await execute(`delete from a_message where message_id =?`, [rid]);
    } 
    else 
    {
        let sctype = '';
        if (rid.includes('commont/enki')) sctype = rid.includes('commont/enkier/') ? '' : 'sc';
        const row=await getData(`select pid from a_message${sctype}_commont where message_id=?`, [rid], true);
    
        if (row.pid) {
            await execute(`call del_commont(?,?,?)`, [sctype, rid, row.pid]);
        }
    }
}

//接受关注 
export async function accept(postbody: ActivityPubBody, domain: string, actor: ActorInfo) {
    if (typeof postbody.object === 'object' && postbody.object.actor && postbody.object.id) {
      // 使用类型断言
        const object = postbody.object as { actor: string; id: string };
        
        const user=await getUserFromUrl(object.actor);
        
        saveFollow({ actor, user, followId: object.id });
        broadcast({ type: 'follow', domain, user, actor, followId: object.id });
      
    }
  }

 //取消关注  别人取消关注
export async function undo(postbody:ActivityPubBody){  
    if(typeof postbody.object==='object' && postbody.object.id && postbody.actor){
        await removeFollow(postbody.object.id);
        const user=await getUserFromUrl(postbody.actor);
         //广播信息
        broadcast({type:'removeFollow',domain:process.env.NEXT_PUBLIC_DOMAIN!,actor:{} as ActorInfo,user,followId:postbody.object.id}); 
    }	
}

//关注//别人的关注
export async function follow(postbody:ActivityPubBody,name:string,domain:string,actor:ActorInfo) 
{
    if (postbody.object && typeof postbody.object === 'string' && postbody.object.startsWith('http')) {
        const user=await getLocalInboxFromUrl(postbody.object) as ActorInfo; //被动关注者
        if( process.env.IS_DEBUGGER==='1') { 
            console.info("follow get user:-----------------------------------------------------")
            console.info(user)
        }
        if(!actor.inbox) return  `no found for ${postbody.actor}`;
        if(user?.name?.toLowerCase()!==name.toLowerCase() || user?.domain?.toLowerCase()!==domain.toLowerCase()) return 'activity error ';
        const thebody=createAccept(postbody,name,domain);
        const follow=await getFollow({actorAccount:user.account,userAccount:actor?.account}); // 注：是actor 关注user
        // let localUser=await getUser('actor_account',user.account,'privkey,dao_id')
        if(follow['follow_id']) { 
        console.info("已关注"); //已关注
        await removeFollow(follow['follow_id'])
        } 
        
        const lok=await saveFollow({actor:user,user:actor,followId:postbody.id});// 被他人关注 
        if(lok)
        {
            console.info("follow save is ok")
            broadcast({type:'follow',domain,actor:user,user:actor,followId:postbody.id??''})  //广播信息
            const localActor=await getSigneActor(user.account);
            if(localActor)  sendSignedActivity(actor.inbox,thebody,localActor)
              .catch(error => console.error('sendSignedActivity error:', error));
           
            return 'follow handle ok!'
        }  
        else  return 'server handle error';
    }
}



async function addLink(content: string, id: string, flag: string) {
    const furl = findFirstURI(content);
    const sql = `update a_message set content_link=? where message_id=?`;
    
    if (furl) {
      const tootContent = await getTootContent(furl, process.env.NEXT_PUBLIC_DOMAIN!);
      if (tootContent) {
        execute(sql, [tootContent, id]);
      }
    } else {
      if (flag === 'update') {
        execute(sql, ['', id]);
      }
    }
  }
  


// 签名验证函数 requetUrl 接收的网页
export async function verifySignature(request: NextRequest, actor: ActorInfo, requetUrl: string): Promise<boolean> {
    const signatureHeader = request.headers.get('signature');
    const host = request.headers.get('host');
    const date = request.headers.get('date');
    const digest = request.headers.get('digest');
    const contentType = request.headers.get('content-type');
  
    if (!signatureHeader || !host || !date || !digest || !contentType) {
      console.warn("Missing required headers for signature verification");
      return false;
    }
  
    try {
      const {  algorithm, headers, signature } = parseSignatureHeader(signatureHeader);
      const publicKey = actor.pubkey??'';
      
      // 需要重新实现 createStringToSign 以适应 NextRequest
      const stringToSign = await createStringToSign(request, requetUrl, headers);
      const isVerified = verifyRsaSignature(stringToSign, signature, publicKey, algorithm);
      
      return isVerified;
    } catch (error) {
      console.error("Error in verifySignature:", error);
      return false;
    }
  }
  
  // 辅助函数也需要进行类型转换...
  function parseSignatureHeader(signatureHeader: string): SignatureParams {
    const parts = signatureHeader.split(',').map(part => part.trim());
    const params: Partial<SignatureParams> = {};
  
    for (const part of parts) {
      const [key, value] = part.split('=').map(s => s.trim());
      if (key && value) {
        const unquotedValue = value.replace(/^"(.*)"$/, '$1');
        (params as any)[key] = unquotedValue;
      }
    }
  
    if (!params.keyId || !params.algorithm || !params.headers || !params.signature) {
      throw new Error('Missing required parameters in Signature header');
    }
  
    return params as SignatureParams;
  }
  
  async function createStringToSign(request: NextRequest, inboxFragment: string, signedHeaders: string): Promise<string> {
    const headers = signedHeaders.split(" ");
    let stringToSign = "";
  
    for (const header of headers) {
      switch (header) {
        case "(request-target)":
          stringToSign += `(request-target): post ${inboxFragment}\n`;
          break;
        default:
          const headerValue = request.headers.get(header);
          if (headerValue) {
            stringToSign += `${header}: ${headerValue}\n`;
          }
          break;
      }
    }
  
    return stringToSign.trim();
  }
  
  function verifyRsaSignature(stringToSign: string, signature: string, publicKey: string, algorithm: string): boolean {
    try {
      const verify = crypto.createVerify(algorithm.toUpperCase());
      verify.update(stringToSign);
      verify.end();
      return verify.verify(publicKey, signature, 'base64');
    } catch (error) {
      console.error("Error during RSA signature verification:", error);
      return false;
    }
  }
  