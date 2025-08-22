import { getUser } from '../mysql/user'
import {getFollowers_send} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'



export function sendfollow(account,content,textContent,imgpath,message_id,pathtype,vedioURL,contentType) 
{
  getUser('actor_account',account,'privkey,Lower(actor_account) account,actor_name,domain').then(localUser=>{
    try{
        if(!localUser.account) return;
        let thebody1;
        let thebody2;

        getFollowers_send({account:localUser.account}).then(data=>{
            data.forEach((element) => {
                if(element.user_account!==account){  //不推给主发起人
                try{
                
                    if(element.user_inbox.includes('/api/activitepub/inbox')) //enki 长文
                    {
                        if(!thebody1) thebody1=createMessage(
                                localUser.actor_name,
                                localUser.domain,
                                content,
                                imgpath,
                                message_id,
                                process.env.LOCAL_DOMAIN,
                                pathtype,
                                contentType,vedioURL,false);
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody1,localUser.privkey);
                    }
                    else{
                        if(!thebody2) thebody2=createMessage(
                            localUser.actor_name,
                            localUser.domain,
                            textContent,
                            imgpath,
                            message_id,
                            process.env.LOCAL_DOMAIN,
                            pathtype,
                            contentType,vedioURL,
                            true);
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody2,localUser.privkey);
                    }
                  
                }catch(e1){ console.error(e1)}
                }
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}

