const utils = require("../utils");
const plugn_abi = require('../abi/DaoPluginManage_abi');
const BigNumber = require('bignumber.js');

//app事件
class DaoPluginManage {

    //登记app地址事件
    installEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj1 = this.contract.events.Install({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                if (!data || !data.returnValues) {utils.log("installEvent error");throw _error;}
                const {dao_delegator_full_id,software_id,software_version_id}=data.returnValues
                const bigNumber = new BigNumber(dao_delegator_full_id);
                const str=bigNumber.toString(2)
                let delegator_id_str= str.slice(str.length - 128)
                let dao_id_str=str.replace(delegator_id_str,'')
                callbackFun.call(null,utils.valueFactory(data, 
                    { 
                        app_id:software_id, 
                        app_version:software_version_id,
                        dao_id:parseInt(dao_id_str, 2),
                        delegate_id:parseInt(delegator_id_str, 2), 
                        "install_address":await utils.getAccount(_this.web3,data.transactionHash), //执行人
                        "install_time":await utils.getTime(_this.web3,data.blockNumber) // 时间戳
                    },
                    "installEvent")
                )
            }
        )
    }
    
  

    //取消订阅
    unsub() {
        try {
            if (this.subriceObj && this.subriceObj.unsubscribe) {this.subriceObj.unsubscribe();}
            this.subriceObj = null; 
        }catch (e) {console.error(e);}
    }
    
    constructor(_web3, _account,_address) {
        this.web3 = _web3;
        this.account = _account;
        this.address =_address;
        this.abi = plugn_abi.abi
    }
}

module.exports = DaoPluginManage