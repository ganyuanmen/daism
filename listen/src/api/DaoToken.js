const erc20s_abi=require('../abi/SCToken_abi.json');
const utils = require("../utils");
/**
 * token 事件
 */
class DaoToken
{
    //发布token事件
    publishTokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;  
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.tObj=this.contract.events.Issue({filter: {},fromBlock: maxBlockNumber});
        this.tObj.on('data',async function (data,_error) {   
                if(!data || !data.returnValues) {utils.log("publishTokenEvent error");throw _error;}       
                _this.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                        "tokenId": data.returnValues['eip3712_id'], 
                        "daoId": data.returnValues['SC_id'],
                    })
                 })
            }
        )
    }
    async balanceOf(_id,_address) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        let val= await this.contract.methods.balanceOf(_id,_address).call({ from: this.account })
        return parseFloat(this.web3.utils.fromWei(val,'ether')).toFixed(6)
    }

    //取消订阅
    unsub()
    {
        try{
            if(this.tObj && this.tObj.unsubscribe){this.tObj.unsubscribe();}
            this.tObj=null;
        }catch(e){console.error(e);}
    }

    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=erc20s_abi
        this.har=[]
    }
}

module.exports=DaoToken