
import { getData,executeID,execute,getPageData } from './common'

export async function add(topImg,daoid,did,title,content)
{
    return await executeID('INSERT INTO a_news(top_img,dao_id,member_address,title,content) VALUES(?,?,?,?,?)'                          
    ,[topImg,daoid,did,title,content]);
}


//删除
export async function newsDel({id})
{
    return await execute('delete from a_news where id=?',[id]);
}


//修改标题
export async function update(title,topImg,content,id,fileType)
{
  // 不传图片就不更新 
  if(!topImg && fileType) //非清空，不用更新图片
    return await execute('update a_news set title=?,content=? where id=?',[title,content,id]);
  else  
   return await execute('update a_news set title=?,top_img=?, content=? where id=?',[title,topImg,content,id]);
}


 //获取一条讨论
 export async function getOne(id)
 {
     let re= await getData('SELECT * FROM v_news WHERE id=? ',[id]);
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
export async function newsPageData({ps,pi,daoid})
{
    let re= await getPageData('news',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}
