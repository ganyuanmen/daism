

import {createUndo} from '../../../lib/activity'
import {signAndSend} from '../../../lib/net'
import { getUser } from "../../../lib/mysql/user";
import { getData } from '../../../lib/mysql/common';
import {removeFollow} from '../../../lib/mysql/folllow'
import { broadcast } from '../../../lib/net';


export default async function handler(req, res) {

    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
    try{
        //从 我关注他人库取出关注ID
        let re=await getData("select follow_id from a_follow where id=?",[req.query.id])
        if(!re[0]) { 
            res.status(500).json({errMsg: 'no found follow Id'});
            return;
        }
        let followId=re[0].follow_id;
        const [userName,domain]=req.query.account.split('@');
        if(!req.query.url.includes(process.env.LOCAL_DOMAIN)){  //被关注的人非本地，
            let theBoty=createUndo(userName,domain,req.query.url,followId)
            let localUser=await getUser('actor_account',req.query.account,'privkey')
            signAndSend(req.query.inbox,userName,domain,theBoty,localUser.privkey);
        }

        re=await removeFollow(followId)
        if(!re) {
            res.status(500).json({errMsg: 'fail'});
            return;
        } else 
        broadcast({type:'removeFollow',domain:process.env.LOCAL_DOMAIN,actor:{},user:{},followId})  //广播信息
  
        res.status(200).json({msg:'ok'})
    }
    catch(err)
    {
        console.error(`get: /api/activitepub/follow:`,req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  

  }
