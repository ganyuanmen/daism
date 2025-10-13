"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { WalletManager, WalletProviderType, TargetChainParams } from "../components/wallet/walletManager";

interface UseWalletManagerOptions {
  targetChain?: TargetChainParams;
  debug?: boolean;
  onConnected?: (account: string, provider: ethers.BrowserProvider) => void;
  onDisconnected?: () => void;
  showError?: (msg: string) => void;
  setIsShowBtn?:(v:boolean)=>void;
  onSwitch?:()=>void; //换用户后退出 签名
}

export const useWalletManager = (opts: UseWalletManagerOptions = {}) => {
  const providerRef = useRef<WalletProviderType | null>(null);
  const netRef = useRef<(() => void) | null>(null);
  const userRef = useRef<(() => void) | null>(null);

  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const walletManagerRef = useRef<WalletManager>(
    new WalletManager(providerRef, netRef, userRef, {
      setAccount,
      setChainId,
      showError: opts.showError,
      targetChain: opts.targetChain,
      debug: opts.debug,
      setIsShowBtn:opts.setIsShowBtn,
      onConnected: opts?.onConnected,
      onDisconnected:opts?.onDisconnected,
      onSwitch:opts?.onSwitch
    })
  );

  // ============================
  // 连接钱包
  // ============================
  const connectWallet = useCallback(async (provider: WalletProviderType) => {
    setConnecting(true);
    try {
      return await walletManagerRef.current.connectWallet(provider);
    } finally {
      setConnecting(false);
    }
  }, []);

  // ============================
  // 自动恢复连接
  // ============================
  // const autoReconnectWallet = useCallback(async () => {
  //   setConnecting(true);
  //   try {
  //     return await walletManagerRef.current.autoReconnectWallet();
  //   } finally {
  //     setConnecting(false);
  //   }
  // }, []);

  // ============================
  // 断开钱包
  // ============================
  const disconnectWallet = useCallback(() => {
    walletManagerRef.current.disconnectWallet();
  }, []);

  // ============================
  // 自动尝试恢复连接（首次挂载）
  // ============================
  // useEffect(() => {
  //   autoReconnectWallet().catch(() => {
  //     /* 忽略未授权或无连接 */
  //   });
  // }, [autoReconnectWallet]);

  return {
    account,
    chainId,
    connecting,
    connectWallet,
    // autoReconnectWallet,
    disconnectWallet,
  };
};
