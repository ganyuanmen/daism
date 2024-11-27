

import {createFollow} from '../../../lib/activity'
const { v4: uuidv4 } = require("uuid");
import {signAndSend,broadcast} from '../../../lib/net'
import { getUser } from "../../../lib/mysql/user";
import {getLocalInboxFromUrl,getLocalInboxFromAccount} from '../../../lib/mysql/message'
import {saveFollow} from '../../../lib/mysql/folllow'

export default async function handler(req, res) {

    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
    try{
        let _id=uuidv4()
        let guid=_id.replaceAll('-','')
        const myURL = new URL(req.query.url);
        let targetDomain = myURL.hostname;
        const [userName,domain]=req.query.account.split('@');
        if(targetDomain===process.env.LOCAL_DOMAIN){  //本地关注
            let actor=await getLocalInboxFromUrl(req.query.url);  //被关注
            let user=await getLocalInboxFromAccount(req.query.account); //关注人
            let re= await saveFollow({actor,user,followId:guid})  //关注他人的确认

            if(!re) {
                res.status(500).json({errMsg: 'fail'});
                return;
            }else //广播 
            {
                broadcast({type:'follow',domain,user,actor,followId:guid})  //广播信息
            }

        }else { //远程关注
          
            let theBoty=createFollow(userName,domain,req.query.url,guid)
            let localUser=await getUser('actor_account',req.query.account,'privkey')
            signAndSend(req.query.inbox,userName,domain,theBoty,localUser.privkey);
        }
        res.status(200).json({msg:'ok'})
    }
    catch(err)
    {
        console.error(`get: /api/activitepub/follow:`,req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  

  }
