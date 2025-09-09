// const uToken_abi=require('../abi/UnitToken_abi.json');
// // const iadd_abi=require('../abi/_IADD_abi.json');
// const utils = require("../utils");

//  // utoken事件
//  class UnitToken
// {
   
//     //eth 兑换 token事件
//     swapEvent(maxBlockNumber,callbackFun) {
//         const _this = this;
//         if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
//         this.swapObj1=this.contract.events.Swap({filter: {},fromBlock: maxBlockNumber})
//         this.swapObj1.on('data',async  function (data,_error) {
//             if(!data || !data.returnValues) {utils.log("swapEvent error");throw _error;}    
//               _this.e2uAr.push({fn:callbackFun,data:utils.valueFactory(data,{
//                     "address": data.returnValues[0], //兑换地址
//                     "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[1],'ether')).toFixed(6), 
//                     "utokenAmount":parseFloat(data.returnValues[2])/100000000
//                     //parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(6)
//                 })
//              })
//             }
//         )
//     }

//     //   //转帐 事件
//     //   transfer(maxBlockNumber,callbackFun) {
//     //     const _this = this;
//     //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
//     //     this.swapObj3=this.contract.events.Transfer({filter: {}, fromBlock: maxBlockNumber}, 
//     //         async function (_error, data) {
//     //             if(!data || !data.returnValues) {utils.log("swapByGasToken error"); throw _error;}
//     //             console.log(data)
//     //             // callbackFun.call(null,utils.valueFactory(data,
//     //             //     {
//     //             //         "fromAddress": data.returnValues[0],
//     //             //         "toAddress": data.returnValues[1],
//     //             //         "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(6),
//     //             //         "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[3],'ether')).toFixed(6),
//     //             //         "swapTime":await utils.getTime(_this.web3,data.blockNumber)
//     //             //     },
//     //             // "swapByGasToken")
//     //             // )
//     //         }
//     //     )
//     // }

    

      
//     //取消订阅
//     unsub()
//     {
//         try{
//             if(this.swapObj1 && this.swapObj1.unsubscribe) this.swapObj1.unsubscribe();
//             // if(this.swapObj2 && this.swapObj2.unsubscribe) this.swapObj2.unsubscribe();
//             // if(this.swapObj3 && this.swapObj3.unsubscribe) this.swapObj3.unsubscribe();
//             this.swapObj1=null;
//             //  this.swapObj2=null; this.swapObj3=null;  
//         }
//         catch(e){ console.error(e); }
//     }

   
//     constructor(_web3,_address) {
//         this.web3=_web3;
//         this.address=_address;
//         this.abi=uToken_abi
//         this.e2uAr=[]
//       }
//   }
  
//   module.exports=UnitToken