
import { getData } from '../mysql/common';
import { sendSignedActivity,type SigneActor } from '../activity/sendSignedActivity';
import { getUser } from '../mysql/user';

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
