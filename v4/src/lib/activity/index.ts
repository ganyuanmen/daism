import crypto from 'crypto';
import path from 'path';


interface Actor {
  '@context': string[];
  id: string;
  type: string;
  preferredUsername: string;
  name: string;
  manager: string;
  summary: string;
  icon: {
    type: string;
    mediaType: string;
    url: string;
  };
  inbox: string;
  outbox: string;
  followers: string;
  following: string;
  publicKey: {
    id: string;
    owner: string;
    publicKeyPem: string;
  };
}

interface Webfinger {
  subject: string;
  aliases: string[];
  links: Array<{
    rel: string;
    type?: string;
    href?: string;
    template?: string;
  }>;
}

interface Accept {
  '@context': string;
  id: string;
  type: string;
  actor: string;
  object: any;
}

interface Follow {
  '@context': string;
  id: string;
  type: string;
  actor: string;
  object: string;
}

interface Undo {
  '@context': string;
  id: string;
  type: string;
  actor: string;
  object: {
    id: string;
    type: string;
    actor: string;
    object: string;
  };
}

interface Collection {
  type: string;
  totalItems: number;
  id: string;
  first: {
    type: string;
    totalItems: number;
    partOf: string;
    orderedItems: any[];
    id: string;
  };
  '@context': string[];
}

interface Announce {
  '@context': string;
  id: string;
  type: string;
  actor: string;
  attributedTo: string;
  object: string;
  content: string;
  topImg: string;
  vedioUrl: string;
  published: string;
  to: string[];
  cc: string[];
}

interface NoteMessage {
  id: string;
  url: string;
  content: string;
  bid: string;
  typeIndex: string;
  vedioUrl: string;
  topImg: string;
  manager: string;
  type: string;
  published: string;
  inReplyTo: string;
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

interface DeleteMessage {
  '@context': string;
  id: string;
  type: string;
  published: string;
  actor: string;
  object: {
    id: string;
    atomUri: string;
  };
}


export function createActor(name: string, domain: string, user: DaismActor): Actor {
  name = name.toLowerCase();
  const avatarExt = user.avatar ? path.extname(user.avatar).slice(1) : 'svg+xml';
  
  return {
    '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    id: `https://${domain}/api/activitepub/users/${name}`,
    type: 'Person',
    preferredUsername: name,
    name: name,
    manager: user.manager,
    summary: user.actor_desc,
    icon: {
      type: 'Image',
      mediaType: `image/${avatarExt}`,
      url: user.avatar ? user.avatar : `https://${domain}/logo.svg`
    },
    inbox: `https://${domain}/api/activitepub/inbox/${name}`,
    outbox: `https://${domain}/api/activitepub/outbox/${name}`,
    followers: `https://${domain}/api/activitepub/followers/${name}`,
    following: `https://${domain}/api/activitepub/following/${name}`,
    publicKey: {
      id: `https://${domain}/api/activitepub/users/${name}#main-key`,
      owner: `https://${domain}/api/activitepub/users/${name}`,
      publicKeyPem: user.pubkey||'',
    },
  };
}

export function createWebfinger(userName: string, domain: string, id: string|number, avatar?: string): Webfinger {
  userName = userName.toLowerCase();
  const avatarExt = avatar ? path.extname(avatar).slice(1) : 'svg';
  
  return {
    subject: `acct:${userName}@${domain}`,
    aliases: [`https://${domain}/api/activitepub/users/${userName}`],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: `https://${domain}/communities/visit/${id}`
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${domain}/api/activitepub/users/${userName}`
      },
      {
        rel: "http://ostatus.org/schema/1.0/subscribe",
        template: `https://${domain}/authorize_interaction?uri={uri}`
      },
      {
        rel: "http://webfinger.net/rel/avatar",
        type: `image/${avatarExt}`,
        href: avatar ? avatar : `https://${domain}/logo.svg`
      }
    ]
  };
}

export function createAccept(thebody: any, userName: string, domain: string): Accept {
  userName = userName.toLowerCase();
  const guid = crypto.randomBytes(16).toString('hex');
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://${domain}/${guid}`,
    type: 'Accept',
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    object: thebody,
  };
}

export function createFollow(userName: string, domain: string, actorUrl: string, guid: string): Follow {
  userName = userName.toLowerCase();
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://${domain}/${userName}/follow/${guid}`,
    type: 'Follow',
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    object: actorUrl
  };
}

export function createUndo(userName: string, domain: string, actorUrl: string, followId: string): Undo {
  userName = userName.toLowerCase();
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: followId.replace('follow', 'undo'),
    type: 'Undo',
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    object: {
      id: followId,
      type: 'Follow',
      actor: `https://${domain}/api/activitepub/users/${userName}`,
      object: actorUrl
    }
  };
}

export function createFollowers(userName: string, domain: string, followers: any[]): Collection {
  userName = userName.toLowerCase();
  
  return {
    type: "OrderedCollection",
    totalItems: followers.length,
    id: `https://${domain}/api/activitepub/followers/${userName}`,
    first: {
      type: "OrderedCollectionPage",
      totalItems: followers.length,
      partOf: `https://${domain}/api/activitepub/followers/${userName}`,
      orderedItems: followers,
      id: `https://${domain}/api/activitepub/followers/${userName}?page=1`
    },
    "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"]
  };
}

export function createFollowees(userName: string, domain: string, followees: any[]): Collection {
  userName = userName.toLowerCase();
  
  return {
    type: "OrderedCollection",
    totalItems: followees.length,
    id: `https://${domain}/api/activitepub/following/${userName}`,
    first: {
      type: "OrderedCollectionPage",
      totalItems: followees.length,
      partOf: `https://${domain}/api/activitepub/following/${userName}`,
      orderedItems: followees,
      id: `https://${domain}/api/activitepub/following/${userName}?page=1`
    },
    "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"]
  };
}

export function createLiked(userName: string, domain: string, likedItems: any[]): Collection {
  userName = userName.toLowerCase();
  
  return {
    type: "OrderedCollection",
    totalItems: likedItems.length,
    id: `https://${domain}/api/activitepub/liked/${userName}`,
    first: {
      type: "OrderedCollectionPage",
      totalItems: likedItems.length,
      partOf: `https://${domain}/api/activitepub/liked/${userName}`,
      orderedItems: likedItems,
      id: `https://${domain}/api/activitepub/liked/${userName}?page=1`
    },
    "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"]
  };
}

export function createAnnounce(
  userName: string,
  domain: string,
  id: string,
  content: string,
  topImg: string,
  vedioUrl: string,
  toUrl: string
): Announce {
  userName = userName.toLowerCase();
  const d = new Date();
  
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `https://${domain}/api/activitepub/users/${userName}/announces/${d.getTime()}`,
    type: "Announce",
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    attributedTo: toUrl,
    object: id,
    content,
    topImg,
    vedioUrl,
    published: d.toISOString(),
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    cc: ["https://example.com/users/alice/followers"]
  };
}

export function createNote(
  userName: string,
  domain: string,
  pid: string,
  id: string,
  message_domain: string,
  pathtype: string,
  content: string,
  bid: string,
  typeIndex: string,
  vedioUrl: string,
  topImg: string,
  manager: string
): CreateMessage {
  userName = userName.toLowerCase();
  const d = new Date();
  
  const noteMessage: NoteMessage = {
    id: `https://${message_domain}/commont/${pathtype}/${id}`,
    url: pid,
    content,
    bid,
    typeIndex,
    vedioUrl,
    topImg,
    manager,
    type: 'Note',
    published: d.toISOString(),
    inReplyTo: pid,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`https://${domain}/api/activitepub/follower/${userName}`]
  };
  
  const createMessage: CreateMessage = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://${message_domain}/commont/${pathtype}/${id}/${d.getTime()}`,
    type: 'Create',
    published: d.toISOString(),
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    attributedTo: `https://${domain}/api/activitepub/users/${userName}`,
    to: ['https://www.w3.org/ns/activitystreams#Public'],
    cc: [`https://${domain}/api/activitepub/follower/${userName}`],
    object: noteMessage
  };
  
  return createMessage;
}

export function createNoteDel(
  userName: string,
  domain: string,
  messageId: string,
  message_domain: string,
  pathtype: string
): DeleteMessage {
  userName = userName.toLowerCase();
  const d = new Date();
  
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://${message_domain}/commont/${pathtype}/${messageId}#delete`,
    type: 'Delete',
    published: d.toISOString(),
    actor: `https://${domain}/api/activitepub/users/${userName}`,
    object: {
      id: `https://${message_domain}/commont/${pathtype}/${messageId}`,
      atomUri: `https://${message_domain}/commont/${pathtype}/${messageId}`
    },
  };
}

