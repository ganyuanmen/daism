import {getReplyList, getDappVersion, getDividend,getDappOwner,getProsData,getMyTemplate,getMynft, getTemplate, getEditLogo,getDaoVote,getLastPro,getAddLogo, getDaosData,getPrice,getToekn,getMyPros,getLogsData,getMyDaos,getMyTokens,getMyDaoDetail } from "../../lib/mysql/daism";

const methods={
    getDaosData,  //dao列表
    getPrice,  //gas平均单价  
    // getPro,  //单个提案
    // getMyDaoData, //我管理的dao
    getToekn, //交易的token 列表
    getMyPros, //我的提案
    getLogsData, //兑换记录
    getMyDaos, //我的dao
    // getMyApps, //我的app
    getMyTokens, //我和tokens
    getMyDaoDetail, //dao 详细信息
    getAddLogo,  //获取未使用logo_id
    getLastPro, //最后一条提案
    getDaoVote, //提案内容
    getTemplate,// 所有公共模板
    getEditLogo, //修改的logo与原logo
    getMynft,//我的nft
    getDappOwner, //dapp owner
    getMyTemplate, //我的NFT模板
    getProsData, //已完成提案
    getDividend, //分红记录
    getDappVersion, //dapp地址对应version
    getReplyList, //获取活动评论回复

}

export default async function handler(req, res) {

    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
  
    try{

        res.status(200).json(await methods[req.headers.method](req.query))
    }
    catch(err)
    {
        console.error(`get: /api/getData:`,req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  
  }
  