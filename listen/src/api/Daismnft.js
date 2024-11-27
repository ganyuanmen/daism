const utils = require("../utils");
const abi=require('../abi/DAismNFT_abi.json');

class Daismnft
{
    mintEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.installobj1=this.contract.events.Mint({filter: {},fromBlock: maxBlockNumber});
        this.installobj1
        .on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("mintEvent error:"+_error);throw _error;}
                _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "daoId": data.returnValues.scId,
                    "to": data.returnValues.to,
                    "tokenId": data.returnValues.tokenId
                    })
                 })
            }
        )
    }

    // mintBatchEvent(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    //     this.installobj2=this.contract.events.MintBatch({filter: {},fromBlock: maxBlockNumber});
    //     this.installobj2
    //     .on('data', async function (data,_error) {
    //             if(!data || !data.returnValues) {utils.log("mintBatchEvent error:"+_error);throw _error;}
    //             console.log(data)
    //             // _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
    //             //     "daoId": data.returnValues._scId,
    //             //         "to": data.returnValues.to,
    //             //         "tokenId": data.returnValues.tokenId,
    //             //         "templateId": data.returnValues.templateId
    //             //     })
    //             //  })

    //         }
    //     )
    // }
    
 
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
        //    if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();}
        //    this.installobj2=null;
        //    if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();}
        //    this.installobj3=null;
        //    if(this.installobj4 && this.installobj4.unsubscribe) {this.installobj4.unsubscribe();}
        //    this.installobj4=null;

       } catch(e){console.error(e);}
   }

    constructor(_web3,_account,_address,_daotoken) {
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi
        this.daotoken=_daotoken
    }
}
module.exports=Daismnft