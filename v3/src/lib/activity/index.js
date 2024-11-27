const crypto = require('crypto');
const message=require("./createMessage")
const path=require('path');
   
  
export function createActor(name,domain,user) {
  name = name.toLowerCase();
  return  {
    '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],

    id: `https://${domain}/api/activitepub/users/${name}`,
    type: 'Person',
    preferredUsername: name,
    name: name,
    summary: user.actor_desc,
    icon: {
      type: 'Image',
      mediaType: `image/${user.avatar?path.extname(user.avatar).slice(1):'svg+xml'}`,
      url: user.avatar?user.avatar:`https://${domain}/logo.svg`
    },
    inbox: `https://${domain}/api/activitepub/inbox/${name}`,
    outbox: `https://${domain}/api/activitepub/outbox/${name}`,
    followers: `https://${domain}/api/activitepub/followers/${name}`,
    following: `https://${domain}/api/activitepub/following/${name}`,

    publicKey: {
      id: `https://${domain}/api/activitepub/users/${name}#main-key`,
      owner: `https://${domain}/api/activitepub/users/${name}`,
      publicKeyPem: user.pubkey,
    },
  };
  //  {
  //   '@context': [
  //     'https://www.w3.org/ns/activitystreams',
  //     'https://w3id.org/security/v1'
  //   ],

  //   'id': `https://${domain}/api/activitepub/users/${userName}`,
  //   "owner":`https://${domain}/api/activitepub/users/${userName}`,
  //   'type': 'Person',
  //   'preferredUsername': `${userName}`,
  //   'name': `${userName}`,
  //   'url': `https://${domain}/communities/visit/${account.id}`,
  //   'inbox': `https://${domain}/api/activitepub/inbox/${userName}`,
  //   'outbox': `https://${domain}/api/activitepub/outbox/${userName}`,
  //   'followers': `https://${domain}/api/activitepub/followers/${userName}`,
  //   'following': `https://${domain}/api/activitepub/following/${userName}`,
  //   "liked":`https://${domain}/api/activitepub/liked/${userName}`,
  //   "endpoints":{
  //     'sharedInbox': `https://${domain}/api/activitepub/inbox/${userName}`
  //     },
  //   'icon': {
  //     'type': 'Image',
  //     'mediaType': 'image/png',
  //     'url':`https://${domain}/uploads/${account.icon}`
  //   },
  //   'publicKey': {
  //     'id': `https://${domain}/api/activitepub/users/${userName}#main-key`,
  //     'owner': `https://${domain}/api/activitepub/users/${userName}`,
  //     'publicKeyPem': account.pubkey
  //   }
  // };
}
 

//  export function createWebfinger(userName, domain,id,img) {
//   return {
//     "aliases": [
//       `https://${domain}/api/activitepub/users/${userName}`
//     ],
//     "links": [
//         {
//             "href": `https://${domain}/api/activitepub/users/${userName}`,
//             "rel": "self",
//             "type": "application/activity+json"
//         },
//         {
//             "rel": "http://ostatus.org/schema/1.0/subscribe",
//             "template": `https://${domain}/interact?uri={uri}`
//         }
//     ],
//     "subject":`acct:${userName}@${domain}`
// }
// }

  

 export function createWebfinger(userName, domain,id,avatar) {
  userName=userName.toLowerCase()
  return {
    'subject': `acct:${userName}@${domain}`,
    "aliases": [ `https://${domain}/api/activitepub/users/${userName}`],

    'links': [
          {
              "rel": "http://webfinger.net/rel/profile-page",
              "type": "text/html",
              "href": `https://${domain}/communities/visit/${id}`
          },
          {
              'rel': 'self',
              'type': 'application/activity+json',
              'href': `https://${domain}/api/activitepub/users/${userName}`
            },
            {
              "rel": "http://ostatus.org/schema/1.0/subscribe",
              "template": `https://${domain}/authorize_interaction?uri={uri}`
          },
          {
              "rel": "http://webfinger.net/rel/avatar",
              "type": `image/${avatar?path.extname(avatar).slice(1):'svg'}`,
              "href": avatar?avatar:`https://${domain}/logo.svg`
          }
    ]
  };
}


export function createAccept(thebody, userName, domain) {
  userName=userName.toLowerCase()
    const guid = crypto.randomBytes(16).toString('hex');
    return {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${domain}/${guid}`,
      'type': 'Accept',
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'object': thebody,
    };
  }
  
   
export function createFollow(userName, domain,actorUrl,guid) {
  userName=userName.toLowerCase()
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    'id': `https://${domain}/${userName}/follow/${guid}`,
    'type': 'Follow',
    'actor': `https://${domain}/api/activitepub/users/${userName}`,
    'object': actorUrl
  };
 }

   
export function createUndo(userName, domain,actorUrl,followId) {
  userName=userName.toLowerCase()
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    'id': followId.replace('follow','undo') , // `https://${domain}/${userName}/undo/${guid}`,
    'type': 'Undo',
    'actor': `https://${domain}/api/activitepub/users/${userName}`,
    'object': {
      'id': followId,
      'type': 'Follow',
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'object': actorUrl
    }
  }
 }

//  '@context': 'https://www.w3.org/ns/activitystreams',
//  id: 'https://daotodon.me/923de01d-d55a-4ca3-93b5-abf52b1349d1',
//  type: 'Follow',
//  actor: 'https://daotodon.me/users/gym',
//  object: 'https://nngym.cn/api/activitepub/gym'

 
 export function createFollowers(userName,domain,followers)
 {
  userName=userName.toLowerCase()
  return {
    "type":"OrderedCollection",
    "totalItems":followers.length,
    "id":`https://${domain}/api/activitepub/followers/${userName}`,
    "first": {
      "type":"OrderedCollectionPage",
      "totalItems":followers.length,
      "partOf":`https://${domain}/api/activitepub/followers/${userName}`,
      "orderedItems": followers,
      "id":`https://${domain}/api/activitepub/followers/${userName}?page=1`
    },
    "@context":["https://www.w3.org/ns/activitystreams","https://w3id.org/security/v1"]
  };
 }
  
 export function createFollowees(userName,domain,followees)
 {
  userName=userName.toLowerCase()
  return {
    "type":"OrderedCollection",
    "totalItems":followees.length,
    "id":`https://${domain}/api/activitepub/following/${userName}`,
    "first": {
      "type":"OrderedCollectionPage",
      "totalItems":followees.length,
      "partOf":`https://${domain}/api/activitepub/following/${userName}`,
      "orderedItems": followees,
      "id":`https://${domain}/api/activitepub/following/${userName}?page=1`
    },
    "@context":["https://www.w3.org/ns/activitystreams","https://w3id.org/security/v1"]
  };
 }


 
 export function createLiked(userName,domain,followees)
 {
  userName=userName.toLowerCase()
  return {
    "type":"OrderedCollection",
    "totalItems":followees.length,
    "id":`https://${domain}/api/activitepub/liked/${userName}`,
    "first": {
      "type":"OrderedCollectionPage",
      "totalItems":followees.length,
      "partOf":`https://${domain}/api/activitepub/liked/${userName}`,
      "orderedItems": followees,
      "id":`https://${domain}/api/activitepub/liked/${userName}?page=1`
    },
    "@context":["https://www.w3.org/ns/activitystreams","https://w3id.org/security/v1"]
  };
 }
