
import withSession from "../../../lib/session";
import { getJsonArray } from "../../../lib/mysql/common";

export default withSession(async (req, res) => {
    let sessionUser= req.session.get('user')
    if(sessionUser && sessionUser.did) {
      res.status(200).json({
            daoActor:await getJsonArray('daoactor',[sessionUser.did]), //dao帐号列表
            actor:await getJsonArray('actor',[sessionUser.did],true)  //个人帐号
      });         
    }else 
    res.status(200).json({
      daoActor:[],
      actor:{}
});         
  
});