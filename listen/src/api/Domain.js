const utils = require("../utils");
const abi=require('../abi/DAismDomain_abi.json');
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

class Domain extends BaseSubscription
{
    RecordEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='RecordEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        const subscribe=()=>{
        const subscription=this.contract.events.Record({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("RecordEvent error:",_error);throw _error;}
              
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                           "domain": data.returnValues.domain,
                           "daoId": data.returnValues._scId
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('RecordEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('RecordEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }
    
    recordInfoEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='recordInfoEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        const subscribe=()=>{
        const subscription=this.contract.events.RecordInfo({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("recordInfoEvent error:",_error);throw _error;}
         
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "domain": data.returnValues.domain,
                                "addr": data.returnValues.addr,
                                "name": data.returnValues.name
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('recordInfoEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('recordInfoEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

//    unsub()
//    {
//        try{
//            if(this.installobj && this.installobj.unsubscribe) {this.installobj.unsubscribe();this.installobj.removeAllListeners();}
//            this.installobj=null;
//            if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();this.installobj1.removeAllListeners();}
//            this.installobj1=null;
//        } catch(e){console.error(e);}
//    }

    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi;
this.parentThis=_parentThis;
globalSubscriptionManager.registerInstance('Domain', this);
    }
}
module.exports=Domain