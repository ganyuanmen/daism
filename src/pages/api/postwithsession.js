import withSession from "../../lib/session";
import { discussionsAdd,discussionsAddCommont,discussionsDel,discussionsUpdate } from "../../lib/mysql/discussion";
import { send } from "../../lib/utils/send";
import { newsDel,getOne as newGetOne } from "../../lib/mysql/news";
import { delOldImage } from "../../lib/utils";
import { eventsDel,eventAddComment,editDiscussion,editReply,eventAddReply,updateVerify,delJoin,addJoin,getOne as eventGetOne } from "../../lib/mysql/events";
import {getOneSource, delSource} from '../../lib/mysql/dao'

const methods={
    discussionsAdd, //增加讨论
    discussionsAddCommont, //回复
    discussionsDel, //删除
    discussionsUpdate, //修改
    newsDel, //删除新闻
    eventsDel,
    eventAddComment, //增加活动评论
    editDiscussion, //禁止恢复活动评论
    editReply, //禁止恢复活动讨论回复
    eventAddReply, //活动评论回复
    updateVerify, //加入活动审批
    delJoin, //删除加入者
    addJoin, //申请加入活动
    delSource, //删除资源
}

export default withSession(async (req, res) => {
    if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
    const sessionUser = req.session.get('user');
    if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
    try{
        let old;
        if(req.headers.method==='newsDel' || req.headers.method==='eventsDel' || req.headers.method==='delSource') 
        {
            old=await getOld(req.headers.method,req.body.id)
        }

        let lok=await methods[req.headers.method](req.body)
        if(lok && req.headers.method==='discussionsAdd' && parseInt(req.body.isSend)===1) {
            if( process.env.IS_DEBUGGER==='1') console.info("discussions send --->",[req.body.daoid,lok,req.body.title])
            send(req.body.daoid,req.body.contentText,'','discussions',lok,`《${req.body.title}》  ${req.body.contentText}`) //发送讨论内容
        } 
        else if(lok && req.headers.method==='eventAddComment'){
            const  eventsObj=await eventGetOne(req.body.pid)
            if(eventsObj[0]['is_send']===1)
            { 
                if( process.env.IS_DEBUGGER==='1') console.info("eventAddComment send --->",[eventsObj[0]['dao_id'],lok])
                send(eventsObj[0]['dao_id'],req.body.contentText,null,'events',lok,req.body.contentText,true)   
            }
        }
        else if(lok && (req.headers.method==='newsDel' || req.headers.method==='eventsDel' || req.headers.method==='delSource')) delNewImage(old) //删除新闻图片
        res.status(200).json(lok);
    }
    catch(err)
    {
        console.error('post:/api/postwithsession:',req.headers.method,req.body,err)
        res.status(500).json({errMsg: 'fail'});
    }  

});

async function getOld(method,id){
    let old
    if(method==='newsDel')
        old=await newGetOne(id)
    else if(method==='eventsDel')
        old=await eventGetOne(id)
    else if(method==='delSource') { //删除资源
        old=await getOneSource(id)
        let ar=old[0].url.split('/')
        old[0].top_img=ar[ar.length-1]
    }

    return old;

}

async function delNewImage(old)  //删除新闻图片
{

    try{
        if(old[0]?.top_img) delOldImage(old[0].top_img)
    } catch (err){ console.error(err)}
}