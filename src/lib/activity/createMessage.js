export function createMessage(userName,domain,text,fileName,path,messageId,title,isNote)
{   
    let d=new Date();    
    let type=isNote?'reply':'message';
    let noteMessage = {
      'id': `https://${domain}/enki/${path}/${type}/nomenu/${messageId}`,
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
    // 'type': isNote?'Note':'Article',
      'type':'Article',
      'published': d.toISOString(),
      'attributedTo': `https://${domain}/api/activitepub/users/${userName}`,
      'content': text,
      'draft': false,
      'name':title,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`]
    };
  
    if(fileName && path)
    {
      noteMessage['attachment']=[{
        'mediaType':'image/jpeg',
        'name':'Banner',
        'type':'Document',
        'url': `https://${domain}/uploads/${fileName}`,
      }]
    }
    let createMessage = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${domain}/enki/${path}/${type}/nomenu/${messageId}/activity`,
      'type': 'Create',
      'published': d.toISOString(),
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`],
      'object': noteMessage
    };
    return createMessage;
}
