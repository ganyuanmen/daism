import { getData, execute, getJsonArray } from './common';

// Type definitions for Follow module
export interface FollowRecord {
  id?: number;
  follow_id: string;
  actor_account: string;
  actor_url: string;
  actor_inbox: string;
  actor_avatar: string;
  user_account: string;
  user_url: string;
  user_avatar: string;
  user_inbox: string;
  user_domain: string;
  createtime?: Date;
}

export interface TipRecord {
  id: number;
  token_to: string;
  tip_to?: string;
  utoken: number;
  actor_account: string;
  avatar: string;
  message_id: string;
  dao_id: number;
  _time: string;
}

export interface FollowParams {
  actorAccount?: string;
  userAccount?: string;
  account?: string;
  manager?: string;
}

export interface SaveFollowParams {
  actor?: {
    account: string;
    url?: string;
    inbox?: string;
    avatar?: string;
  };
  user: {
    account: string;
    url: string;
    avatar: string;
    inbox: string;
  };
  followId: string;
}

/**
 * 查询单条关注记录
 * @param params 包含 actorAccount 和 userAccount 的参数对象
 * @returns 关注记录对象，未找到时返回空对象
 */
export async function getFollow(params: FollowParams): Promise<FollowRecord | {}> {
  const { actorAccount, userAccount } = params;
  
  if (!actorAccount || !userAccount) {
    console.warn('getFollow: Missing required parameters');
    return {};
  }
  
  try {
    const re = await getData<FollowRecord>(
      'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
      'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
      'FROM a_follow WHERE actor_account=? AND user_account=?',
      [actorAccount, userAccount]
    );
    
    return Array.isArray(re) && re.length ? re[0] : {};
  } catch (error) {
    console.error('getFollow error:', error);
    return {};
  }
}

/**
 * 查询 actor 的粉丝集（谁关注我）
 * @param params 包含 account 的参数对象
 * @returns 粉丝记录数组
 */
export async function getFollowers(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;
  
  if (!account) {
    console.warn('getFollowers: Missing account parameter');
    return [];
  }
  
  try {
    const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
                'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
                'FROM a_follow WHERE actor_account=?';
    const re = await getData<FollowRecord>(sql, [account]);
    return Array.isArray(re) ? re : [];
  } catch (error) {
    console.error('getFollowers error:', error);
    return [];
  }
}

/**
 * 查询 actor 的粉丝集（排除本域名）
 * @param params 包含 account 的参数对象
 * @returns 粉丝记录数组（排除本域名）
 */
export async function getFollowers_send(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;
  
  if (!account) {
    console.warn('getFollowers_send: Missing account parameter');
    return [];
  }
  
  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
                'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
                'FROM a_follow WHERE actor_account=? AND user_domain!=?';
    const re = await getData<FollowRecord>(sql, [account, domain || '']);
    return Array.isArray(re) ? re : [];
  } catch (error) {
    console.error('getFollowers_send error:', error);
    return [];
  }
}

/**
 * 查询我关注谁（动态 SQL）
 * @param params 包含 account 的参数对象
 * @returns 动态查询结果
 */
export async function getFollow0(params: FollowParams): Promise<any> {
  const { account } = params;
  
  if (!account) {
    console.warn('getFollow0: Missing account parameter');
    return [];
  }
  
  try {
    return await getJsonArray('follow0', [account]);
  } catch (error) {
    console.error('getFollow0 error:', error);
    return [];
  }
}

/**
 * 查询谁关注我（动态 SQL）
 * @param params 包含 account 的参数对象
 * @returns 动态查询结果
 */
export async function getFollow1(params: FollowParams): Promise<any> {
  const { account } = params;
  
  if (!account) {
    console.warn('getFollow1: Missing account parameter');
    return [];
  }
  
  try {
    return await getJsonArray('follow1', [account]);
  } catch (error) {
    console.error('getFollow1 error:', error);
    return [];
  }
}

/**
 * 我打赏谁
 * @param params 包含 manager 的参数对象
 * @returns 打赏记录数组
 */
export async function getTipFrom(params: FollowParams): Promise<TipRecord[]> {
  const { manager } = params;
  
  if (!manager) {
    console.warn('getTipFrom: Missing manager parameter');
    return [];
  }
  
  try {
    const re = await getData<TipRecord>(
      'SELECT id, token_to, utoken, actor_account, avatar, message_id, dao_id, _time ' +
      'FROM v_tip WHERE token_to=? ORDER BY id DESC', 
      [manager]
    );
    return Array.isArray(re) ? re : [];
  } catch (error) {
    console.error('getTipFrom error:', error);
    return [];
  }
}

/**
 * 谁打赏我
 * @param params 包含 manager 的参数对象
 * @returns 打赏记录数组
 */
export async function getTipToMe(params: FollowParams): Promise<TipRecord[]> {
  const { manager } = params;
  
  if (!manager) {
    console.warn('getTipToMe: Missing manager parameter');
    return [];
  }
  
  try {
    const re = await getData<TipRecord>(
      'SELECT id, tip_to, utoken, actor_account, avatar, message_id, dao_id, _time ' +
      'FROM v_tip_tome WHERE tip_to=? ORDER BY id DESC', 
      [manager]
    );
    return Array.isArray(re) ? re : [];
  } catch (error) {
    console.error('getTipToMe error:', error);
    return [];
  }
}

/**
 * 查询我关注的偶像集
 * @param params 包含 account 的参数对象
 * @returns 关注记录数组
 */
export async function getFollowees(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;
  
  if (!account) {
    console.warn('getFollowees: Missing account parameter');
    return [];
  }
  
  try {
    const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
                'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
                'FROM v_follow WHERE user_account=?';
    const re = await getData<FollowRecord>(sql, [account]);
    return Array.isArray(re) ? re : [];
  } catch (error) {
    console.error('getFollowees error:', error);
    return [];
  }
}

/**
 * 保存关注
 * @param params 包含 actor, user 和 followId 的参数对象
 * @returns 影响的行数
 */
export async function saveFollow(params: SaveFollowParams): Promise<number> {
  const { actor, user, followId } = params;
  
  if (!user?.account || !followId) {
    console.warn('saveFollow: Missing required parameters');
    return 0;
  }
  
  // Validate and extract domain from user account
  const accountParts = user.account.split('@');
  if (accountParts.length < 2) {
    console.warn('saveFollow: Invalid user account format');
    return 0;
  }
  
  const domain = accountParts[1];
  
  try {
    const affectedRows = await execute(
      `INSERT INTO a_follow(
        follow_id, actor_account, actor_url, actor_inbox, actor_avatar,
        user_account, user_url, user_avatar, user_inbox, user_domain
      ) VALUES(?,?,?,?,?,?,?,?,?,?)`,
      [
        followId,
        actor?.account || '',
        actor?.url || '',
        actor?.inbox || '',
        actor?.avatar || '',
        user.account,
        user.url,
        user.avatar,
        user.inbox,
        domain,
      ]
    );
    
    return affectedRows;
  } catch (error) {
    console.error('saveFollow error:', error);
    return 0;
  }
}

/**
 * 删除关注
 * @param followId 关注ID
 * @returns 影响的行数
 */
export async function removeFollow(followId: string): Promise<number> {
  if (!followId) {
    console.warn('removeFollow: Missing followId parameter');
    return 0;
  }
  
  try {
    const affectedRows = await execute('DELETE FROM a_follow WHERE follow_id=?', [followId]);
    return affectedRows;
  } catch (error) {
    console.error('removeFollow error:', error);
    return 0;
  }
}

// Export types for external use
export type { FollowRecord as FollowType, TipRecord as TipType };
