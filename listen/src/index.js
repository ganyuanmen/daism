'use strict';
const GetInfos = require('./api/GetInfos');
const DaoRegistrar = require('./api/DaoRegistrar');
const DaoToken = require('./api/DaoToken');
const DaoLogo = require('./api/DaoLogo');
const IADD = require('./api/IADD');
const IADD_EX = require('./api/IADD_EX');
const UnitToken = require('./api/UnitToken');
const EventSum = require('./api/EventSum');
const Domain=require("./api/Domain")
const Daismnft=require("./api/Daismnft")
const UnitNFT=require("./api/UnitNFT")
const Daismnftsing=require("./api/Daismnftsing")
const ethers=require('ethers')
const utils = require("./utils");
const abiDecoder = require('abi-decoder'); // NodeJS
const fabi=require('./abi/SC_abi.json')
const f_abi=require("./abi/ForSCRegister_abi.json")
const daismAddress = require('../config/address.json');
abiDecoder.addABI(fabi);
console.log(daismAddress)



class DaoApi {
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
  

    async run() {
        this.running=true

        //daoCreate
        while(this.DaoRegistrar.har.length)
        {
            let _data=this.DaoRegistrar.har.shift();
            const dao_id=_data.data.data.daoId
            const _info=await this.GetInfos.getDaoInfo(dao_id)  
            _data.data.data.manager=_info[0]['manager'] //管理员
            _data.data.data.version=_info[0]['version'] // 版本号
            _data.data.data.name=_info[0]['name'] //dao 名称 
            _data.data.data.symbol=_info[0]['symbol'] // dao 符号
            _data.data.data.describe=_info[0]['desc'] // dao 描述
            _data.data.data.sctype=_info[0]['SCType'] // dao 类型
            _data.data.data.creator=_info[0]['SCType']=='dapp'?_info[1]:''
            _data.data.data.delegator=_info[2]
            _data.data.data.strategy=_info[3]
            _data.data.data.lifetime=_info[4]
            _data.data.data.cool_time=_info[5]
            _data.data.data.time=await utils.getTime(this.web3,_data.data.blockNumber)
            _data.data.data.address=_info[1] //执行人
             const logo=await this.DaoLogo.getLogo(dao_id)
             _data.data.data.src=logo.src //执行人
            
             if(_info[0]['SCType']=='dapp') {
                const _contract = new this.web3.eth.Contract(f_abi, _info[1]);
                let _owner= await _contract.methods.ownerOf(_info[1]).call({ from: this.account })
                _data.data.data.dapp_owner=_owner
            } else  _data.data.data.dapp_owner=''


            await this.runAsync(_data.fn,_data.data)
            
        }

        //成员变动
        while(this.EventSum.har3.length)
        {
            let _data=this.EventSum.har3.shift();
            _data.data.data.daoId=await this.DaoRegistrar.proxyTo(_data.data.data['delegator'])

            await this.runAsync(_data.fn,_data.data)
            
        }
        

        //publishTolen ////NFT
        while(this.DaoToken.har.length)
        {
            let _data=this.DaoToken.har.shift();
            _data.data.data.timestamp=await utils.getTime(this.web3,_data.data.blockNumber)
            await this.runAsync(_data.fn,_data.data)
            
        }



        while(this.IADD.t2tAr.length)
        {
            let _data=this.IADD.t2tAr.shift();
            _data.data.data.gas=await utils.gas(this.web3,_data.data.transactionHash)
            _data.data.data.swap_time=await utils.getTime(this.web3,_data.data.blockNumber)
            await this.runAsync(_data.fn,_data.data)
            
        }
        
   

        while(this.IADD.e2tAr.length)
        {
            let _data=this.IADD.e2tAr.shift();
            _data.data.data.gas=await utils.gas(this.web3,_data.data.transactionHash)
            _data.data.data.swap_time=await utils.getTime(this.web3,_data.data.blockNumber)
            await this.runAsync(_data.fn,_data.data)
            
        }
        while(this.UnitToken.e2uAr.length)
        {
            let _data=this.UnitToken.e2uAr.shift();

            let logs=await utils.getCheckEvent_logs(this.ethersProvider,_data.data.transactionHash)
            let eventData= utils.getCheckEvent_ex(logs,this.eventIface,'ETHToSCToken')
            if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'ETHToSCToken')

            if(!eventData.isOk) {
                _data.data.data.gas=eventData.gasUsed
                _data.data.data.swap_time=await utils.getTime(this.web3,_data.data.blockNumber)
                await this.runAsync(_data.fn,_data.data)
            }
            
        }

         while(this.IADD.t2uAr.length)
         {
             let _data=this.IADD.t2uAr.shift();
             let logs=await utils.getCheckEvent_logs(this.ethersProvider,_data.data.transactionHash)
             let eventData= utils.getCheckEvent_ex(logs,this.eventIface,'SCTokenToSCTokenEvent')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'SCTokenToSCTokenEvent')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'SCTokenToUnitTokenEvent')
             if(!eventData.isOk)
             {
                _data.data.data.gas=eventData.gasUsed
                _data.data.data.swap_time=await utils.getTime(this.web3,_data.data.blockNumber)
                await this.runAsync(_data.fn,_data.data)
             }
         }
        
         while(this.IADD.u2tAr.length)
         {
             let _data=this.IADD.u2tAr.shift();
          
             let logs=await utils.getCheckEvent_logs(this.ethersProvider,_data.data.transactionHash)
             let eventData= utils.getCheckEvent_ex(logs,this.eventIface,'ETHToSCToken')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'ETHToSCToken')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface,'SCTokenToSCTokenEvent')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'SCTokenToSCTokenEvent')
             if(!eventData.isOk) eventData= utils.getCheckEvent_ex(logs,this.eventIface_ex,'UnitTokenToSCToken')
             if(!eventData.isOk)
             {
                _data.data.data.gas=eventData.gasUsed
                _data.data.data.swap_time=await utils.getTime(this.web3,_data.data.blockNumber)
                await this.runAsync(_data.fn,_data.data)
             }
         }

              
         //addProposal
        while(this.EventSum.har.length)
         {
             let _data=this.EventSum.har.shift();
             const parasObj=await this.web3.eth.getTransaction(_data.data.transactionHash);
             const decodedData = abiDecoder.decodeMethod(parasObj.input)
             const [account,dividendRights,createTime,rights,antirights,dao_desc]=decodedData.params[0].value
             _data.data.data.creator=parasObj.from
            //  _data.data.data.dividendRights=dividendRights
             _data.data.data.dao_desc=dao_desc
             await this.runAsync(_data.fn,_data.data)
             
         }

           //voteEvent
        while(this.EventSum.har1.length)
        {
            let _data=this.EventSum.har1.shift();
            const parasObj=await this.web3.eth.getTransaction(_data.data.transactionHash);        
            _data.data.data.creator=parasObj.from
            await this.runAsync(_data.fn,_data.data)
            
        }

    
        
        //获取分红
        while(this.EventSum.har2.length)
        {
            let _data=this.EventSum.har2.shift();
            _data.data.data._time=await utils.getTime(this.web3,_data.data.blockNumber)
            await this.runAsync(_data.fn,_data.data)
            
        }
   
        //changeLogo 
        while(this.DaoLogo.har.length)
        {
            let _data=this.DaoLogo.har.shift();
            let res=await this.DaoLogo.getLogoByDaoId(_data.data.data.daoId)
            _data.data.data.src=await this.DaoLogo.get_async_file(res.fileContent,_data.data.data.daoId)
            _data.data.data._time=await utils.getTime(this.web3,_data.data.blockNumber)
            await this.runAsync(_data.fn,_data.data)
            
        }
        

         this.running=false
    }
 
        
     runAsync(callbackFun,data){
        var p = new Promise(function(resolve, reject){
            setTimeout(function(){
                callbackFun.call(null,data)
                resolve('')
            }, 500);
        });
        return p;            
    }


    unsub() {
        this.DaoRegistrar.unsub();
        this.DaoLogo.unsub();
        this.DaoToken.unsub();
        this.IADD.unsub();
        this.IADD_EX.unsub();
        this.UnitToken.unsub();
        this.EventSum.unsub();
        this.Domain.unsub();
        this.DaismNft.unsub();
        this.UnitNFT.unsub();
        this.Daismnftsing.unsub();

        



    } 
    get ethersProvider()
    {
    
        if(!this.ethersProvider_obj)
        this.ethersProvider_obj= new ethers.JsonRpcProvider(process.env.HTTPS_URL.replace('${BLOCKCHAIN_NETWORK}',process.env.BLOCKCHAIN_NETWORK))
        return this.ethersProvider_obj
    }
 
   
   
   
    get GetInfos() { if (!this.dao_getInfos_obj) this.dao_getInfos_obj = new GetInfos(this.web3, this.account,daismAddress['GetInfos']); return this.dao_getInfos_obj; }
  
 
    get DaoLogo() { 
        if (!this.dao_logo_obj) this.dao_logo_obj = new DaoLogo(this.web3, this.account,daismAddress['SCLogo'],this.DaoToken); 
        return this.dao_logo_obj; 
    }
    get DaoToken() { 
        if (!this.dao_token_obj) this.dao_token_obj = new DaoToken(this.web3, this.account,daismAddress['SCToken']); 
        return this.dao_token_obj; 
    }
    
    get DaoRegistrar() { 
        if (!this.dao_register_obj) this.dao_register_obj = new DaoRegistrar(this.web3, daismAddress['SCRegistrar'],this.DaoToken); 
        return this.dao_register_obj; 
    }

    get DaismNft() { 
        if (!this.dao_DaismNft_obj) this.dao_DaismNft_obj = new Daismnft(this.web3, this.account,daismAddress['DAismNFT'],this.DaoToken); 
        return this.dao_DaismNft_obj;
     }
    get IADD() { 
        if (!this.dao_iadd_obj) this.dao_iadd_obj = new IADD(this.web3, this.account,daismAddress['_IADD']);
        return this.dao_iadd_obj; 
        }
    get IADD_EX() { 
        if (!this.dao_iaddex_obj) this.dao_iaddex_obj = new IADD_EX(this.web3, this.account,daismAddress['DAismIADDProxy'],this.IADD);
        return this.dao_iaddex_obj; 
        }
    get UnitToken() { 
        if (!this.dao_uToken_obj) this.dao_uToken_obj = new UnitToken(this.web3, daismAddress['UnitToken']); 
        return this.dao_uToken_obj; 
    }
    get UnitNFT() { 
        if (!this.dao_UnitNFT_obj) this.dao_UnitNFT_obj = new UnitNFT(this.web3, this.account,daismAddress['UnitNFT'],this.DaoToken); 
        return this.dao_UnitNFT_obj; 
    }

    get Daismnftsing() { if (!this.dao_Daismnftsing_obj) this.dao_Daismnftsing_obj = new Daismnftsing(this.web3, this.account,daismAddress['DAismSingleNFT'],this.DaoToken); 
    return this.dao_Daismnftsing_obj; 
    }
    
    get Domain() { if (!this.dao_domain_obj) this.dao_domain_obj = new Domain(this.web3, this.account,daismAddress['DAismDomain'],this.DaoToken); return this.dao_domain_obj; }

    get EventSum() { if (!this.dao_eventSum_obj) this.dao_eventSum_obj = new EventSum(this.web3, this.account,daismAddress['SCEventEmit']); return this.dao_eventSum_obj; }
 
    constructor(_web3, _account,_network) {
        this.web3 = _web3;
        this.running=false
        this.account = _account;
        this.network=_network
    }
}

if (typeof window === 'object') {
    window.Daoapi = function (_web3, _account,_network) {
        return new DaoApi(_web3, _account,_network)
    }
    window.Daoapi.default = window.Daoapi;
}

module.exports = DaoApi