const { v4: uuidv4 } = require("uuid");

import { httpGet } from "../../lib/net"
import { getUser } from "../../lib/mysql/user"
import { signAndSend } from "../../lib/net"
import { compose } from "@reduxjs/toolkit";

export default async function handler(req, res) {
    let para=req.query
   // let re=await getJsonArray('checkdao',[para.daoName,para.daoSymbol,para.creator],true)
//    /.well-known/webfinger?resource=acct:enki@test.daism.io
   let re=await httpGet(`https://${para.domain}/.well-known/webfinger?resource=acct:${para.account}@${para.domain}`)


    let url;
    let type;

   for(let i=0;i<re.message.links.length;i++)
   {
       if(re.message.links[i].rel==='self')
       {
           url=re.message.links[i].href;
           type=re.message.links[i].type
           break;
       }
   }
    await getInboxFromUrl(url,type);
//    return reobj;
   
   res.status(200).json({s:'ok'})
  }
  

  async function getInboxFromUrl(url,type='application/activity+json')
  {
    const myURL = new URL(url);
    // let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',icon:''}
    let re= await httpGet(url,{"Content-Type": type})
    // if(re.code!==200) return obj;
    re=re.message
  

    let followjson={
  '@context': 'https://www.w3.org/ns/activitystreams',
  id: 'https://test.daism.io/'+uuidv4(),
  type: 'Follow',
  actor: 'https://test.daism.io/api/activitepub/users/enki',
  object: re.id
}


const localUser= await getUser('dao_id',2,'privkey,LOWER(account) account')
 
    let strs=localUser.account.split('@') //strs[0]->name strs[1]->domain
      
            signAndSend(re.inbox,strs[0],strs[1],followjson,localUser.privkey);

   
          
       

  }

