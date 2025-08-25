import { getData, execute, getJsonArray } from './common';

// 查询单条关注记录
export async function getFollow({ actorAccount, userAccount }: any): Promise<any> {
  const re = await getData(
    'SELECT * FROM a_follow WHERE actor_account=? AND user_account=?',
    [actorAccount, userAccount]
  );
  return re.length ? re[0] : {};
}

// 查询 actor 的粉丝集（谁关注我）
export async function getFollowers({ account }: any): Promise<any[]> {
  const sql = 'SELECT * FROM a_follow WHERE actor_account=?';
  const re = await getData(sql, [account]);
  return re || [];
}

// 查询 actor 的粉丝集（排除本域名）
export async function getFollowers_send({ account }: any): Promise<any[]> {
  const sql = 'SELECT * FROM a_follow WHERE actor_account=? AND user_domain!=?';
  const re = await getData(sql, [account, process.env.LOCAL_DOMAIN]);
  return re || [];
}

// 查询我关注谁（动态 SQL）
export async function getFollow0({ account }: any): Promise<any> {
  return await getJsonArray('follow0', [account]);
}

// 查询谁关注我（动态 SQL）
export async function getFollow1({ account }: any): Promise<any> {
  return await getJsonArray('follow1', [account]);
}

// 我打赏谁
export async function getTipFrom({ manager }: any): Promise<any[]> {
  const re = await getData('SELECT * FROM v_tip WHERE token_to=? ORDER BY id DESC', [manager]);
  return re || [];
}

// 谁打赏我
export async function getTipToMe({ manager }: any): Promise<any[]> {
  const re = await getData('SELECT * FROM v_tip_tome WHERE tip_to=? ORDER BY id DESC', [manager]);
  return re || [];
}

// 查询我关注的偶像集
export async function getFollowees({ account }: any): Promise<any[]> {
  const sql = 'SELECT * FROM v_follow WHERE user_account=?';
  const re = await getData(sql, [account]);
  return re || [];
}

// 保存关注
export async function saveFollow({ actor, user, followId }: any): Promise<any> {
  const [, domain] = user?.account.split('@');
  return await execute(
    `INSERT INTO a_follow(
      follow_id, actor_account, actor_url, actor_inbox, actor_avatar,
      user_account, user_url, user_avatar, user_inbox, user_domain
    ) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [
      followId,
      actor?.account,
      actor?.url,
      actor?.inbox,
      actor?.avatar,
      user.account,
      user.url,
      user.avatar,
      user.inbox,
      domain,
    ]
  );
}

// 删除关注
export async function removeFollow(followId: any): Promise<any> {
  return await execute('DELETE FROM a_follow WHERE follow_id=?', [followId]);
}
