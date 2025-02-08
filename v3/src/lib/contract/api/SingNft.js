
const nft_abi=require('../data/DAismSingleNFT_abi.json')


class SingNft {
    
   
    async mintByBurnETH(_to,_ethValue,isNft) {
        this.genegateContract()
        let ethValue=this.ethers.parseEther(_ethValue+'')
        let tx = await this.contract['mintByBurnETH(address,bool)'].send(_to,isNft,{value: ethValue});
        await tx.wait();
        return tx;
    }

    // async mintBatch(dao_id,_addressAr,tipsAr,num) {  
    //     this.genegateContract()
    //     let result = await this.contract['mintBatch'].send(dao_id,_addressAr,tipsAr,num);
    //     await result.wait()
    //     return result
    // }

    
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

module.exports = SingNft