const fs = require('node:fs');
const crypto = require('crypto');

export function getEnv()
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
    _daismAddress['domain']=process.env.LOCAL_DOMAIN
    _daismAddress['KEY']=process.env.KEY
    _daismAddress['IV']=process.env.IV
    _daismAddress['accountTotal']=process.env.SMART_COMMONS_COUNT  //允许的注册数量

  //  process.env.DAIMADDRESS=JSON.stringify(_daismAddress)

  return _daismAddress;

}

export function decrypt(ciphertext) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.KEY, Buffer.from(process.env.IV, 'hex'));
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


export function encrypt(text){
  const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

