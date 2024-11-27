// 导入模块
const mysql = require('mysql2');
const fs = require("fs");

var promisePool

function getConnect() {
  if(promisePool) return promisePool
  else return createConnection()
}

function createConnection() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port:process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  promisePool = pool.promise();

  return promisePool

}

//mysql 处理
export async function execute(sql, sqlParams) {
  const promisePool=getConnect()
  if(process.env.IS_DEBUGGER==='1')  console.info(`execute: ${sql}-->`+sqlParams.join())
  try {
    const result = await promisePool.execute(sql,sqlParams)
    return result
  } catch (error) {
    console.info(`execute: ${sql}-->`+sqlParams.join())
    console.error(error)
    return 0
  }
}


//mysql 返回自增ID
export async function executeID(sql, sqlParams) {
  const promisePool=getConnect()
  if(process.env.IS_DEBUGGER==='1')  console.info(`executeID: ${sql}-->`+sqlParams.join())
  try {
    const result = await promisePool.execute(sql,sqlParams)
    return result[0].insertId
  } catch (error) {
    console.error(error)
    return 0
  }
}

//取mysql数据object_false 只取对象，非数组
export async function getJsonArray(cid, sqlParams,object_false)
{
  const promisePool=getConnect()

  const [rows,] = await promisePool.query("select sqls from aux_tree where id=?",[cid]);
  let sql=rows[0].sqls;

  if(process.env.IS_DEBUGGER==='1')  console.info(`${cid}--> getJsonArray: ${sql}-->`+sqlParams.join())
  try {
    const [rows,fields] = await promisePool.query(sql,sqlParams);
    if(rows && rows.length)
    {
      let ar=[]
      rows.forEach(row=>{
        let json={}
        fields.forEach(field=>{
          json[field.name]=row[field.name]
        })
        ar.push(json)
      })
      return  object_false?ar[0]:ar
    }
    return object_false?{}:[]
  } catch (error) {
    console.error(error)
    return  object_false?{}:[]
  }
}


//取mysql数据
export async function getData(sql, sqlParams,is_object=false)
{
  const promisePool=getConnect()
  if(process.env.IS_DEBUGGER==='1')  console.info(`getData: ${sql}-->`+sqlParams.join())
  try {
    const [rows,] = await promisePool.query(sql,sqlParams);
    return is_object?rows[0]:rows
  } catch (error) {
    console.error(error)
    return is_object?{}:[]
  }
  
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
 export async function getPageData(tid,ps,pi,s,a,w)
 {
  if(process.env.IS_DEBUGGER==='1')  console.info(`getPageData: -->`+[tid,ps,pi,s,a,w].join())
  let re= await getData('call get_page(?,?,?,?,?,?)',[tid,ps,pi,s,a,w]);
  return {
    rows:re[0],
    total:re[1][0]['mcount'],
    pages:Math.ceil(re[1][0]['mcount']/ps)
  }
 }


