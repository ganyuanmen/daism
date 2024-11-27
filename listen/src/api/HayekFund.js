const utils = require("../utils");
const app_abi = require('../abi/HayekFund_abi');

//app事件
class HayekFund {


    addRuleEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj1 = this.contract.events.AddRule({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                console.log(data)
             
               
            }
        )
    }
    

    deleteRuleEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj2 = this.contract.events.DeleteRule({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                console.log(data)
            }
        )
    }

    
    useRuleEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj3 = this.contract.events.UseRule({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                console.log(data)
            }
        )
    }

     
    approveEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj4 = this.contract.events.Approve({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                console.log(data)
            }
        )
    }


    //取消订阅
    unsub() {
        try {
            if (this.addappObj1 && this.addappObj1.unsubscribe) {this.addappObj1.unsubscribe();}
            if (this.addverObj2 && this.addverObj2.unsubscribe) {this.addverObj2.unsubscribe();}
            if (this.addappObj3 && this.addappObj3.unsubscribe) {this.addappObj3.unsubscribe();}
            if (this.addverObj4 && this.addverObj4.unsubscribe) {this.addverObj4.unsubscribe();}

            this.addappObj1 = null; this.addverObj2 = null;this.addappObj3 = null; this.addverObj4 = null;
        }catch (e) {console.error(e);}
    }
    
    constructor(_web3, _account,_address) {
        this.web3 = _web3;
        this.account = _account;
        this.address =_address;
        this.abi = app_abi.abi
    }
}

module.exports = HayekFund