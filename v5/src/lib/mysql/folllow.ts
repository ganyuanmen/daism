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
 * Validate that all required user fields are present for saveFollow.
 */
function validateSaveFollowUser(user: SaveFollowParams['user']): string | null {
  if (!user.account || typeof user.account !== 'string') return 'Missing user.account';
  if (!user.url || typeof user.url !== 'string') return 'Missing user.url';
  if (!user.avatar || typeof user.avatar !== 'string') return 'Missing user.avatar';
  if (!user.inbox || typeof user.inbox !== 'string') return 'Missing user.inbox';
  return null;
}

/**
 * Query a single follow record.
 * Returns null if no matching record is found.
 */
export async function getFollow(params: FollowParams): Promise<FollowRecord | null> {
  const { actorAccount, userAccount } = params;

  if (!actorAccount || !userAccount) {
    console.warn('getFollow: Missing required parameters');
    return null;
  }

  const re = await getData<FollowRecord>(
    'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
    'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
    'FROM a_follow WHERE actor_account=? AND user_account=?',
    [actorAccount, userAccount]
  );

  return Array.isArray(re) && re.length ? re[0] : null;
}

/**
 * Query followers of an actor (who follows me).
 */
export async function getFollowers(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;

  if (!account) {
    console.warn('getFollowers: Missing account parameter');
    return [];
  }

  const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
              'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
              'FROM a_follow WHERE actor_account=?';
  const re = await getData<FollowRecord>(sql, [account]);
  return Array.isArray(re) ? re : [];
}

/**
 * Query followers of an actor, excluding records from the local domain.
 */
export async function getFollowersExcludeDomain(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;

  if (!account) {
    console.warn('getFollowersExcludeDomain: Missing account parameter');
    return [];
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  if (!domain) {
    // Environment variable missing — log warning and fall back to no domain filter
    console.warn('getFollowersExcludeDomain: NEXT_PUBLIC_DOMAIN not set, falling back to no domain filter');
    return getFollowers(params);
  }

  const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
              'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
              'FROM a_follow WHERE actor_account=? AND user_domain!=?';
  const re = await getData<FollowRecord>(sql, [account, domain]);
  return Array.isArray(re) ? re : [];
}

/**
 * Query who I follow (dynamic SQL from aux_tree).
 */
export async function getFolloweesDynamic(params: FollowParams): Promise<any> {
  const { account } = params;

  if (!account) {
    console.warn('getFolloweesDynamic: Missing account parameter');
    return [];
  }

  return await getJsonArray('follow0', [account]);
}

/**
 * Query who follows me (dynamic SQL from aux_tree).
 */
export async function getFollowersDynamic(params: FollowParams): Promise<any> {
  const { account } = params;

  if (!account) {
    console.warn('getFollowersDynamic: Missing account parameter');
    return [];
  }

  return await getJsonArray('follow1', [account]);
}

/**
 * Query tips I've sent (who I tipped).
 */
export async function getTipFrom(params: FollowParams): Promise<TipRecord[]> {
  const { manager } = params;

  if (!manager) {
    console.warn('getTipFrom: Missing manager parameter');
    return [];
  }

  const re = await getData<TipRecord>(
    'SELECT id, token_to, utoken, actor_account, avatar, message_id, dao_id, _time ' +
    'FROM v_tip WHERE token_to=? ORDER BY id DESC',
    [manager]
  );
  return Array.isArray(re) ? re : [];
}

/**
 * Query tips I've received (who tipped me).
 */
export async function getTipToMe(params: FollowParams): Promise<TipRecord[]> {
  const { manager } = params;

  if (!manager) {
    console.warn('getTipToMe: Missing manager parameter');
    return [];
  }

  const re = await getData<TipRecord>(
    'SELECT id, tip_to, utoken, actor_account, avatar, message_id, dao_id, _time ' +
    'FROM v_tip_tome WHERE tip_to=? ORDER BY id DESC',
    [manager]
  );
  return Array.isArray(re) ? re : [];
}

/**
 * Query the list of people I follow.
 */
export async function getFollowees(params: FollowParams): Promise<FollowRecord[]> {
  const { account } = params;

  if (!account) {
    console.warn('getFollowees: Missing account parameter');
    return [];
  }

  const sql = 'SELECT id, follow_id, actor_account, actor_url, actor_inbox, actor_avatar, ' +
              'user_account, user_url, user_avatar, user_inbox, user_domain, createtime ' +
              'FROM v_follow WHERE user_account=?';
  const re = await getData<FollowRecord>(sql, [account]);
  return Array.isArray(re) ? re : [];
}

/**
 * Save a follow relationship.
 * Validates all required fields in the user object.
 *
 * @param params - Contains actor, user, and followId
 * @returns Number of affected rows
 * @throws Error if required fields are missing
 */
export async function saveFollow(params: SaveFollowParams): Promise<number> {
  const { actor, user, followId } = params;

  // Validate all required user fields, not just account
  const validationError = validateSaveFollowUser(user);
  if (validationError) {
    throw new Error(`saveFollow: ${validationError}`);
  }

  if (!followId) {
    throw new Error('saveFollow: Missing followId');
  }

  // Validate and extract domain from user account
  const accountParts = user.account.split('@');
  if (accountParts.length < 2) {
    throw new Error('saveFollow: Invalid user account format (expected username@domain)');
  }

  const domain = accountParts[1];

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
}

/**
 * Remove a follow relationship.
 *
 * @param followId - The follow ID to remove
 * @returns Number of affected rows
 */
export async function removeFollow(followId: string): Promise<number> {
  if (!followId) {
    throw new Error('removeFollow: Missing followId parameter');
  }

  const affectedRows = await execute('DELETE FROM a_follow WHERE follow_id=?', [followId]);
  return affectedRows;
}

// Export types for external use
export type { FollowRecord as FollowType, TipRecord as TipType };

// Backward-compatible aliases for existing imports
export { getFollowersExcludeDomain as getFollowers_send };
export { getFolloweesDynamic as getFollow0 };
export { getFollowersDynamic as getFollow1 };
