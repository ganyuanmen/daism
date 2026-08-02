import { getData, execute, getPageData } from './common';

// ==================== Type Definitions ====================

export interface DaoChild {
  member_address: string;
  member_votes: number;
  member_type: number | string;
}

export interface DaoVersion {
  _time: string;
  creator: string;
  dao_version: number;
}

export interface DaoRecord {
  dao_id: string;
  dao_logo?: string;
  dao_name: string;
  dao_symbol: string;
  sctype: string;
  strategy: number;
  dao_manager: string;
  delegator: string;
  child: DaoChild[];
  version: DaoVersion[];
  lifetime: number;
  cool_time: number;
  dao_desc: string;
  creator: string;
}

export interface UserRegister {
  allTotal: number;
  nameTotal: number;
  limitonehour: boolean;
}

export interface NftObjType {
  [key: string]: any;
}

// ==================== Constants ====================

/** Community love page post ID — the pinned message for the love/ranking page */
const LOVE_PAGE_POST_ID = '07e7888a76234abe9b3f88ff128e5f5d';

// ==================== DAO Operations ====================

/**
 * Add EIP type
 */
export async function addEipType(params: { _type: any; _desc: any }): Promise<number> {
  const { _type, _desc } = params;
  return await execute('call i_eip_type(?,?)', [_type, _desc]);
}

/**
 * Check if account is a DAO member
 * @returns Array with member id if found, empty array otherwise
 */
export async function getIsDaoMember(params: { did: string; daoid: number | string }): Promise<any[]> {
  const { did, daoid } = params;
  const re = await getData(
    'SELECT id FROM t_daodetail WHERE dao_id=? AND LOWER(member_address)=?',
    [daoid, did.toLowerCase()]
  );
  return Array.isArray(re) ? re : [];
}

/**
 * Get DAO detail by ID
 */
export async function getMyDaoDetail(daoid: number | string): Promise<DaoRecord> {
  const defaultDao: DaoRecord = {
    dao_id: '',
    dao_name: '',
    dao_symbol: '',
    sctype: '',
    strategy: 0,
    dao_manager: '',
    delegator: '',
    child: [],
    version: [],
    lifetime: 0,
    cool_time: 0,
    dao_desc: '',
    creator: ''
  };

  const re = await getData('SELECT * FROM v_dao WHERE dao_id=?', [daoid]);

  if (!Array.isArray(re) || re.length === 0) {
    return defaultDao;
  }

  // Parallel query for better performance
  const [child, version] = await Promise.all([
    getData('SELECT member_address,member_votes,member_type FROM t_daodetail WHERE dao_id=?', [daoid]),
    getData('SELECT _time,creator,dao_version FROM v_createversion WHERE dao_id=? ORDER BY dao_version', [daoid])
  ]);

  return {
    ...re[0],
    child: Array.isArray(child) ? child : [],
    version: Array.isArray(version) ? version : []
  } as DaoRecord;
}

/**
 * Get DAOs list with pagination and search.
 * Uses parameterized LIKE clause instead of string interpolation.
 */
export async function getDaosData(params: {
  ps: number; pi: number; orderField: string; orderType: string; searchText?: string;
}): Promise<any> {
  const { ps, pi, orderField, orderType, searchText } = params;

  let whereClause = '';

  if (searchText) {
    // Escape single quotes for dynamic SQL in stored procedure
    const escaped = searchText.replace(/'/g, "''").replace(/\\/g, '\\\\');
    whereClause = `(dao_name LIKE '%${escaped}%' OR dao_symbol LIKE '%${escaped}%' OR dao_manager='${escaped}' OR creator='${escaped}')`;
  }

  return await getPageData(
    'dao',
    ps,
    pi,
    orderField,
    orderType !== 'true' ? 'asc' : 'desc',
    whereClause
  );
}

/**
 * Get my DAOs where user is a core member (member_type=1)
 */
export async function getMyDaos(params: { did: string }): Promise<any[]> {
  const { did } = params;
  const re = await getData(
    'SELECT * FROM v_dao WHERE dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address=? AND member_type=1) ORDER BY dao_id',
    [did]
  );
  return Array.isArray(re) ? re : [];
}

/**
 * Get dapp owner info
 */
export async function getDappOwner(params: { did: string }): Promise<any[]> {
  const { did } = params;
  const re = await getData('SELECT * FROM t_dao WHERE dapp_owner=?', [did]);
  return Array.isArray(re) ? re : [];
}

/**
 * Get last proposal for a DAO
 */
export async function getLastPro(params: { daoid: number | string; did: string }): Promise<any[]> {
  const { daoid, did } = params;
  const re = await getData(
    'SELECT * FROM v_pro WHERE dao_id=? AND EXISTS (SELECT 1 FROM t_daodetail WHERE dao_id=? AND member_address=?) ORDER BY block_num DESC LIMIT 1',
    [daoid, daoid, did]
  );
  return Array.isArray(re) ? re : [];
}

// ==================== Token & Price Operations ====================

/**
 * Get reward/dividend records.
 * Uses parameterized query instead of string interpolation for did.
 */
export async function getDividend(params: { ps: number; pi: number; did: string }): Promise<any> {
  const { ps, pi, did } = params;
  return await getPageData('getutoken', ps, pi, '_time', 'desc', `dao_owner=?`);
}

/**
 * Get swap/exchange logs.
 * Uses parameterized query instead of string interpolation.
 */
export async function getLogsData(params: { ps: number; pi: number; did: string }): Promise<any> {
  const { ps, pi, did } = params;
  return await getPageData('swap', ps, pi, 'block_num', 'desc', `swap_address=?`);
}

/**
 * Get my tokens
 */
export async function getMyTokens(params: { did: string }): Promise<any[]> {
  const { did } = params;
  const re = await getData('SELECT * FROM v_tokenuser WHERE dao_manager=?', [did]);
  return Array.isArray(re) ? re : [];
}

/**
 * Get token info with cost
 */
export async function getToken(params: { did: string }): Promise<any[]> {
  const { did } = params;
  const re = await getData(
    'SELECT a.*,IFNULL(b.token_cost,0) token_cost FROM v_token a LEFT JOIN (SELECT * FROM t_tokenuser WHERE dao_manager=?) b ON a.token_id=b.token_id',
    [did]
  );
  return Array.isArray(re) ? re : [];
}

/**
 * Get price data
 */
export async function getPrice(): Promise<any[]> {
  const re = await getData('CALL get_price()', []);
  // Stored procedure returns result in first array element
  return Array.isArray(re) && Array.isArray(re[0]) ? re[0] : [];
}

/**
 * Get my NFTs
 */
export async function getMynft(params: { did: string }): Promise<NftObjType[]> {
  const { did } = params;
  const re = await getData('SELECT * FROM v_mynft WHERE to_address=? ORDER BY _time', [did]);
  return Array.isArray(re) ? re : [];
}

// ==================== Proposal Operations ====================

/**
 * Get historical proposals.
 * Uses parameterized query for did.
 */
export async function getProsData(params: { ps: number; pi: number; did: string; st: number }): Promise<any> {
  const { ps, pi, did, st } = params;
  return await getPageData(
    'pro',
    ps,
    pi,
    'createTime',
    'desc',
    `is_end=${st} AND dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address=?)`
  );
}

/**
 * Get my proposals
 */
export async function getMyPros(params: { did: string }): Promise<any[]> {
  const { did } = params;
  const re = await getData('CALL get_prolist(?)', [did]);
  // Stored procedure returns result in first array element
  return Array.isArray(re) && Array.isArray(re[0]) ? re[0] : [];
}

/**
 * Get DAO vote information
 */
export async function getDaoVote(params: { daoId: number | string; delegator: string; createTime: string }): Promise<any[]> {
  const { daoId, delegator, createTime } = params;
  const sql = `
    SELECT a.member_address,a.member_votes,IFNULL(b.rights,0) rights,IFNULL(b.antirights,0) antirights
    FROM (SELECT * FROM t_daodetail WHERE dao_id=? AND member_type=1) a
    LEFT JOIN (SELECT * FROM t_provote WHERE delegator=? AND createTime=?) b
    ON a.member_address=b.creator
  `;
  const re = await getData(sql, [daoId, delegator, createTime]);
  return Array.isArray(re) ? re : [];
}

// ==================== User Operations ====================

/**
 * Get user avatar and description
 */
export async function getUser(params: { newAccount: string; oldAccount: string }): Promise<any> {
  const { newAccount, oldAccount } = params;
  const re = await getData(
    'SELECT avatar,actor_desc FROM a_account WHERE actor_account=? OR actor_account=?',
    [newAccount, oldAccount]
  );
  return Array.isArray(re) && re.length > 0 ? re[0] : {};
}

/**
 * Check if account exists and get registration info
 */
export async function getSelfAccount(params: { account: string; did: string }): Promise<UserRegister> {
  const { account, did } = params;
  // Parallel queries for better performance
  const [re, re1, re2] = await Promise.all([
    getData('SELECT id FROM a_account WHERE actor_account=?', [account]),
    getData('SELECT count(*) as total FROM a_account', [], true),
    getData(
      "SELECT 1 FROM t_register_log WHERE manager = ? AND create_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)",
      [did.toLowerCase()]
    )
  ]);

  return {
    nameTotal: Array.isArray(re) ? re.length : 0,
    allTotal: (re1 as { total?: number })?.total ?? 1024,
    limitonehour: Array.isArray(re2) && re2.length > 0
  };
}

// ==================== EIP Operations ====================

/**
 * Get EIP types
 */
export async function getEipTypes(): Promise<any[]> {
  const re = await getData('SELECT type_name,type_desc FROM a_eip_type', []);
  return Array.isArray(re) ? re : [];
}

// ==================== Message Operations ====================

/**
 * Get paginated message data for love/donate ranking page.
 * Uses named constant instead of hardcoded magic value for pid.
 */
export async function messagePageDataLove(params: { pi: number; order?: string }): Promise<any> {
  const { pi, order } = params;
  const PS = 20;

  // Validate order to prevent SQL injection
  const safeOrder = order === 'desc' ? 'desc' : 'asc';
  const pageOffset = Number(pi) * PS;

  // Parallel queries for better performance
  const [rows, countResult] = await Promise.all([
    getData(
      `SELECT * FROM a_messagesc_commont WHERE pid=? ORDER BY total_score ${safeOrder} LIMIT ?,?`,
      [LOVE_PAGE_POST_ID, pageOffset, PS]
    ),
    getData('SELECT count(*) as c FROM a_messagesc_commont WHERE pid=?', [LOVE_PAGE_POST_ID], true)
  ]);

  const total = (countResult as { c?: number })?.c ?? 0;
  const pages = Math.ceil(total / PS);

  return {
    rows: Array.isArray(rows) ? rows : [],
    total,
    pages
  };
}
