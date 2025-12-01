import { getUser } from '../mysql/user';
import { getFollowers_send } from '../mysql/folllow';
import { createNoteDel } from '../activity';
import { sendSignedActivity, SigneActor } from '../activity/sendSignedActivity';


interface Follower {
  user_inbox: string;
}

export function sendcommont(account: string, message_id: string, pathtype: string): void {
  
  getUser('actor_account', account, 'privkey,Lower(actor_account) actor_account,actor_url,actor_name,domain')
    .then((localUser: Partial<DaismActor>) => {
      try {
        if (!localUser.actor_account) return;
        const userObject = localUser as { actor_name: string,domain:string,actor_url:string,privkey:string };
        
        let thebody: any;
        
        getFollowers_send({ account: localUser.actor_account })
          .then((data: Follower[]) => {
            
            data.forEach((element: Follower) => {

              try {
                if (!thebody) {
                  thebody = createNoteDel(
                    localUser.actor_name!,
                    localUser.domain!,
                    message_id,
                    process.env.NEXT_PUBLIC_DOMAIN!,
                    pathtype
                  );
                }
                sendSignedActivity( element.user_inbox,thebody,{privateKey:userObject.privkey,publicKeyId:userObject.actor_url} as SigneActor )
              } catch (e1) {
                console.error(e1);
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