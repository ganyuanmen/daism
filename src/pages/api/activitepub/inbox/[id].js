import { httpGet } from "../../../../lib/net"; 
import {saveFollow,removeFollow,getFollower,getFollowerForUrl} from '../../../../lib/mysql/folllow'
import {createAccept} from '../../../../lib/activity'
import { getUser } from "../../../../lib/mysql/user";
import {signAndSend} from '../../../../lib/net'
import {getComment,eventAddReply} from '../../../../lib/mysql/events'

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
    console.info("inbox error ",req.body)
    console.error(error)
  }
  if( process.env.IS_DEBUGGER==='1') { 
    console.log("-----------inbox post infomation-----------------------------------------------")
    console.log(postbody)
    console.log("----------------------------------------------------------")
  }
  if(typeof(postbody)!=='object' || !postbody.type) return res.status(405).json({errMsg:'body json error'})

    const name = req.query.id;
  
    switch (postbody.type.toLowerCase()) {
      case 'accept': 
           accept(postbody).then(e=>{console.info(e)})
           break;
      case 'reject':break;
      case 'undo':   //对方取消关注
          undo(postbody).then(e=>{console.info(e)}); 
          break;
      case 'block':break;
      case 'create': 
          // createMess(req).then(e=>{utils.print(e)});
           break;
      case 'delete': break;
      case 'like':break;
      case 'update':break;
      case 'add':break;
      case 'remove': break;
      case 'follow':  //关注
            follow(postbody,name,process.env.LOCAL_DOMAIN).then(e=>{console.info(e)});
      break;
    }
  
    if(postbody.type.toLowerCase()==='create')
    {
        let replyType=postbody.object.inReplyTo || postbody.object.inReplyToAtomUri || null;
        if(replyType && replyType.toLowerCase().startsWith(`https://${process.env.LOCAL_DOMAIN}/info/events/reply/`))
        {
          
            let content=(new String(postbody.object.content)).toString()
            let actor= await getFollowerForUrl(postbody.actor)
            if(actor.length)
            {
                let ids=replyType.split('/')
                let id=ids[ids.length-1]
                if(id)
                {       
                    let commont=await getComment(id)
                    if(commont.length && commont[0]['is_discussion']===1)
                    {
                        let pid=commont[0]['id']
                        let nick=actor[0]['actor_account']
                        let avatar=actor[0]['actor_icon']
                        await eventAddReply({pid,did:'',nick,avatar,content,sendId:postbody.id})
                    }
                }
            }
        }
    }
  
    res.status(200).json({msg: 'ok'});
  
    return;
  
  }
  

  
async function undo(postbody)
{
  if(!postbody.object || !postbody.object.id) return 'activity error!';
  await removeFollow(postbody.object.id)
  return 'undo handle ok'
}

async function accept(postbody)
{
  let actor=await getInboxFromUrl(postbody.actor); 
  let user=await getLocalInboxFromUrl(postbody.object.actor);
  let re= await saveFollow(actor,user,postbody.object.id,0)  //关注他人的确认
  return "accept handle ok"
}

async function follow(postbody,name,domain)
{
  let actor=await getInboxFromUrl(postbody.actor);
  if( process.env.IS_DEBUGGER==='1') { 
    console.log("follow get actor:-----------------------------------------------")
    console.log(actor)
  }
  let user=await getLocalInboxFromUrl(postbody.object)
  if( process.env.IS_DEBUGGER==='1') { 
    console.log("follow get user:-----------------------------------------------------")
    console.log(user)
  }
  if(!actor.inbox) return  `no found for ${postbody.actor}`;
  if(user.name!==name || user.domain!==domain) return 'activity error ';
  let thebody=createAccept(postbody,name,domain);
  let follow=await getFollower(actor.account,user.account,'id');
  let localUser=await getUser('account',user.account,'privkey,dao_id')
  if(follow['id']) { 
    console.info("已关注"); //已关注
    signAndSend(actor.inbox,name,domain,thebody,localUser.privkey);
  } 
  else
  {
    let lok=await saveFollow(actor,user,postbody.id,1,localUser['dao_id']);// 被他人关注 localUser['id']-->daoId
    if(lok)
    {
      console.info("follow save is ok")
      signAndSend(actor.inbox,name,domain,thebody,localUser.privkey);
    }  
    else  
      return 'server handle error';
  }
  return 'follow handle ok!'
}



async function getLocalInboxFromUrl(url)
{
  let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
  let user=await getUser('account_url',url,'account,avatar,pubkey');
  if(!user['account']) return obj;
  const [userName,domain]=user.account.split('@');

  return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`
  ,account:user['account'],url,pubkey:user['pubkey'],avatar:user['avatar']}
}

async function getLocalInboxFromAccount(account) {
  let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
  let user=await getUser('account',account,'account_url,avatar,pubkey');
  if(!user['account_url']) return obj;
  const [userName,domain]=account.split('@');

  return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`,account,url:user['account_url'],pubkey:user['pubkey'],avatar:`https://${domain}/uploads/${user['avatar']}`}
}

async function getInboxFromUrl(url,type='application/activity+json')
{
  const myURL = new URL(url);
  let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
  let re= await httpGet(url,{"Content-Type": type})
  if(re.code!==200) return obj;
  re=re.message
  if(!re) return obj;
  if(re.name) obj.name=re.name;
  if(re.inbox) { 
    obj.inbox=re.inbox; 
    obj.pubkey=re.publicKey.publicKeyPem;
    obj.url=re.id;
    obj.account=`${re.name}@${myURL.hostname}`
  }
  if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
  else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

  return obj 
}

async function getInboxFromAccount(account) {
  let strs=account.split('@')
  let obj={name:strs[0],domain:strs[1],inbox:''}
  let re=await httpGet(`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
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
  let reobj=await getInboxFromUrl(url,type);
  return reobj;
}
