const abi=require('../data/SC_abi.json')

 class Dao {

    async addProposal(delegator,account,dividendRights,createTime,rights,antirights,desc,proposalType,fileType='svg',fileContent="0x54") {
        let contract= this.genegateContract(delegator)            
        let result = await contract['addProposal'].send({account,dividendRights,createTime,rights,antirights,desc,proposalType},{fileType,fileContent})
        await result.wait()
        return result
    }
  
    async vote(delegator,flag) {
        let contract= this.genegateContract(delegator)
        let result = await contract['vote'].send(flag);
        await result.wait()
        return result
    }

    async dividend(delegator,_address) {
        let contract= this.genegateContract(delegator)
        let result = await contract['dividend'](_address);
        return result
    }

    async getDividend(delegator,_address) {
        let contract= this.genegateContract(delegator)
        let result = await contract['getDividend'].send(_address);
        await result.wait()
        return result
    }
    
    async isVotable(delegator) {
        let contract= this.genegateContract(delegator)
        let res=await  contract['isVotable']();
        return res;
    }

    genegateContract(address){
        return new this.ethers.Contract(address,this.abi , this.signer);   
    }
      
    constructor(_ethers,_signer,_account) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.abi=abi

    }
}

module.exports=Dao