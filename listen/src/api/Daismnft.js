const utils = require("../utils");
const abi=require('../abi/DAismNFT_abi.json');
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');



class Daismnft extends BaseSubscription
{
    mintEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='mintEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
            const subscription=this.contract.events.Mint({filter: {},fromBlock: maxBlockNumber});
            subscription.on('data', async (data,_error)=> {
                if(!data || !data.returnValues) {utils.log("mintEvent error:",_error);throw _error;}
                    const release = await _this.parentThis.queueMutex.acquire();
                    try {
                        _this.parentThis.eventQueue.push(
                            {
                                type:'DaoToken.har',
                                fn:callbackFun,
                                data:utils.valueFactory(data,{
                                    "daoId": data.returnValues.scId,
                                    "to": data.returnValues.to,
                                    "tokenId": data.returnValues.tokenId
                                })
                            });
                            _this.parentThis.processQueue();
                    } finally {
                        release();
                    }
                }
            );
            subscription.on('error', (error) => {
                console.error('mintEvent Subscription  error:');
                setTimeout(() => {subscribe();}, 3000);
            
            });
            subscription.on('connected', (subscriptionId) => {
                console.log('mintEvent Subscription connected with ID:', subscriptionId);
            });

            
            _this.subscriptions.set(subscriptionKey, subscription);
            
        }
        subscribe();
    }

 
    // mintBatchEvent(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    //     this.installobj2=this.contract.events.MintBatch({filter: {},fromBlock: maxBlockNumber});
    //     this.installobj2
    //     .on('data', async function (data,_error) {
    //             if(!data || !data.returnValues) {utils.log("mintBatchEvent error:"+_error);throw _error;}
    //             console.log(data)
    //             // _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
    //             //     "daoId": data.returnValues._scId,
    //             //         "to": data.returnValues.to,
    //             //         "tokenId": data.returnValues.tokenId,
    //             //         "templateId": data.returnValues.templateId
    //             //     })
    //             //  })

    //         }
    //     )
    // }
    
    // mintEvent(maxBlockNumber, callbackFun) {
    //     const subscriptionKey = 'mintEvent';
    
    //     // 先取消已有订阅
    //     this.unsubscribe(subscriptionKey);
    
    //     const _this = this;
    
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    
    //     const subscribe = () => {const subscription = this.contract.events.Mint({ filter: {}, fromBlock: maxBlockNumber });
    
    //         // 保存当前订阅
    //         _this.parentThis[subscriptionKey] = subscription;
    
    //         subscription.on('data', async (data, _error) => {
    //             if (!data || !data.returnValues) {
    //                 console.error("mintEvent data error:", _error);
    //                 return;
    //             }
    
    //             const release = await _this.parentThis.queueMutex.acquire();
    //             try {
    //                 _this.parentThis.eventQueue.push({
    //                     type: 'DaoToken.har',
    //                     fn: callbackFun,
    //                     data: utils.valueFactory(data, {
    //                         daoId: data.returnValues.scId,
    //                         to: data.returnValues.to,
    //                         tokenId: data.returnValues.tokenId
    //                     })
    //                 });
    //                 _this.parentThis.processQueue();
    //             } finally {
    //                 release();
    //             }
    //         });
    
    //         subscription.on('error', (error) => {
    //             console.error('mintEvent Subscription error:', error.message || error);
    //             setTimeout(() => {
    //                 console.log('mintEvent 重新订阅中...');
    //                 subscribe(); // 3秒后重新订阅
    //             }, 3000);
    //         });
    
    //         subscription.on('connected', (subscriptionId) => {
    //             console.log('mintEvent Subscription connected with ID:', subscriptionId);
    //         });
    //     };
    
    //     // 首次订阅
    //     subscribe();
    // }

    
    async getNFT(_id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        let res= await this.contract.methods.getNFT(_id).call({ from: this.account })
       return res
    }

 

//    unsub()
//    {
//        try{
//            if(this.installobj1 && this.installobj1.unsubscribe) {
//             this.installobj1.unsubscribe();
//             this.installobj1.removeAllListeners();
//         }
//            this.installobj1=null;
//         //    if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();}
//         //    this.installobj2=null;
//         //    if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();}
//         //    this.installobj3=null;
//         //    if(this.installobj4 && this.installobj4.unsubscribe) {this.installobj4.unsubscribe();}
//         //    this.installobj4=null;

//        } catch(e){console.error(e);}
//    }

    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('Daismnft', this);
    }
}
module.exports=Daismnft