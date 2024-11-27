const utils = require("../utils");
const abi=require('../abi/DAismSingleNFT_abi.json');

class Daismnftsing
{
    mintEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj1=this.contract.events.MintTip({filter: {},fromBlock: maxBlockNumber});
        this.installobj1
        .on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("mintEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data.returnValues.scId,
                    "to": data.returnValues.to,
                    "mark":data.returnValues.mark,
                    "utokenAmount":parseFloat(data.returnValues.utokenAmount)/100000000,
                    "tokenId": data.returnValues.tokenId
                    })
                 })
            }
        )
    }

    mintBatchEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj2=this.contract.events.MintBatch({filter: {},fromBlock: maxBlockNumber});
        this.installobj2
        .on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("MintBatchEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data.returnValues.scId,
                    "to": data.returnValues.to,
                    "tokenIds": data.returnValues.tokenIds
                    })
                 })
            }
        )
    }

    mintBurnEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj3=this.contract.events.MintBurn({filter: {},fromBlock: maxBlockNumber});
        this.installobj3
        .on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("MintBatchEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data.returnValues.scId,
                    "to": data.returnValues.to,
                    "tokenId": data.returnValues.tokenId,
                    "mark": data.returnValues.mark,
                    "ethBurn": parseFloat(parseFloat(_this.web3.utils.fromWei(data.returnValues.ethBurn,'ether')).toFixed(6))
                    })
                 })
            }
        )
    }

 

    async getNFT(_id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        let res= await this.contract.methods.getNFT(_id).call({ from: this.account })
       return res
    }

  
   unsub()
   {
       try{
           if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();}
           this.installobj1=null;
           if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();}
           this.installobj2=null;
           if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();}
           this.installobj3=null;
        

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
module.exports=Daismnftsing