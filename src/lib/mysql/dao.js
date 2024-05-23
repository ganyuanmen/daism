import { getData,execute } from './common';

 //获取我的资源
 export async function getSource({did})
 {
     let re= await getData('SELECT * FROM a_source WHERE account=? ORDER BY id DESC',[did]);
     return re || []
 }

//撤回资源
export async function delSource({id})
{
    return await execute('delete from a_source where id=?',[id]);
}

//获取资源
export async function getOneSource(id)
{
    let re= await getData('SELECT * FROM a_source WHERE id=? ',[id]);
    return re?re:[];
}

