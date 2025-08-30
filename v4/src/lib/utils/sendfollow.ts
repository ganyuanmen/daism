import { getUser } from '../mysql/user';
import { getFollowers_send } from '../mysql/folllow';
import { signAndSend } from '../net';
import { createMessage } from '../activity/createMessage';

interface LocalUser {
  privkey: string;
  account: string;
  actor_name: string;
  domain: string;
}

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
  getUser('actor_account', account, 'privkey,Lower(actor_account) account,actor_name,domain')
    .then((localUser: LocalUser) => {
      try {
        if (!localUser.account) return;
        
        let thebody1: any;
        let thebody2: any;

        getFollowers_send({ account: localUser.account })
          .then((data: Follower[]) => {
            data.forEach((element: Follower, idx: number) => {
              if (element.user_account !== account) {  // 不推给主发起人
                try {
                  if (element.user_inbox.includes('/api/activitepub/inbox')) { // enki 长文
                    if (!thebody1) {
                      thebody1 = createMessage(
                        localUser.actor_name,
                        localUser.domain,
                        content,
                        imgpath,
                        message_id,
                        process.env.NEXT_PUBLIC_DOMAIN || '',
                        pathtype,
                        contentType,
                        vedioURL,
                        false
                      );
                    }
                    signAndSend(
                      element.user_inbox,
                      localUser.actor_name,
                      localUser.domain,
                      thebody1,
                      localUser.privkey
                    );
                  } else {
                    if (!thebody2) {
                      thebody2 = createMessage(
                        localUser.actor_name,
                        localUser.domain,
                        textContent,
                        imgpath,
                        message_id,
                        process.env.NEXT_PUBLIC_DOMAIN || '',
                        pathtype,
                        contentType,
                        vedioURL,
                        true
                      );
                    }
                    signAndSend(
                      element.user_inbox,
                      localUser.actor_name,
                      localUser.domain,
                      thebody2,
                      localUser.privkey
                    );
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