const utils = require("../utils");
const abi0=require('../abi/SCRegistrar_abi0.json'); //未升级前
const abi=require('../abi/SCRegistrar_abi.json');
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

//dao注册事件
class DaoRegistrar extends BaseSubscription
{
    //dao 注册事件 未升级前
    daoCreateEvent0(maxBlockNumber,callbackFun) {
        const subscriptionKey='daoCreateEvent0';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract0) this.contract0 = new this.web3.eth.Contract(this.abi0, this.address);
        const subscribe=()=>{
        const subscription=this.contract0.events.CreateSC({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent0 error:",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoRegistrar.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                            "daoId": data['returnValues']['SC_id'],
                            "time":(new Date()).getTime().toString().substring(0,10),
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }

            }
        );
        subscription.on('error', (error) => {
            console.error('daoCreateEvent0 Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('daoCreateEvent0 Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
        }
    subscribe();
    }

      //dao 注册事件
      daoCreateEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='daoCreateEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
        const subscription=this.contract.events.CreateSC({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:",_error);throw _error;}
                // console.log(data)
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoRegistrar.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                            "daoId": data['returnValues']['SC_id'],
                            "members":data['returnValues']['members'],
                            "dividendRights":data['returnValues']['dividendRights'],
                            "time":data['returnValues']['time'],
                            })
                        });
                        _this.parentThis.processQueue.call(this.parentThis);
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('daoCreateEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('daoCreateEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

     //dao 修改dapp 地址
     updateSCEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='updateSCEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
        const subscription=this.contract.events.UpdateSC({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("updateSCEvent error:",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                            "daoId": data['returnValues']['SC_id'],
                            "newCreator": data['returnValues']['newCreator']
                            })
                        });
                        _this.parentThis.processQueue(_this.parentThis);
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('updateSCEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('updateSCEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

     //dapp 地址对应 版本号
     addCreatorCEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='addCreatorCEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
        const subscription=this.contract.events.AddCreator({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("addCreatorCEvent error:",_error);throw _error;}

                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                            "daoId": data['returnValues']['SC_id'],
                            "SC_Version": data['returnValues']['SC_Version'],
                            "newCreator": data['returnValues']['newCreator']
                            })
                        });
                        _this.parentThis.processQueue(_this.parentThis);
                } finally {
                    release();
                }

            }
        );
        subscription.on('error', (error) => {
            console.error('addCreatorCEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('addCreatorCEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }

    async proxyTo(id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
       return await this.contract.methods.proxyTo(id).call({ from: this.account });

    }

//    unsub()
//    {
//        try{
//            if(this.installobj10 && this.installobj10.unsubscribe) {this.installobj10.unsubscribe();this.installobj10.removeAllListeners();}
//            if(this.installobj1 && this.installobj1.unsubscribe) {this.installobj1.unsubscribe();this.installobj1.removeAllListeners();}
//            if(this.installobj2 && this.installobj2.unsubscribe) {this.installobj2.unsubscribe();this.installobj2.removeAllListeners();}
//            if(this.installobj3 && this.installobj3.unsubscribe) {this.installobj3.unsubscribe();this.installobj3.removeAllListeners();}
//            this.installobj1=null;this.installobj2=null;this.installobj3=null;this.installobj10=null;
//        } catch(e){console.error(e);}
//    }

    constructor(_web3,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.address=_address;
        this.abi=abi
        this.abi0=abi0
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('DaoRegistrar', this);
    }
}
module.exports=DaoRegistrar