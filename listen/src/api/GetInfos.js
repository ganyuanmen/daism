
const abi = require('../abi/GetInfos_abi.json');

 // 获取数据, 减少http请求
class GetInfos {

    /**获取dao信息
     * @param {int} _daoId  dao ID
     * @returns 
    */
    async getDaoInfo(_daoId) {
        this.genegateContract()
        return await this.contract.methods.getSCInfo(_daoId).call({ from: this.account })
    }

    /** 获取 dao 的成员及票权
    * @param {*} _daoId  dao ID
    * @returns
    */
    async  getAccount_Votes(_daoId) {    
        this.genegateContract()
        let result=await  this.contract.methods.getAccount_Votes(_daoId).call({from: this.account})
        let _acar=[]
        for(let i=0;i<result.length;i++)
        {
            if(result[i]['account']!='0x0000000000000000000000000000000000000000') {
            _acar.push({account:result[i]["account"],vote:result[i]["vote"],memberIndex:i+1})
            } 
        }
        return _acar
    }
  
    genegateContract(){
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
    }

    constructor(_web3, _account,_address) {
        this.web3 = _web3;
        this.account = _account;
        this.address =_address;
        this.abi = abi
    }
}

module.exports = GetInfos