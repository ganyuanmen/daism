import withSession from "../../lib/session";
import { addEipType } from "../../lib/mysql/daism";
import {messageDel,setTopMessage,handleHeartAndBook,setAnnounce} from '../../lib/mysql/message';
import { broadcast } from "../../lib/net";

const methods={
    messageDel, //删除
    addEipType,// 增加eip 类型
    handleHeartAndBook, //点赞、取消点赞
    setTopMessage, //取置顶
    setAnnounce,//转发
    
}

export default withSession(async (req, res) => {
    if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
    const sessionUser = req.session.get('user');
    if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
    try{
        let lok=await methods[req.headers.method](req.body)
        if(lok && req.headers.method==='addEipType')  //广播类型
        {
          broadcast({type:'addType',domain:process.env.LOCAL_DOMAIN,actor:{_type:req.body._type,_desc:req.body._desc},user:{},followId:0})  //广播信息
        } 
        res.status(200).json({state:lok});
    }
    catch(err)
    {
        console.error('error for post:/api/postwithsession:',req.headers.method,req.body,err)
        res.status(500).json({errMsg: 'fail'+err.toString()});
    }  
});


