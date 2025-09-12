'use strict';
const GetInfos = require('./api/GetInfos');
const DaoRegistrar = require('./api/DaoRegistrar');
const DaoToken = require('./api/DaoToken');
const DaoLogo = require('./api/DaoLogo');
// const IADD = require('./api/IADD');
// const IADD_EX = require('./api/IADD_EX');
const UnitToken = require('./api/UnitToken');
const EventSum = require('./api/EventSum');
const Domain=require("./api/Domain")
const Daismnft=require("./api/Daismnft")
// const UnitNFT=require("./api/UnitNFT")
// const SatoshiUTOFund=require("./api/SatoshiUTOFund")
const Daismnftsing=require("./api/Daismnftsing")
const Donate=require("./api/Donate")
const ethers=require('ethers')
const utils = require("./utils");
const abiDecoder = require('abi-decoder'); // NodeJS
const fabi=require('./abi/SC_abi.json')
const f_abi=require("./abi/ForSCRegister_abi.json")
const daismAddress = require('../config/address.json');
const MultiRpcClient=require('./MultiRpcClient')
const  Mutex = require('async-mutex').Mutex;
abiDecoder.addABI(fabi);
console.log(daismAddress)

const PROCESSING_INTERVAL = 2000; // 处理间隔（毫秒）

// const rpcProviders = [
//     'https://sepolia.infura.io/v3/2e68e4d6017344cd89bab57981783954',
//     'https://eth-sepolia.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad',
//     'https://eth.llamarpc.com/sepolia',
//     'https://sepolia.infura.io/v3/982d49c829f4428db93d5a077085d995',
//     'https://sepolia.infura.io/v3/9676a35d629d488fb90d7eac1348c838',
// ];


const rpcProviders = [
    'https://mainnet.infura.io/v3/2e68e4d6017344cd89bab57981783954',
    'https://eth-mainnet.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad',
    'https://eth.llamarpc.com',
    'https://mainnet.infura.io/v3/982d49c829f4428db93d5a077085d995',
    'https://mainnet.infura.io/v3/9676a35d629d488fb90d7eac1348c838',
];

// 使用示例
const rpcClient = new MultiRpcClient(rpcProviders);



class DaoApi {
        
    // 处理队列中的事件
    processQueue=async()=> {

        const _this=this;
        if (this.isProcessing || this.eventQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const eventData = this.eventQueue.shift();

        try {
            await this.processSingleEvent(eventData);
        } catch (error) {
            console.error("Error processing event:", error);
        } finally {
            // 设置定时器，1秒后处理下一个事件
            setTimeout(() => {
                _this.isProcessing = false;
                _this.processQueue();
            }, PROCESSING_INTERVAL);
        }
    }

     processSingleEvent=async(_data)=> {
        switch(_data.type){
            case 'DaoRegistrar.har':
                const dao_id=_data.data.data.daoId              
                const _info=await this.GetInfos.getDaoInfo(dao_id) ;
                _data.data.data.manager=_info[0]['manager'] //管理员
                _data.data.data.version=_info[0]['version'] // 版本号
                _data.data.data.name=_info[0]['name']        //dao 名称 
                _data.data.data.symbol=_info[0]['symbol']    // dao 符号
                _data.data.data.describe=_info[0]['desc']    // dao 描述
                _data.data.data.sctype=_info[0]['SCType']    // dao 类型
                _data.data.data.creator=_info[0]['SCType']=='dapp'?_info[1]:''
                _data.data.data.delegator=_info[2]
                _data.data.data.strategy=_info[3]
                _data.data.data.lifetime=_info[4]
                _data.data.data.cool_time=_info[5]
                _data.data.data.address=_info[1] //执行人
                const logo=await this.DaoLogo.getLogo(dao_id)
                _data.data.data.src=await this.DaoLogo.get_async_file(logo[1],dao_id);

                
                if(_info[0]['SCType']=='dapp') {
                        const _owner=await rpcClient.callContract(_info[1],f_abi,'ownerOf',[])
                        _data.data.data.dapp_owner=_owner;
                    
                } else { 
                    _data.data.data.dapp_owner='';
                }
                await _data.fn(_data.data);
                break;
            
        
            case 'EventSum.har3':
                await _data.fn(_data.data);
                break;
            
            case 'DaoToken.har':
                const obj0=await rpcClient.getBlock(_data.data.blockNumber);
                _data.data.data.timestamp=obj0.timestamp;
                await _data.fn(_data.data);
                break;
            
            case 'EventSum.har':
             const parasObj=await rpcClient.getTransaction(_data.data.transactionHash);
             const decodedData = abiDecoder.decodeMethod(parasObj.data)
             const [account,dividendRights,createTime,rights,antirights,dao_desc]=decodedData.params[0].value
             _data.data.data.creator=parasObj.from
             _data.data.data.dao_desc=dao_desc
             await _data.fn(_data.data);
             break
             
        case 'EventSum.har1':
            const parasObj1=await rpcClient.getTransaction(_data.data.transactionHash);       
            _data.data.data.creator=parasObj1.from
            await _data.fn(_data.data);
            break;
            
        case 'EventSum.har2':
            const obj2=await rpcClient.getBlock(_data.data.blockNumber);
            _data.data.data._time=obj2.timestamp;
            await _data.fn(_data.data);
            break;
            
       case 'DaoLogo.har':

            const logo1=await this.DaoLogo.getLogo(_data.data.data.daoId);
            _data.data.data.src=await this.DaoLogo.get_async_file(logo1[1],_data.data.data.daoId);
            const obj1=await rpcClient.getBlock(_data.data.blockNumber);
            _data.data.data._time=obj1.timestamp;
            await _data.fn(_data.data);
            break;

        default:
            console.log("==================================no opration:",_data.type)
        }
        

       
    }
 
    get eventIface()
    {
        if(!this.iface) this.iface = new  ethers.Interface(this.IADD.abi)
        return this.iface
    }
    get eventIface_ex()
    {
        if(!this.iface_ex) this.iface_ex = new  ethers.Interface(this.IADD_EX.abi)
        return this.iface_ex
    }

    // unsub=()=> {
    //     this.DaoRegistrar.unsub();
    //     this.DaoLogo.unsub();
    //     this.DaoToken.unsub();
    //     // this.IADD.unsub();
    //     // this.IADD_EX.unsub();
    //     // this.UnitToken.unsub();
    //     this.EventSum.unsub();
    //     this.Domain.unsub();
    //     this.DaismNft.unsub();
    //     // this.UnitNFT.unsub();
    //     this.Daismnftsing.unsub();
    //     this.Donate.unsub();

        



    // } 
    get ethersProvider()
    {
    
        if(!this.ethersProvider_obj)
        this.ethersProvider_obj= new ethers.JsonRpcProvider(process.env.HTTPS_URL.replace('${BLOCKCHAIN_NETWORK}',process.env.BLOCKCHAIN_NETWORK))
        return this.ethersProvider_obj
    }
 
  
   
    get GetInfos() { if (!this.dao_getInfos_obj) 
        this.dao_getInfos_obj = 
        new GetInfos(this.web3, this.account,daismAddress['GetInfos'],rpcClient); return this.dao_getInfos_obj; }
  
 
    get DaoLogo() { 
        if (!this.dao_logo_obj) this.dao_logo_obj = 
        new DaoLogo(this.web3, this.account,daismAddress['SCLogo'],rpcClient,this); 
        return this.dao_logo_obj; 
    }
    get DaoToken() { 
        if (!this.dao_token_obj) this.dao_token_obj = 
        new DaoToken(this.web3, this.account,daismAddress['SCToken'],this); 
        return this.dao_token_obj; 
    }
    
    get DaoRegistrar() { 
        if (!this.dao_register_obj) this.dao_register_obj = 
        new DaoRegistrar(this.web3, daismAddress['SCRegistrar'],this); 
        return this.dao_register_obj; 
    }

    get DaismNft() { 
        if (!this.dao_DaismNft_obj) this.dao_DaismNft_obj = 
        new Daismnft(this.web3, this.account,daismAddress['DAismNFT'],this); 
        return this.dao_DaismNft_obj;
     }
    // get IADD() { 
    //     if (!this.dao_iadd_obj) this.dao_iadd_obj = 
    //     new IADD(this.web3, this.account,daismAddress['_IADD'],eventQueue);
    //     return this.dao_iadd_obj; 
    //     }
    // get IADD_EX() { 
    //     if (!this.dao_iaddex_obj) this.dao_iaddex_obj = 
    //     new IADD_EX(this.web3, this.account,daismAddress['DAismIADDProxy'],this.IADD,eventQueue);
    //     return this.dao_iaddex_obj; 
    //     }
    get UnitToken() { 
        if (!this.dao_uToken_obj) this.dao_uToken_obj = 
        new UnitToken(this.web3, daismAddress['UnitToken'],this); 
        return this.dao_uToken_obj; 
    }
    // get UnitNFT() { 
    //     if (!this.dao_UnitNFT_obj) this.dao_UnitNFT_obj = 
    //     new UnitNFT(this.web3, this.account,daismAddress['UnitNFT'],this.DaoToken,eventQueue,queueMutex); 
    //     return this.dao_UnitNFT_obj; 
    // }

    // get SatoshiUTOFund() { 
    //     if (!this.dao_SatoshiUTOFund_obj) this.dao_SatoshiUTOFund_obj = new SatoshiUTOFund(this.web3, this.account,daismAddress['SatoshiUTOFund']); 
    //     return this.dao_SatoshiUTOFund_obj; 
    // }

    get Daismnftsing() { if (!this.dao_Daismnftsing_obj) this.dao_Daismnftsing_obj = 
        new Daismnftsing(this.web3, this.account,daismAddress['DAismSingleNFT'],this); 
    return this.dao_Daismnftsing_obj; 
    }
    
    get Domain() { if (!this.dao_domain_obj) this.dao_domain_obj = 
        new Domain(this.web3, this.account,daismAddress['DAismDomain'],this); return this.dao_domain_obj; } 

    get EventSum() { if (!this.dao_eventSum_obj) this.dao_eventSum_obj = 
        new EventSum(this.web3, this.account,daismAddress['SCEventEmit'],this); return this.dao_eventSum_obj; }
 
    get Donate() { if (!this.dao_Donate_obj) 
        this.dao_Donate_obj =  new Donate(this.web3, this.account,daismAddress['Donation'],this); 
        return this.dao_Donate_obj; }


    constructor(_web3, _account,_network) {
        this.web3 = _web3;
        this.account = _account;
        this.network=_network;
        this.queueMutex = new Mutex(); // 创建互斥锁
        this.eventQueue = []; // 事件队列
        this.isProcessing = false; // 处理标志

    }
}

if (typeof window === 'object') {
    window.Daoapi = function (_web3, _account,_network) {
        return new DaoApi(_web3, _account,_network)
    }
    window.Daoapi.default = window.Daoapi;
}

module.exports = DaoApi

