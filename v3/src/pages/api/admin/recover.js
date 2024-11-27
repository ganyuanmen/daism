import withSession from "../../../lib/session";
import { broadcast } from "../../../lib/net";
// const request = require('request')
import { execute } from "../../../lib/mysql/common";
import { httpGet } from "../../../lib/net";

export default withSession(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed'})
  }
  const {actorName,domain,oldAccount,sctype,daoid } = req.body;
  const newAccount=`${actorName}@${domain}`;
  const [name,oldDomain]=oldAccount.split('@');

  let sql="call recover_follow(?,?)";
  let paras=[newAccount,oldAccount];
  await execute(sql,paras);
    // 广播
  broadcast({type:'recover',domain,user:{account:newAccount},actor:{account:oldAccount},followId:'0'})  //广播信息
    
  let re1=await httpGet(`https://${oldDomain}/api/getUserMwssage?newAccount=${newAccount}&oldAccount=${oldAccount}`, {'content-type': 'application/activity+json'});
    let avatar=`https://${domain}/user.svg`;
  let actor_desc='';
  if(re1 && re1.code===200) {
    avatar=re1.message.avatar;
    actor_desc=re1.message.actor_desc;
  }

  // if(domain!==oldDomain) {   
    sql="update a_account set avatar=?,actor_desc=? where actor_account=? or actor_account=?";
    paras=[avatar,actor_desc,oldAccount,newAccount];
    await execute(sql,paras);
    let pi=0;
    while(true) {
      ////menutype,account,pi,daoid,eventnum
      let re=await httpGet(`https://${oldDomain}/api/getMessage?account=${oldAccount}&pi=${pi}&menutype=${sctype?2:3}&daoid=${daoid}&eventnum=${sctype?0:2}`, {'content-type': 'application/activity+json'});
      if(re.code===200){
        insertData(re.message,actorName,domain,avatar,sctype,daoid)
        if(re.message.length<12) break; 
      }
      else break;
      pi++
    }
  // }
  // else {
  //   let sql='UPDATE a_message SET actor_name=?,actor_url=?,actor_inbox=?,actor_account=? WHERE actor_account=?'
  //   let paras=[actorName,`https://${domain}/api/activitepub/users/${actorName}`,`https://${domain}/api/activitepub/inbox/${actorName}`,`${actorName}@${domain}`,oldAccount];
  //   await execute(sql,paras);
  // } 


   

 

  res.status(200).json({ msg:'ok'}); 
  
});


function insertData(data,actor_name,domain,avatar,sctype,daoid) {
  let sql="INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,link_url,title,content,is_send,is_discussion,top_img,receive_account,send_type,createtime,reply_time) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let paras;
   data.forEach(e => {
    if(sctype){
      sql="INSERT INTO a_messagesc(actor_id,dao_id,title,content,is_send,is_discussion,top_img,start_time,end_time,event_url,event_address,time_event,_type,reply_time,createtime,message_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      paras=[e.actor_id,e.dao_id,e.title,e.content,e.is_send,e.is_discussion,e.top_img,e.start_time
        ,e.end_time,e.event_url,e.event_address,e.time_event,e._type,e.reply_time,e.createtime,e.message_id]
    }else{
      paras=[
        e.message_id,
        e.manager,
        actor_name,
        avatar,
        `${actor_name}@${domain}`,
        `https://${domain}/api/activitepub/users/${actor_name}`,
        `https://${domain}/api/activitepub/inbox/${actor_name}`,
        e.link_url||'',
        e.title,
        e.content,
        e.is_send,
        e.is_discussion,
        e.top_img||'',
        e.receive_account||'',
        e.send_type,
        e.createtime,
        e.reply_time];
     
    }
    execute(sql,paras).then(()=>{});
    });
  }