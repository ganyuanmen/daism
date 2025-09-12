const uToken_abi=require('../abi/UnitToken_abi.json');
// const iadd_abi=require('../abi/_IADD_abi.json');
const utils = require("../utils");
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

 // utoken事件
 class UnitToken extends BaseSubscription
{
   
    //eth 兑换 token事件
    swapEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='swapEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
            const subscription=this.contract.events.Swap({filter: {},fromBlock: maxBlockNumber})
            subscription.on('data',async  function (data,_error) {
                if(!data || !data.returnValues) {utils.log("swapEvent error");throw _error;}   
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                            "address": data.returnValues[0], //兑换地址
                            "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[1],'ether')).toFixed(6), 
                            "utokenAmount":parseFloat(data.returnValues[2])/100000000
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                } 
            }
            
        );
        subscription.on('error', () => {
            console.error('swapEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('swapEvent Subscription connected with ID:', subscriptionId);
        });

        
        _this.subscriptions.set(subscriptionKey, subscription);
        
      }
      subscribe();
    }

    //   //转帐 事件
    //   transfer(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    //     this.swapObj3=this.contract.events.Transfer({filter: {}, fromBlock: maxBlockNumber}, 
    //         async function (_error, data) {
    //             if(!data || !data.returnValues) {utils.log("swapByGasToken error"); throw _error;}
    //             console.log(data)
    //             // callbackFun.call(null,utils.valueFactory(data,
    //             //     {
    //             //         "fromAddress": data.returnValues[0],
    //             //         "toAddress": data.returnValues[1],
    //             //         "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(6),
    //             //         "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[3],'ether')).toFixed(6),
    //             //         "swapTime":await utils.getTime(_this.web3,data.blockNumber)
    //             //     },
    //             // "swapByGasToken")
    //             // )
    //         }
    //     )
    // }

    

      
    // //取消订阅
    // unsub()
    // {
    //     try{
    //         if(this.swapObj1 && this.swapObj1.unsubscribe) this.swapObj1.unsubscribe();
    //         // if(this.swapObj2 && this.swapObj2.unsubscribe) this.swapObj2.unsubscribe();
    //         // if(this.swapObj3 && this.swapObj3.unsubscribe) this.swapObj3.unsubscribe();
    //         this.swapObj1=null;
    //         //  this.swapObj2=null; this.swapObj3=null;  
    //     }
    //     catch(e){ console.error(e); }
    // }

   
    // constructor(_web3,_address) {
    //     this.web3=_web3;
    //     this.address=_address;
    //     this.abi=uToken_abi
    //     this.e2uAr=[]
    //   }

    constructor(_web3,_address,_parentThis) {
        super();
        this.web3=_web3; 
        this.address=_address;
        this.abi=uToken_abi
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('UnitToken', this);
    }
  }
  
  module.exports=UnitToken