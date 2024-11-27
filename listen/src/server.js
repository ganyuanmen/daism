


const { Web3 } = require('web3');
const Daoapi = require("./index")

class Server{

   async start() {
        this.web3 =  new Web3(process.env.WSS_URL.replace('${BLOCKCHAIN_NETWORK}',process.env.BLOCKCHAIN_NETWORK));
        this.daoapi = new Daoapi(this.web3, process.env.ADMINISTRUTOR_ADDRESS,process.env.BLOCKCHAIN_NETWORK);
    }
    async restart(){
        if (this.daoapi && this.daoapi.unsub) {this.daoapi.unsub()}
        if (this.web3 && this.web3.currentProvider && this.web3.currentProvider.close) {await web3.currentProvider.close();}
        await this.start()            
    }
    constructor() {
        this.daoapi=null
        this.web3=null
    }

 

}


module.exports = Server