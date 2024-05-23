const JSZip= require('jszip')

 class DaoLogo {

    async addLogo(id, logo,_type) {
        
        this.genegateContract()
        let result = await this.contract['addLogo'].send(id, [_type,logo]);
        await result.wait()
        return result
    }

    genegateContract(){
        if(!this.contract)  this.contract=new this.ethers.Contract(this.address,this.abi , this.signer);   
        return this.contract
    }
      
    constructor(_ethers,_signer,_account,_address) {
        this.signer=_signer;this.ethers=_ethers;
        this.account=_account;
        this.address=_address;   
        this.abi=[{
            "inputs": [
              {"internalType": "uint256","name": "SC_id","type": "uint256"},
              {"components": [{"internalType": "string","name": "fileType","type": "string"},
                  {"internalType": "bytes","name": "fileContent","type": "bytes"}
                ],
                "internalType": "struct File",
                "name": "SC_logo",
                "type": "tuple"
              }
            ],
            "name": "addLogo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }]

    }
}

module.exports=DaoLogo