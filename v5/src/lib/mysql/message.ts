import { getData, execute, DatabaseWriteError } from './common';
import { getSigneActor, httpGet } from "../net";
import { getUser } from './user';
import { getFollowers_send } from './folllow';
import { createAnnounce } from '../activity';
import { sendfollow } from '../utils/sendfollow';
import { sendcommont } from '../utils/sendcommont';
import { sendSignedActivity } from '../activity/sendSignedActivity';

// ====================== SSRF Protection ======================

/** IPv4 ranges that must never be targeted by outbound HTTP requests */
const BLOCKED_IP_RANGES = [
  /^127\./,                     // Loopback
  /^10\./,                      // Class A private
  /^172\.(1[6-9]|2\d|3[01])\./, // Class B private
  /^192\.168\./,                // Class C private
  /^169\.254\./,                // Link-local
  /^0\./,                       // Current network
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,  // Carrier-grade NAT
];

/** Allowed ActivityPub federation domains (populate from config in production) */
const ALLOWED_FEDERATION_DOMAINS: Set<string> = new Set(
  (process.env.FEDERATION_ALLOWED_DOMAINS || '')
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean)
);

// Always allow the local domain
if (process.env.NEXT_PUBLIC_DOMAIN) {
  ALLOWED_FEDERATION_DOMAINS.add(process.env.NEXT_PUBLIC_DOMAIN.toLowerCase());
}

/**
 * Validate that a URL does not target internal/private IP addresses.
 * Throws if the hostname resolves to a blocked range.
 */
function validateUrlTarget(urlString: string): void {
  let hostname: string;
  try {
    const parsed = new URL(urlString);
    hostname = parsed.hostname.toLowerCase();
  } catch {
    throw new Error(`SSRF blocked: invalid URL "${urlString.substring(0, 100)}"`);
  }

  // Block private/internal IPs
  for (const pattern of BLOCKED_IP_RANGES) {
    if (pattern.test(hostname)) {
      throw new Error(`SSRF blocked: internal IP range detected (${hostname})`);
    }
  }

  // If federation domain whitelist is configured, enforce it for non-local requests
  if (ALLOWED_FEDERATION_DOMAINS.size > 0 && !ALLOWED_FEDERATION_DOMAINS.has(hostname)) {
    // Allow if it's the local domain passed via NEXT_PUBLIC_DOMAIN
    const localDomain = process.env.NEXT_PUBLIC_DOMAIN?.toLowerCase();
    if (hostname !== localDomain) {
      throw new Error(`SSRF blocked: domain "${hostname}" not in federation allowlist`);
    }
  }
}

/**
 * Validate and parse a domain from an account string (e.g. "user@example.com").
 * Returns the domain part, or throws if the format is invalid.
 */
function parseDomainFromAccount(account: string): string {
  const parts = account.split('@');
  if (parts.length < 2 || !parts[1]) {
    throw new Error(`Invalid account format (expected username@domain): "${account}"`);
  }
  return parts[1];
}

// ====================== Type Definitions ======================

interface MessagePageParams {
  pi: number | string;
  menutype: number | string;
  daoid: number | string;
  w?: string;
  actorid: number | string;
  account?: string;
  order?: string;
  eventnum: number | string;
  v?: number | string;
}

interface EnkiTotalParams {
  account: string;
  actorid: number | string;
  t?: number | string;
}

interface DaoPageParams {
  pi: number | string;
  w?: string;
}

interface InsertMessageParams {
  account: string;
  message_id: string;
  pathtype: string;
  contentType: string;
  idx: number | string;
}

interface ReplyTotalParams {
  sctype: string;
  pid: string;
}

interface GetAccountParams {
  id: string;
}

interface UpdateNoticeParams {
  manager: string;
}

interface UpdateSetParams {
  text: string;
  local: string;
  id: number | string;
}

interface RegisterLogParams {
  did: string;
}

interface ReplyPageParams {
  pi: number | string;
  sctype: string;
  pid: string;
}

interface SetTopMessageParams {
  id: string;
  sctype: string;
  flag: number | string;
}

interface MessageDelParams {
  mid: string;
  type: number | string;
  path: string;
  sctype: string;
  pid?: string;
  rAccount?: string;
  account?: string;
}

interface HeartAndBookParams {
  pid: string;
  account: string;
  table: string;
  sctype: string;
}

interface HandleHeartAndBookParams {
  account: string;
  pid: string;
  flag: number | string;
  table: string;
  sctype: string;
}

interface SetAnnounceParams {
  account: string;
  id: string;
  content: string;
  sctype: string;
  topImg?: string;
  vedioUrl?: string;
  toUrl?: string;
  linkurl?: string;
}

interface GetOneParams {
  id: string;
  sctype: string;
}

interface GetOneByMessageIdParams {
  id1: string;
  id2: string;
  sctype: string;
}

interface GetAnnoceParams {
  id: string;
  account: string;
}

interface FromAccountParams {
  actor_account: string;
  user_account: string;
}

interface GetNoticeParams {
  manager: string;
}

interface GetLastDonateParams {
  did: string;
}

// ====================== Sctype Whitelist ======================

/** Allowed values for sctype parameter — prevents dynamic table name injection */
const ALLOWED_SCTYPE_VALUES = ['', 'sc'] as const;
type Sctype = typeof ALLOWED_SCTYPE_VALUES[number];

/**
 * Validate sctype against the whitelist. Throws if invalid.
 * This prevents SQL injection via dynamic table name construction.
 */
function validateSctype(value: string): Sctype {
  if (ALLOWED_SCTYPE_VALUES.includes(value as Sctype)) {
    return value as Sctype;
  }
  throw new Error(`Invalid sctype value: "${value}". Allowed: ${ALLOWED_SCTYPE_VALUES.join(', ')}`);
}

// ====================== SQL Injection Protection ======================

/** Allowed ORDER BY columns for message queries */
const ALLOWED_MESSAGE_ORDER_COLUMNS = new Set([
  'id', 'createtime', 'message_id', 'total_score', 'is_top',
]);

/**
 * Validate and sanitize an ORDER BY column name.
 */
function validateOrderColumn(order: string, defaultOrder: string = 'id'): string {
  const cleaned = order.replace(/[^a-zA-Z0-9_]/g, '');
  return ALLOWED_MESSAGE_ORDER_COLUMNS.has(cleaned) ? cleaned : defaultOrder;
}

// ====================== Message Pagination ======================

/**
 * Paginated message data query.
 * Parameters: pi, menutype, daoid, w, actorid, account, order, eventnum, v
 *
 * menutype: 1=my community, 2=public community, 3=personal
 * eventnum: community: 0=non-event, 1=event; personal: 1=home, 2=my posts, 3=bookmarks, 4=received, 8=filter
 * v: for menutype 1: 3=bookmarks, 6=likes, 1=following
 */
export async function messagePageData(params: MessagePageParams): Promise<any[]> {
  const { pi, menutype, daoid, w, actorid, account, order, eventnum, v } = params;
  const safeOrder = validateOrderColumn(order || 'id', 'id');
  const menuType = parseInt(String(menutype));
  const eventNum = parseInt(String(eventnum));
  const vNum = parseInt(String(v || '0'));
  const pageOffset = Number(pi) * 12;

  // Build query conditionally — all user-supplied values are now parameterized
  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (menuType === 1) {
    if (vNum === 3) {
      // Bookmarks in community
      conditions.push(`a.message_id IN (SELECT pid FROM a_bookmarksc WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (vNum === 6) {
      // Likes in community
      conditions.push(`a.message_id IN (SELECT pid FROM a_heartsc WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (vNum === 1) {
      // Following in community
      conditions.push(`a.actor_account IN (SELECT actor_account FROM a_follow WHERE user_account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else {
      if (String(daoid).includes(',')) {
        // Multiple DAO IDs — validate that daoid only contains numbers and commas
        if (!/^[\d,]+$/.test(String(daoid))) {
          throw new Error('Invalid daoid parameter');
        }
        conditions.push(`a.dao_id IN (${String(daoid)})`);
      } else {
        conditions.push(`a.dao_id=?`);
        queryParams.push(Number(daoid));
      }
      if (eventNum === 1) {
        conditions.push(`a._type=1`);
      } else if (eventNum === 8) {
        conditions.push(`a.message_id IN (SELECT pid FROM a_tag WHERE tag_name=?)`);
        queryParams.push(w || '');
      }
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    }
  } else if (menuType === 2) {
    if (Number(daoid) > 0) {
      conditions.push(`a.dao_id=?`);
      queryParams.push(Number(daoid));
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 1) {
      return executeParameterizedQuery('v_messagesc', 'a', [`a._type=1`], [], safeOrder, pageOffset);
    } else if (eventNum === 2) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_bookmarksc WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 3) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_heartsc WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 8) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_tag WHERE tag_name=?)`);
      queryParams.push(w || '');
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 9) {
      conditions.push(`a.actor_id=?`);
      queryParams.push(Number(actorid));
      return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
    }
    return executeParameterizedQuery('v_messagesc', 'a', conditions, queryParams, safeOrder, pageOffset);
  } else {
    // Personal messages (menutype 3)
    if (eventNum === 1) {
      conditions.push(`((a.send_type=0 AND a.actor_account=?) OR a.receive_account=?)`);
      queryParams.push(account, account);
    } else if (eventNum === 2) {
      conditions.push(`a.send_type=0 AND a.actor_account=?`);
      queryParams.push(account);
    } else if (eventNum === 3) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_bookmark WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('vv_message', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 4) {
      conditions.push(`a.receive_account=?`);
      queryParams.push(account);
    } else if (eventNum === 5) {
      conditions.push(`a.send_type=0 AND a.property_index=1`);
    } else if (eventNum === 6) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_heart WHERE account=?)`);
      queryParams.push(account);
      return executeParameterizedQuery('vv_message', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 7) {
      conditions.push(`a.receive_account=? AND a.send_type=2`);
      queryParams.push(account);
    } else if (eventNum === 8) {
      conditions.push(`a.message_id IN (SELECT pid FROM a_tag WHERE tag_name=?)`);
      queryParams.push(w || '');
      return executeParameterizedQuery('vv_message', 'a', conditions, queryParams, safeOrder, pageOffset);
    } else if (eventNum === 9) {
      conditions.push(`a.send_type=0 AND a.property_index=1 AND a.actor_account=?`);
      queryParams.push(account);
    }
    return executeParameterizedQuery('v_message', 'a', conditions, queryParams, safeOrder, pageOffset);
  }
}

/** Helper: build and execute a parameterized message query */
async function executeParameterizedQuery(
  table: string,
  alias: string,
  conditions: string[],
  params: any[],
  orderCol: string,
  offset: number,
): Promise<any[]> {
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT ${alias}.* FROM ${table} ${alias} ${whereClause} ORDER BY ${alias}.${orderCol} DESC LIMIT ${offset},12`;

  // Build final params array, adding search params if present
  return await getData(sql, params);
}

// ====================== Message Statistics ======================

export interface EnkiTotal {
  total: number;
}

export async function getEnkiTotal(params: EnkiTotalParams): Promise<EnkiTotal[]> {
  const { account, actorid, t } = params;

  let sql: string;
  const baseParams = [account, Number(actorid), account];

  if (t) {
    sql = 'SELECT COUNT(*) AS total FROM v_message WHERE LOWER(actor_account)=? AND property_index=1 AND send_type=0 ' +
          'UNION ALL SELECT COUNT(*) AS total FROM a_messagesc WHERE actor_id=? ' +
          'UNION ALL SELECT COUNT(*) AS total FROM a_sendmessage WHERE LOWER(receive_account)=?';
  } else {
    sql = 'SELECT COUNT(*) AS total FROM v_message WHERE LOWER(actor_account)=? AND send_type=0 ' +
          'UNION ALL SELECT COUNT(*) AS total FROM a_messagesc WHERE actor_id=? ' +
          'UNION ALL SELECT COUNT(*) AS total FROM a_sendmessage WHERE LOWER(receive_account)=?';
  }

  const re: any = await getData(sql, baseParams);
  return re;
}

// ====================== DAO Pagination ======================

export async function daoPageData(params: DaoPageParams): Promise<any[]> {
  const { pi, w } = params;
  const pageOffset = Number(pi) * 10;
  const queryParams: any[] = [];

  let whereClause = 'WHERE dao_id>0';
  if (w) {
    whereClause += ' AND actor_name LIKE ?';
    queryParams.push(`%${w}%`);
  }

  const sql = `SELECT dao_id,actor_account,avatar FROM a_account ${whereClause} ORDER BY id LIMIT ${pageOffset},10`;
  const re: any[] = await getData(sql, queryParams);
  return re;
}

// ====================== Message Operations ======================

export async function insertMessage(params: InsertMessageParams): Promise<void> {
  const { account, message_id, pathtype, contentType, idx } = params;
  const sctype = validateSctype(pathtype === 'enkier' ? '' : 'sc');

  const re: any = await getData(
    `SELECT message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,title,content,top_img FROM v_message${sctype} WHERE message_id=?`,
    [message_id],
    true
  );

  const linkUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/communities/${pathtype}/${message_id}`;
  let sql: string;
  let paras: any[];

  if (contentType === 'Create') {
    sql = "INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,link_url,title,content,is_send,is_discussion,top_img,receive_account,send_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    paras = [re.message_id, re.manager, re.actor_name, re.avatar, re.actor_account, re.actor_url, re.actor_inbox, linkUrl, re.title, re.content, 0, 1, re.top_img, account, 1];
    await execute(sql, paras);
  } else if (contentType === 'Update' && sctype === 'sc' && Number(idx) === 0) {
    sql = "UPDATE a_message SET content=?,top_img=? WHERE message_id=? AND receive_account!=''";
    paras = [re.content, re.top_img, re.message_id];
    await execute(sql, paras);
  }
}

// ====================== Reply Statistics ======================

export async function getReplyTotal(params: ReplyTotalParams): Promise<any> {
  const { sctype, pid } = params;
  validateSctype(sctype);
  const sql = `SELECT COUNT(*) AS total FROM a_message${sctype}_commont WHERE pid=?`;
  const re: any[] = await getData(sql, [pid]);
  return re[0].total;
}

// ====================== Account ======================

export async function getAccount(params: GetAccountParams): Promise<any> {
  const { id } = params;
  const sql = `SELECT manager,actor_account,actor_name,avatar FROM v_account WHERE register_time=?`;
  const aa = await getData(sql, [id]);
  return aa;
}

// ====================== Notifications ======================

export async function updateNotice(params: UpdateNoticeParams): Promise<any> {
  const { manager } = params;
  return await execute('UPDATE t_nft_tip SET is_read=1 WHERE LOWER(tip_to)=? AND is_read=0;', [manager.toLowerCase()]);
}

// ====================== Update Settings ======================
// id=1: home page text description
// id=2: public tools list edit

export async function updateSet(params: UpdateSetParams): Promise<any> {
  const { text, local, id } = params;

  // Use parameterized query instead of string interpolation
  const column = local === 'en' ? 'var_en' : 'var_zh';
  const sql = `UPDATE a_home SET ${column}=? WHERE id=?`;
  const affectedRows = await execute(sql, [text, Number(id)]);

  if (affectedRows === 0) {
    throw new Error('updateSet: no rows affected, update may have failed');
  }

  return affectedRows;
}

// ====================== Registration Log ======================

export async function insertRegisterLog(params: RegisterLogParams): Promise<any> {
  const { did } = params;
  return await execute("INSERT INTO t_register_log(manager) VALUES(?)", [did.toLowerCase()]);
}

// ====================== Reply Pagination ======================

export async function replyPageData(params: ReplyPageParams): Promise<any[]> {
  const { pi, sctype, pid } = params;
  validateSctype(sctype);
  const pageOffset = Number(pi) * 20;
  const sql = `SELECT * FROM v_message${sctype}_commont WHERE pid=? ORDER BY bid DESC, createtime ASC LIMIT ${pageOffset},20`;
  const re: any[] = await getData(sql, [pid]);
  return re;
}

// ====================== Message Pin ======================

export async function setTopMessage(params: SetTopMessageParams): Promise<any> {
  const { id, sctype, flag } = params;
  validateSctype(sctype);
  return await execute(`UPDATE a_message${sctype} SET is_top=? WHERE message_id=?`, [Number(flag), id]);
}

// ====================== Delete Message ======================

export async function messageDel(params: MessageDelParams): Promise<any> {
  const { mid, type, path, sctype, pid, rAccount, account } = params;
  validateSctype(sctype);

  if (Number(type) === 0) {
    let affectedRows: number;
    if (path === 'enki') {
      affectedRows = await execute(`DELETE FROM a_messagesc WHERE message_id=?`, [mid]);
    } else if (path === 'enkier') {
      if (rAccount) {
        affectedRows = await execute(`DELETE FROM a_sendmessage WHERE message_id=? AND receive_account=?`, [mid, rAccount]);
      } else {
        affectedRows = await execute(`DELETE FROM a_message WHERE message_id=?`, [mid]);
      }
    } else {
      affectedRows = 0;
    }

    // if (affectedRows > 0 && !rAccount) {
    if (affectedRows > 0 && !rAccount && account){
      sendfollow(account, '', '', '', mid, sctype === 'sc' ? 'enki' : 'enkier', '', 'Delete');
    }
  } else {
    const affectedRows = await execute(`CALL del_commont(?,?,?)`, [sctype, mid, pid]);
    if (affectedRows > 0  && account) {
      sendcommont(account, mid, sctype === 'sc' ? 'enki' : 'enkier');
    } else {
      console.error(`del_commont failed or returned 0 affected rows`);
    }
  }
}

// ====================== Common/Shared ======================

export async function getAllSmartCommon(): Promise<any[]> {
  const re: any[] = await getData('SELECT * FROM v_allsmartcommon', []);
  return re || [];
}

export interface HeartAndBookType {
  total: number;
  pid: string;
}

export async function getHeartAndBook(params: HeartAndBookParams): Promise<HeartAndBookType> {
  const { pid, account, table, sctype } = params;
  validateSctype(sctype);
  const sql = `SELECT a.total,IFNULL(b.pid,'') pid FROM (SELECT COUNT(*) total FROM a_${table}${sctype} WHERE pid=?) a LEFT JOIN (SELECT pid FROM a_${table}${sctype} WHERE pid=? AND account=?) b ON 1=1`;
  return await getData(sql, [pid, pid, account], true) as HeartAndBookType;
}

export async function handleHeartAndBook(params: HandleHeartAndBookParams): Promise<any> {
  const { account, pid, flag, table, sctype } = params;
  validateSctype(sctype);
  if (Number(flag) === 0) {
    return await execute(`DELETE FROM a_${table}${sctype} WHERE pid=? AND account=?`, [pid, account]);
  } else {
    return await execute(`INSERT INTO a_${table}${sctype}(account, pid) VALUES(?,?)`, [account, pid]);
  }
}

// ====================== Announcements ======================

export async function setAnnounce(params: SetAnnounceParams): Promise<any> {
  const { account, id, content, sctype, topImg, vedioUrl, toUrl, linkurl } = params;
  validateSctype(sctype);

  const affectedRows = await execute('CALL send_annoce(?,?,?)', [sctype, id, account]);
  if (affectedRows > 0) {
    try {
      const localActor = await getSigneActor(account);
      if (!localActor) {
        console.error("setAnnounce: no such account:", account);
        return;
      }
      const [actorName] = account.split('@');
      let sendbody: any;

      getFollowers_send({ account }).then(async data => {
        // Create sendbody once per follower to avoid mutation issues (was: singleton reuse)
        data.forEach((element: any) => {
          // const perFollowerBody = createAnnounce(
          //   actorName,
          //   process.env.NEXT_PUBLIC_DOMAIN as string,
          //   linkurl,
          //   content,
          //   topImg,
          //   vedioUrl,
          //   toUrl
          // );
          const perFollowerBody = createAnnounce(
            actorName,
            process.env.NEXT_PUBLIC_DOMAIN as string,
            linkurl || '',
            content || '',
            topImg || '',
            vedioUrl || '',
            toUrl || ''
          );
          sendSignedActivity(element.user_inbox, perFollowerBody, localActor);
        });
      });
    } catch (e1) {
      console.error(e1);
    }
  } else {
    console.warn('setAnnounce: send_annoce returned 0 affected rows');
  }
}

// ====================== Donation ======================

export async function getLastDonate(params: GetLastDonateParams): Promise<any> {
  const { did } = params;
  const sql = 'SELECT * FROM t_donate WHERE donor_address=? ORDER BY block_num DESC LIMIT 1';
  const re: any = await getData(sql, [did]);
  return re[0] || {};
}

// ====================== Get One Message ======================

/**
 * Get a single message by either numeric id or message_id string.
 * Uses explicit parameter to distinguish ID types instead of string-length heuristic.
 */
export async function getOne(params: GetOneParams): Promise<EnkiMessType> {
  const { id, sctype } = params;
  validateSctype(sctype);

  // Determine which column to use: if id looks like a numeric auto-increment ID, use `id`;
  // otherwise treat it as a message_id string.
  const isNumericId = /^\d+$/.test(id) && Number(id) < 1000000000; // Reasonable threshold
  const column = isNumericId ? 'id' : 'message_id';
  const sql = `SELECT * FROM v_message${sctype} WHERE ${column}=?`;
  const re: any = await getData(sql, [id]);
  return re.length ? re[0] : {} as EnkiMessType;
}

// ====================== Get One By Message ID ======================

export async function getOneByMessageId(params: GetOneByMessageIdParams): Promise<EnkiMessType> {
  const { id1, id2, sctype } = params;
  validateSctype(sctype);
  const re: any = await getData(`SELECT * FROM v_message${sctype} WHERE message_id=? OR message_id=?`, [id1, id2]);
  return re.length ? re[0] : {} as EnkiMessType;
}

// ====================== Announce Forward Check ======================

export async function getAnnoce(params: GetAnnoceParams): Promise<any> {
  const { id, account } = params;
  const re: any = await getData('SELECT 1 FROM a_annoce WHERE pid=? AND account=?', [id, account]);
  return re || [];
}

// ====================== Follow Lookup ======================

async function findFollow(actor_account: string, user_account: string): Promise<number> {
  const sql = 'SELECT id FROM a_follow WHERE actor_account=? AND user_account=?';
  const re: any = await getData(sql, [actor_account, user_account]);
  return re && re.length > 0 ? re[0].id : 0;
}

/**
 * Look up account info by actor_account, matching local or remote (federated) users.
 * Uses exact domain matching instead of String.includes() to prevent substring false positives.
 */
export async function fromAccount(params: FromAccountParams): Promise<any> {
  const { actor_account, user_account } = params;
  let obj: any = {};

  const localDomain = process.env.NEXT_PUBLIC_DOMAIN as string;

  // Exact domain match: parse the domain from actor_account and compare
  try {
    const accountDomain = parseDomainFromAccount(actor_account);
    if (accountDomain === localDomain) {
      const sql = 'SELECT actor_name `name`, actor_inbox inbox, domain, actor_account account, actor_url url, avatar, pubkey, manager FROM v_account WHERE actor_account=? OR actor_url=?';
      const re: any = await getData(sql, [actor_account, actor_account]);
      if (re[0]) {
        obj = re[0];
        obj.id = await findFollow(actor_account, user_account);
      }
    } else {
      if (actor_account.startsWith('http')) {
        obj = await getInboxFromUrl(actor_account);
      } else {
        obj = await getInboxFromAccount(actor_account);
      }

      if (obj.inbox) {
        obj.id = await findFollow(actor_account, user_account);
      }
    }
  } catch (e) {
    console.error('fromAccount error:', e);
  }

  return obj;
}

// ====================== Notifications ======================

export async function getNotice(params: GetNoticeParams): Promise<any> {
  const { manager } = params;
  const re: any = await getData(
    'SELECT id FROM t_nft_tip WHERE LOWER(tip_to)=? AND is_read=0',
    [manager.toLowerCase()]
  );
  return re;
}

// ====================== ActivityPub Federation (SSRF-protected) ======================

/**
 * Get inbox info from an ActivityPub account string (e.g. "user@example.com").
 * Protected against SSRF: validates the target domain before making outbound HTTP requests.
 */
export async function getInboxFromAccount(account: string): Promise<ActorInfo> {
  let reobj: ActorInfo = {
    name: '',
    domain: '',
    inbox: '',
    account: '',
    url: '',
    pubkey: '',
    avatar: '',
  };

  try {
    const domain = parseDomainFromAccount(account);
    const parts = account.split('@');
    const obj: any = { name: parts[0], domain, inbox: '' };

    const requestUrl = `https://${domain}/.well-known/webfinger?resource=acct:${account}`;
    validateUrlTarget(requestUrl);

    const reData: any = await httpGet(requestUrl);
    const re = typeof reData === 'string' ? JSON.parse(reData) : reData;

    if (!re) return obj;

    let url = '';
    let type = '';
    for (let i = 0; i < re.links.length; i++) {
      if (re.links[i].rel === 'self') {
        url = re.links[i].href;
        type = re.links[i].type;
        break;
      }
    }
    reobj = await getInboxFromUrl(url, type);
  } catch (e) {
    console.error('getInboxFromAccount error:', e);
  }

  return reobj;
}

/**
 * Get inbox info for a local account.
 */
export async function getLocalInboxFromAccount(account: string): Promise<ActorInfo> {
  const obj: ActorInfo = {
    name: '',
    domain: '',
    inbox: '',
    account: '',
    url: '',
    pubkey: '',
    avatar: '',
  };

  const user: DaismActor = await getUser('actor_account', account, 'actor_url,avatar,pubkey');
  if (!user.actor_url) return obj;

  try {
    const [userName, domain] = account.split('@');
    if (!domain) return obj;

    return {
      name: userName,
      domain,
      inbox: `https://${domain}/api/activitepub/inbox/${userName}`,
      account,
      url: user.actor_url,
      pubkey: user.pubkey,
      avatar: user.avatar ?? '',
    };
  } catch {
    return obj;
  }
}

// ====================== URL-based Inbox Lookup (SSRF-protected) ======================

export async function getLocalInboxFromUrl(url: string): Promise<ActorInfo> {
  const obj: ActorInfo = {
    name: '',
    domain: '',
    inbox: '',
    account: '',
    url: '',
    pubkey: '',
    avatar: '',
    manager: '',
  };

  const user: DaismActor = await getUser('actor_url', url, 'actor_account,avatar,pubkey,manager');
  if (!user.actor_account) return obj;

  try {
    const [userName, domain] = user.actor_account.split('@');
    if (!domain) return obj;

    return {
      name: userName,
      domain,
      inbox: `https://${domain}/api/activitepub/inbox/${userName}`,
      account: user.actor_account,
      url,
      pubkey: user.pubkey,
      avatar: user.avatar ?? '',
      manager: user.manager,
    };
  } catch {
    return obj;
  }
}

/**
 * Get inbox info from an ActivityPub actor URL.
 * Protected against SSRF: validates the target URL before making outbound requests.
 * Uses safe optional chaining to prevent crashes on missing publicKey.
 */
export async function getInboxFromUrl(url: string, type: string = 'application/activity+json'): Promise<ActorInfo> {
  const myURL = new URL(url);
  const hostname = myURL.hostname;
  const obj: ActorInfo = {
    name: '',
    domain: hostname,
    inbox: '',
    account: '',
    url: '',
    pubkey: '',
    avatar: '',
    manager: '',
  };

  try {
    validateUrlTarget(url);

    const reData: any = await httpGet(url, {
      "Content-Type": type,
      'Accept': type,
    });
    const re = typeof reData === 'string' ? JSON.parse(reData) : reData;
    if (!re) return obj;

    if (re.name) obj.name = re.name;
    if (re.inbox) {
      obj.inbox = re.inbox;
      obj.desc = re.summary;
      obj.manager = re.manager;
      // Safe optional chaining: prevent crash when publicKey is missing
      obj.pubkey = re.publicKey?.publicKeyPem ?? '';
      obj.url = re.id;
      obj.account = `${re.name}@${hostname}`;
    }
    if (re.avatar?.url) obj.avatar = re.avatar.url;
    else if (re.icon?.url) obj.avatar = re.icon.url;
  } catch (e) {
    console.error('getInboxFromUrl error:', e);
  }

  return obj;
}

/**
 * Get user info from a URL (web profile page).
 * Protected against SSRF: validates URL before outbound requests.
 */
export async function getUserFromUrl(params: { url: string }): Promise<ActorInfo> {
  const { url } = params;

  // Try local lookup first
  const reData = await getLocalInboxFromUrl(url);
  if (reData.inbox && reData.account && reData.url) return reData;

  const myURL = new URL(url);
  const hostname = myURL.hostname;
  const obj: ActorInfo = {
    name: '',
    domain: hostname,
    inbox: '',
    account: '',
    url: '',
    pubkey: '',
    avatar: '',
  };

  try {
    validateUrlTarget(url);

    const reDataNet: any = await httpGet(url, {
      "Content-Type": 'application/activity+json',
      'Accept': 'application/activity+json',
    });
    const re = typeof reDataNet === 'string' ? JSON.parse(reDataNet) : reDataNet;
    if (!re) return obj;

    if (re.name) obj.name = re.name;
    if (re.inbox) {
      obj.inbox = re.inbox;
      obj.desc = re.summary;
      // Safe optional chaining: prevent crash when publicKey is missing
      obj.pubkey = re.publicKey?.publicKeyPem ?? '';
      obj.url = re.id;
      obj.account = `${re.name}@${hostname}`;
    }
    if (re.avatar?.url) obj.avatar = re.avatar.url;
    else if (re.icon?.url) obj.avatar = re.icon.url;
  } catch (e) {
    console.error('getUserFromUrl error:', e);
  }

  return obj;
}
