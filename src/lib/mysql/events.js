
import { getData,execute,getPageData,executeID } from './common'

const { v4: uuidv4 } = require("uuid");

/**
 * 增加
 * @param {*} cid  getTime生成的ID
 * @param {*} daoid 
 * @param {*} did async
 * @param {*} title 
 * @param {*} content 
 * @param {*} isSend 
 * @param {*} isDiscussion 
 * @returns 
 */
export async function add(daoid,did,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,time_event)
{
    return await executeID('INSERT INTO a_events (dao_id,member_address,title,content,is_send,is_discussion,top_img,start_time,end_time,event_url,original,numbers,participate,address,time_event) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'                          
    ,[daoid,did,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,time_event]);
}

//删除
export async function eventsDel({id,replyLevel})
{
    if(replyLevel=='0')  return await execute('delete from a_events where id=?',[id]);
    else if(replyLevel=='1')  return await execute('delete from a_events_commont where id=?',[id]);
    else  return await execute('delete from a_events_reply where id=?',[id]);
}

//修改        
export async function update(id,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,fileType,time_event)
{

    if(!topImg && fileType) //非清空，不用更新图片
        return await execute('UPDATE a_events SET title=?,content=?,is_send=?,is_discussion=?,start_time=?,end_time=?,event_url=?,original=?,numbers=?,participate=?,address=?,time_event=? WHERE id=?'
        ,[title,content,isSend,isDiscussion,startTime,endTime,eventUrl,original,numbers,participate,address,time_event,id]);

    else 
        return await execute('UPDATE a_events SET title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,original=?,numbers=?,participate=?,address=?,time_event=? WHERE id=?'
        ,[title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,time_event,id]);
        

}

//修改是否允许评论
export async function editDiscussion({id,flag})
{
    return await execute('update a_events set is_discussion=? where id=?',[flag,id]);
}


//修改是否允许回复
export async function editReply({id,flag})
{
    return await execute('update a_events_commont set is_discussion=? where id=?',[flag,id]);
}

 //获取一条讨论
export async function getOne(id)
{
    let re= await getData('SELECT * FROM v_events WHERE id=?',[id]);
    return re?re:[];
}

 //获取参与者
 export async function getJoin(id)
 {
     let re= await getData('SELECT * FROM v_events_join WHERE pid=? order by id desc',[id]);
     return re?re:[];
 }

 //增加参与者
 export async function addJoin({pid,did,content})
 {
    let data=await getData('SELECT participate FROM a_events WHERE id=?',[pid]);
    let _participate=0
    if(data.length && data[0].participate=='0')  _participate='2' //匿名
    return await executeID('INSERT INTO a_events_join (pid,member_address,content,flag) VALUES(?,?,?,?)',[pid,did,content,_participate]);
 }

 //删除参与者
 export async function delJoin({id})
 {
    return await execute('delete from a_events_join where id=?',[id]);
 }
 
 //参与者审核
 export async function updateVerify({id,flag})
 {
    return await execute('update a_events_join set flag=? where id=?',[flag,id]);
 }

//新增加评论
export async function eventAddComment({pid,did,content})
{
    return await executeID("INSERT INTO a_events_commont (pid,member_address,content) VALUES(?,?,?)",[pid,did,content])
}


//新增回复
export async function eventAddReply({pid,did,nick,avatar,content,sendId})
{
    
    if(!sendId) sendId=uuidv4()
    if(avatar)
        return await executeID("INSERT INTO a_events_reply(pid,member_address,member_nick,member_icon,content,send_id) VALUES(?,?,?,?,?,?)"
        ,[pid,did,nick,avatar,content,sendId])
    else 
        return await executeID("INSERT INTO a_events_reply(pid,member_address,member_nick,content,send_id) VALUES(?,?,?,?,?)"
        ,[pid,did,nick,content,sendId])

}

//获取评论
export async function getFromPid(pid)
{
    let re= await getData('SELECT * FROM v_events_commont WHERE pid=? ',[pid]);
    return re?re:[];
}
 

//获取评论
export async function getComment(id)
{
    let re= await getData('SELECT * FROM v_events_commont WHERE id=? ',[id]);
    return re?re:[];
}

//获取回复
export async function geRely(pid)
{
    let re= await getData('SELECT * FROM v_events_reply WHERE pid=?',[pid]);
    return re?re:[];
}

//统计人数:

export async function eventsSum(pid)
{   
    let data={amount:0,noAudit:0}
    let re= await getData('SELECT COUNT(*) amount FROM a_events_join WHERE pid=? and flag>0 ',[pid]);
    if(re && re[0]) data.amount=re[0].amount
    re= await getData('SELECT COUNT(*) amount FROM a_events_join WHERE pid=? and flag=0 ',[pid]);
    if(re && re[0]) data.noAudit=re[0].amount
    return data;
}



 /**
  * 获取分页数据
  * @param {*} tid 数据id，数据库中定义的,从哪里取数据
  * @param {*} ps 每页记录数
  * @param {*} pi 第几页,从1开始 
  * @param {*} s 排序字段
  * @param {*} a 排序方式 asc 或desc 
  * @param {*} w 查询条件
  * @returns 
  */
export async function eventsPageData({ps,pi,daoid})
{
    let re= await getPageData('events',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}
