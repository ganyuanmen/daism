import { useState } from 'react';
import { Button } from 'react-bootstrap';
import SwapWindow from './SwapWindow';
import { ethers } from 'ethers';
import iaddStyle from "../../styles/iadd.module.css"
import { useTranslations } from 'next-intl'

export function OpenWindowButton({user,setOutput,workIndex,token,setToken,setBalance,comulate,utoken,iadd,setTokenPrice,setIsTip,...props}){
    const [show,setShow]=useState(false)
    const t = useTranslations('iadd')
    // function checkApproveUtoken()
    // {
    //     if(props.utokenApprove.current===undefined) { //未授权
    //         window.daismDaoapi.UnitToken.allowance(user.account, window.daismDaoapi.IADD.address).then(e=>{ //查询授权
    //             props.utokenApprove.current=parseFloat(e.approveSum) > 0
    //             props.setIsallow(props.utokenApprove.current)
    //             if(!props.utokenApprove.current)  props.inputRef.current.setInputError(t('unauthorizedText'))

    //         })
    //     } else  {
    //         props.setIsallow(props.utokenApprove.current)
    //         if(!props.utokenApprove.current)  props.inputRef.current.setInputError(t('unauthorizedText'))
    //     }
    // }
 
    // function checkApproveToken()
    // {
    //     if(props.tokenApprove.current===undefined){
    //         window.daismDaoapi.DaoToken.allowanceGlobal(user.account, window.daismDaoapi.IADD.address).then(e=>{
    //             props.tokenApprove.current=e.status
    //             props.setIsallow(props.tokenApprove.current)
    //             if(!props.tokenApprove.current)  props.inputRef.current.setInputError(t('unauthorizedText'))
    //         }) 
    //     }else { 
    //         props.setIsallow(props.tokenApprove.current)
    //         if(!props.tokenApprove.current)  props.inputRef.current.setInputError(t('unauthorizedText'))
    //     }
    // }

    
    function getPool(_id) {
        setTokenPrice('loading...')
        iadd['pools'](_id).then(result=>{
           let utoken=parseFloat(ethers.formatUnits(result.unit_token_supply,8))
           let token=parseFloat(ethers.formatEther(result.eip3712_supply))
           let price=Math.round((utoken/token-0.01)*1000000)/1000000
           setTokenPrice(price)
        })
     

   }

    //token选择处理 obj->被选择的token对象
    const selectToken = async (obj) => {
        setShow(false);
        if (obj.token_id === token.token_id) return;    //重复选择不处理
        // if(obj.token_id===-2) props.setIsallow(true);  //eth 不需要授权
        let logoImage; //logo 图片

        if (obj.token_id === -2) {logoImage = '/eth.png';setTokenPrice('');}
        else if (obj.token_id === -1) {  //utoken
            // if(workIndex===-2 && window.daismDaoapi ){ checkApproveUtoken() } //上窗口
            logoImage = '/uto.svg';setTokenPrice('');
        }
        else { //token
            // if(workIndex===-2 && window.daismDaoapi){ checkApproveToken() } //上窗口
            logoImage = obj.dao_logo ? obj.dao_logo : '/uto.svg';
            setBalance('0')
            getPool(obj.token_id) //获单价
            if(window.daismDaoapi) //已登录
            {
                setBalance('loading...')
                window.daismDaoapi.DaoToken.balanceOf(obj.token_id, user.account).then(balance=>{
                    setBalance(Math.round(parseFloat(balance.token)*1000000)/1000000)
                })
            }
        }

        setToken({ btext: obj.dao_symbol, blogo: logoImage, token_id: obj.token_id });

        if(workIndex===-2) { //上窗口
            if (obj.token_id === props.downRef.current.getToken().token_id)  //与输出token相同
            {   
               props.downRef.current.setToken({ btext: t('selectTokenText'), blogo: '', token_id: 0 });
               props.downRef.current.setBalance('0')
               props.statusRef.current.setStatus({err:'',ratio:''})
               setIsTip(false);
           } else if(props.downRef.current.getToken().token_id===0 ) setIsTip(false); else setIsTip(true);

           //(obj.token_id ===-2 && props.downRef.current.getToken().token_id===-1) || 
        

        }else //下窗口
        {
            if (obj.token_id === props.upRef.current.getToken().token_id) //与输入token相同
            {  
                props.upRef.current.setToken({ btext: t('selectTokenText'), blogo: '', token_id: 0 });
                props.upRef.current.setBalance('0')
                props.statusRef.current.setStatus({err:'',ratio:''})
                setIsTip(false)
            } else if(props.upRef.current.getToken().token_id===0) setIsTip(false); else setIsTip(true);
            //(obj.token_id ===-1 && props.upRef.current.getToken().token_id===-2)             || 
        }



         setRatio({ btext: obj.dao_symbol, blogo: logoImage, token_id: obj.token_id })
         setTimeout(() => {
            setOutput() //触发重新计算
         }, 100);
        
    } 

    
    function getEther(v){return ethers.parseEther(v+'')}
    function getUtoEther(v){return ethers.parseUnits(v+'',8)}
    function fromEther(v){return Math.round(parseFloat(ethers.formatEther(v+''))*1000000)/1000000}
    function fromUtoken(v){return Math.round(parseFloat(ethers.formatUnits(v+'',8))*1000000)/1000000}
   
    function setRatio(obj){
        let inobj,outobj;
        if(workIndex===-2){inobj=obj;outobj=props.downRef.current.getToken();}
        else {outobj=obj;inobj=props.upRef.current.getToken();}

        if (inobj.token_id && outobj.token_id && inobj.token_id !== outobj.token_id) {
            props.statusRef.current.setStatus({ratio:'loading'})
            if (inobj.token_id === -2) { //上窗口eth
                
               utoken.getOutputAmount(getEther(1)).then(ethToutokenPrice=>{
                if (outobj.token_id === -1) { //eth to utoken
                    props.statusRef.current.setStatus({ratio:`1 ETH = ${fromUtoken(ethToutokenPrice[0])} UTOKEN` })
                } else {  // eth to token
                    if (outobj.token_id) { 
                        comulate.unitTokenToSCToken(ethToutokenPrice[0], outobj.token_id).then(e => {
                            props.statusRef.current.setStatus({ratio:`1 ETH = ${fromEther(e)} ${outobj.btext}`})
                        })
                    }
                }
               });
              
            } else if (inobj.token_id === -1) { //utoken to token
                if (outobj.token_id) {
                    comulate.unitTokenToSCToken(getUtoEther(1), outobj.token_id).then(e => {
                        props.statusRef.current.setStatus({ratio:`1 UTOKEN = ${fromEther(e)} ${outobj.btext}`})
                    })
                }
            } else if (inobj.token_id) {
                if (outobj.token_id === -1) {  //token to utoken
                    comulate.SCTokenToUnitToken(getEther(1), inobj.token_id).then(e => {
                        props.statusRef.current.setStatus({ratio:`1 ${inobj.btext} = ${fromUtoken(e)} UTOKEN`})
                    })
                } else {  //token to token
                    if (inobj.token_id && outobj.token_id) {
                        comulate.SCTokenToSCToken(getEther(1), inobj.token_id, outobj.token_id).then(e => {
                            props.statusRef.current.setStatus({ratio:`1 ${inobj.btext} = ${fromEther(e[0])} ${outobj.btext}`})
                        })
                    }
                }
            }
        }
    }

    return <> 
    <Button className={iaddStyle.iadd_btn} variant="outline-secondary"  onClick={()=>setShow(true)} size="lg" >
        {token.blogo && <img alt='' width={24} height={24}  src={token.blogo} />}
        <span style={{ display: 'inline-block', padding: '0 4px',fontSize: '20px',color:'#0D111C' }} >{token.btext}</span>
        <img alt='' width={24} height={24} src='/down.svg' />
    </Button>
    <SwapWindow workIndex={workIndex} show={show} setShow={setShow} selectToken={selectToken} />
    </>

}
