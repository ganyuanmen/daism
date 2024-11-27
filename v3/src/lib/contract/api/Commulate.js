const commulate_abi=require('../data/commulate.json')
/**
 * 查询兑换的结果
 */
class Commulate
{
     /**
     * utoken-->token
     * @param {number} _value  utoken 数值(单位：wei)
     * @param {int} _id   token ID
     * @returns 
     */
    
    async unitTokenToDaoToken(_value,_id) {
        this.genegateContract()
        return await this.contract['unitTokenToSCToken'](_value,_id);
    }
       
    /**
     * token-->utoken
     * @param {number} _value token数据(单位：wei)
     * @param {int} _id token ID
     * @returns 
     */
    async daoTokenToUnitToken(_value,_id) {
        this.genegateContract()
        return await this.contract['SCTokenToUnitToken'](_value,_id);
    }

    /**
     * token-->token
     * @param {number} _value 兑换token 值 (单位：wei)
     * @param {int} _id1 兑换token ID（from） 
     * @param {int} _id2 兑换给 token ID (to)
     * @returns 
     */
    async DaoTokenToDaoToken(_value,_id1,_id2) {
        this.genegateContract()
        return await this.contract['SCTokenToSCToken'](_value,_id1,_id2);
    }
  
    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }

    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;      
        this.address=_address;
        this.abi=commulate_abi
    }
}

module.exports=Commulate