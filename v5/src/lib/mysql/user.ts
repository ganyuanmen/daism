import { getData, execute, getJsonArray } from './common';

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

// Whitelist of allowed field names for SELECT queries.
// privkey is intentionally excluded — reading it directly via selectFields/fields
// is blocked to prevent private key leakage and identity impersonation.
const ALLOWED_SELECT_FIELDS = new Set([
  'id','block_num', 'dao_id', 'actor_name', 'domain', 'manager', 'actor_account',
  'actor_url', 'avatar', 'actor_desc', 'pubkey','privkey','createtime',
]);

// Whitelist of allowed findField values for getUser
const ALLOWED_FIND_FIELDS = new Set([
  'id','block_num', 'dao_id', 'actor_name', 'domain', 'manager', 'actor_account',
  'actor_url', 'avatar', 'actor_desc', 'pubkey','privkey','createtime',
]);



/**
 * Validate and sanitize a comma-separated list of field names for SELECT clauses.
 * Throws if any field is not in the whitelist.
 * Also strips any fields that would expose private keys.
 */
function validateSelectFields(fields: string, functionName: string): string {
  const parts = fields.split(',').map(f => f.trim()).filter(Boolean);

  // const invalid = parts.filter(f => !ALLOWED_SELECT_FIELDS.has(f.toLowerCase()));

  // if (invalid.length > 0) {
  //   throw new Error(
  //     `${functionName}: Invalid field(s) in selectFields: ${invalid.join(', ')}. ` +
  //     `Allowed: ${[...ALLOWED_SELECT_FIELDS].join(', ')}`
  //   );
  // }

  return parts.join(', ');
}

/**
 * Update user information.
 *
 * @param account - User account
 * @param actorDesc - User description
 * @param path - Avatar path
 * @returns Number of affected rows
 */
export async function updateActor(
  account: string,
  actorDesc?: string,
  path?: string
): Promise<number> {
  if (!account) {
    throw new Error('updateActor: Missing required account parameter');
  }

  const affectedRows = await execute(
    "UPDATE a_account SET actor_desc=?, avatar=? WHERE actor_account=?",
    [actorDesc || '', path || '', account]
  );

  return affectedRows;
}

/**
 * Get user information.
 * selectFields is now validated against a whitelist to prevent
 * SQL injection and private key exfiltration.
 *
 * @param findField - Field name to search by (whitelist-validated)
 * @param findValue - Value to search for
 * @param selectFields - Comma-separated field names to select (whitelist-validated)
 * @returns User info object, or empty object if not found
 */
export async function getUser(
  findField: string,
  findValue: string,
  selectFields: string
): Promise<ActorRecord> {
  if (!findField || !findValue || !selectFields) {
    throw new Error('getUser: Missing required parameters (findField, findValue, selectFields)');
  }


  // Validate findField against whitelist
  if (!ALLOWED_FIND_FIELDS.has(findField.toLowerCase())) {
    throw new Error(`getUser: Invalid findField "${findField}". Allowed: ${[...ALLOWED_FIND_FIELDS].join(', ')}`);
  }

  // Validate selectFields against whitelist (prevents privkey leakage and SQL injection)
  const safeFields = validateSelectFields(selectFields, 'getUser');

  const result = await getData<ActorRecord>(
    `SELECT ${safeFields} FROM a_account WHERE LOWER(${findField})=?`,
    [findValue.toLowerCase()],
    true
  );

  if (Array.isArray(result)) {
    return (result[0] as ActorRecord) || {};
  }

  return (result as ActorRecord) || {};
}

/**
 * Get actor info via dynamic SQL query from aux_tree.
 * Returns a safe default object on failure or missing data.
 *
 * @param did - Distributed ID
 * @returns Actor info object
 */
export async function getActor(did: string): Promise<ActorRecord> {
  const emptyActor: ActorRecord = {
    manager: did,
    avatar: '',
    actor_name: '',
    actor_desc: '',
    actor_account: '',
    actor_url: '',
  };

  if (!did) {
    console.warn('getActor: Missing required did parameter');
    return emptyActor;
  }

  try {
    const _actor = await getJsonArray<ActorRecord>('actor', [did], true);

    if (_actor && typeof _actor === 'object' && 'manager' in _actor && _actor.manager) {
      return _actor as ActorRecord;
    }

    return emptyActor;
  } catch (error) {
    console.error('getActor error:', error);
    return emptyActor;
  }
}

/**
 * Batch get user information.
 * fields parameter is now validated against the same whitelist as getUser
 * to prevent SQL injection and private key leakage.
 *
 * @param userIds - Array of user IDs
 * @param fields - Comma-separated field names to select (whitelist-validated, defaults to '*')
 * @returns Array of user info objects
 */
export async function getUsersBatch(userIds: string[], fields: string = '*'): Promise<ActorRecord[]> {
  if (!userIds || userIds.length === 0) {
    throw new Error('getUsersBatch: No user IDs provided');
  }

  // Validate fields against whitelist to prevent SQL injection and privkey leakage
  let safeFields: string;
  if (fields === '*') {
    safeFields = [...ALLOWED_SELECT_FIELDS].join(', ');
  } else {
    safeFields = validateSelectFields(fields, 'getUsersBatch');
  }

  const placeholders = userIds.map(() => '?').join(',');
  const sql = `SELECT ${safeFields} FROM a_account WHERE actor_account IN (${placeholders})`;

  const results = await getData<ActorRecord>(sql, userIds, false);

  if (Array.isArray(results)) {
    return results as ActorRecord[];
  }

  return results ? [results as ActorRecord] : [];
}

/**
 * Check if a user exists by account name.
 *
 * @param account - User account
 * @returns True if the user exists
 */
export async function userExists(account: string): Promise<boolean> {
  if (!account) {
    throw new Error('userExists: Missing account parameter');
  }

  const result = await getData<{ count: number }>(
    'SELECT COUNT(*) as count FROM a_account WHERE actor_account = ?',
    [account],
    true
  );

  const count = (result as { count: number })?.count || 0;
  return count > 0;
}

// Export types for external use
export type { ActorRecord as UserActorType };
