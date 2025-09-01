import React, { useImperativeHandle, useState, forwardRef, ForwardRefRenderFunction } from "react";
import { SiweMessage } from 'siwe';
import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
// import { type signeredObjType, getSigneredObj } from "@/lib/globalStore";
import { getDaismContract } from "@/lib/globalStore";
import {type RootState, type AppDispatch, setErrText, setTipText, setLoginsiwe,
  setDaoActor,setActor,setMyFollow,setShowNotice} from '@/store/store';

interface LoginButtonProps {
  second_login?: boolean; //是否第二次登录
  command?: boolean; //是否显示 "登录" 文本
}

export interface LoginButtonRef {
  siweLogin: () => Promise<void>;
}

const LoginButton: ForwardRefRenderFunction<LoginButtonRef, LoginButtonProps> = (props, ref) => {
  const [singering, setSingering] = useState(false); // 正在签名
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user);
  const dispatch = useDispatch<AppDispatch>();
  // const singerObj: signeredObjType|undefined = getSigneredObj();
  
  const showLoadding = (str: string) => dispatch(setTipText(str));
  const showTip = (str: string) => dispatch(setErrText(str));
  const showError = (str: string) => dispatch(setErrText(str));
  let daismObj=getDaismContract();

  async function createSiweMessage(): Promise<SiweMessage> {
    const res = await fetch(`/api/siwe/nonce`);
 
    const data = await res.json();
    console.log("res once:",data)

    return new SiweMessage({
      domain: window.location.host,
      address: await daismObj?.signer.getAddress(),
      statement: 'Sign in with Ethereum to the daism dApp.',
      uri: window.location.origin,
      version: '1',
      chainId: user.chainId,
      nonce:data.nonce
    });
  }

  const siweLogin = async (): Promise<void> => {
    if (singering) return;
    if (!daismObj?.signer || !daismObj.signer.signMessage){
        showError(tc('noConnectText'));
        return;
    }
    const controller = new AbortController();
    showLoadding(tc('singerLoginingText'));
    setSingering(true);
    
    try {
      const messageObj = await createSiweMessage();
      const message = messageObj.prepareMessage();
      const signature = await daismObj.signer.signMessage(message);
   
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const res = await fetch(`/api/siwe/login`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const data = await res.json();

        if (res.status !== 200) {
          console.error(data.errMsg);
          showTip(`${tc('loginError')} \n ${data.errMsg} `);
        } else {
          if (!props?.second_login) {
            dispatch(setLoginsiwe(true));
            dispatch(setDaoActor(data.daoActor));
            dispatch(setActor(data.actor));
            dispatch(setMyFollow(data.myFollow));
            dispatch(setShowNotice(true));
            window.sessionStorage.setItem("loginsiwe", "1");
            window.sessionStorage.setItem("daoActor", JSON.stringify(data.daoActor));
            window.sessionStorage.setItem("actor", JSON.stringify(data.actor));
            window.sessionStorage.setItem("myFollow", JSON.stringify(data.myFollow));
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if ((error as Error).name === 'AbortError') {
          console.error("请求超时");
          showTip('登录超时，请重新登录!');
        } else {
          console.error(error);
        }
      } finally {
        setSingering(false);
        showLoadding('');
      }
    } catch (err) {
      setSingering(false);
      showLoadding('');
      const error = err as Error;
      
      if (error.message.includes('User rejected the request')) {
        showTip(tc("rejectLogin"));
      } else {
        showTip(tc('errorText') + (error.message ? error.message : error));
      }
    }
  };


  useImperativeHandle(ref, () => ({ siweLogin }));

  return (
    <>
      {!props.command && (
        <>
          {singering ? (
            <>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> 
              {tc('singerLoginText')}...
            </>
          ) : (
            <span>{tc('loginText')}</span>
          )}
        </>
      )}
    </>
  );
};

export default forwardRef(LoginButton);