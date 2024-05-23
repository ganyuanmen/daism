import { getData,executeID,getPageData } from './common';


export async function addSource(did,url)
{
    return await executeID('INSERT INTO a_source(account,url) VALUES(?,?)'                          
    ,[did,url]);
}

// 分红记录
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
export async function getProsData({ps,pi,did})
{
    let re= await getPageData('pro',ps,pi,'createTime','desc',`is_end=1 AND dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address='${did}')`);
    return re 
}



//公共模板
export async function getTemplate({ps,pi})
{
    let re= await getPageData('template',ps,pi,'template_id','desc',`is_public=1`);
    return re 
}

//未使用的logoID
export async function getAddLogo({daoid})
{
    let re= await getData('SELECT * FROM v_addlogo WHERE dao_id=? and is_use=0',[daoid]);
    return re || []
}

//我的nft模板
export async function getMyTemplate({did})
{
    let re= await getData('select * from v_template where to_address=?',[did]);
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
    let re= await getData('SELECT * FROM v_pro WHERE dao_id=? and creator=? ORDER BY block_num DESC LIMIT 1',[daoid,did]);
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
    let re= await getData('select * from v_mynft where to_address=?',[did]);
    return re || []
}



//获取修改的logo与原logo
export async function getEditLogo({imgid,daoid})
{
    let re= await getData('SELECT a.clogo,b.ologo FROM (SELECT dao_logo AS clogo FROM t_addlogo WHERE img_id=?) a CROSS JOIN (SELECT dao_logo AS ologo FROM t_dao WHERE dao_id=?) b',[imgid,daoid]);
    return re || []
}

//Daodetail
export async function getMyDaoDetail({daoid})
{
    let re= await getData('SELECT * FROM v_dao WHERE dao_id=?',[daoid]);
    if(re && re.length) re[0].child=await getData('select * from v_members where dao_id=?',[daoid])
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
