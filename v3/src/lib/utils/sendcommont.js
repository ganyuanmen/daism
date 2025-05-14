import { getUser } from '../mysql/user'
import {getFollowers_send} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'
import { createNoteDel } from '../activity'



export function sendcommont(account,message_id,pathtype) 
{
  getUser('actor_account',account,'privkey,Lower(actor_account) account,actor_name,domain').then(localUser=>{
    try{
        if(!localUser.account) return;
        let thebody;
        getFollowers_send({account:localUser.account}).then(data=>{
            data.forEach((element) => {
                try{
                    if(!thebody)  thebody=createNoteDel(localUser.actor_name,localUser.domain,message_id,process.env.LOCAL_DOMAIN,pathtype);
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody,localUser.privkey);
                }catch(e1){ console.error(e1)}
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}

