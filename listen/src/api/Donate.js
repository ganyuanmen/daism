const utils = require("../utils");
const abi=require('../abi/Donation_abi.json');

class Donate
{
    DonationReceived(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.obj1=this.contract.events.DonationReceived({filter: {},fromBlock: maxBlockNumber});
        this.obj1.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("RecordEvent error:"+_error);throw _error;}
                _this.EventSum.har3.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "donor": data.returnValues.donor,
                    "uTokenAmount": parseFloat(data.returnValues.uTokenAmount)/100000000,
                    "totalDonationETH": parseFloat(_this.web3.utils.fromWei(data.returnValues.totalDonationETH,'ether')).toFixed(6),
                    "tokenId": data.returnValues.tokenId,
                    "donationTime": data.returnValues.donationTime,
                    "donationAmount": parseFloat(_this.web3.utils.fromWei(data.returnValues.donationAmount,'ether')).toFixed(6)
                    })
                 })
            
            }
        )
    }
    
    ERC20Withdraw(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.obj2=this.contract.events.ERC20Withdraw({filter: {},fromBlock: maxBlockNumber});
        this.obj2.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("recordInfoEvent error:"+_error);throw _error;}
                // console.log(data.returnValues)
                _this.EventSum.har3.push({fn:callbackFun,data:utils.valueFactory(data,{
                        "token": data.returnValues.token,
                        "to": data.returnValues.to,
                        "amount": data.returnValues.amount
                    })
                 })
            }
        )
    }

   unsub()
   {
       try{
           if(this.obj1 && this.obj1.unsubscribe) {this.obj1.unsubscribe();}
           this.obj1=null;
           if(this.obj2 && this.obj2.unsubscribe) {this.obj2.unsubscribe();}
           this.obj2=null;
       } catch(e){console.error(e);}
   }

    constructor(_web3,_account,_address,_EventSum) {
        this.web3=_web3;
        this.account=_account;     
        this.address=_address;
        this.abi=abi;
        this.EventSum=_EventSum;
    }
}
module.exports=Donate