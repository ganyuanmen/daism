const abi=require('../data/SCRegistrar_abi.json')

 class Register {
    //_bytes ='0x' 表示不需要mint NFT
    async createSC(daoinfo, memberAr,voteAr,_src,_type,_bytes,s,life,cool) {
        this.genegateContract()
        let result = await this.contract['createSC'].send(daoinfo, memberAr,voteAr
            ,s,life * 24 * 3600,cool * 24 * 3600,[_type,_src],_bytes);
        await result.wait()
        return result
    }

    async proposeUpdate(dao_id, newCreator) {
        
      this.genegateContract()
      let result = await this.contract['proposeUpdate'].send(dao_id, newCreator);
      await result.wait()
      return result
  }

  async toProxy(_id) {
    this.genegateContract()
    return await this.contract['toProxy'](_id);
    
}

    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }
      
    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;   
        this.abi=abi
      

    }
}

module.exports=Register