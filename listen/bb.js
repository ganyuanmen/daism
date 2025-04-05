
const { Web3 } = require('web3');
const abi0 = require('./src/abi/SCC0LicenseManager_abi.json');
const abi1 = require('./src/abi/SCC0Whitelist_abi.json');
const addr0='0xB9aA2B8B72a1EDC1AEd8a90A775704A75a17a2BD';
const addr1='0xB7f3060885c3A75e04f09735273Bb0CCac7BdA4d';
const walletOwner='0x5aD91dCCD7b5F15A454213B36aaDa82a8FbD4ea2';
const web3Obj = new Web3('wss://eth-sepolia.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad', 'sepolia');




const contract0Obj = new web3Obj.eth.Contract(abi0, addr0, { from: walletOwner });
const contract1Obj = new web3Obj.eth.Contract(abi1, addr1, { from: walletOwner });

const listen1=contract0Obj.events.ManagerAdded({filter: {},fromBlock: 1});
listen1.on('data', async function (data,_error) {
          console.log(data.blockNumber,"CreatorAdded", data.returnValues)
      }
  )

const listen2=contract0Obj.events.ManagerRemoved({filter: {},fromBlock: 1});
listen2.on('data', async function (data,_error) {
          console.log(data.blockNumber,'CreatorRemoved',data.returnValues)
      }
  )

const listen3=contract0Obj.events.VersionAdded({filter: {},fromBlock: 1});
listen3.on('data', async function (data,_error) {
          console.log(data.blockNumber,'VersionAdded',data.returnValues)
      }
  )


const listen4=contract0Obj.events.DeprecatedVersionAdded({filter: {},fromBlock: 1});
listen4.on('data', async function (data,_error) {
          console.log(data.blockNumber,'DeprecatedVersionAdded',data.returnValues)
      }
  )


//-----------------------------
const listen5=contract1Obj.events.AuditorAdded({filter: {},fromBlock: 1});
listen5.on('data', async function (data,_error) {
          console.log(data.blockNumber,"AuditorAdded", data.returnValues)
      }
  )

const listen6=contract1Obj.events.AuditorRemoved({filter: {},fromBlock: 1});
listen6.on('data', async function (data,_error) {
          console.log(data.blockNumber,'AuditorRemoved',data.returnValues)
      }
  )

const listen7=contract1Obj.events.DAppWhitelisted({filter: {},fromBlock: 1});
listen7.on('data', async function (data,_error) {
          console.log(data.blockNumber,'DAppWhitelisted',data.returnValues)
      }
  )


const listen8=contract1Obj.events.DAppRemovedFromWhitelist({filter: {},fromBlock: 1});
listen8.on('data', async function (data,_error) {
          console.log(data.blockNumber,'DAppRemovedFromWhitelist',data.returnValues)
      }
  )