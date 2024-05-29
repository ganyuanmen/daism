import { getUser } from '../mysql/user'
import {getFollowers} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'


export function send(daoid,content,fileName,path,messageId,title,isNote=false)  //daoid,content,fileName,'news'
{

  getUser('dao_id',daoid,'privkey,Lower(account) account').then(localUser=>{
    try{
        if(!localUser.account) return;
        let strs=localUser.account.split('@') //strs[0]->name strs[1]->domain
        const thebody=createMessage(strs[0],strs[1],content,fileName,path,messageId,title,isNote);
        getFollowers(localUser.account).then(data=>{
            data.forEach(element => {
                try{
                    signAndSend(element.actor_inbox,strs[0],strs[1],thebody,localUser.privkey);
                }catch(e1){ console.error(e1)}
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}


