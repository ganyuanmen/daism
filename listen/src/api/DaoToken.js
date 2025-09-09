const erc20s_abi=require('../abi/SCToken_abi.json');
const utils = require("../utils");
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');
/**
 * token 事件
 */
class DaoToken extends BaseSubscription
{
    //发布token事件
    publishTokenEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='publishTokenEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this;  
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        const subscribe=()=>{
        const subscription=this.contract.events.Issue({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data',async function (data,_error) {   
                if(!data || !data.returnValues) {utils.log("publishTokenEvent error",_error);throw _error;}   
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoToken.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "tokenId": data.returnValues['eip3712_id'], 
                                "daoId": data.returnValues['SC_id'],
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }

            }
        );
        subscription.on('error', (error) => {
            console.error('publishTokenEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('publishTokenEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }
    async balanceOf(_id,_address) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address);
        let val= await this.contract.methods.balanceOf(_id,_address).call({ from: this.account })
        return parseFloat(this.web3.utils.fromWei(val,'ether')).toFixed(6)
    }

    // //取消订阅
    // unsub()
    // {
    //     try{
    //         if(this.tObj && this.tObj.unsubscribe){this.tObj.unsubscribe();this.tObj.removeAllListeners();}
    //         this.tObj=null;
    //     }catch(e){console.error(e);}
    // }

    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=erc20s_abi
this.parentThis=_parentThis;
globalSubscriptionManager.registerInstance('DaoToken', this);
    }
}

module.exports=DaoToken