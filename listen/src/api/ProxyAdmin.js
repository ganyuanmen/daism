const utils = require("../utils");
const proxy_abi=require('../abi/ProxyAdmin_abi');

//升级事件
class ProxyAdmin
{
    //dao 注册事件
    updateVersion(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.installobj=this.contract.events.UpdateVersion({filter: {},fromBlock: maxBlockNumber+1}, 
            async function (_error, data) {
                if(!data || !data.returnValues) {utils.log("updateVersion error:"+_error);throw _error;}
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "version": data.returnValues.version,
                        "time":await utils.getTime(_this.web3,data.blockNumber)
                    },
                "updateVersion")
                )
            }
        )
    }

   unsub()
   {
       try{
           if(this.installobj && this.installobj.unsubscribe) {this.installobj.unsubscribe();}
           this.installobj=null;
       } catch(e){console.error(e);}
   }

   
   constructor(_web3,_account,_address) {
    this.web3=_web3;
    this.account=_account;
    this.address=_address;
    this.abi=proxy_abi.abi
   }

}
module.exports=ProxyAdmin