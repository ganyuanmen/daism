import { getData,execute } from './common'

 
export async function saveMessage(actor,messageId,content,followerUrl,type,title,pid)
{
  return await execute("INSERT INTO a_message(actor_account,actor_url,message_id,content,follower_url,actor_icon,message_type,title,pid) VALUES(?,?,?,?,?,?,?,?,?)",
  [actor.account,actor.url,messageId,content,followerUrl,actor.avatar,type,title,pid]);
}

export async function getMessage (messageId) {
    let re=await getData('select content from a_message where message_id=?',[messageId]);
    return re.length?re[0]:{};
}


export async function getMessageFromId (messageId) {
    let re=await getData('select * from a_message where id=? or pid=?',[messageId,messageId]);
    return re || []
}
  
export async function getMessages (userAccount) {
    let re=await getData('SELECT * FROM a_message WHERE actor_account=? OR actor_account IN(SELECT actor_account FROM a_follow WHERE follow_type=0 AND user_account=?) order by id desc'
       ,[userAccount,userAccount]);
    return re || []
}

