const fs = require("fs");

export function handleEnv()
{
    let _daismAddress
    if(process.env.NODE_ENV==='development') { 
         _daismAddress=require('../../../config/address.json')
    }
    else {
      
        let _daismAddress1 = fs.readFileSync("/app/config/address.json",'utf8')
        _daismAddress=JSON.parse(_daismAddress1)
    }

    //插入administrator ，方便传到前端
    _daismAddress['administrator']=process.env.ADMINISTRUTOR_ADDRESS
    _daismAddress['networkName']=process.env.BLOCKCHAIN_NETWORK
    _daismAddress['node_url']=process.env.HTTPS_URL
    _daismAddress['tx_url']=process.env.ETHERSCAN_URL
    process.env.DAIMADDRESS=JSON.stringify(_daismAddress)

}