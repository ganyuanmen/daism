import {setTipText,setMessageText,setEthBalance,setTokenList,setTokenFilter} from '../../data/valueData'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import React, {useImperativeHandle,useState, forwardRef, use } from "react";
import { SwapTokenSvg } from '../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import { client } from '../../lib/api/client';

const SubmitButton = forwardRef(({comulate,upRef,downRef,statusRef,setUtokenBalance,user,ratioRef,tipRef,isTip,utoken}, ref) => {
    const [show, setShow] = useState(false); //预兑换提示
    const dispatch = useDispatch();
    const t = useTranslations('iadd')
    const tc = useTranslations('Common')
    useImperativeHandle(ref, () => ({
       setShow:setShow
    }));

    const config= {
        method:'post',
        headers: {'Content-Type': 'application/json',"method":'getToekn'},
        body:JSON.stringify({did: user.connected===1?user.account:''})
    }

    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
    function setEth(value){dispatch(setEthBalance(value))}

    // function getEther(v){return window.daismDaoapi.ethers.parseEther(v+'')}
    // function fromEther(v){return  window.daismDaoapi.ethers.formatEther(v+'')}

    function getEther(v){return window.daismDaoapi.ethers.parseEther(v+'')}
    // function getUtoEther(v){return window.daismDaoapi.ethers.parseUnits(v+'',8)}
    // function fromEther(v){return  window.daismDaoapi.ethers.formatEther(v+'')}
    function fromUtoken(v){return  window.daismDaoapi.ethers.formatUnits(v+'',8)}

    //兑换操作完成后清理
     const resulthandle = (b1, b2) => {
        upRef.current.setBalance(parseFloat(b1).toFixed(4))
        downRef.current.setBalance(parseFloat(b2).toFixed(4))
        upRef.current.clear()
        downRef.current.clear()
        tipRef?.current?.setTip(false)
        tipRef?.current?.setBurn(false)
        statusRef.current.setStatus({...statusRef.current.state,gas:'',price:'',minValue:'',exValue:''})
        setShow(false)
        getTokens()

       }

    function getTokens()
    {
        client.get(`/api/getData?did=${user.account}`,'getToekn').then(res =>{ 
            if(res.status===200) {
                dispatch(setTokenList(res.data))
                dispatch(setTokenFilter(res.data))
            }
            else console.error(res.statusText)
        })
    }
   
       
    //eth 兑换 utoken
    const eth_utoken = async (value) => {
        
        showTip(t('walltSubmitText'));

         if(isTip && tipRef.current.getTip()) { //mint
            window.daismDaoapi.SingNft.mintByBurnETH(user.account,value,true).then(re => {
                closeTip();
                window.daismDaoapi.signer.provider.getBalance(user.account).then(e1 => {
                    const _b1 = window.daismDaoapi.ethers.formatEther(e1)
                    setEth(_b1)
                    window.daismDaoapi.UnitToken.balanceOf(user.account).then(e2 => {
                        const _b2 = e2.utoken;
                    setUtokenBalance(_b2)
                    resulthandle(_b1, _b2);
                    })
                })
            }, err => {
                console.error(err); closeTip();
                showClipError(tc('errorText') + (err.message ? err.message : err));
            });
        } 
        else {
            window.daismDaoapi.UnitToken.swap(user.account,value).then(re => {
                closeTip();
                window.daismDaoapi.signer.provider.getBalance(user.account).then(e1 => {
                    const _b1 = window.daismDaoapi.ethers.formatEther(e1)
                    setEth(_b1)
                    window.daismDaoapi.UnitToken.balanceOf(user.account).then(e2 => {
                        const _b2 = e2.utoken;
                    setUtokenBalance(_b2)
                    resulthandle(_b1, _b2);
                    })
                })
            }, err => {
                console.error(err); closeTip();
                showClipError(tc('errorText') + (err.message ? err.message : err));
            });
        }
    }

    const geneParas=()=>{
        let _uto=0
        let _isMintNFT=false
        let tokenId=0
        if(isTip) {
            if(tipRef.current.getTip()) _uto=parseFloat(tipRef.current.getValue()) || 0
            _isMintNFT=_uto>0?tipRef.current.getNft():false  // 没有打赏就不能mint NFT
            tokenId=_uto>0?tipRef.current.getTokenId():0
        }
        return {_uto,_isMintNFT,tokenId}
    }

   // _uto(打赏),recipient(转帐接收地址),_isMintNFT,_nftRecipient
    const eth_token =async (out_id,value,minRatio,) => { 
      
        const {_uto,_isMintNFT}=geneParas();
        const _isBurnNFT=tipRef.current.getBurn();
        showTip(t('walltSubmitText'));
        // if(parseFloat(_uto)>0){
            let re=await  utoken.getOutputAmount(getEther(value))  // 计算可以获多少utoken
            re=parseFloat(fromUtoken(re[0])) //换成真实uto 除以8位
            if(_uto>re){
             showClipError(t('notTipText')) 
             closeTip()
             return
            }
            window.daismDaoapi.IADD_EX.ethToDaoToken(value,out_id,_uto,minRatio,user.account,_isMintNFT,_isBurnNFT,user.account).then(e => {
                closeTip();
                window.daismDaoapi.signer.provider.getBalance(user.account).then(e1 => {
                    const _b1 = window.daismDaoapi.ethers.formatEther(e1);
                    setEth(_b1)
                    window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
                        const _b2 = e2.token;
                        resulthandle(_b1, _b2);
                    })
                })
            }, err => {
                console.error(err);closeTip();
                showClipError(tc('errorText') + (err.message ? err.message : err));
            })
        //  } else 
        //  {
        //     window.daismDaoapi.IADD.ethToDaoToken(value, out_id,minRatio).then(e => {
        //         closeTip();
        //         window.daismDaoapi.signer.provider.getBalance(user.account).then(e1 => {
        //             const _b1 = window.daismDaoapi.ethers.formatEther(e1);
        //             setEth(_b1)
        //             window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
        //                 const _b2 = e2.token;
        //                 resulthandle(_b1, _b2);
        //             })
        //         })
        //     }, err => {
        //         console.error(err);closeTip();
        //         showClipError(tc('errorText') + (err.message ? err.message : err));
        //     })
    
        //  }
         
         
       
    }

    //_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const utoken_token = (out_id,value,minRatio) => {
       
        const {_uto,_isMintNFT}=geneParas()

        if(parseFloat(value)+parseFloat(_uto)>parseFloat(upRef.current.getBalance())){
            showClipError(t('notEnoughTip')) 
            return
        }
        showTip(t('walltSubmitText'));
        // if(parseFloat(_uto)>0)
        window.daismDaoapi.IADD_EX.unitTokenToDaoToken(value, out_id,minRatio,_uto,user.account,_isMintNFT,user.account).then(e => {
            closeTip();
            window.daismDaoapi.UnitToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUtokenBalance(_b1)
                window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        })
        // else 
        // window.daismDaoapi.IADD.unitTokenToDaoToken(value, out_id,minRatio).then(e => {
        //     closeTip();
        //     window.daismDaoapi.UnitToken.balanceOf(user.account).then(e1 => {
        //         const _b1 = e1.utoken;
        //         setUtokenBalance(_b1)
        //         window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
        //             const _b2 = e2.token;
        //             resulthandle(_b1, _b2);
        //         })
        //     })
        // }, err => {
        //     console.error(err);closeTip();
        //     showClipError(tc('errorText') + (err.message ? err.message : err));
        // })

    }

    //_value,_id,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const token_utoken = (in_id,value,minRatio) => {
        const {_uto,_isMintNFT}=geneParas()
        if(parseFloat(_uto)>parseFloat(downRef.current.getValue())){
            showClipError(t('notTipText')) 
            return
        }

        showTip(t('walltSubmitText'));
        // if(parseFloat(_uto)>0)
        window.daismDaoapi.IADD_EX.daoTokenToUnitToken(value, in_id,minRatio,_uto,user.account,_isMintNFT,user.account).then(e => {
           closeTip();
            window.daismDaoapi.UnitToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUtokenBalance(_b1)
                window.daismDaoapi.DaoToken.balanceOf(in_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b2, _b1);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        })
        // else 
        // window.daismDaoapi.IADD.daoTokenToUnitToken(value, in_id,minRatio).then(e => {
        //     closeTip();
        //      window.daismDaoapi.UnitToken.balanceOf(user.account).then(e1 => {
        //          const _b1 = e1.utoken;
        //          setUtokenBalance(_b1)
        //          window.daismDaoapi.DaoToken.balanceOf(in_id, user.account).then(e2 => {
        //              const _b2 = e2.token;
        //              resulthandle(_b2, _b1);
        //          })
        //      })
        //  }, err => {
        //      console.error(err);closeTip();
        //      showClipError(tc('errorText') + (err.message ? err.message : err));
        //  })
 

    }
    //_value,_id1,_id2,_minRatio,_uto,recipient,_isMintNFT,_nftRecipient
    const token_token =async (in_id,out_id,value,minRatio) => {
        const {_uto,_isMintNFT,tokenId}=geneParas()
        showTip(t('walltSubmitText'));
        // if(parseFloat(_uto)>0){
           let re=await comulate.SCTokenToUnitToken(getEther(value), in_id) // 计算可以获多少utoken
           re=parseFloat(fromUtoken(re)) //换成真实uto 除以8位
           if(_uto>re){
            showClipError(t('notTipText')) 
            closeTip()
            return
           }
           let flag=!(tokenId==in_id)
           window.daismDaoapi.IADD_EX.DaoTokenToDaoToken(value, in_id, out_id,minRatio,_uto,user.account,_isMintNFT,user.account,flag).then(e => {
            closeTip();
             window.daismDaoapi.DaoToken.balanceOf(in_id, user.account).then(e1 => {
                 const _b1 = e1.token;
                 window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
                     const _b2 = e2.token;
                     resulthandle(_b1, _b2);
                 })
             })
         }, err => {
             console.error(err);closeTip();
             showClipError(tc('errorText') + (err.message ? err.message : err));
         })

        // } else 
        // {
        //     window.daismDaoapi.IADD.DaoTokenToDaoToken(value, in_id, out_id,minRatio).then(e => {
        //         closeTip();
        //          window.daismDaoapi.DaoToken.balanceOf(in_id, user.account).then(e1 => {
        //              const _b1 = e1.token;
        //              window.daismDaoapi.DaoToken.balanceOf(out_id, user.account).then(e2 => {
        //                  const _b2 = e2.token;
        //                  resulthandle(_b1, _b2);
        //              })
        //          })
        //      }, err => {
        //          console.error(err);closeTip();
        //          showClipError(tc('errorText') + (err.message ? err.message : err));
        //      })
     
        // }

        
        
       
    }

    //兑换处理
    const handleswap = () => {
        const value=upRef.current.getValue();
        const in_id=upRef.current.getToken().token_id;
        const out_id=downRef.current.getToken().token_id;
        let minRatio=ratioRef.current

        if (!parseFloat(value)) { statusRef.current.setStatus({err:t('enter an amount')}) ; setShow(false); return; } //0 或非数字
        if (parseFloat(value) > parseFloat(upRef.current.getBalance())) { statusRef.current.setStatus({err:t('Insufficient balance')}); setShow(false); return; } //余额是足
        if (in_id === -2 && out_id === -1) { eth_utoken(value); }
        else if (in_id === -2 && out_id > 0) { eth_token(out_id,value,minRatio); }
        else if (in_id === -1 && out_id > 0) { utoken_token(out_id,value,minRatio); }
        else if (in_id> 0 && out_id === -1) { token_utoken(in_id,value,minRatio); }
        else if (in_id > 0 && out_id > 0) { token_token(in_id,out_id,value,minRatio); }
    }

    return <>
       {show && <>
                <br/>
                <Button   variant='primary' onClick={handleswap}  ><SwapTokenSvg size={20} />  {t('swapText')}</Button>
                </>
       }
    </>
   
});

export default SubmitButton;

