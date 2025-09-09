import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

import scAbi from './src/abi/SCRegistrar_abi.json' with { type: 'json' };
import infoAbi from './src/abi/GetInfos_abi.json' with { type: 'json' };
import logoAbi from './src/abi/SCLogo_abi.json' with { type: 'json' };
import f_abi from './src/abi/ForSCRegister_abi.json' with { type: 'json' };

import { Web3 } from 'web3';

dotenv.config();

const scAddress = "0x9B98114Aa6B6f9978c517b5f350fA42171Cc59b2";
const infoAddress = "0xA34C804d375472701Ea0ee9a2269d5E39447F82a";
const logoAddress = "0xA8e1bb0FC7D7A3d7b14EC18BC36B4B66FFB1Eaa5";
const maxData = [];
const account = "0x90659d3eE9C954F4f540E9c21610abbeE920bB81"

let start_block = 21232473n  //Start listening for block numbers
if (process.env.BLOCKCHAIN_NETWORK != 'mainnet') start_block = 0n

// 事件队列和互斥锁
const eventQueue = [];
let queueLock = false; // 简单的互斥锁
const PROCESSING_INTERVAL = 2000;

k

// 安全地向队列添加事件
async function safePushEvent(eventData) {
    return await withQueueLock(() => {
        eventQueue.push(eventData);
        return eventQueue.length;
    });
}

// 安全地从队列获取事件
async function safeShiftEvent() {
    return await withQueueLock(() => {
        if (eventQueue.length === 0) return null;
        return eventQueue.shift();
    });
}

// 安全地获取队列长度
async function safeGetQueueLength() {
    return await withQueueLock(() => {
        return eventQueue.length;
    });
}

// 处理队列中的事件
let isProcessing = false;

async function processQueue() {
    if (isProcessing) return;
    
    isProcessing = true;
    
    try {
        while (true) {
            const eventData = await safeShiftEvent();
            if (!eventData) break; // 队列为空
            
            try {
                await processSingleEvent(eventData);
            } catch (error) {
                console.error("Error processing event:", error);
                // 可以选择将失败的事件重新加入队列
                // await safePushEvent(eventData);
            }
            
            // 等待2秒再处理下一个事件
            await new Promise(resolve => setTimeout(resolve, PROCESSING_INTERVAL));
        }
    } finally {
        isProcessing = false;
        
        // 检查是否还有新的事件到达
        const remaining = await safeGetQueueLength();
        if (remaining > 0) {
            setTimeout(processQueue, 100);
        }
    }
}

// 触发队列处理（确保只有一个处理实例运行）
async function triggerQueueProcessing() {
    const length = await safeGetQueueLength();
    if (length > 0 && !isProcessing) {
        processQueue();
    }
}

// 处理单个事件
async function processSingleEvent(eventData) {
    if (!eventData || !eventData.returnValues) {
        console.log("daoCreateEvent error: Invalid event data");
        return;
    }

    const web3 = getWeb3Instance();
    const scContract = new web3.eth.Contract(scAbi, scAddress);
    const infoContract = new web3.eth.Contract(infoAbi, infoAddress);
    const logoContract = new web3.eth.Contract(logoAbi, logoAddress);

    const dao_id = eventData['returnValues']['SC_id'];
    const _info = await infoContract.methods.getSCInfo(dao_id).call({ from: account });
    console.log(dao_id, _info)

    const data = {
        manager: _info[0]['manager'],
        version: _info[0]['version'],
        daoName: _info[0]['name'],
        symbol: _info[0]['symbol'],
        describe: _info[0]['desc'],
        sctype: _info[0]['SCType'],
        creator: _info[0]['SCType'] == 'dapp' ? _info[1] : '',
        delegator: _info[2],
        strategy: _info[3],
        lifetime: _info[4],
        cool_time: _info[5],
        address: _info[1]
    }

    const logo = await logoContract.methods.getLogo(dao_id).call({ from: account });
    console.log("logo src", logo.src)

    if (_info[0]['SCType'] == 'dapp') {
        const _contract = new web3.eth.Contract(f_abi, _info[1]);
        let _owner = await _contract.methods.ownerOf(_info[1]).call({ from: account })
        data.dapp_owner = _owner;
    } else {
        data.dapp_owner = '';
    }

    let sql = "INSERT IGNORE INTO t_dao(sctype,dao_id,block_num,dao_name,dao_symbol,dao_desc,dao_manager,dao_time,dao_exec,creator,delegator,strategy,lifetime,cool_time,dao_logo,dapp_owner) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let params = [
        data['sctype'],
        dao_id,
        eventData.blockNumber,
        data['daoName'],
        data['symbol'],
        data['describe'],
        data['manager'],
        (new Date()).getTime().toString().substring(0, 10),
        data['address'], data['creator'], data['delegator'], data['strategy'], data['lifetime'], data['cool_time'],
        logo.src, data['dapp_owner']];
    
    maxData[0] = eventData.blockNumber + 1n;

    console.log(params)

    await executeSql(sql, params);
    
    const memberData = eventData['returnValues']['members'];
    for (let i = 0; i < memberData.length; i++) {
        await executeSql("call i_daodetail(?,?,?,?)", [
            eventData['returnValues']['dividendRights'][i],
            memberData[i],
            data['delegator'],
            dao_id
        ]);
    }
}

async function hand(web3) {
    let sql = 'SELECT IFNULL(MAX(block_num),0)+1 s FROM t_dao'
    const rows = await promisePool.query(sql, []);
    rows[0].forEach(element => { maxData.push(element.s > start_block ? element.s : start_block) });
    console.log(" maxData[0]:", maxData[0])
    const scContract = new web3.eth.Contract(scAbi, scAddress);

    const event = scContract.events.CreateSC({ filter: {}, fromBlock: maxData[0] });
    event.on('data', async function (eventData, _error) {
        // 安全地添加事件到队列
        await safePushEvent(eventData);
        // 触发队列处理
        triggerQueueProcessing();
    });
}

// mysql 处理
async function executeSql(addSql, addSqlParams) {
    if (process.env.IS_DEBUGGER === '1') console.info(addSql, addSqlParams.join(','))
    await promisePool.execute(addSql, addSqlParams)
}

// 获取web3实例的函数
function getWeb3Instance() {
    const { WSS_URL, BLOCKCHAIN_NETWORK } = process.env;
    return new Web3(WSS_URL.replace('${BLOCKCHAIN_NETWORK}', BLOCKCHAIN_NETWORK));
}

const promisePool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

promisePool.on('error', (err) => {
    console.error('Database connection error:', err);
});

let web3;
try {
    const { WSS_URL, BLOCKCHAIN_NETWORK } = process.env;
    web3 = new Web3(WSS_URL.replace('${BLOCKCHAIN_NETWORK}', BLOCKCHAIN_NETWORK));
    await hand(web3);
} catch (error) {
    console.error("Error starting the server:", error);
    throw error;
}