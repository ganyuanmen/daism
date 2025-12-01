import { getUser } from '../mysql/user';
import { getFollowers_send } from '../mysql/folllow';
import { createMessage } from '../activity/createMessage';
// import { getSigneActor } from '../net';
import { sendSignedActivity, SigneActor } from '../activity/sendSignedActivity';

interface Follower {
  user_account: string;
  user_inbox: string;
}

export function sendfollow(
  account: string,
  content: string,
  textContent: string,
  imgpath: string,
  message_id: string,
  pathtype: string,
  vedioURL: string,
  contentType: string
): void {
  getUser('actor_account', account, 'privkey,Lower(actor_account) actor_account,actor_name,domain,actor_url')
    .then((localUser: DaismActor) => {
      try {
        if (!localUser.actor_account) return;

        const userObject = localUser as { actor_name: string,domain:string,actor_url:string,privkey:string };
        
        let thebody1: any;
        let thebody2: any;

        getFollowers_send({ account: localUser.actor_account })
          .then((data: Follower[]) => {
            data.forEach(async (element: Follower) => {
              if (element.user_account !== account) {  // 不推给主发起人
                try {
                  if (element.user_inbox.includes('/api/activitepub/inbox')) { // enki 长文
                    if (!thebody1) {thebody1 = createMessage(userObject.actor_name,userObject.domain,content,
                        imgpath,message_id,process.env.NEXT_PUBLIC_DOMAIN || '',pathtype,
                        contentType,vedioURL,false);
                    }
                    sendSignedActivity(element.user_inbox,thebody1,{privateKey:userObject.privkey,publicKeyId:userObject.actor_url} as SigneActor )
                  } else {
                    if (!thebody2) {thebody2 = createMessage(userObject.actor_name,userObject.domain,textContent,
                        imgpath,message_id,process.env.NEXT_PUBLIC_DOMAIN || '',pathtype,
                        contentType,vedioURL,true);
                    }
                    sendSignedActivity(element.user_inbox,thebody2,{privateKey:userObject.privkey,publicKeyId:userObject.actor_url} as SigneActor )
                    
                  }
                } catch (e1) {
                  console.error(e1);
                }
              }
            });
          })
          .catch((error: Error) => {
            console.error('Error getting followers:', error);
          });
      } catch (e) {
        console.error(e);
      }
    })
    .catch((error: Error) => {
      console.error('Error getting user:', error);
    });
}