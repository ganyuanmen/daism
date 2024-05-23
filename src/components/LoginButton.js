import React, {useImperativeHandle,useState,forwardRef} from "react"
import { SiweMessage } from 'siwe'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux';
import {setMessageText,setTipText,setLoginsiwe,setDaoActor,setActor} from '../data/valueData'


const LoginButton = forwardRef((props, ref) => {
    const [singering,setSingering]=useState(false); //正在签名
    const t = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user)
    const dispatch = useDispatch();
    function showLoadding(str){dispatch(setTipText(str))}
    function showTip(str){dispatch(setMessageText(str))}
    
  
    async function createSiweMessage() {
        const res = await fetch(`/api/siwe/nonce`)
        let nonce=await res.text()
        return new SiweMessage({
            domain:window.location.host, 
            address:window.daism_signer.address,
            statement: 'Sign in with Ethereum to the daism dApp.',
            uri: window.location.origin,
            version: '1',
            chainId: user.chainId,
            nonce
        });
      }

    const siweLogin=async ()=>{
        if(singering) return
        showLoadding(t('singerLoginingText'))
        setSingering(true)
        const messageObj = await createSiweMessage();
        const message=messageObj.prepareMessage();

        window.daism_signer.signMessage(message).then(async (signature)=>{
        const res = await fetch(`/api/siwe/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message, signature })
        });
        let data=await res.json();

        if(res.status!==200) { 
            console.error(data.errMsg)
            showTip(`${t('loginError')} \n ${data.errMsg} `)
         }
        else { 
            dispatch(setLoginsiwe(true))
            dispatch(setDaoActor(data.daoActor))
            dispatch(setActor(data.actor))
            window.sessionStorage.setItem("loginsiwe", "1")
            window.sessionStorage.setItem("daoActor", JSON.stringify(data.daoActor))
            window.sessionStorage.setItem("actor", JSON.stringify(data.actor))
        }
        setSingering(false)
        showLoadding('')

    },err=>{ //钱包签名错误处理
        console.error(err);
        setSingering(false)
        showLoadding('')
        if(err.message.includes('User rejected the request'))
            showTip(t("rejectLogin"));
        else
            showTip(t('errorText')+(err.message?err.message:err));
    })
    }

    useImperativeHandle(ref, () => ({siweLogin:siweLogin}));
    
   //command 不显示文本
    return <>
            { !props.command? 
                <>{
                    singering?
                        <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> {t('singerLoginText')}...</>
                    :<span>{t('loginText')}</span>
                }
                </>:
                <></>
            }
           </>
});

export default LoginButton;
