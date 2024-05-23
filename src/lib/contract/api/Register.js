const JSZip= require('jszip')

 class Register {

    async createSC(daoinfo, memberAr,voteAr,_src,_type) {
        
        this.genegateContract()
        let result = await this.contract['createSC'].send(daoinfo, memberAr,voteAr
            ,(2 ** 16-1).toString(),7 * 24 * 3600,9 * 24 * 3600,[_type,_src]);
        await result.wait()
        return result
    }

    async proposeUpdate(dao_id, newCreator) {
        
      this.genegateContract()
      let result = await this.contract['proposeUpdate'].send(dao_id, newCreator);
      await result.wait()
      return result
  }

  async toProxy(_id) {
    this.genegateContract()
    return await this.contract['toProxy'](_id);
    
}

    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }
      
    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;   
        this.abi=[{"inputs": [
              {
                "components": [
                  {"internalType": "string","name": "name","type": "string"},
                  {"internalType": "string","name": "symbol","type": "string"},
                  {"internalType": "string","name": "desc","type": "string"},
                  {"internalType": "address","name": "manager","type": "address"},
                  {"internalType": "uint16","name": "version","type": "uint16"}
                ],
                "internalType": "struct SCInfo",
                "name": "_SCInfo",
                "type": "tuple"
              },
              {"internalType": "address[]","name": "_members","type": "address[]"},
              {"internalType": "uint16[]","name": "_dividendRights","type": "uint16[]"},
              {"internalType": "uint16","name": "_strategy","type": "uint16"},
              {"internalType": "uint32","name": "_lifetime","type": "uint32"},
              {"internalType": "uint32","name": "_coolingPeriod","type": "uint32"},
              {
                "components": [
                  {"internalType": "string","name": "fileType","type": "string"},
                  {"internalType": "bytes","name": "fileContent","type": "bytes"}
                ],
                "internalType": "struct File",
                "name": "_logo",
                "type": "tuple"
              }
            ],
            "name": "createSC",
            "outputs": [
              {"internalType": "uint256","name": "","type": "uint256"}
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256","name": "SC_id", "type": "uint256"
              },
              {
                "internalType": "address","name": "_newCreator", "type": "address"
              }
            ],
            "name": "proposeUpdate", "outputs": [], "stateMutability": "nonpayable", "type": "function"
          },
          {"inputs": [
              {"internalType": "uint256","name": "","type": "uint256"}
            ],
            "name": "toProxy",
            "outputs": [{"internalType": "address","name": "","type": "address"}],
            "stateMutability": "view",
            "type": "function"
          },
        
        ]

    }
}

module.exports=Register