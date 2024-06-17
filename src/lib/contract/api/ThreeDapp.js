

const abi=require('../data/ThreeDapp_abi.json')

 class ThreeDapp {

    /**
     * @param {char(42)} _address //第三方dapp地址
     * @param {*} _name //smart common 名称 
     * @param {*} _symbol //smart common 代币名称
     * @param {*} _desc  //smart common 描述
     * @param {*} _manager  //smart common管理员 
     * @param {*} _members  //smart common 成员列表 
     * @param {*} _votes  //smart common 票权列表
     * @param {*} _imgstr  //smart common logo svg 内容
     * @param {*} _num  // nft 每成员份数
     * @returns 
     */
    async mintScAndNFT(_address,_name,_symbol,_desc,_manager,_members,_votes,_imgstr,_num) {
        let contract= this.genegateContract(_address)
        let daoinfo=[_name,_symbol,_desc,_manager,1]           
        let result = await contract['mintScAndNFT'].send(daoinfo,_members,_votes,(2 ** 16-1).toString(),7 * 24 * 3600,9 * 24 * 3600,['svg',_imgstr],_num)
        await result.wait()
        return result
    }
 

    genegateContract(address){
        return new this.ethers.Contract(address,this.abi , this.signer);   
    }
      
    constructor(_ethers,_signer,_account) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.abi=abi

    }
}

module.exports=ThreeDapp

