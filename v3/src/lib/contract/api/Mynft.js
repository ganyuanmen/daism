
const nft_abi=require('../data/DAismNFT_abi.json')


class Mynft {
    
    async mint(dao_id,_addrsss,tipAr) {  
        console.log(dao_id,_addrsss,tipAr)
        this.genegateContract()
        let result = await this.contract['mint'].send(dao_id,_addrsss,tipAr);
        await result.wait()
        return result
    }
    
    async mintBatch(dao_id,_addressAr,tipsAr,num) {  
        this.genegateContract()
        let result = await this.contract['mintBatch'].send(dao_id,_addressAr,tipsAr,num);
        await result.wait()
        return result
    }

    
    async getNFT(_id) {
           
        this.genegateContract()
        let result= await this.contract['getNFT'](_id);
        return result;
    }
  
      
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
    }

    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=nft_abi
    }
}

module.exports = Mynft