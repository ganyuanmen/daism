const mysql = require('mysql2/promise'); 
let promisePool; 

async function createConnection() {
  if (promisePool) { // 检查是否已经创建了连接池
    return promisePool;
  }

  promisePool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 20,  // 这个值根据实际情况调整
    queueLimit: 0,       // 通常设置为0，让队列无限增长，但需要监控连接池状态
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  promisePool.on('error', (err) => {
    console.error('Database connection error:', err);
  });

  return promisePool;
}

export async function getData(sql, sqlParams, is_object = false) {
  const pool = await createConnection(); // 只调用一次 createConnection
  if (process.env.IS_DEBUGGER === '1') console.info(`getData: ${sql}-->` + sqlParams.join());

  try {
    const [rows, ] = await pool.query(sql, sqlParams);
    return is_object ? (rows.length?rows[0]:{}) : rows;
  } catch (error) {
    console.info(`error for getData: ${sql}-->` + sqlParams.join());
    console.error('Database query error:', error); 
    return is_object ? {} : [];
  }
}

//mysql 处理
export async function execute(sql, sqlParams) {
  const pool = await createConnection(); // 只调用一次 createConnection
  if(process.env.IS_DEBUGGER==='1')  console.info(`execute: ${sql}-->`+sqlParams.join())
  try {
    const result = await pool.execute(sql,sqlParams)
    return result
  } catch (error) {
    console.info(`error for execute: ${sql}-->`+sqlParams.join())
    console.error(error)
    return 0
  }
}

//mysql 返回自增ID
export async function executeID(sql, sqlParams) {
  const pool = await createConnection(); // 只调用一次 createConnection
  if(process.env.IS_DEBUGGER==='1')  console.info(`executeID: ${sql}-->`+sqlParams.join())
  try {
    const result = await pool.execute(sql,sqlParams)
    return result[0].insertId
  } catch (error) {
    console.info(`error for executeID: ${sql}-->`+sqlParams.join())
    console.error(error)
    return 0
  }
}

//取mysql数据object_false 只取对象，非数组
export async function getJsonArray(cid, sqlParams,object_false)
{
  const pool = await createConnection(); // 只调用一次 createConnection
  const [rows,] = await pool.query("select sqls from aux_tree where id=?",[cid]);
  let sql=rows[0].sqls;

  // if(process.env.IS_DEBUGGER==='1')  console.info(`${cid}--> getJsonArray: ${sql}-->`+sqlParams.join())
  try {
    const [rows,fields] = await pool.query(sql,sqlParams);
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
    console.info(` error for ${cid}--> getJsonArray: ${sql}-->`+sqlParams.join())
    console.error(error)
    return  object_false?{}:[]
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



async function gracefulShutdown() {
  console.info('Shutting down gracefully...');
  if (promisePool) {
    await promisePool.end();
    console.info('Database connection pool closed.');
  }
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown); // Handle Ctrl+C
process.on('SIGTERM', gracefulShutdown); // Handle kill command
