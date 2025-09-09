const utils = require("../utils");
const eventSum_abi=require('../abi/SCEventEmit_abi.json');
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

// const abiDecoder = require('abi-decoder'); // NodeJS
// abiDecoder.addABI(fabi);

class EventSum extends BaseSubscription
{
    async  addProposal(maxBlockNumber,callbackFun) {
        const subscriptionKey='addProposal';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        const subscribe=()=>{
         const subscription=this.contract.events.AddProposal({filter: {}, fromBlock: maxBlockNumber}) 
         subscription.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("addProposal error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "delegator": data.returnValues['emiter'],
                                "account":data.returnValues['account'],
                                "dividendRights":data.returnValues['dividendRights'],
                                "proposalType":data.returnValues['proposalType'],
                                "_time":data.returnValues['_time']
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );subscription.on('error', (error) => {
            console.error('addProposal Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('addProposal Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

     async  voteEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='voteEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        const subscribe=()=>{
        const subscription=this.contract.events.Vote({filter: {}, fromBlock: maxBlockNumber}) 
        subscription.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("voteEvent error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har1',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "delegator": data.returnValues['emiter'], 
                                "antirights":data.returnValues['antirights'], 
                                "rights":data.returnValues['rights'], 
                                "proposalType":data.returnValues['proposalType'],
                                "createTime":data.returnValues['_proposalTime'],
                                "_time":data.returnValues['_time']
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );subscription.on('error', (error) => {
            console.error('voteEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('voteEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
    }
    subscribe();
    }

    async  execEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='execEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        const subscribe=()=>{
        const subscription=this.contract.events.Exec({filter: {}, fromBlock: maxBlockNumber})         
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("execEvent error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har3',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "delegator": data.returnValues['emiter'], 
                                "dividendRights":data.returnValues['dividendRights'], 
                                "account":data.returnValues['account'],
                                "account":data.returnValues['account'],
                                "proposalType": data.returnValues['proposalType'],
                                "_time":data.returnValues['_time']
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }

            }
        );subscription.on('error', (error) => {
            console.error('execEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('execEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }
    //分红
    async  getDividendEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='getDividendEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        const subscribe=()=>{
        const subscription=this.contract.events.GetDividend({filter: {}, fromBlock: maxBlockNumber})
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("getDividendEvent error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har2',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "delegator": data.returnValues['emiter'], 
                                "account":data.returnValues['to'], 
                                "dao_owner":data.returnValues['owner'], 
                                "utoken_amount":parseFloat(data.returnValues.amount)/100000000,
                                "pre_time":data.returnValues['_time']
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('getDividendEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        })
        subscription.on('connected', (subscriptionId) => {
            console.log('getDividendEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
    }
    subscribe();
        // return subscription;
    }
    //成员变动
     async  accountDividendRight(maxBlockNumber,callbackFun) {
        const subscriptionKey='accountDividendRight';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        const subscribe=()=>{
        const subscription=this.contract.events.AccountDividendRight({filter: {}, fromBlock: maxBlockNumber})
        subscription.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("accountDividendRight error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har3',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "delegator": data.returnValues['emiter'], 
                                "account":data.returnValues['account'], 
                                "dividendRights":data.returnValues['dividendRights']
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );subscription.on('error', (error) => {
            console.error('accountDividendRight Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        })
        subscription.on('connected', (subscriptionId) => {
            console.log('accountDividendRight Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
     }
     subscribe();
    }

   


    // //取消订阅
    // unsub()
    // {
    //     try{
    //         if(this.execobj1 && this.execobj1.unsubscribe){this.execobj1.unsubscribe();this.execobj1.removeAllListeners();}
    //         this.execobj1=null;
    //         if(this.execobj2 && this.execobj2.unsubscribe){this.execobj2.unsubscribe();this.execobj2.removeAllListeners();}
    //         this.execobj2=null;
    //         if(this.execobj3 && this.execobj3.unsubscribe){this.execobj3.unsubscribe();this.execobj3.removeAllListeners();}
    //         this.execobj3=null;
    //         if(this.execobj4 && this.execobj4.unsubscribe){this.execobj4.unsubscribe();this.execobj4.removeAllListeners();}
    //         this.execobj4=null;
    //         if(this.execobj5 && this.execobj5.unsubscribe){this.execobj5.unsubscribe();this.execobj5.removeAllListeners();}
    //         this.execobj5=null;

    //     } catch(e){console.error(e);}
    // }
    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=eventSum_abi
this.parentThis=_parentThis;
globalSubscriptionManager.registerInstance('EventSum', this);
        
    }
}

module.exports=EventSum