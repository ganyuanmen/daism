import {type RootState,type AppDispatch, setErrText,setTipText,setEthBalance,setUtoBalance} from '@/store/store';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { SwapTokenSvg } from '@/lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';
import {type StatusBarState} from "./StatusBar"
import {type tipType} from "./TipWin"; 
import { getDaismContract } from '@/lib/globalStore';
// import { useFetchToken } from '@/hooks/useFetchToken';

interface SubmitButtonProps{

    inObj:DaismToken;
    outObj:DaismToken;
    status:StatusBarState;
    tokenValue:number;
    tipValue:tipType;
    setStatus:(v:StatusBarState)=>void;
    upBalance:string;
    setInputError:(v:string)=>void;
    inputError:string;
    clearStutes:(v1:string,v2:string)=>void;
    showButton:boolean;
}

export default function SubmitButton({setInputError,inObj,outObj,status,tokenValue,tipValue,upBalance,clearStutes}:SubmitButtonProps)  {

    const dispatch = useDispatch<AppDispatch>();
    const t = useTranslations('iadd')
    const tc = useTranslations('Common')
    const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;

    function showTip(str:string){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str:string){dispatch(setErrText(str))}
    function setEth(value:string){dispatch(setEthBalance(value))}
    function setUto(value:string){dispatch(setUtoBalance(value))}

    let daismObj=getDaismContract();
      
  function getEther(v:string|number|bigint){return ethers.parseEther(v+'')}
  function fromEther(v:string|number|bigint){return  ethers.formatEther(v+'')}
  function fromUtoken(v:string|number|bigint){return  ethers.formatUnits(v+'',8)}
    // 获取代币数据
    // const getTokens=useFetchToken();

    // 兑换操作完成后清理
     const resulthandle = (upBalace:string, downBalance:string) => {
        clearStutes(upBalace,downBalance);
        // getTokens(user.account)
       }

     
    const geneParas=()=>{
        let _isBurnNFT=false;
        let _uto=0
        let _isMintNFT=false
        let _tokenId=0

        if(inObj.token_id===-2 && outObj.token_id===-1){ //eth->uto
            _isBurnNFT=tipValue.isTip; //此处不能打赏，isTip 变为BurnNFT 锻造
        }  
        else {//eth->token时 此处可以打赏NFT，也可以锻造NFT
            _isBurnNFT=tipValue.isBurn;
            if(tipValue.isShowTip && tipValue.isTip) {
                _uto=tipValue.value;
                if(_uto>0){ // 没有打赏就不能mint NFT
                   _isMintNFT=tipValue.isNft  
                   _tokenId=getToken();
                }
           }
        } 

        return {_uto,_isMintNFT,_tokenId,_isBurnNFT}
    }

    //eth 兑换 utoken
    const eth_utoken = async () => {
        
        showTip(t('walltSubmitText'));
        const {_isBurnNFT}=geneParas();
            //锻造锻造荣誉通证
         if(tipValue.isShowTip && tipValue.isTip) { //mint
            daismObj?.SingNft.mintByBurnETH(user.account,tokenValue,_isBurnNFT).then(() => {
                closeTip();
                daismObj?.signer.provider?.getBalance(user.account).then(e1 => {
                    const _b1 = fromEther(e1)
                    setEth(_b1)
                    daismObj?.UnitToken.balanceOf(user.account).then(e2 => {
                        const _b2 = e2.utoken;
                    setUto(_b2)
                    resulthandle(_b1, _b2);
                    })
                })
            }, err => {
                console.error(err); closeTip();
                showClipError(tc('errorText') + (err.message ? err.message : err));
            });
        } 
        else {
            daismObj?.UnitToken.swap(user.account,tokenValue).then(re => {
                closeTip();
                daismObj?.signer.provider?.getBalance(user.account).then(e1 => {
                    const _b1 = fromEther(e1)
                    setEth(_b1)
                    daismObj?.UnitToken.balanceOf(user.account).then(e2 => {
                        const _b2 = e2.utoken;
                    setUto(_b2)
                    resulthandle(_b1, _b2);
                    })
                })
                // daismObj?.signer.provider.getBalance(user.account).then(e1 => {
                //     const _b1 = fromEther(e1);
                //     setEth(_b1)
                //     daismObj?.UnitToken.balanceOf(user.account).then(e2 => {
                //         const _b2 = e2.utoken;
                //     setUto(_b2)
                //     resulthandle(_b1, _b2);
                //     })
                // })
            }, err => {
                console.error(err); closeTip();
                showClipError(tc('errorText') + (err.message ? err.message : err));
            });
        }
    }


    const getToken=()=>{
        if(inObj.token_id>0 && outObj.token_id>0) {
            if(!tipValue.selectToken) return inObj.token_id
            else  return outObj.token_id
            }
            else return 0;
    }
   

   // _uto(打赏),recipient(转帐接收地址),_isMintNFT,_nftRecipient
    const eth_token =async () => { 
        const {_uto,_isMintNFT,_isBurnNFT}=geneParas();
        showTip(t('walltSubmitText'));
        const res=await  daismObj?.UnitToken.getOutputAmount(getEther(tokenValue))  // 计算可以获多少utoken
        if(!res) {closeTip(); showClipError(tc('errorText'));return;}
        const re=parseFloat(fromUtoken(res[0])) //换成真实uto 除以8位
        if(_uto>re){
            showClipError(t('notTipText')) 
            closeTip()
            return
        }
        daismObj?.IADD_EX.ethToDaoToken(tokenValue,outObj.token_id,_uto,status.slippage,user.account,_isMintNFT,_isBurnNFT,user.account).then(() => {
            closeTip();
            daismObj?.signer.provider?.getBalance(user.account).then(e1 => {
                const _b1 = fromEther(e1);
                setEth(_b1)
                daismObj?.DaoToken.balanceOf(outObj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        })
    }

    //_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const utoken_token = () => {
        const {_uto,_isMintNFT}=geneParas();
        if(tokenValue+_uto>parseFloat(upBalance)){
            showClipError(t('notEnoughTip')) 
            return
        }
        showTip(t('walltSubmitText'));
        daismObj?.IADD_EX.unitTokenToDaoToken(tokenValue, outObj.token_id,status.slippage,_uto,user.account,_isMintNFT,user.account).then(() => {
            closeTip();
            daismObj?.UnitToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUto(_b1)
                daismObj?.DaoToken.balanceOf(outObj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        })
    }

    //_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const token_utoken = () => {
        const {_uto,_isMintNFT}=geneParas();
        showTip(t('walltSubmitText'));
        daismObj?.IADD_EX.daoTokenToUnitToken(tokenValue, inObj.token_id,status.slippage,_uto,user.account,_isMintNFT,user.account).then(() => {
           closeTip();
           daismObj?.UnitToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUto(_b1)
                daismObj?.DaoToken.balanceOf(inObj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b2, _b1);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        })
    }
    //_value,_id1,_id2,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const token_token =async () => {
        const {_uto,_isMintNFT,_tokenId}=geneParas();
        showTip(t('walltSubmitText'));

           const res=await daismObj?.Commulate.daoTokenToUnitToken(getEther(tokenValue), inObj.token_id) // 计算可以获多少utoken
           if(!res) {closeTip(); showClipError(tc('errorText'));return;}
           const re=parseFloat(fromUtoken(res)) //换成真实uto 除以8位
           if(_uto>re){
            showClipError(t('notTipText')) 
            closeTip()
            return
           }
           const flag=!(_tokenId===inObj.token_id);
           daismObj?.IADD_EX.daoTokenToDaoToken(tokenValue, inObj.token_id, outObj.token_id,status.slippage,_uto,user.account,_isMintNFT,user.account,flag).then(() => {
            closeTip();
            daismObj?.DaoToken.balanceOf(inObj.token_id, user.account).then(e1 => {
                 const _b1 = e1.token;
                 daismObj?.DaoToken.balanceOf(outObj.token_id, user.account).then(e2 => {
                     const _b2 = e2.token;
                     resulthandle(_b1, _b2);
                 })
             })
         }, err => {
             console.error(err);closeTip();
             showClipError(tc('errorText') + (err.message ? err.message : err));
         })       
    }

    //兑换处理
    const handleswap = () => {
        if(!daismObj) daismObj=getDaismContract();
        
        if(inObj.token_id===0 || outObj.token_id===0) {
            showClipError(t("noselectTokenText"));
            setInputError(t('noselectTokenText'));
            return;
        }
        if (tokenValue<=0) {
            showClipError(t("enter an amount")); 
            setInputError(t('enter an amount')); 
             return;
        } 

  
        
        if (tokenValue > parseFloat(upBalance)) {  //余额是足
            setInputError(t('Insufficient balance'));
            showClipError(t("Insufficient balance")); 
            return; 
        }
        
        if (inObj.token_id === -2 && outObj.token_id === -1) { eth_utoken(); }  
        else if (inObj.token_id === -2 && outObj.token_id > 0) { eth_token(); }
        else if (inObj.token_id === -1 && outObj.token_id > 0) { utoken_token(); }
        else if (inObj.token_id> 0 && outObj.token_id === -1) { token_utoken(); }
        else if (inObj.token_id > 0 && outObj.token_id > 0) { token_token(); }
    }

    return <>
    <Button   variant='primary' onClick={handleswap}  ><SwapTokenSvg size={20} />  {t('swapText')}</Button>
       {/* {showButton && inputError==='' && user.connected===1 && <>
                <br/>
                <Button   variant='primary' onClick={handleswap}  ><SwapTokenSvg size={20} />  {t('swapText')}</Button>
                </>
       } */}
    </>
   
}

