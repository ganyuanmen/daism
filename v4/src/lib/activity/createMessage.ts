interface Attachment {
  mediaType: string;
  type: string;
  url: string;
}

interface NoteMessage {
  id: string;
  url: string;
  atomUri: string;
  actor: string;
  attributedTo: string;
  type: string;
  published?: string;
  updated?: string;
  content: string;
  draft: boolean;
  attachment: Attachment[];
  to: string[];
  cc: string[];
}

interface CreateMessage {
  '@context': string;
  id: string;
  type: string;
  published: string;
  actor: string;
  attributedTo: string;
  to: string[];
  cc: string[];
  object: NoteMessage;
}

export function createMessage(
  userName: string,
  domain: string,
  text: string,
  imgPath: string,
  id: string,
  message_domain: string,
  pathtype: string,
  contentType: string,
  vedioURL: string,
  isNoEnki: boolean
): CreateMessage {
  userName = userName.toLowerCase();
  let d = new Date();
  let suff = imgPath.indexOf('.') > 0 ? imgPath.split('.').splice(-1)[0] : '';
  let suff_vedio = vedioURL.indexOf('.') > 0 ? vedioURL.split('.').splice(-1)[0] : '';

  let noteMessage: NoteMessage = {
    'id': `https://${message_domain}/communities/${pathtype}/${id}`,
    'url': `https://${message_domain}/communities/${pathtype}/${id}`,
    'atomUri': `https://${message_domain}/communities/${pathtype}/${id}`,
    'actor': `https://${domain}/api/activitepub/users/${userName}`,
    'attributedTo': `https://${domain}/api/activitepub/users/${userName}`,
    'type': 'Note',
    'published': d.toISOString(),
    'content': isNoEnki ? `${text}<p><a href='https://${message_domain}/communities/${pathtype}/${id}'>https://${message_domain}/communities/${pathtype}/${id}</a></p>` : text,
    'draft': false,
    'attachment': [],
    'to': ['https://www.w3.org/ns/activitystreams#Public'],
    'cc': [`https://${domain}/api/activitepub/follower/${userName}`]
  };

  if (imgPath && suff) {
    noteMessage.attachment.push({
      'mediaType': `image/${suff}`,
      'type': 'Document',
      'url': imgPath,
    });
  }

  if (vedioURL && suff_vedio) {
    noteMessage.attachment.push({
      'mediaType': `image/${suff_vedio}`,
      'type': 'Document',
      'url': vedioURL,
    });
  }

  if (contentType === 'Update') {
    noteMessage.updated = d.toISOString();
    delete noteMessage.published;
  }

  let createMessage: CreateMessage = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    'id': `https://${message_domain}/communities/${pathtype}/${id}#${contentType}`,
    'type': contentType,
    'published': d.toISOString(),
    'actor': `https://${domain}/api/activitepub/users/${userName}`,
    'attributedTo': `https://${domain}/api/activitepub/users/${userName}`,
    'to': ['https://www.w3.org/ns/activitystreams#Public'],
    'cc': [`https://${domain}/api/activitepub/follower/${userName}`],
    'object': noteMessage
  };

  return createMessage;
}


// export function createMessage(userName:string,domain:string,text:string,
//   imgPath:string,id:string,message_domain:string,pathtype:string,contentType:string
//   ,vedioURL:string,isNoEnki:boolean)
// {   
//     userName=userName.toLowerCase()
//     let d=new Date();  
//     let suff=imgPath.indexOf('.')>0?imgPath.split('.').splice(-1)[0]:''
//     let suff_vedio=vedioURL.indexOf('.')>0?vedioURL.split('.').splice(-1)[0]:''
//     let noteMessage = {
//       'id': `https://${message_domain}/communities/${pathtype}/${id}`,
//       'url':`https://${message_domain}/communities/${pathtype}/${id}`,
//       'atomUri':`https://${message_domain}/communities/${pathtype}/${id}`,
//       'actor': `https://${domain}/api/activitepub/users/${userName}`,
//       'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
//       'type':'Note',
//       'published': d.toISOString(),
//       'content':isNoEnki?`${text}<p><a href='https://${message_domain}/communities/${pathtype}/${id}'>https://${message_domain}/communities/${pathtype}/${id}</a></p>`:text,
//       'draft': false,
//       // 'name':text,
//       // 'title':text,
//       // imgPath,vedioURL,
//       attachment:[],
//       'to': ['https://www.w3.org/ns/activitystreams#Public'],
//       'cc':[`https://${domain}/api/activitepub/follower/${userName}`]
//     };
  
//     if(imgPath && suff)
//     {
//       noteMessage['attachment'].push({
//         'mediaType':`image/${suff}`,
//         'type':'Document',
//         'url': imgPath,
//       });
//     }
//     if(vedioURL && suff_vedio)
//       {
      
//         noteMessage['attachment'].push({
//           'mediaType':`image/${suff_vedio}`,
//           'type':'Document',
//           'url': vedioURL,
//         });
//       }

//     if(contentType==='Update'){
//       noteMessage.updated=d.toISOString();
//       delete noteMessage.published;
//     }
//     let createMessage = {
//       '@context': 'https://www.w3.org/ns/activitystreams',
//       'id': `https://${message_domain}/communities/${pathtype}/${id}#${contentType}`,
//       'type': contentType,
//       'published': d.toISOString(),
//       'actor': `https://${domain}/api/activitepub/users/${userName}`,
//       'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
//       'to': ['https://www.w3.org/ns/activitystreams#Public'],
//       'cc':[`https://${domain}/api/activitepub/follower/${userName}`],
//       'object': noteMessage
//     };
//     return createMessage;
// }
