const utils = require("../utils");
const eventSum_abi=require('../abi/SCEventEmit_abi.json');

// const abiDecoder = require('abi-decoder'); // NodeJS
// abiDecoder.addABI(fabi);

class EventSum
{
    async  addProposal(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
         this.execobj1=this.contract.events.AddProposal({filter: {}, fromBlock: maxBlockNumber}) 
         this.execobj1.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("addProposal error");throw _error;}
              
                _this.har.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "delegator": data.returnValues['emiter'],
                    "account":data.returnValues['account'],
                    "dividendRights":data.returnValues['dividendRights'],
                    "proposalType":data.returnValues['proposalType'],
                    "_time":data.returnValues['_time']
                    })
                 })  
            }
        )
    }

     async  voteEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.execobj2=this.contract.events.Vote({filter: {}, fromBlock: maxBlockNumber}) 
        this.execobj2.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("voteEvent error");throw _error;}
                _this.har1.push({fn:callbackFun,data:utils.valueFactory(data,{
                        "delegator": data.returnValues['emiter'], 
                        "antirights":data.returnValues['antirights'], 
                        "rights":data.returnValues['rights'], 
                        "proposalType":data.returnValues['proposalType'],
                        "createTime":data.returnValues['_proposalTime'],
                        "_time":data.returnValues['_time']
                    })
                 })  

            }
        )
    }

    async  execEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.execobj3=this.contract.events.Exec({filter: {}, fromBlock: maxBlockNumber})         
        this.execobj3.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("execEvent error");throw _error;}
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "delegator": data.returnValues['emiter'], 
                        "dividendRights":data.returnValues['dividendRights'], 
                        "account":data.returnValues['account'],
                        "account":data.returnValues['account'],
                        "proposalType": data.returnValues['proposalType'],
                        "_time":data.returnValues['_time']
                    })
                )
            }
        )
    }
    //分红
    async  getDividendEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.execobj4=this.contract.events.GetDividend({filter: {}, fromBlock: maxBlockNumber})
        this.execobj4.on('data', async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("GetDividend error");throw _error;}
                // console.log(data)
                _this.har2.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "delegator": data.returnValues['emiter'], 
                    "account":data.returnValues['to'], 
                    "dao_owner":data.returnValues['owner'], 
                    "utoken_amount":parseFloat(data.returnValues.amount)/100000000,
                    // parseFloat(_this.web3.utils.fromWei(data.returnValues.amount,'ether')).toFixed(6), 
                    "pre_time":data.returnValues['_time']
                    })
                 }) 

            }
        )
    }
    //成员变动
     async  accountDividendRight(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.execobj5=this.contract.events.AccountDividendRight({filter: {}, fromBlock: maxBlockNumber})
        this.execobj5.on('data',async function (data,_error) {
                if(!data || !data.returnValues) {utils.log("AccountDividendRight error");throw _error;}
                
                _this.har3.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "delegator": data.returnValues['emiter'], 
                    "account":data.returnValues['account'], 
                    "dividendRights":data.returnValues['dividendRights']
                    })
                 })  
            }
        )
    }

    


    //取消订阅
    unsub()
    {
        try{
            if(this.execobj1 && this.execobj1.unsubscribe){this.execobj1.unsubscribe();}
            this.execobj1=null;
            if(this.execobj2 && this.execobj2.unsubscribe){this.execobj2.unsubscribe();}
            this.execobj2=null;
            if(this.execobj3 && this.execobj3.unsubscribe){this.execobj3.unsubscribe();}
            this.execobj3=null;
            if(this.execobj4 && this.execobj4.unsubscribe){this.execobj4.unsubscribe();}
            this.execobj4=null;
            if(this.execobj5 && this.execobj5.unsubscribe){this.execobj5.unsubscribe();}
            this.execobj5=null;

        } catch(e){console.error(e);}
    }
    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=eventSum_abi
        this.har=[]
        this.har1=[]
        this.har2=[]
        this.har3=[]
    }
}

module.exports=EventSum