const utils = require("../utils");
const abi=require('../abi/DAismSingleNFT_abi.json');
const {  toUtf8String  } = require("ethers");
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

class Daismnftsing extends BaseSubscription
{
    // mintEvent(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    //     this.installobj1=this.contract.events.MintTip({filter: {},fromBlock: maxBlockNumber});
    //     this.installobj1
    //     .on('data', async function (data,_error) {
    //             if(!data || !data.returnValues) {utils.log("mintEvent error:"+_error);throw _error;}
    //             _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
    //                 "daoId": data.returnValues.scId,
    //                 "to": data.returnValues.to,
    //                 "mark":data.returnValues.mark,
    //                 "utokenAmount":parseFloat(data.returnValues.utokenAmount)/100000000,
    //                 "tokenId": data.returnValues.tokenId
    //                 })
    //              })
    //         }
    //     )
    // }

    mintTipEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='mintTipEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
            const subscription=this.contract.events.MintForAddressTip({filter: {},fromBlock: maxBlockNumber});
            subscription.on('data', async (data,_error)=> {
                    if(!data || !data.returnValues) {utils.log("mintTipEvent error:",_error);throw _error;}
                    const release = await _this.parentThis.queueMutex.acquire();
                    try {
                        _this.parentThis.eventQueue.push(
                            {
                                type:'DaoToken.har',
                                fn:callbackFun,
                                data:utils.valueFactory(data,{
                                    "daoId": data.returnValues.scId,
                                    "to": data.returnValues.nftTo,
                                    "tipto": data.returnValues.tipTo,
                                    "utokenAmount":parseFloat(data.returnValues.utokenAmount)/100000000,
                                    "tokenId": data.returnValues.tokenId,
                                    "id":toUtf8String(data.returnValues.data)
                                })
                            });
                            _this.parentThis.processQueue();
                    } finally {
                        release();
                    }
                }
            );
            subscription.on('error', (error) => {
                console.error('mintTipEvent Subscription  error:');
                setTimeout(() => {subscribe();}, 3000);
            });
            subscription.on('connected', (subscriptionId) => {
                console.log('mintTipEvent Subscription connected with ID:', subscriptionId);
            });
            _this.subscriptions.set(subscriptionKey, subscription);
        }
        subscribe();
    }


    mintBatchEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='mintBatchEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
        const subscription=this.contract.events.MintBatch({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async (data,_error)=> {
                if(!data || !data.returnValues) {utils.log("MintBatchEvent error:",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "daoId": data.returnValues.scId,
                                "to": data.returnValues.to,
                                "tokenIds": data.returnValues.tokenIds
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }

            }
        );
        subscription.on('error', (error) => {
            console.error('mintBatchEvent Subscription  error:');
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('mintBatchEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

    // mintBurnEvent(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
    //     this.installobj3=this.contract.events.MintBurn({filter: {},fromBlock: maxBlockNumber});
    //     this.installobj3
    //     .on('data', async function (data,_error) {
    //             if(!data || !data.returnValues) {utils.log("MintBatchEvent error:"+_error);throw _error;}
    //             _this.daotoken.har.push({fn:callbackFun,data:utils.valueFactory(data,{
    //                 "daoId": data.returnValues.scId,
    //                 "to": data.returnValues.nftTo,
    //                 "tokenId": data.returnValues.tokenId,
    //                 "mark": data.returnValues.mark,
    //                 "ethBurn": parseFloat(parseFloat(_this.web3.utils.fromWei(data.returnValues.ethBurn,'ether')).toFixed(6))
    //                 })
    //              })
    //         }
    //     )
    // }

 

    async getNFT(_id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        let res= await this.contract.methods.getNFT(_id).call({ from: this.account })
       return res
    }

  
//    unsub()
//    {
//        try{
//         //    if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();}
//         //    this.installobj1=null;
//            if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();this.installobj2.removeAllListeners();}
//            this.installobj2=null;
//         //    if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();}
//         //    this.installobj3=null;
//            if(this.installobj4 && this.installobj4.unsubscribe) {this.installobj4.unsubscribe();this.installobj4.removeAllListeners();}
//            this.installobj4=null;
        
        

//        } catch(e){console.error(e);}
//    }

    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi;
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('Daismnftsing', this);
    }
}
module.exports=Daismnftsing