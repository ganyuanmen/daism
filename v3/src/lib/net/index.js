const request = require('request')
const crypto = require('crypto')
import { getData } from '../mysql/common';

export async function signAndSend(url,name,domain,message,privkey) {
    if( process.env.IS_DEBUGGER==='1') console.info("signAndSend--->",[url,name,domain,message])
    const myURL = new URL(url);
    let targetDomain = myURL.hostname;
    let inboxFragment = url.replace('https://'+targetDomain,'');
        
    const digestHash = crypto.createHash('rsa-sha256').update(JSON.stringify(message)).digest('base64');
    const signer = crypto.createSign('rsa-sha256');
    let d = new Date();
    let stringToSign = `(request-target): post ${inboxFragment}\nhost: ${targetDomain}\ndate: ${d.toUTCString()}\ndigest: SHA-256=${digestHash}\ncontent-type: application/activity+json`;
       
    signer.update(stringToSign);
    signer.end();
    const signature = signer.sign(privkey);
    const signature_b64 = signature.toString('base64');
    let header = `keyId="https://${domain}/api/activitepub/users/${name}",algorithm="rsa-sha256",headers="(request-target) host date digest content-type",signature="${signature_b64}"`;
    
    request({
    url,
    headers: {
        'Host': targetDomain,
        'Date': d.toUTCString(),
        'Digest': `SHA-256=${digestHash}`,
        'Signature': header,
        //,signingString:strToBase64,
        'content-type': 'application/activity+json'

    },
    method: 'POST',
    json: true,
    body: message
    }, function (error, response){
    if (error) {
        console.error('signAndSend Error:', error,(response&&response.body)?response.body:'');
    }
    else {
      if(process.env.IS_DEBUGGER==='1') console.info(`signAndSend Error: Code:${response?.statusCode}, Response:${response?.body?.error}`);
    }
    });
}
  
 export function httpGet(url, headers={},method='GET') {
     if(process.env.IS_DEBUGGER==='1') console.info('request: ',url)
    return new Promise(function (resolve, reject) { request({url,headers,method,json: true}, 
        function (error, response){
        if (error) {
          console.error('Error:', error, (response&&response.body)?response.body:'');
          resolve({code:(response&&response.statusCode)?response.statusCode:500});
        }
        else 
        // if( process.env.IS_DEBUGGER==='1') console.info(response.statusCode,response.body)
        resolve({code:response.statusCode,message:response.body});
      });});
  }

 
   
 export function broadcast({type,domain,user,actor,followId})
 {
 
   getData('SELECT DISTINCT domain FROM a_account WHERE domain<>?',[domain]).then(data=>{
     data.forEach(element => {
       try{
         let url=`https://${element.domain}/api/broadcast`;
         let message
         if(type==='follow') { 
          if(user?.domain===element.domain || actor?.domain===element.domain) return false;
          message={type,domain,user,actor,followId} 
        }
         else if(type==='removeFollow')  message={type,followId} //取消关注
         else if(type==='addType') message={type,_desc:actor._desc,_type:actor._type}
         else if(type==='recover') message={type,user,actor} //转移关注
         else return false
        if(user?.domain!==element.domain && user?.domain!==element.domain ) 
         request({url,headers: {'content-type': 'application/activity+json'},
           method: 'POST',json: true,body: message	}, function (error, response){
           if (error) {
             console.error('broadcast follow Error:', error,(response&&response.body)?response.body:'');
           }
           else {
             if(process.env.IS_DEBUGGER==='1') console.info(`broadcast follow Code:${response?.statusCode}, Response:${response?.body?.error}`);
           }
           });

       }catch(e1){ console.error('broadcast follow',e1)}
     });
   })
   
 
 }
 