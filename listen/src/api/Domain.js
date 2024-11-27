const utils = require("../utils");
const abi=require('../abi/DAismDomain_abi.json');

class Domain
{
    RecordEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.installobj=this.contract.events.Record({filter: {},fromBlock: maxBlockNumber});
        this.installobj.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("RecordEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "domain": data.returnValues.domain,
                    "daoId": data.returnValues._scId
                    })
                 })
            }
        )
    }
    
    recordInfoEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.installobj1=this.contract.events.RecordInfo({filter: {},fromBlock: maxBlockNumber});
        this.installobj1.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("recordInfoEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                        "domain": data.returnValues.domain,
                        "addr": data.returnValues.addr,
                        "name": data.returnValues.name
                    })
                 })
            }
        )
    }

   unsub()
   {
       try{
           if(this.installobj && this.installobj.unsubscribe) {this.installobj.unsubscribe();}
           this.installobj=null;
           if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();}
           this.installobj1=null;
       } catch(e){console.error(e);}
   }

    constructor(_web3,_account,_address,_daotoken) {
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi;
        this.daotoken=_daotoken;
    }
}
module.exports=Domain