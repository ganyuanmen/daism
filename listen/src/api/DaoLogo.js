const abi=require('../abi/SCLogo_abi.json');
const utils = require("../utils");
// const JSZip= require('jszip')
const fs = require('node:fs');

const BaseSubscription = require('./base-subscription');
const globalSubscriptionManager = require('../subscription-manager');

//logo 事件
 class DaoLogo extends BaseSubscription {

     /**根据daoId获取logo图片
     * @param {int} id daoId
     * @returns 
     */
    async getLogo(id) {
        // if (this.rpcClient.getHealthyCount() === 0) {await this.rpcClient.checkAllProviders();}
            
        return await this.rpcClient.callContract(
             this.address, 
             this.abi, 
             'getLogo', 
             [id]
         );

      

        // return await this.readWeb3(this.address,this.abi,'getLogo',[id])
        // if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
 
        // let re = await this.contract.methods.getLogo(id).call({ from: this.account });
        // let result = await this.get_async_file(re[1],id);
        // return { src: result };
    }
    // async getLogoByDaoId(id) {
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
    //    return await this.contract.methods.getLogo(id).call({ from: this.account });

    // }

    async getLogoByConfigID(id) {
        // if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        // let re = await this.contract.methods.getLogoByConfigID(id).call({ from: this.account });
        // return re;
        return await this.rpcClient.callContract(
            this.address, 
            this.abi, 
            'getLogoByConfigID', 
            [id]
        );
    }

    // async logoStorages(id) {
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
    //     let re = await this.contract.methods.logoStorages(id).call({ from: this.account });
    //     return re;
    // }
    

   /** 异步处理文件，根据后缀名还原图片的base64编码
    * @param {string} file_type 图片文件后缀名
    * @param {string} bytesStr 图片16进制编码
    * @returns 
    */
    get_async_file(bytesStr,daoid) {
        const _this=this
        return new Promise(function (resolve, reject) {
            //16进制的文件编码 转成 Uint8Array格式的数组
            // let len = bytesStr.length / 2 - 1;
            // let array = new Uint8Array(len);
            // for (let k = 0; k < len; k++) {
            //     array[k] = parseInt(bytesStr.slice(2 + k * 2, 2 + k * 2+2), 16);
            // }

            // if (file_type == 'zip') { //解压
            //     let new_zip = new JSZip();
            //     new_zip.loadAsync(Buffer.from(array.buffer))
            //     .then(function (mzip) {
            //         //文件名
            //         let fileName = Object.keys(mzip.files)[0];
            //         mzip.file(fileName).async("nodebuffer").then(blob => {
            //             let fileNames = fileName.split('.');
            //             let fileType = fileNames[fileNames.length - 1];
            //             let fn=`${new Date().getTime()}_${daoid}.${fileType}`
            //             _this.writeImage(daoid,blob.toString('base64'),fn)
                        
            //             resolve(`https://${process.env.LOCAL_DOMAIN}/uploads/logo/${fn}`)
            //             // if (fileType == 'svg') {
            //             //     this.writeImage(daoid,fileType,blob.toString('base64'))
            //             //     resolve(`https://${process.env.LOCAL_DOMAIN}/uploads/logo/${daoid}.${fileType}`)
            //             //     // resolve('data:image/svg+xml;base64,' + blob.toString('base64'))
            //             // }
            //             // else {
            //             //     this.writeImage(daoid,fileType,blob.toString('base64'))
            //             //     resolve(`https://${process.env.LOCAL_DOMAIN}/uploads/logo/${daoid}.${fileType}`)
            //             //   //  resolve('data:image/' + fileType + ';base64,' + blob.toString('base64'))
            //             // }
            //         });
            //     });
            // } else {
                let fn=`s_${daoid}.svg`
                // _this.writeImage(daoid,Buffer.from(array.buffer).toString('base64'),fn)
                _this.writeImage(daoid,bytesStr,fn)
               resolve(`https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/logo/${fn}`)
               // resolve('data:image/' + file_type + ';base64,' + Buffer.from(array.buffer).toString('base64'))
            // }
        });
    }

    writeImage(daoid,base64Str,fn)
    {
        // const buffer = Buffer.from(base64Str, 'base64');
        const filePath = `./images/${fn}`;
        // console.log(filePath)
        fs.writeFile(filePath, base64Str, (err) => {
        if (err) {
            console.error(`Saving image failed(${daoid}):`, err);
        } else {
            if(process.env.IS_DEBUGGER==='1')  console.log('Image saved successfully:', filePath);
        }
        });
    }
   

    
   
    // //创建logo事件
    // setLogoEvent(maxBlockNumber,callbackFun) {
    //     const _this = this;
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
    //     this.eventObj1=this.contract.events.InitLogo({filter: {},fromBlock: maxBlockNumber});
    //     this.eventObj1.on('data',async function (data,_error) {  
    //             if(!data || !data.returnValues) {utils.log("setLogoEvent error"); throw _error;}
    //             let img=await _this.getLogo(data.returnValues['dao_id'])
    //             callbackFun.call(null, utils.valueFactory(data,
    //                  {
    //                     "daoId": data.returnValues['dao_id'],
    //                     "src": img.src, //带data:image的字串
    //                     "timestamp": await utils.getTime(_this.web3,data.blockNumber),
    //                 })
    //             )   
    //         }
    //     )
    // }

    //修改logo事件
    changeLogoEvent(maxBlockNumber,callbackFun) {
        const subscriptionKey='changeLogoEvent';
        this.unsubscribe(subscriptionKey);
        const _this = this
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        const subscribe=()=>{
        const subscription=this.contract.events.ChangeLogo({filter: {},fromBlock: maxBlockNumber}); 
        subscription.on('data', async function (data,_error) { 
                if(!data || !data.returnValues) {utils.log("changeLogoEvent error",_error);throw _error;}
                const release = await _this.parentThis.queueMutex.acquire();
                try {
                    _this.parentThis.eventQueue.push(
                        {
                            type:'DaoLogo.har',
                            fn:callbackFun,
                            data:utils.valueFactory(data,{
                                "daoId": data.returnValues.SC_id,
                                "logo_id":data.returnValues.logoConfigID
                            })
                        });
                        _this.parentThis.processQueue();
                } finally {
                    release();
                }
            }
        );
        subscription.on('error', (error) => {
            console.error('changeLogoEvent Subscription  error:');
            setTimeout(() => {subscribe();}, 3000);
        });
        subscription.on('connected', (subscriptionId) => {
            console.log('changeLogoEvent Subscription connected with ID:', subscriptionId);
        });
        _this.subscriptions.set(subscriptionKey, subscription);
        
        }
        subscribe();
    } 

    
    // //修改logo事件
    // addLogoEvent(maxBlockNumber,callbackFun) {
    //     const _this = this
    //     if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
    //     this.eventObj3=this.contract.events.AddLogo({filter: {},fromBlock: maxBlockNumber});
    //     this.eventObj3.on('data',async function (data,_error) { 
    //             if(!data || !data.returnValues) {utils.log("AddLogoEvent error");throw _error;}
    //             _this.har.push({fn:callbackFun,data:utils.valueFactory(data,{
    //                 "img_id": data.returnValues.logoConfigID,
    //                 "dao_id": data.returnValues.SC_id
    //                 })
    //              })
                 
    //         }
    //     )
    // } 
    
    //取消订阅
    unsub(){
        try{
            if(this.eventObj2 && this.eventObj2.unsubscribe){this.eventObj2.unsubscribe();this.eventObj2.removeAllListeners();}
            // if(this.eventObj1 && this.eventObj1.unsubscribe){this.eventObj1.unsubscribe()}
            // if(this.eventObj3 && this.eventObj3.unsubscribe){this.eventObj3.unsubscribe()}
            this.eventObj2=null;
            // this.eventObj1=null;
            // this.eventObj3=null;
        }catch(e){console.error(e);}
    }
 
    constructor(_web3,_account,_address,_rpcClient,_parentThis) {
        super();
        this.web3=_web3;
        this.account=_account;
        this.address = _address;
        this.abi=abi
        this.rpcClient=_rpcClient;
        this.parentThis=_parentThis;
        globalSubscriptionManager.registerInstance('DaoLogo', this);
    }
}

module.exports=DaoLogo