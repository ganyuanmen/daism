const uToken_abi=require('../data/unitToken.json')

 //utoken 处理类
 class UnitToken
{
   

    /** 查询utoken余额
     * @param {char[42]} _address 查询人
     * @returns 
     */
    async balanceOf(_address) {
        this.genegateContract()
        if(this.contract['balanceOf']) {
            try{
                let result= await this.contract['balanceOf'](_address)
                return {utoken: this.ethers.formatUnits(result,8),utokenWei:result.toString()};
            }catch(e){
                console.error(e);
                return {utoken: '0',utokenWei:'0'};
            }
        }
        else 
            return {utoken: '0',utokenWei:'0'};
    }

    
    /** 查询ethTotoken 的最小值
     * @param {int} _eth 
     * @returns 
     */
    async getOutputAmount(_ethWei) {
        this.genegateContract()
        return await this.contract['getOutputAmount'](_ethWei);
    }


    /** 查询utoken授权信息
     * @param {char[42]} _owneraddress 授权人
     * @param {char[42]} _speneraddress 授权地址
     * @returns 
     */
    async allowance(_owneraddress,_speneraddress) {
        this.genegateContract()
        let result= await this.contract['allowance'](_owneraddress,_speneraddress);
        return {approveSumWei: result.toString(),approveSum:this.ethers.formatEther(result)};
    }

    /** utoken 授权
     * @param {char[42]} _spaneraddress 授权地址
     * @param {number} _amount 授权数量
     * @returns 
     */
    async  approve(_spaneraddress,_amount) {
        this.genegateContract()
        let amount=this.ethers.parseEther(_amount+'')
        let tx=  await  this.contract['approve'].send(_spaneraddress,amount);
        await tx.wait();
        return tx;
    }

    /**
     * eth 兑换 utoken 把携带的eth兑换为utoken 指定eth
     * @param {address} _to  兑换给的地址
     * @param {address} _ethValue 兑换的eth数量
     * @returns 
     */
    async swap(_to,_ethValue) {
        this.genegateContract()
        let ethValue=this.ethers.parseEther(_ethValue+'')
        let tx = await this.contract['swap'].send(_to,{value: ethValue});
        await tx.wait();
        return tx;
    }

    async transferWithCallback(_address,_amount,_data) {
        this.genegateContract()
        let tx = await this.contract['transferWithCallback'].send(_address,_amount,_data);
        await tx.wait();
        return tx;
    }

      
    // async swapGas(_to,_ethValue) {
    //     this.genegateContract()
    //     let ethValue=this.ethers.parseEther(_ethValue+'')
    //     let feeData = await this.signer.provider.getFeeData()
    //     let gasUsed=await this.contract['swap'].estimateGas(_to,{value: ethValue});

    //     let gas=(feeData.gasPrice+feeData.maxPriorityFeePerGas)*gasUsed
     

    //     return this.ethers.formatUnits(gas,'gwei')    
        
    //     // let code=this.contract.interface.encodeFunctionData('swap',[_to])
    //     // let gas1=await this.signer.provider.estimateGas(this.address,code)      
    // }

    // /**
    //  * eth 兑换 utoken 指定utoken
    //  * @param {address} _to 
    //  * @param {address} _utoken  得到utoken数量
    //  * @returns 
    //  */
    // async swapExactUnitToken(_to,_utoken) {
    //     this.genegateContract()
    //     let utoken=this.ethers.parseEther(_utoken+'')
    //    // let gasLimit=await utils.estimateGas(this.contract,'swapExactUnitToken',[_to,utoken],'100000')
    //    // let tx = await this.contract.swapExactUnitToken(_to,utoken,gasLimit);
    //    let tx = await this.contract.swapExactUnitToken(_to,utoken);
    //     await tx.wait();
    //     return tx;
    // }

  

    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract;
    }
    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=uToken_abi
      }
  }
  
  module.exports=UnitToken