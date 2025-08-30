import { getData, execute, getJsonArray } from './common';
import { httpGet, signAndSend } from "../net"; 
import { getUser } from './user';
import { getFollowers_send } from './folllow';
import { createAnnounce } from '../activity';
import { sendfollow } from '../utils/sendfollow';
import { sendcommont } from '../utils/sendcommont';

////pi,menutype,daoid,w,actorid:嗯文人ID,account,order,eventnum
// menutype 1 我的社区，2 公区社区 3 个人社区
//eventnum 社区: 0 非活动，1活动, 个人：1:首页 2:我的嗯文 3:我的收藏 4:我的接收嗯文 ,8 过滤（where 为过滤值）
// v: 1 我关注的社区
// ====================== 消息分页 ======================
export async function messagePageData(params: any): Promise<any[]> {
  const { pi, menutype, daoid, w, actorid, account, order, eventnum, v } = params;
  let sql = `select a.* from v_message${parseInt(menutype) === 3 ? '' : 'sc'} a where 1=1`;
  let sctype = '';

  switch(parseInt(menutype)) {
    case 1:
      if(parseInt(v) === 3) sql = `select a.* from v_messagesc a join a_bookmarksc b on a.message_id=b.pid where b.account='${account}'`;
      else if(parseInt(v) === 6) sql = `select a.* from v_messagesc a join a_heartsc b on a.message_id=b.pid where b.account='${account}'`;
      else if(parseInt(v) === 1) sql = `select a.* from v_messagesc a join a_follow b on a.actor_account=b.actor_account WHERE b.user_account='${account}'`;
      else { 
        if(daoid.includes(',')) sql = `select a.* from v_messagesc a where dao_id in(${daoid})`;
        else sql = `select a.* from v_messagesc a where dao_id=${daoid}`;
        if(parseInt(eventnum) === 1) sql = `${sql} and _type=1`;
        else if(parseInt(eventnum) === 8) sql = `select a.* from v_messagesc a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`;
      }
      sctype = 'sc';
      break;
    case 2:
      if(parseInt(daoid) > 0) sql = `select * from v_messagesc a where dao_id=${daoid}`;
      else if(parseInt(eventnum) === 1) sql = "select * from v_messagesc a where _type=1";
      else if(parseInt(eventnum) === 8) sql = `select * from v_messagesc a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`;
      else if(parseInt(eventnum) === 9) sql = `select * from v_messagesc a where actor_id=${actorid}`;
      sctype = 'sc';
      break;
    default:
      if(parseInt(eventnum) === 1) sql = `select a.* from v_message a where ((a.send_type=0 and a.actor_account='${account}') or a.receive_account='${account}')`;
      else if(parseInt(eventnum) === 2) sql = `select a.* from v_message a where (a.send_type=0 and a.actor_account='${account}')`;
      else if(parseInt(eventnum) === 3) sql = `select a.* from vv_message a join a_bookmark b on a.message_id=b.pid where b.account='${account}'`;
      else if(parseInt(eventnum) === 4) sql = `select a.* from v_message a where receive_account='${account}'`;
      else if(parseInt(eventnum) === 5) sql = 'select a.* from v_message a where (a.send_type=0 and a.property_index=1)';
      else if(parseInt(eventnum) === 6) sql = `select a.* from vv_message a join a_heart b on a.message_id=b.pid where b.account='${account}'`;
      else if(parseInt(eventnum) === 7) sql = `select a.* from v_message a where (a.receive_account='${account}' and a.send_type=2)`;
      else if(parseInt(eventnum) === 8) sql = `select a.* from vv_message a join a_tag b on a.message_id=b.pid where b.tag_name='${w}'`;
      else if(parseInt(eventnum) === 9) sql = `select a.* from v_message a where (a.send_type=0 and a.property_index=1 and a.actor_account='${account}')`;
      break;
  }

  let re: any[] = await getData(`${sql} order by ${order} desc limit ${pi*12},12`, []);
  re = re.filter(obj => obj.is_top === 0);

  if(parseInt(pi) === 0) {
    let re1: any[] = await getData(`${sql} and a.is_top=1 order by ${order} desc`, []);
    re = [...re1, ...re];
  }

  return re;
}

// ====================== 消息统计 ======================
export interface EnkiTotal{
 total:number;
}
export async function getEnkiTotal(params: any): Promise<EnkiTotal[]> {
  const { account, actorid, t } = params;
  let sql: string;
  if(t) {
    sql = 'SELECT COUNT(*) AS total FROM v_message WHERE LOWER(actor_account)=? AND property_index=1 and send_type=0 UNION ALL SELECT COUNT(*) AS total FROM a_messagesc WHERE actor_id=? UNION ALL SELECT COUNT(*) AS total FROM a_sendmessage WHERE LOWER(receive_account)=?';
  } else {
    sql = 'SELECT COUNT(*) AS total FROM v_message WHERE LOWER(actor_account)=? and send_type=0 UNION ALL SELECT COUNT(*) AS total FROM a_messagesc WHERE actor_id=? UNION ALL SELECT COUNT(*) AS total FROM a_sendmessage WHERE LOWER(receive_account)=?';
  }
  let re: any = await getData(sql, [account, actorid, account]);
  return re;
}

// ====================== DAO 分页 ======================
export async function daoPageData(params: any): Promise<any[]> {
  const { pi, w } = params;
  let sql = w
    ? `SELECT dao_id,actor_account,avatar FROM a_account WHERE dao_id>0 and actor_name like '%${w}%' order by id limit ${Number(pi)*10},10`
    : `SELECT dao_id,actor_account,avatar FROM a_account WHERE dao_id>0 order by id limit ${Number(pi)*10},10`;
  let re: any[] = await getData(sql, []);
  return re;
}

// ====================== 消息操作 ======================
export async function insertMessage(account: any, message_id: any, pathtype: any, contentType: any, idx: any): Promise<void> {
  const sctype = pathtype === 'enkier' ? '' : 'sc';
  let re: any = await getData(`SELECT message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,title,content,top_img FROM v_message${sctype} WHERE message_id=?`, [message_id], true);

  const linkUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/communities/${pathtype}/${message_id}`;
  let sql: string;
  let paras: any[];

  if(contentType === 'Create') {
    sql = "INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,link_url,title,content,is_send,is_discussion,top_img,receive_account,send_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    paras = [re.message_id,re.manager,re.actor_name,re.avatar,re.actor_account,re.actor_url,re.actor_inbox,linkUrl,re.title,re.content,0,1,re.top_img,account,1];
    await execute(sql, paras);
  } else if(contentType === 'Update' && sctype === 'sc' && idx === 0) {
    sql = "UPDATE a_message SET content=?,top_img=? WHERE message_id=? AND receive_account!=''";
    paras = [re.content, re.top_img, re.message_id];
    await execute(sql, paras);
  }
}

// ====================== 回复统计 ======================
export async function getReplyTotal(params: any): Promise<any> {
  const { sctype, pid } = params;
  const sql = `SELECT COUNT(*) AS total FROM a_message${sctype}_commont WHERE pid=?`;
  const re: any[] = await getData(sql, [pid]);
  return re[0].total;
}

// ====================== 通知 ======================
export async function updateNotice(params: any): Promise<any> {
  const { manager } = params;
  return await execute('UPDATE t_nft_tip SET is_read=1 WHERE LOWER(tip_to)=? AND is_read=0;', [manager.toLowerCase()]);
}

// ====================== 回复分页 ======================
export async function replyPageData(params: any): Promise<any[]> {
  const { pi, sctype, pid } = params;
  const sql = `SELECT * FROM v_message${sctype}_commont WHERE pid=? ORDER BY bid DESC, createtime ASC LIMIT ${pi*20},20`;
  let re: any[] = await getData(sql, [pid]);
  return re;
}

// ====================== 消息置顶 ======================
export async function setTopMessage(params: any): Promise<any> {
  const { id, sctype, flag } = params;
  return await execute(`UPDATE a_message${sctype} SET is_top=? WHERE message_id=?`, [flag, id]);
}

// ====================== 删除消息 ======================
export async function messageDel(params: any): Promise<any> {
  const { mid, type, path, sctype, pid, rAccount, account } = params;
  if(Number(type) === 0) {
    let lok: any;
    if(path === 'enki') lok = await execute(`DELETE FROM a_messagesc WHERE message_id=?`, [mid]);
    else if(path === 'enkier') lok = rAccount ? await execute(`DELETE FROM a_sendmessage WHERE message_id=? AND receive_account=?`, [mid,rAccount])
                                          : await execute(`DELETE FROM a_message WHERE message_id=?`, [mid]);
    if(lok && !rAccount) sendfollow(account, '', '', '', mid, sctype==='sc'?'enki':'enkier', '', 'Delete');
  } else {
    let lok: any = await execute(`CALL del_commont(?,?,?)`, [sctype, mid, pid]);
    if(lok) sendcommont(account, mid, sctype==='sc'?'enki':'enkier');
  }
}

// ====================== 公共函数 ======================
export async function getAllSmartCommon(): Promise<any[]> {
  const re: any[] = await getData('SELECT * FROM v_allsmartcommon', []);
  return re || [];
}

export async function getHeartAndBook(params: any): Promise<any[]> {
  const { pid, account, table, sctype } = params;
  const sql = `SELECT a.total,IFNULL(b.pid,'') pid FROM (SELECT COUNT(*) total FROM a_${table}${sctype} WHERE pid=?) a LEFT JOIN (SELECT pid FROM a_${table}${sctype} WHERE pid=? AND account=?) b ON 1=1`;
  const re: any[] = await getData(sql, [pid, pid, account]);
  return re || [];
}

export async function handleHeartAndBook(params: any): Promise<any> {
  const { account, pid, flag, table, sctype } = params;
  if(flag == 0) return await execute(`DELETE FROM a_${table}${sctype} WHERE pid=? AND account=?`, [pid, account]);
  else return await execute(`INSERT INTO a_${table}${sctype}(account, pid) VALUES(?,?)`, [account, pid]);
}

// ====================== 公告 ======================
export async function setAnnounce(params: any): Promise<any> {
  const { account, id, content, sctype, topImg, vedioUrl, toUrl, linkurl } = params;
  const lok: any = await execute('CALL send_annoce(?,?,?)', [sctype, id, account]);
  if(lok) {
    try {
      const re: any = await getData("SELECT domain,actor_name,privkey FROM v_account WHERE actor_account=?", [account], true);
      let sendbody: any;
      getFollowers_send({account}).then(async data=>{
        data.forEach((element: any) => {
          if(!sendbody) sendbody = createAnnounce(re.actor_name, process.env.NEXT_PUBLIC_DOMAIN as string, linkurl, content, topImg, vedioUrl, toUrl);
          signAndSend(element.user_inbox, re.actor_name, re.domain, sendbody, re.privkey);
        });
      });
    } catch(e1) { console.error(e1); }
  }
}

// 获取捐赠的最后一条
export async function getLastDonate({ did }: any): Promise<any> {
    const sql = 'SELECT * FROM t_donate WHERE donor_address=? ORDER BY block_num DESC LIMIT 1';
    const re: any = await getData(sql, [did]);
    return re[0] || {};
}

// 获取一条嗯文
export async function getOne({ id, sctype }: any): Promise<any> {
    const re: any = await getData(`SELECT * FROM v_message${sctype} WHERE ${id.length < 10 ? 'id' : 'message_id'}=?`, [id]);
    return re.length ? re[0] : {};
}

// 获取一条嗯文
export async function getOneByMessageId(id1: any, id2: any, sctype: any): Promise<any> {
    const re: any = await getData(`SELECT * FROM v_message${sctype} WHERE message_id=? OR message_id=?`, [id1, id2]);
    return re.length ? re[0] : {};
}

// 获取是否已转发
export async function getAnnoce({ id, account }: any): Promise<any> {
    const re: any = await getData('SELECT 1 FROM a_annoce WHERE pid=? AND account=?', [id, account]);
    return re || [];
}

// 查找我关注过的人
async function findFollow(actor_account: any, user_account: any): Promise<any> {
    const sql = 'SELECT id FROM a_follow WHERE actor_account=? AND user_account=?';
    const re: any = await getData(sql, [actor_account, user_account]);
    return re && re.length > 0 ? re[0].id : 0;
}

// actor_account 查找的帐号 user_account 本地帐号
export async function fromAccount({ actor_account, user_account }: any): Promise<any> {
    let obj: any = {};
    if (actor_account.includes(process.env.NEXT_PUBLIC_DOMAIN as string)) {
        const sql = 'SELECT actor_name `name`, actor_inbox inbox, domain, actor_account account, actor_url url, avatar, pubkey, manager FROM v_account WHERE actor_account=? OR actor_url=?';
        const re: any = await getData(sql, [actor_account, actor_account]);
        if (re[0]) {
            obj = re[0];
            obj.id = await findFollow(actor_account, user_account);
        }
    } else {
        if (actor_account.startsWith('http')) obj = await getInboxFromUrl(actor_account);
        else obj = await getInboxFromAccount(actor_account);

        if (obj.inbox) obj.id = await findFollow(actor_account, user_account);
    }
    return obj;
}
// 获取通知
export async function getNotice({ manager }:any): Promise<any> {
  const re: any = await getData(
      'SELECT id FROM t_nft_tip WHERE LOWER(tip_to)=? AND is_read=0',
      [manager.toLowerCase()]
  );
  return re;
}

// 从账户获取 Inbox
export async function getInboxFromAccount(account: any): Promise<any> {
    let reobj: any = { name: '', domain: '', inbox: '', account: '', url: '', pubkey: '', avatar: '' };
    try {
        const strs: any = account.split('@');
        const obj: any = { name: strs[0], domain: strs[1], inbox: '' };
        let re: any = await httpGet(`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`);
        if (re.code !== 200) return obj;
        re = re.message;
        if (!re) return obj;

        let url: any, type: any;
        for (let i = 0; i < re.links.length; i++) {
            if (re.links[i].rel === 'self') {
                url = re.links[i].href;
                type = re.links[i].type;
                break;
            }
        }
        reobj = await getInboxFromUrl1(url, type);
    } catch (e) {
        console.error(e);
    } finally {
        return reobj;
    }
}

// 本地账户 Inbox
export async function getLocalInboxFromAccount(account: any): Promise<any> {
    const obj: any = { name: '', domain: '', inbox: '', account: '', url: '', pubkey: '', avatar: '' };
    const user: any = await getUser('actor_account', account, 'actor_url,avatar,pubkey');
    if (!user.actor_url) return obj;
    const [userName, domain] = account.split('@');
    return { name: userName, domain, inbox: `https://${domain}/api/activitepub/inbox/${userName}`, account, url: user.actor_url, pubkey: user.pubkey, avatar: user.avatar };
}

// 本地 URL Inbox
export async function getLocalInboxFromUrl(url: any): Promise<any> {
    const obj: any = { name: '', domain: '', inbox: '', account: '', url: '', pubkey: '', avatar: '', manager: '' };
    const user: any = await getUser('actor_url', url, 'actor_account,avatar,pubkey,manager');
    if (!user.actor_account) return obj;
    const [userName, domain] = user.actor_account.split('@');
    return { name: userName, domain, inbox: `https://${domain}/api/activitepub/inbox/${userName}`, account: user.actor_account, url, pubkey: user.pubkey, avatar: user.avatar, manager: user.manager };
}

// 从 URL 获取 Inbox
export async function getInboxFromUrl(url: any, type: any = 'application/activity+json'): Promise<any> {
    const myURL: any = new URL(url);
    let obj: any = { name: '', domain: myURL.hostname, inbox: '', account: '', url: '', pubkey: '', avatar: '', manager: '' };
    let re: any = await httpGet(url, { "Content-Type": type });
    if (re.code !== 200) return obj;
    re = re.message;
    if (!re) return obj;
    if (re.name) obj.name = re.name;
    if (re.inbox) {
        obj.inbox = re.inbox;
        obj.desc = re.summary;
        obj.manager = re.manager;
        obj.pubkey = re.publicKey.publicKeyPem;
        obj.url = re.id;
        obj.account = `${re.name}@${myURL.hostname}`;
    }
    if (re.avatar && re.avatar.url) obj.avatar = re.avatar.url;
    else if (re.icon && re.icon.url) obj.avatar = re.icon.url;
    return obj;
}

// 内部辅助函数 Inbox
async function getInboxFromUrl1(url: any, type: any = 'application/activity+json'): Promise<any> {
    const myURL: any = new URL(url);
    let obj: any = { name: '', domain: myURL.hostname, inbox: '', account: '', url: '', pubkey: '', avatar: '', manager: '' };
    let re: any = await httpGet(url, { "Content-Type": type });
    if (re.code !== 200) return obj;
    re = re.message;
    if (!re) return obj;
    if (re.name) obj.name = re.name;
    if (re.inbox) {
        obj.inbox = re.inbox;
        obj.desc = re.summary;
        obj.manager = re.manager;
        obj.pubkey = re.publicKey.publicKeyPem;
        obj.url = re.id;
        obj.account = `${re.name}@${myURL.hostname}`;
    }
    if (re.avatar && re.avatar.url) obj.avatar = re.avatar.url;
    else if (re.icon && re.icon.url) obj.avatar = re.icon.url;
    return obj;
}

// 从 URL 获取网页个人信息
export async function getUserFromUrl({ url }: any): Promise<any> {
    const myURL: any = new URL(url);
    let obj: any = { name: '', domain: myURL.hostname, inbox: '', account: '', url: '', pubkey: '', avatar: '' };
    let re: any = await httpGet(url, { "Content-Type": 'application/activity+json' });
    if (re.code !== 200) return obj;
    re = re.message;
    if (!re) return obj;
    if (re.name) obj.name = re.name;
    if (re.inbox) {
        obj.inbox = re.inbox;
        obj.desc = re.summary;
        obj.pubkey = re.publicKey.publicKeyPem;
        obj.url = re.id;
        obj.account = `${re.name}@${myURL.hostname}`;
    }
    if (re.avatar && re.avatar.url) obj.avatar = re.avatar.url;
    else if (re.icon && re.icon.url) obj.avatar = re.icon.url;
    return obj;
}
