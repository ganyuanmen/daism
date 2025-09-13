
const Server = require('./src/server');
const globalSubscriptionManager = require('./src/subscription-manager'); // 单独引入
const schedule =require("node-schedule");
const mysql = require('mysql2/promise'); 
const dotenv=require('dotenv');
const crypto = require('node:crypto');

dotenv.config();

let start_block=21232473n  //Start listening for block numbers
if(process.env.BLOCKCHAIN_NETWORK!='mainnet') start_block=0n
var monitor = 0; //Restart every 10 minutes 
var server1=new Server();
var maxData = []; // Record the maximum block number that has been listened to

const promisePool = mysql.createPool({
   host: process.env.MYSQL_HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DATABASE,
   port: process.env.MYSQL_PORT,
   waitForConnections: true,
   connectionLimit: 1,  // 这个值根据实际情况调整
   queueLimit: 0,       // 通常设置为0，让队列无限增长，但需要监控连接池状态
   enableKeepAlive: true,
   keepAliveInitialDelay: 0
 });

 promisePool.on('error', (err) => {
   console.error('Database connection error:', err);
 });

async function daoListenStart() {
   monitor = 0;
   await server1.restart();
   daoListen();
}

if (server1.web3 && server1.web3.currentProvider && server1.web3.currentProvider.on) {
   // server1.web3.currentProvider.on('close', async (code, reason) => {
   //   console.warn(`[WebSocket] disconnected. code=${code}, reason=${reason}`);
   //   console.log('[Server] Attempting automatic restart...');
   //   try {
   //     await server1.restart();
   //     console.log('[Server] Automatic restart successful');
   //   } catch (err) {
   //     console.error('[Server] Automatic restart failed:', err.message);
   //   }
   // });

   server1.web3.currentProvider.on('error', async (err) => {
     console.error('[WebSocket] error:', err.message);
     console.log('[Server] Attempting automatic restart due to WS error...');
     try {
       await server1.restart();
       console.log('[Server] Automatic restart successful');
     } catch (err) {
       console.error('[Server] Automatic restart failed:', err.message);
     }
   });
 }

async function hand() {
    //Obtain the maximum block number that needs to be monitored from the database
   let sql = 'SELECT IFNULL(MAX(block_num),0)+1 s FROM t_dao'  //0 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_createversion'  //1 dapp 地址改变
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_changelogo' //2 logo 修改
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_token'  //3 发布代币 默认都 发布
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_u2t'  //4
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_t2u'  //5
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_e2t'  //6
        + ' union all SELECT IFNULL(MAX(block_num),0)+1 FROM t_eth_utoken' //7
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_proexcu'  //8 执行提案
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_pro'  //9 提案
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_provote'  //10 提案投票
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_t2t'  //11
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft_mint'  //12  mint smart common
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_getdaoutoken'  //13 分红
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_daoaccount'  //14 dao 成员
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_domain'  //15 activitypub dao 帐号  
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft'  //16 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_domainsing'  //17 activitypub 个人帐号
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft_swaphonor'  //18 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft'  //19 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft_transfer'  //20 发布时mint nft
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_updatedaocreator'  //21 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft_swap'  //22 打赏 mint nft
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_donate'  //23 捐赠
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0)+1 FROM t_nft_tip';  //24 enki打赏 
        
   const rows=await promisePool.query(sql,[]);
   rows[0].forEach(element => {maxData.push(element.s>start_block?element.s:start_block)});
   console.info(maxData)
   
   await server1.start();
   daoListen();
   //1分钟循环执行
   schedule.scheduleJob("*/5 * * * * *",async() => {
      // console.log("monitor:",monitor,server1.daoapi.eventQueue.length)
      server1.daoapi.processQueue();
      if (monitor > 60*12 && server1.daoapi.eventQueue.length===0 && !server1.daoapi.isProcessing) daoListenStart();
      monitor++;  
   });  
}


// 监听所有事件，带延迟执行
async function daoListen() {
   p("start...........")
   // console.log('开始监听DAO事件，带延迟执行...');
   
   // 先取消所有现有订阅
   await globalSubscriptionManager.unsubscribeAll();
   
   // 等待一段时间确保订阅完全取消
   await new Promise(resolve => setTimeout(resolve, 2000));
 
   // 使用数组定义所有订阅方法和参数
   const subscribeMethods = [
     { method: daoCreate, name: 'daoCreate', delay: true },
     { method: domainsing, name: 'domainsing', delay: true },
     { method: domain, name: 'domain', delay: true },
     { method: DonationReceived, name: 'DonationReceived', delay: true },
     { method: addProEvent, name: 'addProEvent', delay: true },
     { method: voteEvent, name: 'voteEvent', delay: true },
     { method: execEvent, name: 'execEvent', delay: true },
     { method: changeLogo, name: 'changeLogo', delay: true },
     { method: mintEvent, name: 'mintEvent', delay: true },
     { method: mintTipEvent, name: 'mintTipEvent', delay: true },
     { method: mintSmartCommon, name: 'mintSmartCommon', delay: true },
     { method: updateSCEvent, name: 'updateSCEvent', delay: true },
     { method: addCreatorCEvent, name: 'addCreatorCEvent', delay: true },
     { method: accountDividendRight, name: 'accountDividendRight', delay: true },
     { method: publishTolen, name: 'publishTolen', delay: true },
     { method: getDividendEvent, name: 'getDividendEvent', delay: true },
     { method: eth2utoken, name: 'eth2utoken', delay: true },

     
     
   ];
 
   // 顺序执行带延迟
   for (let i = 0; i < subscribeMethods.length; i++) {
     const { method, name, delay } = subscribeMethods[i];
     
     try {

       method(); // 执行订阅方法
       
       // 如果不是最后一个方法，添加延迟
       if (delay && i < subscribeMethods.length - 1) {
         const delayMs = Math.floor(Math.random() * 2000) + 1000; // 1-3秒随机延迟
       
         await new Promise(resolve => setTimeout(resolve, delayMs));
       }
       
     } catch (error) {
       console.error(`执行订阅 ${name} 时出错:`, error);
       // 出错时也等待一段时间再继续
       const errorDelay = 2000; // 错误时等待2秒
       console.log(`发生错误，等待 ${errorDelay}ms 后继续...`);
       await new Promise(resolve => setTimeout(resolve, errorDelay));
     }
   }
   
   globalSubscriptionManager.isListening = true;
   // console.log('所有订阅监听已启动完成');
   
   return globalSubscriptionManager.getStatus();
 }

// //监听
// function daoListen() {
//    p('begin listent...')
//    // addLogoEvent()  
//    // SatoshiUTOFund()
 
//   daoCreate() //创建dao事件处理
//   domainsing()  //个人社区帐号建立
//   domain()  //smart common 注册社区帐号
//   DonationReceived(); //捐赠
// //   ERC20Withdraw(); //erc 捐赠

// // setTimeout(() => {
//    addProEvent();
// // }, 10000);
// // setTimeout(() => {
//    voteEvent() //投票
//    execEvent()  //执行
//    changeLogo() //chanelogo 修改 dao logo 事件
 
//    //荣誉通证
//  // 关闭市场  nfttransfer() // 发布mint nft  UnitNFT  t_nft_transfer  0 
//  //  关闭市场 nftsing()  //打赏 mint nft  Daismnftsing  t_nft_swap 2 
//    mintEvent();  //手工mint 其它脚本mint  DaismNft   t_nft  1  
//    mintTipEvent(); //个人打赏 Daismnftsing  t_nft_tip 5
//  // 关闭市场  mintBurnEvent()  //Daismnftsing  t_nft_swaphonor 4
//    mintSmartCommon(); //mint smart common  Daismnftsing  t_nft_mint  3
 
  
//    // setLogo()   //setlogo 创建dao logo 事件
//    updateSCEvent() //修改dapp 地址 不经提案，直接修改
//    addCreatorCEvent() // 增加dapp 地址对应 版本号
//  //   getDividendEvent() //提取分红
//    accountDividendRight()  //增加成员
 
//    publishTolen()  // dao发
// // }, 16000);

//   // //以下的监听需要dao条件下才能处理，所以延迟监听
// //   setTimeout(() => listen_attach(), 10000);     //5
//   //延迟监听兑换，需要处理前期事件
// //   setTimeout(() => listen_swap(),16000);  //8
//   // updateVersion()  //升级
//   // transfer()  // 转帐
  
// //   addProEvent()   //addProEvent 创建提案事件
// //   voteEvent() //投票
// //   execEvent()  //执行

// //   changeLogo() //chanelogo 修改 dao logo 事件

// //   //荣誉通证
// // // 关闭市场  nfttransfer() // 发布mint nft  UnitNFT  t_nft_transfer  0 
// // //  关闭市场 nftsing()  //打赏 mint nft  Daismnftsing  t_nft_swap 2 
// //   mintEvent();  //手工mint 其它脚本mint  DaismNft   t_nft  1  
// //   mintTipEvent(); //个人打赏 Daismnftsing  t_nft_tip 5
// // // 关闭市场  mintBurnEvent()  //Daismnftsing  t_nft_swaphonor 4
// //   mintSmartCommon(); //mint smart common  Daismnftsing  t_nft_mint  3

 
// //   // setLogo()   //setlogo 创建dao logo 事件
// //   updateSCEvent() //修改dapp 地址 不经提案，直接修改
// //   addCreatorCEvent() // 增加dapp 地址对应 版本号
// // //   getDividendEvent() //提取分红
// //   accountDividendRight()  //增加成员

// //   publishTolen()  // dao发布token事件
// }

// function listen_swap()
// {
//    domain()  //smart common 注册社区帐号

//    changeLogo() //chanelogo 修改 dao logo 事件
//    execEvent()  //提案执行
//    // 关闭市场eth2token() //eth to token eth 兑换 token
//    // 关闭市场eth2tokenex()
//    // 关闭市场token2token() //t2t token 兑换 token 
//    // 关闭市场token2tokenex() 
 
//    // 关闭市场utoken2token()  //u2t utoken 兑换 token 事件
//    // 关闭市场utoken2tokenex()
//    // 关闭市场token2utoken()  //t2u token 兑换 utoken 事件
//    // 关闭市场token2utokenex()
 
//    // 关闭市场eth2utoken() //eth to utoken eth 兑换 utoken
//    // addProEvent()   //addProEvent 创建提案事件
//    // voteEvent()
// }

// function listen_attach()
// {
//    voteEvent()
//    // setLogo()   //setlogo 创建dao logo 事件
//    updateSCEvent()
//    addCreatorCEvent()
//    getDividendEvent() //提取分红
//    accountDividendRight()  //增加成员
// }

// 开始监听
hand();

// function SatoshiUTOFund()
// {
//    server1.daoapi.SatoshiUTOFund.addRuleEvent(0, undefined);
//    // server1.daoapi.SatoshiUTOFund.deleteRuleEvent(0, undefined);
//    // server1.daoapi.SatoshiUTOFund.useRuleEvent(0, undefined);
//    // server1.daoapi.SatoshiUTOFund.approveEvent(0, undefined);
// }

//统计个人当前的token 值
async function token_cost(id, address) {
   let e=await server1.daoapi.DaoToken.balanceOf(id, address)
   let sql = "CALL excuteToken(?,?,?)";
   let params = [id, address, e];
   await executeSql(sql, params);
}

  //mysql 处理
async function executeSql(addSql, addSqlParams) {
   if(process.env.IS_DEBUGGER==='1') console.info(addSql,addSqlParams.join(','))
   await promisePool.execute(addSql,addSqlParams)
}

//屏幕打印
function p(str) {
  let myDate = new Date();
  console.info(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + "-->" + str)
}
//----------------------------------------------------------------------------
function domain()
{
  server1.daoapi.Domain.RecordEvent(maxData[15], (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="INSERT IGNORE INTO t_domain(dao_id,block_num,domain,pubkey,privkey,_time) VALUES(?,?,?,?,?,?)";
      crypto.generateKeyPair('rsa', {
         modulusLength: 512,
         publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
         },
         privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
         }
      }, 
      async (err, publicKey, privateKey) => {
         let params = [data['daoId'],obj.blockNumber,data['domain'].toLowerCase(),publicKey,privateKey,data['timestamp']];
         maxData[15] = obj.blockNumber+1n;  //Cache last block number
         await executeSql(sql, params); 
     });
   });
}

function domainsing()
{
  server1.daoapi.Domain.recordInfoEvent(maxData[17], (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="insert IGNORE into t_domainsing(block_num,addr,domain,nick_name,pubkey,privkey,_time) values(?,?,?,?,?,?,?)";
      crypto.generateKeyPair('rsa', {
         modulusLength: 512,
         publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
         },
         privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
         }
      }, 
      async (err, publicKey, privateKey) => {
            let params = [obj.blockNumber,data['addr'],data['domain'].toLowerCase(),data['name'],publicKey,privateKey,data['timestamp']];
            maxData[17] = obj.blockNumber+1n;  //Cache last block number
            await executeSql(sql, params); 
      });     
   });
}

function mintEvent()
{
  server1.daoapi.DaismNft.mintEvent(maxData[16], async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let tokenSvg=await server1.daoapi.DaismNft.getNFT(data['tokenId'])
      let _tips;
      if(tokenSvg[1].length===6 && tokenSvg[1][5]==='events: Donation in support of Proof of Love')
      {
         let _uto=tokenSvg[1][4].split(':');
         let _eth=tokenSvg[1][3].split(':');
         _tips=`Donation in support of Proof of Love(${parseFloat(server1.web3.utils.fromWei(_eth[1],'ether')).toFixed(4)}ETH => ${parseFloat(_uto[1])/100000000}UTO)`;


      }else _tips=tokenSvg[1].join(',');

      let sql ="INSERT IGNORE INTO t_nft(block_num,dao_id,token_id,token_to,tokensvg,_time,contract_address,tips) VALUES(?,?,?,?,?,?,?,?)";
      let params = [obj.blockNumber,data['daoId'],data['tokenId'],data['to'],tokenSvg[0][1],data['timestamp'], server1.daoapi.DaismNft.address,_tips];
      maxData[16] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); //dao 信息
   });
}


function mintTipEvent()
{
  
    server1.daoapi.Daismnftsing.mintTipEvent(maxData[24], async (obj) => {
         if(process.env.IS_DEBUGGER==='1') console.info(obj)
         const {data}=obj;
         let svg='';
         if(data['tokenId']>0){
            const tokenSvg=await server1.daoapi.DaoLogo.getLogo(data['daoId']);
             svg=tokenSvg?.fileContent ?? '';
         }
       
         const [daoid,id]=data['id'].split(',');

         let sql ="INSERT IGNORE INTO t_nft_tip(block_num,dao_id,token_id,token_to,tokensvg,_time,contract_address,utoken,tip_to,message_id) VALUES(?,?,?,?,?,?,?,?,?,?)";
         let params = [obj.blockNumber,daoid,data['tokenId'],data['to'],svg,data['timestamp'], server1.daoapi.Daismnftsing.address
         ,data['utokenAmount'],data['tipto'],id];

         maxData[24] = obj.blockNumber+1n;  //Cache last block number
         await executeSql(sql, params); //dao 信息
     });  
   
   
}




function mintBurnEvent()
{
  server1.daoapi.Daismnftsing.mintBurnEvent(maxData[18], async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      if(parseInt(data['tokenId'])===0) return;
      let tokenSvg=await server1.daoapi.Daismnftsing.getNFT(data['tokenId'])
      let sql ="INSERT IGNORE INTO t_nft_swaphonor(block_num,dao_id,token_id,token_to,tokensvg,_time,contract_address,tips) VALUES(?,?,?,?,?,?,?,?)";
      let params = [obj.blockNumber,data['daoId'],data['tokenId'],data['to'],tokenSvg[0][1],data['timestamp'], server1.daoapi.Daismnftsing.address,`ETH Forging(${data["ethBurn"]}ETH)`];
      maxData[18] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); //dao 信息
   });
}

function nftsing()
{
 server1.daoapi.Daismnftsing.mintEvent(maxData[22], async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      // let tokenSvg=['','']
     let tokenSvg=await server1.daoapi.DaoLogo.getLogo(data['daoId'])
      let sql ="INSERT IGNORE INTO t_nft_swap(block_num,dao_id,token_id,token_to,tokensvg,_time,contract_address,utoken) VALUES(?,?,?,?,?,?,?,?)";
      let params = [obj.blockNumber,data['daoId'],data['tokenId'],data['to'],tokenSvg[1],data['timestamp'], server1.daoapi.Daismnftsing.address,data['utokenAmount']];
      maxData[22] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); //dao 信息
  });  
}

function daoCreate()
{
  server1.daoapi.DaoRegistrar.daoCreateEvent0(maxData[0],async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="INSERT IGNORE INTO t_dao(sctype,dao_id,block_num,dao_name,dao_symbol,dao_desc,dao_manager,dao_time,dao_exec,creator,delegator,strategy,lifetime,cool_time,dao_logo,dapp_owner) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      let params = [data['sctype'],data['daoId'],obj.blockNumber,data['name'],data['symbol'],data['describe'],data['manager']
      ,data['time'],data['address'],data['creator'],data['delegator'],data['strategy'],data['lifetime'],data['cool_time'],data['src'],data['dapp_owner']];
      maxData[0] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); //dao 信息
      // for(let i=0;i<data["members"].length;i++){
      //    await executeSql("call i_daodetail(?,?,?,?)",[data['dividendRights'][i],data['members'][i],data['delegator'],data['daoId']]);
      // }
   });


   server1.daoapi.DaoRegistrar.daoCreateEvent(maxData[0],async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="INSERT IGNORE INTO t_dao(sctype,dao_id,block_num,dao_name,dao_symbol,dao_desc,dao_manager,dao_time,dao_exec,creator,delegator,strategy,lifetime,cool_time,dao_logo,dapp_owner) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      let params = [data['sctype'],data['daoId'],obj.blockNumber,data['name'],data['symbol'],data['describe'],data['manager']
      ,data['time'],data['address'],data['creator'],data['delegator'],data['strategy'],data['lifetime'],data['cool_time'],data['src'],data['dapp_owner']];
      maxData[0] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); //dao 信息
      for(let i=0;i<data["members"].length;i++){
         await executeSql("call i_daodetail(?,?,?,?)",[data['dividendRights'][i],data['members'][i],data['delegator'],data['daoId']]);
      }
   });
}

function publishTolen()
{
   server1.daoapi.DaoToken.publishTokenEvent(maxData[3], async obj => {
      const {data}=obj
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      let sql = "call i_token(?,?,?,?)";
      let params = [data['daoId'],data['tokenId'],obj.blockNumber, data['timestamp']];
      maxData[23] = obj.blockNumber+1n ; //Cache last block number
      await executeSql(sql, params);
   })
}


function DonationReceived()
{
   server1.daoapi.Donate.DonationReceived(maxData[23], async obj => {
      const {data}=obj
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      let sql = "INSERT INTO t_donate(block_num,donor_address,donationAmount,uTokenAmount,totalDonationETH,donationTime,tokenid) VALUES(?,?,?,?,?,?,?)";
      let params = [obj.blockNumber,data['donor'],data['donationAmount'],data['uTokenAmount'],data['totalDonationETH'], data['donationTime'], data['tokenId']];
      maxData[23] = obj.blockNumber+1n ; //Cache last block number
      await executeSql(sql, params);
     
   })
}


// function ERC20Withdraw()
// {
//    server1.daoapi.Donate.ERC20Withdraw(maxData[24], async obj => {
//       const {data}=obj
//       if(process.env.IS_DEBUGGER==='1') console.info(obj);
//       let sql = "INSERT INTO t_donateerc20(block_num,from_address,to_address,amount) VALUES(?,?,?,?)";
//       let params = [obj.blockNumber,data['token'],data['to'],data['amount']];
//       maxData[24] = obj.blockNumber+1n ; //Cache last block number
//       await executeSql(sql, params);
     
//    })
// }



async function geneU2t(obj)
{
   if(process.env.IS_DEBUGGER==='1') console.info(obj);
   const {data}=obj
   let sql = "call i_u2t(?,?,?,?,?,?,?,?,?,?,?)";
   let cost = await server1.daoapi.IADD.getPool(data.tokenId); // 流动池中 dao 的当前币值（utoken）
   let params = [obj.blockNumber, data['tokenId'], cost, data['from'], data['to'], data['utoken'], data['token'], data['swap_time'],obj.transactionHash,data['gas'],data['tipAmount']];
   maxData[4] = obj.blockNumber+1n; //Cache last block number
   await executeSql(sql, params);
   await token_cost(data.tokenId, data.to); //统计个人当前的token 值
}

function utoken2token(){
   server1.daoapi.IADD.utokenTotokenEvent(maxData[4], async obj => {await geneU2t(obj)})
}

function utoken2tokenex(){
   server1.daoapi.IADD_EX.utokenTotokenEvent(maxData[4], async obj => {await geneU2t(obj)})
}

async function geneT2U(obj)
{
   if(process.env.IS_DEBUGGER==='1') console.info(obj);
   const {data}=obj
   let sql = "call i_t2u(?,?,?,?,?,?,?,?,?,?,?)";
   let cost = await server1.daoapi.IADD.getPool(data.tokenId);// 流动池中 dao 的当前币值（utoken）
   let params = [obj.blockNumber, data['tokenId'], cost, data['from'], data['to'], data['utoken'], data['token'], data['swap_time'],obj.transactionHash,data['gas'],data['tipAmount']];
   maxData[5] = obj.blockNumber+1n; //Cache last block number
   await executeSql(sql, params);
   await token_cost(data.tokenId, data.from);  //统计个人当前的token 值
}

function token2utoken(){
   server1.daoapi.IADD.tokenToUtokenEvent(maxData[5], async obj => { await geneT2U(obj)})
}

function token2utokenex(){
   server1.daoapi.IADD_EX.tokenToUtokenEvent(maxData[5], async obj => { await geneT2U(obj)})
}

async function geneT2t(obj)
{
   const {data}=obj
   let sql = "call i_t2t(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
   let cost1 = await server1.daoapi.IADD.getPool(data.fromTokenId); // 流动池中 dao 的当前币值（utoken）
   let cost2 = await server1.daoapi.IADD.getPool(data.toTokenId);// 流动池中 dao 的当前币值（utoken）
   let params = [obj.blockNumber, data.fromTokenId, data.toTokenId, cost1, cost2, data.from, data.to, data.fromToken, data.toToken, data.swap_time,obj.transactionHash,data.gas,data.tipAmount,data.sc_id];
   maxData[11] = obj.blockNumber+1n; //Cache last block number
   await executeSql(sql, params);
   await token_cost(data.toTokenId, data.to); //统计个人当前的token 值
   await token_cost(data.fromTokenId, data.from); //统计个人当前的token 值
}

function token2token()
{
   server1.daoapi.IADD.tokenTotokenEvent(maxData[11], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      await geneT2t(obj)
   })
}

function token2tokenex()
{
   server1.daoapi.IADD_EX.tokenTotokenEvent(maxData[11], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      await geneT2t(obj)
   })
}

async function geneE2t(obj)
{
   if(process.env.IS_DEBUGGER==='1') console.info(obj);
   const {data}=obj
   let sql = "INSERT IGNORE INTO t_e2t (block_num,from_address,to_address,in_amount,out_amount,swap_time,tran_hash,token_id,utoken_cost,swap_gas,tipAmount) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
   let cost = await server1.daoapi.IADD.getPool(data.tokenId); // 流动池中 dao 的当前币值（utoken）
   let params = [obj.blockNumber, data['from'],  data['to'], data['input_amount'],data['output_amount'],data['swap_time'],obj.transactionHash,data.tokenId,cost,data['gas'],data['tipAmount']];
   maxData[6] = obj.blockNumber+1n; //Cache last block number
   await executeSql(sql, params);
   await token_cost(data.tokenId, data.from); //统计个人当前的token 值
}

function eth2token(){
   server1.daoapi.IADD.ETHToDaoToken(maxData[6],async obj => {await geneE2t(obj)})
}

function eth2tokenex(){
   server1.daoapi.IADD_EX.ETHToDaoToken(maxData[6],async obj => {await geneE2t(obj)})
}

function eth2utoken()
{
   server1.daoapi.UnitToken.swapEvent(maxData[7], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let sql = "call i_swap(?,?,?,?,?,?,?)";
      let params = [obj.blockNumber, data['address'], data['timestamp'], data['ethAmount'], data['utokenAmount'],obj.transactionHash,0];
      maxData[7] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
   })
}

function changeLogo()
{
   server1.daoapi.DaoLogo.changeLogoEvent(maxData[2], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql = "call i_changelogo(?,?,?,?,?)";
      let params = [data['daoId'], obj.blockNumber, data['_time'],data['logo_id'],data['src']];
      maxData[2] = obj.blockNumber+1n ;//Cache last block number
      await executeSql(sql, params);
   })
}

function mintSmartCommon()  // mint smart common
{
   server1.daoapi.Daismnftsing.mintBatchEvent(maxData[12], async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let tokenSvg=await server1.daoapi.DaoLogo.getLogo(data['daoId'])
      let sql ="INSERT IGNORE INTO t_nft_mint(block_num,dao_id,token_id,token_to,tokensvg,_time,contract_address) VALUES(?,?,?,?,?,?,?)";
      let params ;
      data['to'].forEach((account,idx)=>{
         data['tokenIds'][idx].forEach(async token=>{
            params = [obj.blockNumber,data['daoId'],token,account,tokenSvg[1],data['timestamp'], server1.daoapi.Daismnftsing.address];
            await executeSql(sql, params); //dao 信息
         })
      })
      maxData[12] = obj.blockNumber+1n;  //Cache last block number 
   });
   
}

function updateSCEvent()
{
   server1.daoapi.DaoRegistrar.updateSCEvent(maxData[21],async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="INSERT IGNORE INTO t_updatedaocreator(block_num,dao_id,creator,_time) VALUES(?,?,?,?) ";
      let params = [obj.blockNumber,data['daoId'],data['newCreator'],data['timestamp']];
      maxData[21] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); 
   });
}

function addCreatorCEvent()
{
   server1.daoapi.DaoRegistrar.addCreatorCEvent(maxData[1], async (obj) => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj)
      const {data}=obj
      let sql ="INSERT IGNORE INTO t_createversion(block_num,dao_id,creator,dao_version,_time) VALUES(?,?,?,?,?) ";
      let params = [obj.blockNumber,data['daoId'],data['newCreator'],data['SC_Version'],data['timestamp']];
      maxData[1] = obj.blockNumber+1n;  //Cache last block number
      await executeSql(sql, params); 
   });
}

function addProEvent()
{
   server1.daoapi.EventSum.addProposal(maxData[9], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let imgstr=''
      if(data['dividendRights']==1){
         let b=data.account.slice(-10)
         imgstr=await server1.daoapi.DaoLogo.getLogoByConfigID(parseInt(b,16))
      }
      let sql = "call i_pro(?,?,?,?,?,?,?,?,?)";
      let params = [obj.blockNumber, data['delegator'],data['creator'],data['account'],data['dividendRights']
      ,data['_time'],data['dao_desc'],imgstr && imgstr.fileContent?imgstr.fileContent:'',,data['proposalType']]; //_time 是block 操作时间戳=createTime
      maxData[9] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
   })
}

function voteEvent()
{
   server1.daoapi.EventSum.voteEvent(maxData[10],async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      // let sql = "INSERT INTO t_provote(block_num,delegator,createTime,creator,antirights,rights,_time,proposalType) VALUES(?,?,?,?,?,?,?,?)";
      // let params = [obj.blockNumber, data['delegator'],data['createTime'],data['creator'],data['antirights'],data['rights'],data['_time'],data['proposalType']];
      // maxData[10] = obj.blockNumber+1n; //Cache last block number
      // await executeSql(sql, params);
      //p_nump BIGINT,p_delegator CHAR(42), p_createTime INT,p_creator CHAR(42),p_rights INT,p_antirights INT,p_time INT,p_type
      maxData[10] = obj.blockNumber+1n; //Cache last block number
      await executeSql("call calc_pro(?,?,?,?,?,?,?,?)",[obj.blockNumber,data['delegator'],data['createTime'],data['creator'],data['rights'],data['antirights'],data['_time'],data['proposalType']]); //处理是结束
      // let contract= new server1.web3.eth.Contract(daoabi, data['delegator'], { from: server1.account });
      // let res=await contract.methods.proposal().call({ from: server1.account })
      // console.log(res)
      // if(parseInt(res.createTime)===0) //Completed
      // {
      //    const isEnd=parseInt(res.rights)>parseInt(res.antirights)?1:2; //反对票大于赞成票，不通过,为2
      //    await executeSql('update t_pro set is_end=?,rights=?,antirights=? where delegator=? and createTime=?',[isEnd,res.rights,res.antirights,data['delegator'],data['createTime']])
      // }
      // else
      //    await executeSql('update t_pro set rights=?,antirights=? where delegator=? and createTime=?',[res.rights,res.antirights,data['delegator'],data['createTime']]);
   })
}

function execEvent()
{
   server1.daoapi.EventSum.execEvent(maxData[8], async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let sql = "INSERT IGNORE INTO t_proexcu(block_num,delegator,account,dividendRights,_time,proposalType) VALUES(?,?,?,?,?,?)";
      let params = [obj.blockNumber, data['delegator'],data['account'],data['dividendRights'],data['_time'],data['proposalType']];
      maxData[8] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
      const flag=parseInt(data['proposalType']);
      //1 修改logo , 不在这处理 
      // if(flag===2 || flag===3|| flag===4 || data['account']==='0x0000000000000000000000000000000000000000')  
      if(flag===2 || flag===3|| flag===4 || flag===0) {
         let rows=await promisePool.query("select dao_id from t_dao where delegator=?",[data['delegator']]);
         if(rows.length && rows[0].length) {
            const dao_id=rows[0][0].dao_id;
            let res= await  server1.daoapi.GetInfos.getDaoInfo(dao_id);
            if(flag===0)
               await promisePool.execute('update t_dao set strategy=? where dao_id=?',[res[3],dao_id]).catch(err=>{console.error('[update t_dao strategy ERROR] - ', err.message)});
            else if(flag===2){ //修改描述
               await promisePool.execute('update t_dao set dao_desc=? where dao_id=?',[res[0]['desc'],dao_id]).catch(err=>{console.error('[update t_dao dao_desc ERROR] - ', err.message)});
               await promisePool.execute('update a_account set actor_desc=? where dao_id=?',[res[0]['desc'],dao_id]).catch(err=>{console.error('[update a_account ERROR] - ', err.message)});
            }
            else if(flag===3 ) //修改管理员
               await promisePool.execute('update t_dao set dao_manager=? where dao_id=?',[res[0]['manager'],dao_id]).catch(err=>{console.error('[update t_dao manager ERROR] - ', err.message)});
            else if(flag===4 ) //修改智能公器类型
               await promisePool.execute('update t_dao set sctype=? where dao_id=?',[res[0]['SCType'],dao_id]).catch(err=>{console.error('[update t_dao SCType ERROR] - ', err.message)});

         }       
      }
   })
}

function getDividendEvent()
{
   server1.daoapi.EventSum.getDividendEvent(maxData[13],async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let sql = "INSERT IGNORE INTO t_getdaoutoken(block_num,delegator,account,utoken_amount,_time,dao_owner,pre_time) VALUES(?,?,?,?,?,?,?)";
      let params = [obj.blockNumber, data['delegator'],data['account'],data['utoken_amount'],data['_time'],data['dao_owner'],data['pre_time']];
      maxData[13] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
   })
}

function accountDividendRight()
{
   server1.daoapi.EventSum.accountDividendRight(maxData[14],async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let sql = "call i_daoaccount(?,?,?,?)";
      let params = [obj.blockNumber, data['delegator'],data['account'],data['dividendRights']];
      maxData[14] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
     
   })
}

function nfttransfer()
{
   server1.daoapi.UnitNFT.transfer(maxData[20],async obj => {
      if(process.env.IS_DEBUGGER==='1') console.info(obj);
      const {data}=obj
      let tokenSvg=await server1.daoapi.UnitNFT.getTokenImageSvg(data['tokenId'])
      let sql = "INSERT IGNORE INTO t_nft_transfer(block_num,token_id,token_to,tokensvg,_time,contract_address) VALUES(?,?,?,?,?,?)";
      let params = [obj.blockNumber, data['tokenId'],data['to'],tokenSvg,data['timestamp'],server1.daoapi.UnitNFT.address];
      maxData[20] = obj.blockNumber+1n; //Cache last block number
      await executeSql(sql, params);
   })
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
 