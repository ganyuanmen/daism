const iadd_abi=require('../abi/DAismIADDProxy_abi.json');
const utils = require("../utils");


class IADD_EX
{
  
     //token 兑换 token
     tokenTotokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.t2tObj=this.contract.events.SCTokenToSCTokenEvent({filter: {}, fromBlock: maxBlockNumber})
        this.t2tObj.on('data', async function (data,_error) {  
                if(!data || !data.returnValues) {utils.log("tokenTotokenEvent error");throw _error;}  
                _this.iadd.t2tAr.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "from": data.returnValues.spender,
                    "to": data.returnValues.to,
                    "fromTokenId":data.returnValues.id_A,
                    "toTokenId":data.returnValues.id_B,
                    "fromtokenWei":data.returnValues.input_amount,
                    "toTokenWei":data.returnValues.output_amount,
                    "sc_id":data.returnValues.scId,
                    "tipAmount":parseFloat(data.returnValues.tipAmount)/100000000,
                    "fromToken":parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether')).toFixed(6),
                    "toToken":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(6)
                    })
                 })
            }
        )
    }

    //eth 兑换 token 同时触发eth to utoken  和utoken to token 事件
    ETHToDaoToken(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.e2tObj=this.contract.events.ETHToSCToken({filter: {}, fromBlock: maxBlockNumber})
        this.e2tObj.on('data', async function (data,_error) {  
                if(!data || !data.returnValues) {utils.log("ETHToSCToken error");throw _error;}  
                // console.log(data)  
                _this.iadd.e2tAr.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "from": data.returnValues.spender,
                    "to": data.returnValues.to,
                    "tokenId":data.returnValues.id,
                    "tipAmount":parseFloat(data.returnValues.tipAmount)/100000000,
                    "input_amount":parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether')).toFixed(6),
                    "output_amount":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(6)
                    })
                 })
            }
        )
    }

        //utoken 兑换 token事件 
        utokenTotokenEvent(maxBlockNumber,callbackFun) {
            const _this = this;
            if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
            this.u2tObj=this.contract.events.UnitTokenToSCToken({filter: {},fromBlock: maxBlockNumber})
            this.u2tObj.on('data',async function (data,_error) {
                    if(!data || !data.returnValues) {utils.log("utokenTotokenEvent error");throw _error;}
                    //进到t2t 表示只有这一事件
                    _this.iadd.t2tAr.push({fn:callbackFun,data:utils.valueFactory(data,{
                                "from": data.returnValues.spender, //兑换人
                                "to": data.returnValues.to, //目标人
                                "tokenId":data.returnValues.id,
                                "utokenWei":data.returnValues.input_amount,
                                "tokenWei":data.returnValues.output_amount,
                                "tipAmount":parseFloat(data.returnValues.tipAmount)/100000000,
                                "utoken":parseFloat(data.returnValues.input_amount)/100000000-parseFloat(data.returnValues.tipAmount)/100000000,
                                "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(6)
                            })
                    })
                }
            )
        }

       
    //token 兑换 utoken
    tokenToUtokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.t2uObj=this.contract.events.SCTokenToUnitTokenEvent({filter: {}, fromBlock: maxBlockNumber})
        this.t2uObj.on('data', async function (data,_error) {  
                if(!data || !data.returnValues) {utils.log("tokenToUtokenEvent error");throw _error;}   
                //进到t2t 表示只有这一事件
                _this.iadd.t2tAr.push({fn:callbackFun,data:utils.valueFactory(data,{
                    "from": data.returnValues.spender,
                    "to": data.returnValues.to,
                    "tokenId":data.returnValues.id,
                    "utokenWei":data.returnValues.output_amount,
                    "tokenWei":data.returnValues.input_amount,
                    "tipAmount":parseFloat(data.returnValues.tipAmount)/100000000,
                    "utoken":(parseFloat(data.returnValues.output_amount)/100000000).toFixed(6),
                    "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether')).toFixed(6)
                    })
                 })

            }
        )
    }

    //取消订阅
    unsub()
    {
        try{
         
            if(this.t2tObj && this.t2tObj.unsubscribe){this.t2tObj.unsubscribe();}
            if(this.e2tObj && this.e2tObj.unsubscribe){this.e2tObj.unsubscribe();}
            if(this.e2uObj && this.e2uObj.unsubscribe){this.e2uObj.unsubscribe();}
            if(this.u2tObj && this.u2tObj.unsubscribe){this.u2tObj.unsubscribe();}
            
            this.e2tObj=null;this.t2tObj=null; this.e2uObj=null;this.u2tObj=null;
        }catch(e){console.error(e);}
    }

    constructor(_web3,_account,_address,_iadd) {
        this.running=false
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=iadd_abi
        this.iadd=_iadd
     
      
       }
   }
   
   module.exports=IADD_EX