
const domain_abi=require('../data/DAismDomain_abi.json')


class Domain {

  
    async record(_id,_domain) {
           
        this.genegateContract()
        let result = await this.contract['record'].send(_id, _domain);
        await result.wait()
        return result
    }
    async daoId2Domain(_id) {
        this.genegateContract()
        let result= await this.contract['scId2Domain'](_id);
        return result;
    }
    
  
    
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
    }

    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=domain_abi
    }
}

module.exports = Domain