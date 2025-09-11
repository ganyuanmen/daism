'use client';

import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import {useRef,useEffect, useState } from "react";
// import { useDispatch } from 'react-redux';
import {useTranslations } from 'next-intl';
import { useLayout } from '@/contexts/LayoutContext';
import ImageWithFallback from "../ImageWithFallback";
// import { useStableCallbackRef } from "@/hooks/useStableCallbackRef";
// import { current } from "@reduxjs/toolkit";
// import { onDisconnect,updateLoginData,checkNetwork,recorLogin,showError } from "@/lib/utils/labriry";
// import {type AppDispatch} from '@/store/store';
  
    interface ChildProps { 
      providers: WalletProviderType[],
      onDisconnect:()=>void,
      updateLoginData:(tempAccount:string,walletProvider:WalletProviderType)=>Promise<void>,
      checkNetwork:(chainId: number)=> boolean,
      recorLogin:()=>void,
      showError:(str:string)=>void
    
    }
  
    export default function WalletInfo({providers,onDisconnect,updateLoginData
      ,checkNetwork,recorLogin,showError}: ChildProps) {

    const [connecting, setConnecting] = useState(false); // 连接状态
    const providerRef = useRef<WalletProviderType | null>(null); // 当前选择的提供者
    const tc = useTranslations('Common');
    
    
    const netWorkSwitchRef = useRef<(() => void) | null>(null); 
    const userSwithRef = useRef<(() => void) | null>(null);
    const { isShowBtn, setIsShowBtn } = useLayout(); 
  
       
// 连接钱包
const connectWallet =async (providerWithInfo: WalletProviderType) => {
  providerRef.current = providerWithInfo;
  setConnecting(true);
  
  try { // 请求账户访问权限
      const accounts = await providerWithInfo.provider.request({method: 'eth_requestAccounts' });
      
      const tempAccount = accounts?.[0];
      if (!tempAccount){
          showError('No accounts found');
          return;
      }

      // 先移除旧的监听器
      if (netWorkSwitchRef.current) {
          netWorkSwitchRef.current();
          netWorkSwitchRef.current = null;
      }
      if (userSwithRef.current) {
          userSwithRef.current();
          userSwithRef.current = null;
      }
       
      setupChainChangeListener(providerWithInfo.provider,tempAccount); // 网络切换监听
      setupUserSwithchListener(providerWithInfo.provider); // 监听账户变化
      updateLoginData(tempAccount,providerWithInfo);

  } catch (err) {
      window.sessionStorage.setItem("providerinfoname", '');
      window.sessionStorage.setItem("isLogin", ""); 
      console.error("Wallet connection error:", err);
      showError(tc('connectionFailed'));
  } finally {
      setConnecting(false);
  }
  }

  // const connectWalletRef = useStableCallbackRef(connectWallet);

  // 恢复登录状态
  useEffect(() => {
    // const connectWallet = connectWalletRef.current;
    // const recorLogin = recorLoginRef.current;
    // const setIsShowBtn = setIsShowBtnRef.current;
  
    if (providers.length > 0) {
      const providerName = window.sessionStorage.getItem("providerinfoname");
      
      if (providerName) {
        const savedProvider = providers.find(p => p.info.name === providerName);
        if (savedProvider) providerRef.current = savedProvider;
      }

      if (window.sessionStorage.getItem("isLogin") === '1') {
        if(providerRef.current){
          connectWallet(providerRef.current);
        } 
        if (window.sessionStorage.getItem("loginsiwe") === '1') recorLogin()
      } 
      else
      {
        setIsShowBtn(true);
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers]);



    // 处理网络切换（使用匿名函数）
const setupChainChangeListener = (provider: any,account:string) => {
    
    const chainChangedHandler = (chainId: string) => {
      onDisconnect();
      // console.info("chainChanged--->", chainId);
      const decimalChainId = parseInt(chainId, 16);
      if (checkNetwork(decimalChainId)) {
        if(providerRef.current)  updateLoginData(account,providerRef.current);
      }
    };
  
    provider.on('chainChanged', chainChangedHandler);
    
    netWorkSwitchRef.current = () => {
      provider.removeListener('chainChanged', chainChangedHandler);
    };
  };

  
// 处理用户切换（使用匿名函数）
const setupUserSwithchListener = (provider: any) => {

    const userChangedHandler = (accounts: string[]) => {
        onDisconnect();
        // console.info("userChangedHandler--->", accounts);
        if (accounts.length > 0){
            if(providerRef.current)  updateLoginData(accounts[0],providerRef.current);
        }
    };
  
    provider.on('accountsChanged', userChangedHandler);
    
    netWorkSwitchRef.current = () => {
      provider.removeListener('chainChanged', userChangedHandler);
    };
  };

  return (
    <Dropdown>
              {isShowBtn && <Dropdown.Toggle 
                variant="primary" 
                size="sm" 
                disabled={connecting}
                style={{ 
                  borderRadius: '12px', 
                  marginLeft: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                
                <Image alt="wallet" src='/wallet.svg' width={18} height={18} /> 
                <span>{connecting ? tc('connectingText') : tc('connectText')}</span>
              
              </Dropdown.Toggle>}
              
              <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {providers.map(provider => (
                  <Dropdown.Item 
                    key={provider.info.uuid} 
                    onClick={() => connectWallet(provider)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px'
                    }}
                  >
                    <ImageWithFallback 
                      src={provider.info.icon} 
                      alt={provider.info.name}  
                      width={24} 
                      height={24} 
                      style={{ borderRadius: '4px' }}
                    />
                    <span>{provider.info.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
    </Dropdown>
  );
}

