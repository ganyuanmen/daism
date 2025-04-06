export function createMessage(userName,domain,text,imgPath,id,message_domain,pathtype,contentType,isNoEnki)
{   
    userName=userName.toLowerCase()
    let d=new Date();  
    let suff=imgPath.indexOf('.')>0?imgPath.split('.').splice(-1)[0]:''
    let noteMessage = {
      'id': `https://${message_domain}/communities/${pathtype}/${id}`,
      'url':`https://${message_domain}/communities/${pathtype}/${id}`,
      'atomUri':`https://${message_domain}/communities/${pathtype}/${id}`,
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
      'type':'Note',
      'published': d.toISOString(),
      'attributedTo': `https://${domain}/api/activitepub/users/${userName}`,
      'content':isNoEnki?`${text}<p><a href='https://${message_domain}/communities/${pathtype}/${id}'>https://${message_domain}/communities/${pathtype}/${id}</a></p>`:text,
      'draft': false,
      // 'name':text,
      // 'title':text,
      "imgpath":imgPath,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`]
    };
  
    if(imgPath && suff)
    {
      noteMessage['attachment']=[{
        'mediaType':`image/${suff}`,
        'name':'Banner',
        'type':'Document',
        'url': imgPath,
      }]
    }
    if(contentType==='Update'){
      noteMessage.updated=d.toISOString();
      delete noteMessage.published;
    }
    let createMessage = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${message_domain}/communities/${pathtype}/${id}#${contentType}`,
      'type': contentType,
      'published': d.toISOString(),
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`],
      'object': noteMessage
    };
    return createMessage;
}
