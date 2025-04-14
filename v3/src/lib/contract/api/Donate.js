
const abi=require('../data/Donation_abi.json')


class Donate {
    
    async donate(v) {  
        this.genegateContract()
        let _amount=this.ethers.parseEther(v+'')
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
        this.abi=abi
    }
}

module.exports = Donate