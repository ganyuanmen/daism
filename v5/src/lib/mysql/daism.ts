
import { getData, execute, getPageData } from './common';

// 添加 EIP 类型
export async function addEipType({ _type, _desc }: any): Promise<any> {
  return await execute('call i_eip_type(?,?)', [_type, _desc]);
}

// 检测帐号是否是 DAO 成员
export async function getIsDaoMember({ did, daoid }: any): Promise<any[]> {
  const re = await getData(
    "SELECT id FROM t_daodetail WHERE dao_id=? AND LOWER(member_address)=?",
    [daoid, did.toLowerCase()]
  );
  return re || [];
}

// 奖励记录
export async function getDividend({ ps, pi, did }: any): Promise<any> {
  const re = await getPageData('getutoken', ps, pi, '_time', 'desc', `dao_owner='${did}'`);
  return re;
}

// 兑换记录
export async function getLogsData({ ps, pi, did }: any): Promise<any> {
  const re = await getPageData('swap', ps, pi, 'block_num', 'desc', `swap_address='${did}'`);
  return re;
}

// 历史提案
export async function getProsData({ ps, pi, did, st }: any): Promise<any> {
  const re = await getPageData(
    'pro',
    ps,
    pi,
    'createTime',
    'desc',
    `is_end=${st} AND dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address='${did}')`
  );
  return re;
}

// 获取 avatar 和 desc
export async function getUser({ newAccount, oldAccount }: any): Promise<any> {
  const re = await getData(
    'SELECT avatar,actor_desc FROM a_account WHERE actor_account=? OR actor_account=?',
    [newAccount, oldAccount]
  );
  return re[0] || {};
}


export interface UserRegister{
  allTotal:number; //所有注册数
  nameTotal:number; //本人是否已注册 >0=>true
  limitonehour:boolean;
}

// 检测帐号是否存在
export async function getSelfAccount({ account,did }: any): Promise<UserRegister> {
  const re = await getData('SELECT id FROM a_account WHERE actor_account=?', [account]);
  const re1 = await getData('SELECT count(*) as total FROM a_account', [],true);
  const re2=await getData("SELECT 1 FROM t_register_log WHERE manager = ?  AND create_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)",[did.toLowerCase()])
  return { nameTotal: re.length, allTotal: re1?.total ?? 1024,limitonehour:re2.length>0 };
}

// // 修改 dapp 地址对应 version
// export async function getDappVersion({ daoid }: any): Promise<any[]> {
//   const re = await getData('SELECT * FROM v_createversion WHERE dao_id=? ORDER BY dao_version', [daoid]);
//   return re || [];
// }

// 我的 dapp owner
export async function getDappOwner({ did }: any): Promise<any[]> {
  const re = await getData('SELECT * FROM t_dao WHERE dapp_owner=?', [did]);
  return re || [];
}

// 最后一条提案
export async function getLastPro({ daoid, did }: any): Promise<any[]> {
  const re = await getData(
    'SELECT * FROM v_pro WHERE dao_id=? AND EXISTS (SELECT 1 FROM t_daodetail WHERE dao_id=? AND member_address=?) ORDER BY block_num DESC LIMIT 1',
    [daoid, daoid, did]
  );
  return re || [];
}

// daos 列表
export async function getDaosData({ ps, pi, orderField, orderType, searchText }: any): Promise<any> {
  searchText = searchText?.replaceAll(' ', '');
  const re = await getPageData(
    'dao',
    ps,
    pi,
    orderField,
    orderType !== 'true' ? 'asc' : 'desc',
    searchText
      ? `dao_name LIKE '%${searchText}%' OR dao_symbol LIKE '%${searchText}%' OR dao_manager='${searchText}' OR creator='${searchText}'`
      : ''
  );
  return re;
}

// 我的 tokens
export async function getMyTokens({ did }: any): Promise<any[]> {
  const re = await getData('SELECT * FROM v_tokenuser WHERE dao_manager=?', [did]);
  return re || [];
}

// eip 类型
export async function getEipTypes(): Promise<any[]> {
  const re = await getData('SELECT type_name,type_desc FROM a_eip_type', []);
  return re || [];
}

// 我的提案
export async function getMyPros({ did }: any): Promise<any[]> {
  const re = await getData('CALL get_prolist(?)', [did]);
  return re?.[0] || [];
}

// 我的 Daos
export async function getMyDaos({ did }: any): Promise<any[]> {
  const re = await getData(
    'SELECT * FROM v_dao WHERE dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address=? AND member_type=1) ORDER BY dao_id',
    [did]
  );
  return re || [];
}

// 我的 NFT
export async function getMynft({ did }: any): Promise<NftObjType[]> {
  const re = await getData('SELECT * FROM v_mynft WHERE to_address=? ORDER BY _time', [did]);
  return re || [];
}

// Daodetail

interface DaoChild {member_address: string;member_votes: number;member_type: number | string;}
interface DaoVersion {_time: string;creator: string;dao_version: number;}

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
  version:DaoVersion[];
  lifetime: number;
  cool_time: number;
  dao_desc: string;
  creator: string;
}
export async function getMyDaoDetail(daoid : number|string): Promise<DaoRecord> {
  const re = await getData('SELECT * FROM v_dao WHERE dao_id=?', [daoid]);
  if (re?.length) {
    re[0].child = await getData('SELECT member_address,member_votes,member_type FROM t_daodetail WHERE dao_id=?', [daoid]);
    re[0].version = await getData('SELECT _time,creator,dao_version FROM v_createversion WHERE dao_id=? ORDER BY dao_version', [daoid]);
  }
  return re[0] || {};
}

// Token 信息
export async function getToken({ did }: any): Promise<any[]> {

  const re = await getData(
    'SELECT a.*,IFNULL(b.token_cost,0) token_cost FROM v_token a LEFT JOIN (SELECT * FROM t_tokenuser WHERE dao_manager=?) b ON a.token_id=b.token_id',
    [did]
  );
  return re || [];
}

// 获取价格
export async function getPrice(): Promise<any[]> {
  const re = await getData('CALL get_price()', []);
  return re?.[0] || []; //存储过程 需要re[0] 获取数组结果 
}

// DAO 投票信息
export async function getDaoVote({ daoId, delegator, createTime }: any): Promise<any[]> {
  const sql = `
    SELECT a.member_address,a.member_votes,IFNULL(b.rights,0) rights,IFNULL(b.antirights,0) antirights
    FROM (SELECT * FROM t_daodetail WHERE dao_id=? AND member_type=1) a
    LEFT JOIN (SELECT * FROM t_provote WHERE delegator=? AND createTime=?) b
    ON a.member_address=b.creator
  `;
  const re = await getData(sql, [daoId, delegator, createTime]);
  return re || [];
}


export async function messagePageDataLove(params: any): Promise<any> {
  const ps=20;
  const { pi,order } = params;

  let sql="SELECT * FROM a_messagesc_commont WHERE  pid='07e7888a76234abe9b3f88ff128e5f5d'";
  let sqltotal="SELECT count(*) as c FROM a_messagesc_commont WHERE  pid='07e7888a76234abe9b3f88ff128e5f5d'";;
  const rows= await getData(`${sql} order by total_score ${order} limit ${pi*ps},${ps}`, []);
  const re= await getData(sqltotal, [],true);
  const total=re.c;
//  console.log(pi,total,Math.ceil(total/ps),ps);
//  console.log(`${sql} order by total_score ${order} limit ${pi*ps},${ps}`)
  return { rows,total,pages:Math.ceil(total/ps)};
}
