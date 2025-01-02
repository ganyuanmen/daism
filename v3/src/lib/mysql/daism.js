import { getData,execute,getPageData } from './common';

export async function addEipType({_type,_desc})
{
    
    return await execute('call i_eip_type(?,?)' ,[_type,_desc]);
}

//检测帐号是否dao成员
export async function getIsDaoMember({did,daoid})
{
    let re= await getData("SELECT id FROM t_daodetail WHERE dao_id=? AND LOWER(member_address)=?",[daoid,did.toLowerCase()]);
    return re 
}
  
// 奖励记录
export async function getDividend({ps,pi,did})
{
    let re= await getPageData('getutoken',ps,pi,'_time','desc',`dao_owner='${did}'`);
    return re 
}

//兑换记录
export async function getLogsData({ps,pi,did})
{
    let re= await getPageData('swap',ps,pi,'block_num','desc',`swap_address='${did}'`);
    return re 
}

//历史提案
export async function getProsData({ps,pi,did,st})
{
    let re= await getPageData('pro',ps,pi,'createTime','desc',`is_end=${st} AND dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address='${did}')`);
    return re 
}

//获取avatar 和 desc
export async function getUser({newAccount,oldAccount})
{
    let re= await getData('select avatar,actor_desc from a_account  where actor_account=? or actor_account=?',[newAccount,oldAccount]);
    return  re[0] || {}
}

//检测帐号是否存在
export async function getSelfAccount({account})
{
    let re= await getData("select id from a_account where actor_account=?",[account]);
    let re1=await getData("select count(*) as total from a_account",[]);
    return {nameTotal:re.length, allTotal:re1[0].total}
}



//修改dapp地址对应 version
export async function getDappVersion({daoid})
{
    let re= await getData('SELECT * FROM v_createversion WHERE dao_id=? order by dao_version',[daoid]);
    return re || []
}


//我的dapp owner
export async function getDappOwner({did})
{
    let re= await getData('select * from t_dao where dapp_owner=?',[did]);
    return re || []
}


//最后一条提案
export async function getLastPro({daoid,did})
{
    let re= await getData(' SELECT * FROM v_pro WHERE dao_id=? AND  EXISTS (SELECT 1 FROM t_daodetail WHERE dao_id=? AND member_address=?) ORDER BY block_num DESC LIMIT 1',[daoid,daoid,did]);
    return re || []
}

//daos列表
export async function getDaosData({ps,pi,orderField,orderType,searchText})
{
    searchText=searchText.replaceAll(' ','')
    let re= await getPageData('dao',ps,pi,orderField
    ,orderType!=='true'?'asc':'desc'
    ,searchText?`dao_name like '%${searchText}%' or dao_symbol like '%${searchText}%' or dao_manager='${searchText}' or creator='${searchText}' `:"");
    return re 
}

//我的tokens
export async function getMyTokens({did})
{
    let re= await getData('SELECT * FROM v_tokenuser WHERE dao_manager=?',[did]);
    return re || []
}


//eip 类型
export async function getEipTypes()
{
    let re= await getData('SELECT type_name,type_desc FROM a_eip_type',[]);
    return re || []
}

//我的提案
export async function getMyPros({did})
{
    let re= await getData('CALL get_prolist(?)',[did]);
    return (re && re[0])?re[0]:[]
}

//我的Daos
export async function getMyDaos({did})
{
    let re= await getData('SELECT * FROM v_dao WHERE dao_id in(select dao_id from t_daodetail where member_address=? and member_type=1) order by dao_id',[did]);
    return re || []
}

//我的NFT
export async function getMynft({did})
{
    let re= await getData('select * from v_mynft where to_address=? order by _time',[did]);
    return re || []
}



//Daodetail
export async function getMyDaoDetail({daoid})
{
    let re= await getData('SELECT * FROM v_dao WHERE dao_id=?',[daoid]);
    if(re && re.length) re[0].child=await getData('select * from t_daodetail where dao_id=?',[daoid])
    return re || []
}

export async function getToekn({did})
{
    let re= await getData('SELECT a.*,IFNULL(b.token_cost,0) token_cost FROM v_token a LEFT JOIN (SELECT * FROM  t_tokenuser WHERE dao_manager=?) b ON a.`token_id`=b.token_id',[did]);
    return re || []
}

export async function getPrice({}) 
{
    let re=await getData('CALL get_price()',[])
    return (re && re[0])?re[0]:[]
}


export async function getDaoVote({daoId,delegator,createTime}) 
{
    let sql=` SELECT a.member_address,a.member_votes,IFNULL(b.rights,0) rights,IFNULL(b.antirights,0) antirights FROM 
    (SELECT * FROM t_daodetail WHERE dao_id=? AND member_type=1) a LEFT JOIN 
    (SELECT * FROM t_provote WHERE delegator=? AND createTime=?) b ON a.member_address=b.creator`
    let re= await getData(sql,[daoId,delegator,createTime])
    return re || []
}
