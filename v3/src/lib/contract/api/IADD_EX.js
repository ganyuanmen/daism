
const iadd_ex_abi=require('../data/DAismIADDProxy_abi.json')


class IADD_EX {

    // recipient: SCToken接收地址
	// _isMintNFT : 打赏时是否mint 荣誉通证
	// _nftRecipient : 荣誉通证接收地址
    //_eth ,_id(sc_id),_uto(打赏),_minRatio（滑点）
    async ethToDaoToken(_eth,_id,_uto,_minRatio,recipient,_isMintNFT,_nftRecipient) {

        this.genegateContract()
        let _amount=this.ethers.parseEther(_eth+'')
        let _utotip=this.ethers.parseUnits(_uto+'',8)
        let min_amount=await this.contract.estimateEthToSCTokenByTip(_amount,_id,_utotip)
        let temp=parseFloat(this.ethers.formatEther(min_amount))
        let minratio=this.ethers.parseEther(temp*(1-_minRatio/100)+'')
        let res=await this.contract.ethToSCTokenByTip.send(minratio,_id,recipient,_id,_utotip,_isMintNFT,_nftRecipient,{value: _amount})
        await res.wait()
        return res
     }
    
    //  min_amount : 最少接收SCToken的数量
	// pool_id : iadd 池id(scId)
	// recipient: SCToken接收地址
	// _scId : 打赏给智能公器的scID
	// _tipUtokenAmount: 打赏的utoken数量
	// _isMintNFT : 打赏时是否mint 荣誉通证
	// _nftRecipient : 荣誉通

     async unitTokenToDaoToken(_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient) {
        this.genegateContract()
        let _amount=this.ethers.parseUnits(_value+'',8)
        let _utotip=this.ethers.parseUnits(_uto+'',8)

        let min_amount=await this.contract.estimateUnitTokenToSCTokenByTip(_amount,_id)
        let temp=parseFloat(this.ethers.formatUnits(min_amount,8))
        let minratio=this.ethers.parseUnits(temp*(1-_minRatio/100)+'',8)
       
        let ifa = new this.ethers.Interface(this.abi);
        //函数及参数的编码
        let functionData = ifa.encodeFunctionData('unitTokenToSCTokenByTip'
        ,[minratio,_id,recipient,_id,_utotip,_isMintNFT,_nftRecipient]);  
    
        //打包地址和函数
        let abicoder=new this.ethers.AbiCoder()
        let paras=abicoder.encode([ "address", "bytes" ], [this.address, functionData ]);

        let totalAmount=_amount+_utotip

        //回调
        let res=await this.utoken.transferWithCallback(this.address,totalAmount,paras)
        await res.wait()

        return res;
      }


  async daoTokenToUnitToken(_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient) {
        this.genegateContract()
        let _amount=this.ethers.parseEther(_value+'')
        let _utotip=this.ethers.parseUnits(_uto+'',8)
        let min_amount=await this.contract.estimateSCTokenToUnitTokenByTip(_amount,_id,_utotip)
        let temp=parseFloat(this.ethers.formatUnits(min_amount,8))
        let minratio=this.ethers.parseUnits((temp*(1-_minRatio/100)).toFixed(6),8)
        let ifa = new this.ethers.Interface(this.abi);
      
        //函数及参数的编码
        let functionData = ifa.encodeFunctionData('SCTokenToUnitTokenByTip'
        ,[minratio,_amount, _id,recipient,_id,_utotip,_isMintNFT,_nftRecipient]);  
    
        //打包地址和函数
        let abicoder=new this.ethers.AbiCoder()
        let paras=abicoder.encode([ "address", "bytes" ], [this.address, functionData]);
        
        //回调
        let res=await this.token.transferWithCallback(_id,this.address,_amount,paras)
        await res.wait()
        return res;

    }
  
    async DaoTokenToDaoToken(_value,_id1,_id2,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient,flag) {
        this.genegateContract()
        let _amount=this.ethers.parseEther(_value+'')
        let _utotip=this.ethers.parseUnits(_uto+'',8)
        
        let min_amount=await this.contract.estimateSCTokenToSCTokenByTip(_amount,_id1,_id2,_utotip)
        let temp= parseFloat(this.ethers.formatEther(min_amount[0]))
        let minratio=this.ethers.parseEther((temp*(1-_minRatio/100)).toFixed(6))   
        let ifa = new this.ethers.Interface(this.abi);
        //函数及参数的编码
        let functionData = ifa.encodeFunctionData('SCTokenToSCTokenByTip'
        ,[0,minratio,_amount,_id1,_id2,recipient,flag?_id2:_id1,_utotip,_isMintNFT,_nftRecipient]);  
        //打包地址和函数
        let abicoder=new this.ethers.AbiCoder()
        let paras=abicoder.encode([ "address", "bytes" ], [this.address, functionData ]);
   
        //回调
        let res=await this.token.transferWithCallback(_id1, this.address,_amount,paras)
        await res.wait()
        return res
      }

      
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
    }

    constructor(_ethers,_signer,_account,_address,utoken,token) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=iadd_ex_abi;
        this.utoken=utoken;
        this.token=token;
    }
}

module.exports = IADD_EX