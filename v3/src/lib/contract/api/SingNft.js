
const nft_abi=require('../data/DAismSingleNFT_abi.json')
import { toUtf8Bytes  } from 'ethers';

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

        /**
         * 打赏
         * @param {*} _utokenAmount uto 数量
         * @param {*} _recipient  接收打赏的地址
         * @param {*} _nftRecipient  mint NFT接收地址
         * @param {*} _isMintNFT  是否mint NFT
         * @returns 
         */
    async mintTip(_utokenAmount,_recipient,_nftRecipient,_isMintNFT,_id) {
        this.genegateContract()
        let _amount=this.ethers.parseUnits(_utokenAmount+'',8)
        
        // let _utotip=this.ethers.parseUnits(_uto+'',8)

        // let min_amount=await this.contract.estimateUnitTokenToSCTokenByTip(_amount,_id)
        // let temp=parseFloat(this.ethers.formatUnits(min_amount,8))
        // let minratio=this.ethers.parseUnits(temp*(1-_minRatio/100)+'',8)
       
        let ifa = new this.ethers.Interface(this.abi);
        //函数及参数的编码
        let functionData = ifa.encodeFunctionData('mintForAddressByTipUTokenCallBack'
        ,[_amount,_recipient,_nftRecipient,_isMintNFT,toUtf8Bytes(_id)]);  
    
        //打包地址和函数
        let abicoder=new this.ethers.AbiCoder()
        let paras=abicoder.encode([ "address", "bytes" ], [this.address, functionData ]);


        // let totalAmount=_amount+_utotip

        //回调
        let res=await this.utoken.transferWithCallback(this.address,_amount,paras)
        await res.wait()

        return res;
      }

    async getNFT(_id) {
           
        this.genegateContract()
        let result= await this.contract['getNFT'](_id);
        return result;
    }
  
      
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
    }

    constructor(_ethers,_signer,_account,_address,utoken) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=nft_abi;
        this.utoken=utoken;
    }
}

module.exports = SingNft