const utils = require("../utils");
const abi=require('../abi/Donation_abi.json');
const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

class Donate extends BaseSubscription
{
    DonationReceived(maxBlockNumber,callbackFun) {
        const subscriptionKey='DonationReceived';
        this.unsubscribe(subscriptionKey);
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        const subscribe=()=>{
        const subscription=this.contract.events.DonationReceived({filter: {},fromBlock: maxBlockNumber});
        subscription.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("DonationReceived error:",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'EventSum.har3',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                           "donor": data.returnValues.donor,
                            "uTokenAmount": parseFloat(data.returnValues.uTokenAmount)/100000000,
                            "totalDonationETH": parseFloat(_this.web3.utils.fromWei(data.returnValues.totalDonationETH,'ether')).toFixed(6),
                            "tokenId": data.returnValues.tokenId,
                            "donationTime": data.returnValues.donationTime,
                            "donationAmount": parseFloat(_this.web3.utils.fromWei(data.returnValues.donationAmount,'ether')).toFixed(6)
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }

            }

        );
        subscription.on('error', (error) => {
            console.error('DonationReceived Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('DonationReceived Subscription connected with ID:', subscriptionId);
        });

        _this.subscriptions.set(subscriptionKey, subscription);
        
    }
    subscribe();
    }
    

//    unsub()
//    {
//        try{
//            if(this.obj1 && this.obj1.unsubscribe) {this.obj1.unsubscribe();this.obj1.removeAllListeners();}
//            this.obj1=null;
//        } catch(e){console.error(e);}
//    }

    constructor(_web3,_account,_address,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi;
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('Donate', this);
    }
}
module.exports=Donate