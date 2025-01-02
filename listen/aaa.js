//  const { ethers } = require("ethers");

// // 使用 Infura 的 provider
// const provider = new ethers.providers.InfuraProvider("mainnet", "https://mainnet.infura.io/v3/2e68e4d6017344cd89bab57981783954");

// async function getImplementationAddress(proxyAddress) {
//     const slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"; // EIP-1967 的实现地址槽
//     const rawStorage = await provider.getStorageAt(proxyAddress, slot);
//     const implementationAddress = ethers.utils.getAddress("0x" + rawStorage.slice(-40)); // 提取地址部分
//     return implementationAddress;
// }

// getImplementationAddress("0xdFBF69B7E5366FB3001C9a214dd85c5FE3f90bAe").then(console.log);


// import { ethers } from 'ethers';
const ethers=require('ethers')
const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/2e68e4d6017344cd89bab57981783954");

const address = '0xdFBF69B7E5366FB3001C9a214dd85c5FE3f90bAe';
const slot = 0; // Storage slot index

async function readStorage() {
    const storageValue = await provider.getStorage(address, slot);
    console.log(storageValue);
}

readStorage();