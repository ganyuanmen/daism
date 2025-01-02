const utils = require("../utils");
const abi0=require('../abi/SCRegistrar_abi0.json'); //未升级前
const abi=require('../abi/SCRegistrar_abi.json');

//dao注册事件
class DaoRegistrar
{
    //dao 注册事件 未升级前
    daoCreateEvent0(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract0) this.contract0 = new this.web3.eth.Contract(this.abi0, this.address);
        this.installobj10=this.contract0.events.CreateSC({filter: {},fromBlock: maxBlockNumber});
        this.installobj10.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:"+_error);throw _error;}
                _this.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data['returnValues']['SC_id'],
                
                    "time":(new Date()).getTime().toString().substring(0,10),
                    })
                })
            }
        )
    }

      //dao 注册事件
      daoCreateEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj1=this.contract.events.CreateSC({filter: {},fromBlock: maxBlockNumber});
        this.installobj1.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:"+_error);throw _error;}
                _this.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data['returnValues']['SC_id'],
                    "members":data['returnValues']['members'],
                    "dividendRights":data['returnValues']['dividendRights'],
                    "time":data['returnValues']['time'],
                    })
                })
            }
        )
    }

     //dao 修改dapp 地址
     updateSCEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj2=this.contract.events.UpdateSC({filter: {},fromBlock: maxBlockNumber});
        this.installobj2.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data['returnValues']['SC_id'],
                    "newCreator": data['returnValues']['newCreator']
                    })
                 })
            }
        )
    }

     //dapp 地址对应 版本号
     addCreatorCEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj3=this.contract.events.AddCreator({filter: {},fromBlock: maxBlockNumber});
        this.installobj3.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data['returnValues']['SC_id'],
                    "SC_Version": data['returnValues']['SC_Version'],
                    "newCreator": data['returnValues']['newCreator']
                    })
                 })
            }
        )
    }

    async proxyTo(id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
       return await this.contract.methods.proxyTo(id).call({ from: this.account });

    }

   unsub()
   {
       try{
           if(this.installobj10 && this.installobj10.unsubscribe) {this.installobj10.unsubscribe();}
           if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();}
           if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();}
           if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();}
           this.installobj1=null;this.installobj2=null;this.installobj3=null;this.installobj10=null;
       } catch(e){console.error(e);}
   }

    constructor(_web3,_address,_daotoken) {
        this.web3=_web3;
        this.address=_address;
        this.abi=abi
        this.abi0=abi0
        this.har=[]
        this.daotoken=_daotoken
    }
}
module.exports=DaoRegistrar