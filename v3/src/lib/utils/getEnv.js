const crypto = require('crypto');

// const fs = require('node:fs');
// export function getEnv()
// {
//     let _daismAddress
//     if(process.env.NODE_ENV==='development') { 
//          _daismAddress=require('../../../config/address.json')
//     }
//     else {
      
//         let _daismAddress1 = fs.readFileSync("/app/config/address.json",'utf8')
//         _daismAddress=JSON.parse(_daismAddress1)
//     }
//     //插入administrator ，方便传到前端
//     _daismAddress['administrator']=process.env.ADMINISTRUTOR_ADDRESS
//     _daismAddress['networkName']=process.env.BLOCKCHAIN_NETWORK
//     _daismAddress['node_url']=process.env.HTTPS_URL
//     _daismAddress['tx_url']=process.env.ETHERSCAN_URL
//     _daismAddress['domain']=process.env.LOCAL_DOMAIN
//     _daismAddress['KEY']=process.env.KEY
//     _daismAddress['IV']=process.env.IV
//     _daismAddress['version']=process.env.VERSION
//     _daismAddress['accountTotal']=process.env.SMART_COMMONS_COUNT  //允许的注册数量
//   return _daismAddress;

// }

export function getEnv()
{

  const  LOCAL_DOMAIN='daism.io';
  const  BLOCKCHAIN_NETWORK='mainnet';
  return {
    administrator:'0xB39D48f4167519ADa7a769875966907189CA13E2',
    networkName:BLOCKCHAIN_NETWORK,
    node_url:`=https://eth-${BLOCKCHAIN_NETWORK}.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad`,
    tx_url:`https://${BLOCKCHAIN_NETWORK}.etherscan.io/tx/`,
    domain:LOCAL_DOMAIN,
    KEY:'1d34a678S012A4567I90123m56789p1X',
    IV:'7e465a0de91b295946ddbc0e5e72f056',
    version:'v1.2.0',
    accountTotal:1024,

    //mainnet
    Donation:'0x9E84d3DEfC7c4D333620ff5aa61a900f6AD42CEA',
    UnitNFT:'0xf9b6Ed3C56387085d6949d884F71d30D955402Ef',
    SCRegistrar:'0xdFBF69B7E5366FB3001C9a214dd85c5FE3f90bAe',
    DAismNFT:'0x287CcB7533e7c911244467635596E039C0960ac9',
    DAismSingleNFT:'0xaB0f69add0FEfB649a541DA4eFAD1e8879Ba2819',
    Commulate:'0x5535Cd4c4C395F4c1E069Fc3ef07436996F5F251',
    _IADD:'0xe7BCC24685B1E7898F72DEDE87A43Ccb00535fBC',
    SC:'0x2661142b4E499c870144d3aF936Cf634775F9808',
    SCToken:'0x1Aca8f89aDb28d32D38D568A3DDC00a2424B60c9',
    UnitToken:'0xe40b05570d2760102c59bF4ffc9b47f921B67a1F',
    DAismIADDProxy:'0xf856be785189329dE0B89d72CE0F9Af9A3Fd2d43',
    DAismDomain:'0xbe930F53983c8822D1d8f970fc71081af78Ad3f6'


  };

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

