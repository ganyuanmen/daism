const utils = require("../utils");
const app_abi = require('../abi/app_abi');

//app事件
class App {

    //登记app地址事件
    addAppEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj1 = this.contract.events.AddSoftware({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
                if (!data || !data.returnValues) {utils.log("addAppEvent error");throw _error;}
                const {software_type,software_id}=data.returnValues
                let infos,versions
                if(software_type==='0'){
                    infos=await _this.contract.methods.softwareSystemInfos(software_id).call({ from: this.account })
                    versions=await _this.contract.methods.softwareSystemVersions(software_id,infos['latestVersion']).call({ from: this.account })
                }
                else {
                    infos=await _this.contract.methods.softwarePluginInfos(software_id).call({ from: this.account })
                    versions=await _this.contract.methods.softwarePluginVersions(software_id,infos['latestVersion']).call({ from: this.account });
                }   
                callbackFun.call(null,utils.valueFactory(data, 
                    { 
                        "version":infos['latestVersion'], //版本号
                        "name": infos['name'], //app名称
                        "app_id": software_id, //app序号
                        "appAddress": versions['proxyTarget'], //app登记地址
                        "manager": infos['manager']?infos['manager']:'', //管理员
                        "desc":infos['desc'] , //app描述
                        "ver_desc":versions['desc'] , //版本描述
                        "software_type":software_type , //类型
                        "time":await utils.getTime(_this.web3,data.blockNumber) // 时间戳
                    },
                    "addAppEvent")
                )
            }
        )
    }
    
    //登记app版本地址事件
    addVersionEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.addappObj1 = this.contract.events.AddSoftwareVersion({ filter: {}, fromBlock: maxBlockNumber + 1}, 
            async function (_error, data) {
            
                if (!data || !data.returnValues) {utils.log("addVersionEvent error");throw _error;}
                const {software_type,software_id,software_version_id}=data.returnValues
                let infos,versions
                if(software_type==='0'){
                    infos=await _this.contract.methods.softwareSystemInfos(software_id).call({ from: this.account })
                    versions=await _this.contract.methods.softwareSystemVersions(software_id,software_version_id).call({ from: this.account })
                }
                else {
                    infos=await _this.contract.methods.softwarePluginInfos(software_id).call({ from: this.account })
                    versions=await _this.contract.methods.softwarePluginVersions(software_id,software_version_id).call({ from: this.account });
                }
             
                    
                // callbackFun.call(null, {
                //     "address": data.address,
                //     "blockHash": data.blockHash,
                //     "blockNumber": data.blockNumber,
                //     "transactionHash": data.transactionHash,
                //     "transactionIndex": data.transactionIndex,
                //     "data": { 
                //         "version":infos['latestVersion'], //版本号
                //         "name": infos['name'], //app名称
                //         "app_id": software_id, //app序号
                //         "appAddress": versions['proxyTarget'], //app登记地址
                //         "manager": infos['manager']?infos['manager']:'', //管理员
                //         "desc":infos['desc'] , //app描述
                //         "ver_desc":versions['desc'] , //版本描述
                //         "software_type":software_type , //类型
                //         "time":await utils.getTime(_this.web3,data.blockNumber) // 时间戳
                //     },
                //     "event": "addVersionEvent"
                // })
            }
        )
    }

    //取消订阅
    unsub() {
        try {
            if (this.addappObj1 && this.addappObj1.unsubscribe) {this.addappObj1.unsubscribe();}
            if (this.addverObj2 && this.addverObj2.unsubscribe) {this.addverObj2.unsubscribe();}
            this.addappObj1 = null; this.addverObj2 = null;
        }catch (e) {console.error(e);}
    }
    
    constructor(_web3, _account,_address) {
        this.web3 = _web3;
        this.account = _account;
        this.address =_address;
        this.abi = app_abi.abi
    }
}

module.exports = App