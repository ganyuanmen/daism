const iadd_abi=require('../data/iadd.json')
/**
 * IADD 网络兑换
 */
class IADD
{
  
     /**
     * eth-->token
     * @param {number} _eth utoken 值
     * @param {int} _id  token ID
     * @param {number} _minRatio  滑点值
     * @returns 
     */
     async ethToDaoToken(_eth,_id,_minRatio) {

        this.genegateContract()
        let _amount=this.ethers.parseEther(_eth+'')
        let minUtoken= await this.utoken.getOutputAmount(_amount)
        let minDaotoken=await this.commulate.unitTokenToDaoToken(minUtoken[0].toString(),_id)
        let temp=parseFloat(this.ethers.formatEther(minDaotoken))
        let minratio=this.ethers.parseEther(temp*(1-_minRatio/100)+'')
        let result= await this.contract['ethToSCToken'].send(minUtoken[0].toString(),minratio,_id,this.account,{value: _amount});
        await result.wait();
        return result;
     }
   
     async ethToDaoTokenGas(_eth,_id) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_eth+'')
      let minUtoken= await this.utoken.getOutputAmount(_amount)
      let feeData = await this.signer.provider.getFeeData()
      let gasUsed=await this.contract['ethToSCToken'].estimateGas(minUtoken[0],0,_id,this.account,{value: _amount})   
      let gas=(feeData.gasPrice+feeData.maxPriorityFeePerGas)*gasUsed
      return this.ethers.formatUnits(gas,'gwei')      
   }
     
    /**
     * utoken-->token
     * @param {number} _value utoken 值
     * @param {int} _id  token ID
     * @param {number} _minRatio  滑点值
     * @returns 
     */
    async unitTokenToDaoToken(_value,_id,_minRatio) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_value+'').toString()
      let min_amount= await this.commulate.unitTokenToDaoToken(_amount,_id);    
      let temp= parseFloat(this.ethers.formatEther(min_amount))
      let minratio=this.ethers.parseEther(temp*(1-_minRatio/100)+'')
      let result= await this.contract['unitTokenToSCToken'].send(minratio,_amount,_id,this.account);
       await result.wait();
       return result;
    }

    async unitTokenToDaoTokenGas(_value,_id) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_value+'').toString()
      let feeData = await this.signer.provider.getFeeData()
      let gasUsed=await this.contract['unitTokenToSCToken'].estimateGas(0,_amount,_id,this.account)   
      let gas=(feeData.gasPrice+feeData.maxPriorityFeePerGas)*gasUsed
      return this.ethers.formatUnits(gas,'gwei')           
   }
   
    /**
     * token-->utoken
     * @param {number} _value token数据
     * @param {int} _id token ID
     * @param {number} _minRatio  滑点值
     * @returns 
     */
    async daoTokenToUnitToken(_value,_id,_minRatio) {
        this.genegateContract()
        let _amount=this.ethers.parseEther(_value+'').toString()
        let min_amount= await this.commulate.daoTokenToUnitToken(_amount,_id);
        let temp= parseFloat(this.ethers.formatEther(min_amount))
        let minratio=this.ethers.parseEther(temp*(1-_minRatio/100)+'')
        let result= await this.contract['SCTokenToUnitToken'].send(minratio,_amount,_id,this.account);
        await result.wait()
        return result;
    }

    async daoTokenToUnitTokenGas(_value,_id) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_value+'').toString()
      let feeData = await this.signer.provider.getFeeData()
      let gasUsed=await this.contract['SCTokenToUnitToken'].estimateGas(0,_amount,_id,this.account)
      let gas=(feeData.gasPrice+feeData.maxPriorityFeePerGas)*gasUsed
      return this.ethers.formatUnits(gas,'gwei')            
  }
  
    /**
     * token-->token
     * @param {number} _value 兑换token 值
     * @param {int} _id1 兑换token ID（from）
     * @param {int} _id2 兑换给 token ID (to)
     * @param {number} _minRatio  滑点值
     * @returns 
     */
    async DaoTokenToDaoToken(_value,_id1,_id2,_minRatio) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_value+'').toString()
      let min_amount= await this.commulate.DaoTokenToDaoToken(_amount,_id1,_id2);
      let temp= parseFloat(this.ethers.formatEther(min_amount[0]))
      let minratio=this.ethers.parseEther(temp*(1-_minRatio/100)+'')
      let result= await this.contract['SCTokenToSCToken'].send(0, minratio, _amount,_id1,_id2,this.account);
      await result.wait()
      return result;
    }

    async DaoTokenToDaoTokenGas(_value,_id1,_id2) {
      this.genegateContract()
      let _amount=this.ethers.parseEther(_value+'').toString()
      let feeData = await this.signer.provider.getFeeData()
      let gasUsed=await this.contract['SCTokenToSCToken'].estimateGas(0, 0, _amount,_id1,_id2,this.account);
      let gas=(feeData.gasPrice+feeData.maxPriorityFeePerGas)*gasUsed
      return this.ethers.formatUnits(gas,'gwei')   

    }
  


    async getPool(_id) {
        this.genegateContract()
        let result= await this.contract['pools'](_id);
        let utoken=parseFloat(this.ethers.formatEther(result.unit_token_supply))
        let token=parseFloat(this.ethers.formatEther(result.eip3712_supply))
        let price=utoken/token-0.01
        return {utoken,token,price};

    }
   
     
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }

    constructor(_ethers,_signer,_account,_commulate,_utoken,_address) {
        this.utoken=_utoken
        this.commulate=_commulate;
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=iadd_abi
       }
   }
   
   module.exports=IADD