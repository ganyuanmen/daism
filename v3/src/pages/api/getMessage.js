// import { getData } from "../../lib/mysql/common";
import { messagePageData } from "../../lib/mysql/message";

////pi,menutype,daoid,w,actorid:嗯文人ID,account,order,eventnum
// menutype 1 我的社区，2 公区社区 3 个人社区
//eventnum 社区: 0 非活动，1活动, 个人：1:首页 2:我的嗯文 3:我的收藏 4:我的接收嗯文 
// v: 1 我关注的社区
// export async function messagePageData({pi,menutype,daoid,w,actorid,account,order,eventnum,v})

export default async function handler(req, res) {
    const {menutype,account,pi,daoid,eventnum}=req.query;
  
    if (!account) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let re=await messagePageData({pi,menutype,daoid,w:'',actorid:0,account,order:'id',eventnum,v:''});
      res.json(re);
    }
  }
  