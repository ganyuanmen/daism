const { v4: uuidv4 } = require("uuid");
import { getData,execute,getPageData,executeID } from './common';


export async function discussionsAdd({daoid,did,title,content,isSend,isDiscussion})
{
    return await executeID('INSERT INTO a_discussion (dao_id,member_address,title,content,is_send,is_discussion) VALUES(?,?,?,?,?,?)'
    ,[daoid,did,title,content,isSend,isDiscussion]);
}

export async function discussionsAddCommont({id,did,nick,avatar,content,sendId})
{
  
    if(!sendId) sendId=uuidv4()
    
    if(avatar)
        return await executeID("INSERT INTO a_discussion_commont(pid,member_address,member_nick,member_icon,content,send_id) VALUES(?,?,?,?,?,?)"
        ,[id,did,nick,avatar,content,sendId])
    else 
        return await executeID("INSERT INTO a_discussion_commont(pid,member_address,member_nick,content,send_id) VALUES(?,?,?,?,?)"
        ,[id,did,nick,content,sendId])

}


//删除
export async function discussionsDel({id,replyLevel})
{
    if(replyLevel=='0') return await execute('delete from a_discussion where id=?',[id]);
    else return await execute('delete from a_discussion_commont where id=?',[id]);
}


//修改标题
export async function discussionsUpdate({id,title,content,isSend})
{
    return await execute('update a_discussion set title=?,content=?,is_send=? where id=?',[title,content,isSend,id]);
}

//修改是否允许评论
export async function editDiscussion(id,flag)
{
    return await execute('update a_discussion set is_discussion=? where id=?',[flag,id]);
}

 //获取一条讨论
export async function getOne(id)
{
    let re= await getData('SELECT * FROM v_discussion WHERE id=? ',[id]);
    return re?re:[];
}

//获取评论
export async function getFromPid(pid)
{
    let re= await getData('SELECT * FROM v_discussion_commont WHERE pid=?',[pid]);
    return re?re:[];
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
export async function discussionPageData({ps,pi,daoid})
{
    let re= await getPageData('discussions',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}

//讨论回复
export async function dcviewPageData({ps,pi,pid})
{
    let re= await getPageData('dcview',ps,pi,'id','asc',`pid=${pid}`);
    return re 
}
