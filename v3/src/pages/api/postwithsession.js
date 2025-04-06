import withSession from "../../lib/session";
import { addEipType } from "../../lib/mysql/daism";
import {messageDel,setTopMessage,handleHeartAndBook,setAnnounce} from '../../lib/mysql/message';
import { getData } from "../../lib/mysql/common"
import { broadcast } from "../../lib/net";
import { send } from "../../lib/utils/send";
import { createNoteDel } from "../../lib/activity";
import { signAndSend } from "../../lib/net";
import { getUser } from "../../lib/mysql/user";
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
        if(req.headers.method==='messageDel' ){
            if(req.body.type==='0'){ //delete message 
                const {id,type,sctype}=req.body;
                let rear = await getData(`select actor_account,message_id from a_message${sctype} where id=?`, [id],true)
                if(type=='0') {
                    send(
                       rear.actor_account,
                        '',
                        '',
                        '',
                        rear.message_id,
                        sctype==='sc'?'enki':'enkier',
                        'Delete'
                    ) 
                }
            }else { //delete message_commont
                const {id,sctype,ppid,account}=req.body;
                if(sctype!=='sc' && ppid && ppid.startsWith('http') && account && account.includes('@')){
                    const obj=await getData("SELECT actor_inbox FROM a_message WHERE message_id=?",[ppid],true);
                    const user= await getUser('actor_account',account,'privkey,actor_name,domain')                  
                    if(obj?.actor_inbox && user.domain && user.actor_name){
                        const send_body=createNoteDel(user.actor_name,user.domain,id,process.env.LOCAL_DOMAIN);
                        signAndSend(obj.actor_inbox,user.actor_name,user.domain,send_body,user.privkey);
                    } 
                }
            }
        }

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


