const abi=require('../abi/UnitNFT_abi.json');

const utils = require("../utils");

 
 class UnitNFT
{
  

      //转帐 事件
      transfer(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.swapObj3=this.contract.events.Transfer({filter: {}, fromBlock:maxBlockNumber})
        this.swapObj3.on('data',async  function (data,_error) {
            if(!data || !data.returnValues) {utils.log("transferEvent error");throw _error;}  
            _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                "to":data.returnValues['to'], 
                "tokenId":data.returnValues['tokenId']
                })
             })
        })

    }

    async getTokenImageSvg(_id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        return await this.contract.methods.getTokenImageSvg(_id).call({ from: this.account })
       
    }



      
    //取消订阅
    unsub()
    {
        try{
            if(this.swapObj1 && this.swapObj1.unsubscribe) this.swapObj1.unsubscribe();
            this.swapObj1=null;

        }
        catch(e){ console.error(e); }
    }

   
    constructor(_web3,_account,_address,_daotoken) {
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi
        this.daotoken=_daotoken
    }
  }
  
  module.exports=UnitNFT