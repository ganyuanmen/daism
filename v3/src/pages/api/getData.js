import {getUser,getIsDaoMember, getEipTypes, getDappVersion, getDividend,getDappOwner,getProsData,getMynft, getSelfAccount,getDaoVote,getLastPro, getDaosData,getPrice,getToekn,getMyPros,getLogsData,getMyDaos,getMyTokens,getMyDaoDetail,getMessTag } from "../../lib/mysql/daism";
import { messagePageData,replyPageData,getAllSmartCommon,getHeartAndBook,fromAccount,getReplyTotal,daoPageData,getUserFromUrl,getOne,getAnnoce } from "../../lib/mysql/message";
import { getFollowers,getFollowees,getFollow,getFollow0,getFollow1 } from "../../lib/mysql/folllow";
import { httpGet } from "../../lib/net";


const methods={
    getDaosData,  //dao列表
    getPrice,  //gas平均单价  
    getToekn, //交易的token 列表
    getMyPros, //我的提案
    getLogsData, //兑换记录
    getMyDaos, //我的dao
    getMyTokens, //我和tokens
    getMyDaoDetail, //dao 详细信息
    getLastPro, //最后一条提案
    getDaoVote, //提案内容
    getSelfAccount,// 查询帐帐号是否已注册
    getMynft,//我的nft
    getDappOwner, //dapp owner
    getProsData, //已完成提案
    getDividend, //奖励记录
    getDappVersion, //dapp地址对应version
    messagePageData, //嗯文分页列表
    replyPageData, //获取回复
    getFollowers, //获取粉丝
    getFollowees, //偶像集
    getEipTypes, //eip类型
    getAllSmartCommon, //所有已注册的smartcommon
    getHeartAndBook, //获取点赞数量及是否已点赞 /获取收藏数量及是否已收藏
    fromAccount, //查找帐号 可以xx@xx 也可以 https://xxxx
    getFollow, //获某一关注 {actorAccount,userAccount} userAccount 关注  actorAccount
    getFollow0,
    getFollow1,
    getIsDaoMember, //是否dao成员
    getUser, //获取avatar 和desc
    getReplyTotal, //获取回复总数
    daoPageData, //获取注册dao帐号列表
    getUserFromUrl, //从网页获取个人信息
    getOne, //获取一条嗯文
    getMessTag, // 当前嗯文的标签
    getAnnoce, //获取是否已转发

}

export default async function handler(req, res) {
    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
    try{
        //向原帐号所在域名请求，公器的首页和活动，account为空，只向本地获取
        if(req.headers.method==='messagePageData' && req.query.account && req.query.account.includes('@') ){  
           const {pi,menutype,daoid,actorid,w,order,account,eventnum,v}=req.query;
           const [,domain]=account.split('@');
           if(domain===process.env.LOCAL_DOMAIN) //本地
                res.status(200).json(await methods[req.headers.method](req.query))
           else { //其它域名
                let response=await httpGet(`https://${domain}/api/getData?pi=${pi}&menutype=${menutype}&daoid=${daoid}&actorid=${actorid}&w=${w}&order=${order}&eventnum=${eventnum}&account=${account}&v=${v}`,{'Content-Type': 'application/json',method:'messagePageData'})
                if(response?.message) res.status(200).json(response.message)
                else  res.status(500).json({errMsg: 'fail'});
           }
        }  //向原帐号所在域名请求
        else if(req.headers.method==='replyPageData' && req.query.account && req.query.account.includes('@')) {
            const {pi,ppid,account,sctype}=req.query;
            const [,domain]=account.split('@');
            if(domain===process.env.LOCAL_DOMAIN) //本地或smar common 
                 res.status(200).json(await methods[req.headers.method](req.query))
            else { //其它域名
                 let response=await httpGet(`https://${domain}/api/getData?pi=${pi}&ppid=${ppid}&sctype=${sctype}&account=`,{'Content-Type': 'application/json',method:'replyPageData'})
                 if(response?.message) res.status(200).json(response.message)
                 else  res.status(500).json({errMsg: 'fail'});
            }
        }else if((req.headers.method==='getFollow0' || req.headers.method==='getFollow1')  && req.query.account && req.query.account.includes('@')) {
          const [,domain]=req.query.account.split('@');
          if(domain===process.env.LOCAL_DOMAIN) //本地或smar common 
               res.status(200).json(await methods[req.headers.method](req.query))
          else { //其它域名
               let response=await httpGet(`https://${domain}/api/getData?account=${req.query.account}`,{'Content-Type': 'application/json',method:req.headers.method})
               if(response?.message) res.status(200).json(response.message)
               else  res.status(500).json({errMsg: 'fail'});
          }
        }
        else {
          res.status(200).json(await methods[req.headers.method](req.query))
        }
    }
    catch(err)
    {
        console.error(`get: /api/getData:`,req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  
  }
  