const daoToken_abi=require('../data/daoToken.json')

// DaoToken处理
 class DaoToken
{
       
    
    /**授权查询
    * @param {char[42]} _owneraddress  授权人
    * @param {char[42]} _spenneraddress  授权地址
    * @returns true/false
    */
    async allowanceGlobal(_owneraddress,_spenneraddress)
    {
        this.genegateContract()
        let result= await this.contract['allowanceGlobal'](_owneraddress,_spenneraddress);
        return {status:result}; 
    }


     /** token 全局授权,授权一次， 所有token 均被授权
     * @param {char[42]} _spaneraddress 授权地址
     * @param {boolean} _status 授权状态(true/false)
     * @returns 
     */
    async approveGlobal(_spaneraddress,_status) {
        this.genegateContract()
        // let gasLimit=await utils.estimateGas(this.contract,'approveGlobal',[_spaneraddress,_status],'100000')
        let re=  await this.contract['approveGlobal'](_spaneraddress,_status);
        await re.wait()
        return re;
    }

    /** 查询token余额
     * @param {int} _id token ID 也叫eip3712_id
     * @param {char[42]} _address 查询人
     * @returns 
     */
    async balanceOf(_id,_address) {
        this.genegateContract()
        let result= await this.contract['balanceOf'](_id,_address);
        return {token: this.ethers.formatEther(result),tokenWei:result.toString()};
    }
   
    // /**发布token, 只能发布一次
    //  * @param {int} _id  dao ID
    //  * @returns 
    //  */
    // async issue(_id) {
    //     this.genegateContract()
    //     let result= await this.contract.issue(_id);
    //     await result.wait()
    //     return result;
    // }

    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }

    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;
        this.abi=daoToken_abi
    }
}

module.exports=DaoToken