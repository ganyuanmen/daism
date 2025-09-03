export interface Attachment {
  mediaType?: string;
  type?: string;
  url?: string;
}

export interface NoteMessage {
  id?: string;
  url?: string;
  atomUri?: string;
  actor?: string;
  attributedTo?: string;
  type?: string;
  published?: string;
  updated?: string;
  manager?:string;
  typeIndex?:string;
  bid?:string;
  content?: string;
  draft?: boolean;
  vedioURL?:string;
  imgpath?:string;
  inReplyTo?:string;
  inReplyToAtomUri?:string;
  attachment?: Attachment[];
  to?: string[];
  cc?: string[];
}

export interface ActivityPubBody {
  '@context'?: string;
  id?: string;
  type?: string;
  content?:string;
  published?: string;
  actor?: string;
  topImg?:string;
  vedioUrl?:string;
  attributedTo?: string;
  to?: string[];
  cc?: string[];
  object?: NoteMessage|string;
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
): ActivityPubBody {
  userName = userName.toLowerCase();
  const d = new Date();
  const suff = imgPath.indexOf('.') > 0 ? imgPath.split('.').splice(-1)[0] : '';
  const suff_vedio = vedioURL.indexOf('.') > 0 ? vedioURL.split('.').splice(-1)[0] : '';

  const noteMessage: NoteMessage = {
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
  if (imgPath && suff && noteMessage?.attachment) {
    noteMessage.attachment.push({
      'mediaType': `image/${suff}`,
      'type': 'Document',
      'url': imgPath,
    });
  }

  if (vedioURL && suff_vedio && noteMessage?.attachment) {
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

  const createMessage: ActivityPubBody = {
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

