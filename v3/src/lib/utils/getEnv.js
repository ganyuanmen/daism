const crypto = require('crypto');

export function getEnv()
{
//  const  LOCAL_DOMAIN='sepolia.50satoshis.com';
 const  LOCAL_DOMAIN='holesky.50satoshis.com';
//  const  LOCAL_DOMAIN='daism.io';
  
  const BLOCKCHAIN_NETWORK='sepolia';
  // const  BLOCKCHAIN_NETWORK='holesky';
  // const  BLOCKCHAIN_NETWORK='mainnet';
 
  return {
    administrator:'0xB39D48f4167519ADa7a769875966907189CA13E2',
    networkName:BLOCKCHAIN_NETWORK,
    node_url:`=https://eth-${BLOCKCHAIN_NETWORK}.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad`,
    tx_url:`https://${BLOCKCHAIN_NETWORK}.etherscan.io/tx/`,
    domain:LOCAL_DOMAIN,
    KEY:'1d34a678S012A4567I90123m56789p1X',
    IV:'7e465a0de91b295946ddbc0e5e72f056',
    version:'v1.0.10',
    accountTotal:1024,

    //sepolia  //holesky
    Donation:'0x881fb354Af51924c41c79F090b4A9B07B46B4890',
    UnitNFT:'0x9B43031Fee739339569fB326927B8cAD1b5228E4',
    SCRegistrar:'0x9B98114Aa6B6f9978c517b5f350fA42171Cc59b2',
    DAismNFT:'0x5664057293B1D270Cb40b93493f7141a9DdeB0CE',
    DAismSingleNFT:'0x1eAddC834A115a7150c41Ad4E09FB7fb7eCdE37a',
    Commulate:'0x140Cb4497eAF4CC17719310D7E8Ea816E7811B3e',
    _IADD:'0x4312A944631bB6Dc429524f8613766dbCE76efD0',
    SC:'0xA8e1bb0FC7D7A3d7b14EC18BC36B4B66FFB1Eaa5',
    SCToken:'0x07239A579473245cdDaA8Cd08C72E81fF94F2e1A',
    UnitToken:'0xCcFbDd1f940146848aEd53e2aE4F5354882f0Ad3',
    DAismIADDProxy:'0x5A123D05A7c45b877be1cE39200351907B397F03',
    DAismDomain:'0x7a0453150EE99Db2AEf6561A4a063a71CbE126f8'

    //mainnet
    // Donation:'0x9E84d3DEfC7c4D333620ff5aa61a900f6AD42CEA',
    // UnitNFT:'0xf9b6Ed3C56387085d6949d884F71d30D955402Ef',
    // SCRegistrar:'0xdFBF69B7E5366FB3001C9a214dd85c5FE3f90bAe',
    // DAismNFT:'0x287CcB7533e7c911244467635596E039C0960ac9',
    // DAismSingleNFT:'0xaB0f69add0FEfB649a541DA4eFAD1e8879Ba2819',
    // Commulate:'0x5535Cd4c4C395F4c1E069Fc3ef07436996F5F251',
    // _IADD:'0xe7BCC24685B1E7898F72DEDE87A43Ccb00535fBC',
    // SC:'0x2661142b4E499c870144d3aF936Cf634775F9808',
    // SCToken:'0x1Aca8f89aDb28d32D38D568A3DDC00a2424B60c9',
    // UnitToken:'0xe40b05570d2760102c59bF4ffc9b47f921B67a1F',
    // DAismIADDProxy:'0xf856be785189329dE0B89d72CE0F9Af9A3Fd2d43',
    // DAismDomain:'0xbe930F53983c8822D1d8f970fc71081af78Ad3f6'


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

