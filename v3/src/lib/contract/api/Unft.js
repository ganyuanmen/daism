
const nft_abi=require('../data/UnitNFT_abi.json')


class Unft {
    
    async mint() {  
        this.genegateContract()
        let _amount=this.ethers.parseEther('0.02')
        let result = await this.contract['donate'].send({value: _amount});
        await result.wait()
        return result
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

module.exports = Unft