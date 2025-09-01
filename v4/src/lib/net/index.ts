
import { getData } from '../mysql/common';
// import crypto from 'crypto';
// import request from 'request';
import { sendSignedActivity,type SigneActor } from '../activity/sendSignedActivity';
import { getUser } from '../mysql/user';

// export async function signAndSend(url: any, name: any, domain: any, message: any, privkey: any): Promise<void> {
//     if (process.env.IS_DEBUGGER === '1') {
//         console.info(`${new Date().toLocaleString()}: signAndSend --->`, [url, name, domain, message]);
//     }

//     const myURL: any = new URL(url);
//     const targetDomain: any = myURL.hostname;
//     const inboxFragment: any = url.replace('https://' + targetDomain, '');

//     const digestHash: any = crypto.createHash('sha256').update(JSON.stringify(message)).digest('base64');
//     const signer: any = crypto.createSign('RSA-SHA256');

//     const d: any = new Date();
//     const stringToSign: any = `(request-target): post ${inboxFragment}\nhost: ${targetDomain}\ndate: ${d.toUTCString()}\ndigest: SHA-256=${digestHash}\ncontent-type: application/activity+json`;

//     signer.update(stringToSign);
//     signer.end();

//     const signature: any = signer.sign(privkey);
//     const signature_b64: any = signature.toString('base64');

//     const header: any = `keyId="https://${domain}/api/activitepub/users/${name}",algorithm="rsa-sha256",headers="(request-target) host date digest content-type",signature="${signature_b64}"`;

//     request({
//         url,
//         headers: {
//             'Host': targetDomain,
//             'Date': d.toUTCString(),
//             'Digest': `SHA-256=${digestHash}`,
//             'Signature': header,
//             'content-type': 'application/activity+json'
//         },
//         method: 'POST',
//         json: true,
//         body: message
//     }, (error: any, response: any) => {
//         if (error) {
//             console.error('signAndSend Error:', error, (response && response.body) ? response.body : '');
//         } else {
//             if (process.env.IS_DEBUGGER === '1') {
//                 console.info(`signAndSend Info: Code:${response?.statusCode}, Response:${response?.body?.error}`);
//             }
//         }
//     });
// }

interface FirstActor{
  privkey:string;
  actor_url:string;
}

export type HttpHeaders = HeadersInit & Record<string, string>;

export async function httpGet<T = any>(
  url: string,
  headers: HttpHeaders = {}
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      console.error(`httpGet failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    } else {
      return (await res.text()) as unknown as T;
    }
  } catch (err) {
    console.error(`httpGet error: ${err}`);
    return null;
  }
}

export async function getSigneActor(account:string):Promise<SigneActor|null>{
  const localUser=await getUser('actor_account',account,'privkey,actor_url') as DaismActor;
  if(!localUser.privkey || !localUser.actor_url )  return null;
  return {  
    privateKey: localUser.privkey,  
    publicKeyId: localUser.actor_url
  };
}

export async function broadcast({ type, domain, user, actor, followId }:
     { type: string; domain: string; user: ActorInfo; actor: ActorInfo; followId: string }): Promise<void> {

      let localActor:SigneActor|null;
      if(user.account){
        localActor=await getSigneActor(user.account);
      }
      else //没有user ，取第1个，发送用的帐号和私钥
      {
        const firstActor:FirstActor=await getData("select privkey,actor_url from a_account limit 1",[],true) as FirstActor;
        user.url=firstActor.actor_url;
        localActor =  {   
          privateKey: firstActor.privkey,
          publicKeyId:firstActor.actor_url
        };
      }
      

    getData('SELECT DISTINCT domain FROM a_account WHERE domain<>?', [domain]).then((data: any) => {
        data.forEach((element: any) => {
            try {
                let url: any = `https://${element.domain}/api/broadcast`;
                let message: any;

                switch (type) {
                  case 'follow':
                      if (user?.domain === element.domain || actor?.domain === element.domain) return;
                      message = {user, actor, followId };
                      url = `${url}/follow`;
                      break;
                      
                  case 'removeFollow':
                      message = { user, followId };
                      url = `${url}/removeFollow`;
                      break;
                      
                  case 'addType':
                      message = { actor,user };
                      url = `${url}/addType`;
                      break;
                      
                  case 'recover':
                      message = { user, actor };
                      url = `${url}/recover`;
                      break;
                      
                  default:
                      console.error("no such type for：" + type);
                      return;
              }

                if (user?.domain !== element.domain) { //不能给自己推送
                    if(localActor) {
                      sendSignedActivity(url,message,localActor)
                      .catch(error => console.error('sendSignedActivity error:', error));
                    }
                }
            } catch (e1) {
                console.error('broadcast errpr', e1);
            }
        });
    });
}
