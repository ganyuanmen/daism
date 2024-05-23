
const nft_abi=require('../data/DAismNFT_abi.json')


class Mynft {
    
    async mintWithSvgTemplateAndTips(dao_id,_addrsss,svgAr,tipAr,isPublic) {  
        this.genegateContract()
        let result = await this.contract['mintWithSvgTemplateAndTips'].send(dao_id,_addrsss,svgAr,tipAr,isPublic);
        await result.wait()
        return result
    }
    
    async mintWithSvgBatchByTokenId(dao_id,template_id,_addrsss,num,tipAr) {  
        this.genegateContract()
        let result = await this.contract['mintWithSvgBatchByTokenId'].send(dao_id,template_id,_addrsss,num,tipAr);
        await result.wait()
        return result
    }


    async mintWithSvgTemplateId(dao_id,template_id,_addrsss,tipAr) {  
        this.genegateContract()
        let result = await this.contract['mintWithSvgTemplateId'].send(dao_id,template_id,_addrsss,tipAr);
        await result.wait()
        return result
    }
    async mintWithSvgTokenId(dao_id,token_id,_addrsss,tipAr) {  
        this.genegateContract()
        let result = await this.contract['mintWithSvgTokenId'].send(dao_id,token_id,_addrsss,tipAr);
        await result.wait()
        return result
    }
    
    async mintWithSvgTips(token_id,tipAr) {  
        this.genegateContract()
        let result = await this.contract['mintWithSvgTips'].send(token_id,tipAr);
        await result.wait()
        return result
    }
    
    async getTokenImageSvg(_id) {
           
        this.genegateContract()
        let result= await this.contract['getTokenImageSvg'](_id);
        return result;
    }
    async getSvgTemplate(_id) {
        this.genegateContract()
        let result= await this.contract['getSvgTemplate'](_id);
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