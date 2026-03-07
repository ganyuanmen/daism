import { getJsonArray, getData, execute } from './common';

// Type definitions for User module
export interface UpdateActorParams {
  account: string;
  actorDesc?: string;
  path?: string;
}

// ActorRecord type - compatible with global DaismActor interface
export interface ActorRecord {
  id?: number;
  dao_id?: number;
  actor_name?: string;
  domain?: string;
  manager?: string;
  actor_account?: string;
  actor_url?: string;
  avatar?: string;
  actor_desc?: string;
  pubkey?: string;
  privkey?: string;
}

/**
 * 更新用户信息
 * @param account - 用户账户
 * @param actorDesc - 用户描述
 * @param path - 头像路径
 * @returns 影响的行数
 */
export async function updateActor(
  account: string, 
  actorDesc?: string, 
  path?: string
): Promise<number> {
  if (!account) {
    console.warn('updateActor: Missing required account parameter');
    return 0;
  }
  
  try {
    const affectedRows = await execute(
      "UPDATE a_account SET actor_desc=?, avatar=? WHERE actor_account=?",
      [actorDesc || '', path || '', account]
    );
    
    return affectedRows;
  } catch (error) {
    console.error('updateActor error:', error);
    return 0;
  }
}

/**
 * 获取用户信息
 * @param findField - 查找字段名
 * @param findValue - 查找值
 * @param selectFields - 要选择的字段
 * @returns 用户信息对象
 */
export async function getUser(
  findField: string, 
  findValue: string, 
  selectFields: string
): Promise<ActorRecord> {
  if (!findField || !findValue || !selectFields) {
    console.warn('getUser: Missing required parameters');
    return {};
  }
  
  // 验证 findField 是有效的字段名
  const validFields = ['id', 'dao_id', 'actor_name', 'domain', 'manager', 'actor_account', 
                       'actor_url', 'avatar', 'actor_desc', 'pubkey', 'privkey'];
  
  if (!validFields.includes(findField.toLowerCase())) {
    console.warn(`getUser: Invalid findField: ${findField}`);
    return {};
  }
  
  try {
    const result = await getData<ActorRecord>(
      `SELECT ${selectFields} FROM a_account WHERE LOWER(${findField})=?`,
      [findValue.toLowerCase()],
      true
    );
    
    if (Array.isArray(result)) {
      return (result[0] as ActorRecord) || {};
    }
    
    return (result as ActorRecord) || {};
  } catch (error) {
    console.error('getUser error:', error);
    return {};
  }
}

/**
 * 获取 actor 信息（通过动态 SQL）
 * @param did - 分布式ID
 * @returns actor 信息对象
 */
export async function getActor(did: string): Promise<ActorRecord> {
  if (!did) {
    console.warn('getActor: Missing required did parameter');
    return {
      manager: '',
      avatar: '',
      actor_name: '',
      actor_desc: '',
      actor_account: '',
      actor_url: ''
    };
  }
  
  try {
    const _actor = await getJsonArray<ActorRecord>('actor', [did], true);
    
    if (_actor && typeof _actor === 'object' && 'manager' in _actor && _actor.manager) {
      return _actor as ActorRecord;
    }
    
    return {
      manager: did,
      avatar: '',
      actor_name: '',
      actor_desc: '',
      actor_account: '',
      actor_url: ''
    };
  } catch (error) {
    console.error('getActor error:', error);
    return {
      manager: did,
      avatar: '',
      actor_name: '',
      actor_desc: '',
      actor_account: '',
      actor_url: ''
    };
  }
}

/**
 * 批量获取用户信息
 * @param userIds 用户ID数组
 * @param fields 要选择的字段
 * @returns 用户信息数组
 */
export async function getUsersBatch(userIds: string[], fields: string = '*'): Promise<ActorRecord[]> {
  if (!userIds || userIds.length === 0) {
    console.warn('getUsersBatch: No user IDs provided');
    return [];
  }
  
  try {
    const placeholders = userIds.map(() => '?').join(',');
    const sql = `SELECT ${fields} FROM a_account WHERE actor_account IN (${placeholders})`;
    
    const results = await getData<ActorRecord>(sql, userIds, false);
    
    if (Array.isArray(results)) {
      return results as ActorRecord[];
    }
    
    return results ? [results as ActorRecord] : [];
  } catch (error) {
    console.error('getUsersBatch error:', error);
    return [];
  }
}

/**
 * 检查用户是否存在
 * @param account 用户账户
 * @returns 是否存在
 */
export async function userExists(account: string): Promise<boolean> {
  if (!account) {
    console.warn('userExists: Missing account parameter');
    return false;
  }
  
  try {
    const result = await getData<{ count: number }>(
      'SELECT COUNT(*) as count FROM a_account WHERE actor_account = ?',
      [account],
      true
    );
    
    const count = (result as { count: number })?.count || 0;
    return count > 0;
  } catch (error) {
    console.error('userExists error:', error);
    return false;
  }
}

// Export types for external use
export type { ActorRecord as UserActorType };
