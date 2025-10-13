"use client";
import { ethers } from "ethers";
import type { RefObject } from "react";

/** 钱包 Provider 类型 */
export interface WalletProviderType {
  info: {
    uuid: string;
    name: string;
    icon?: string;
    rdns?: string;
  };
  provider: any;
}

/** 目标链参数 */
export interface TargetChainParams {
  chainId: number; // 十进制
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls?: string[];
}

/** WalletManager 配置项 */
interface WalletManagerOptions {
  setAccount?: (a: string | null) => void;
  setChainId?: (c: number | null) => void;
  showError?: (msg: string) => void;
  onConnected?: (account: string, provider: ethers.BrowserProvider) => void;
  onDisconnected?: () => void;
  setIsShowBtn?:(v:boolean)=>void;
  onSwitch?:()=>void;
  debug?: boolean;
  targetChain?: TargetChainParams; // 如果提供则自动切换或添加
}

/** WalletManager 类 */
export class WalletManager {
  private providerRef: RefObject<WalletProviderType | null>;
  private netWorkSwitchRef: RefObject<(() => void) | null>;
  private userSwitchRef: RefObject<(() => void) | null>;
  private opts: WalletManagerOptions;
  public connecting:boolean;

  constructor(
    providerRef: RefObject<WalletProviderType | null>,
    netWorkSwitchRef: RefObject<(() => void) | null>,
    userSwitchRef: RefObject<(() => void) | null>,
    opts: WalletManagerOptions = {}
  ) {
    this.providerRef = providerRef;
    this.netWorkSwitchRef = netWorkSwitchRef;
    this.userSwitchRef = userSwitchRef;
    this.opts = opts;
    this.connecting=true;
  }

  private log(...args: any[]) {
    if (this.opts.debug) console.log("%c[WalletManager]", "color:#0bf;", ...args);
  }
/** ============================
 * 强制切换或添加目标网络（Edge 兼容 + 超时恢复）
 * ============================ */
private async switchOrAddTargetChain(provider: any) {
  if (!this.opts.targetChain) return;

  const { chainId, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
    this.opts.targetChain;
  const hexChainId = "0x" + chainId.toString(16);

  const isEdge =
    typeof navigator !== "undefined" && /Edg\//.test(navigator.userAgent);
  const timeoutMs = 8000;

  const raceTimeout = (ms: number) =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("wallet_switchEthereumChain timeout")), ms)
    );

  this.log(`🌐 尝试切换到网络: ${chainName} (${hexChainId})`);

  try {
    await Promise.race([
      provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      }),
      raceTimeout(timeoutMs),
    ]);

    if (isEdge) {
      this.log("🕓 Edge detected — waiting for wallet sync...");
      await new Promise((res) => setTimeout(res, 1000));
    }

    this.log(`✅ 已成功切换到网络: ${chainName}`);
  } catch (err: any) {
    // 🧩 超时或其他错误
    if (err.message?.includes("timeout")) {
      this.log(`⚠️ 钱包切换超时 (${timeoutMs}ms)`);

      // Edge 环境中尝试重新检测当前网络
      try {
        const tempProvider = new ethers.BrowserProvider(provider);
        const currentNetwork = await tempProvider.getNetwork();
        const currentId = Number(currentNetwork.chainId);
        if (currentId === chainId) {
          this.log("✅ 钱包已在目标网络上，继续连接流程。");
          return;
        }
      } catch {
        this.log("🔍 检查当前网络失败，可能钱包无响应。");
      }

      // 提示用户手动切换
      this.opts.showError?.(
        `Edge 钱包切换网络失败，请手动切换到 ${chainName}（Chain ID: ${chainId}）。`
      );
      return;
    }

    // 🧩 未添加目标网络
    if (err.code === 4902) {
      this.log(`⚙️ 钱包未添加 ${chainName}，正在添加...`);
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId,
              chainName,
              rpcUrls,
              nativeCurrency,
              blockExplorerUrls,
            },
          ],
      });
        this.log(`✅ 已添加并切换到 ${chainName}`);
      } catch (addErr) {
        this.log("❌ 添加网络失败:", addErr);
        this.opts.showError?.(
          `添加网络失败，请手动添加 ${chainName}（Chain ID: ${chainId}）`
        );
        throw addErr;
      }
    } else {
      this.log("❌ 切换网络失败:", err);
      this.opts.showError?.(
        `请手动切换到 ${chainName} 网络（Chain ID: ${chainId}）。`
      );
      throw err;
    }
  }
}


  /** ============================
 * 连接钱包
 * ============================ */
async connectWallet(providerWithInfo: WalletProviderType) {
  this.connecting = true;
  this.providerRef.current = providerWithInfo;
  this.log("🔗 Connecting wallet:", providerWithInfo.info.name);

  try {
    const accounts: string[] = await providerWithInfo.provider.request({
      method: "eth_requestAccounts",
    });
    const account = accounts?.[0];
    if (!account) throw new Error("No accounts found");

    // 初始 ethersProvider
    let ethersProvider = new ethers.BrowserProvider(providerWithInfo.provider);
    // let signer = await ethersProvider.getSigner();
    let network = await ethersProvider.getNetwork();
    let chainId = Number(network.chainId);

    // =============================
    // 自动切换或添加目标网络
    // =============================
    if (this.opts.targetChain && chainId !== this.opts.targetChain.chainId) {
      this.log(`⚠️ 当前网络 (${chainId}) 与目标网络 (${this.opts.targetChain.chainId}) 不匹配，正在切换...`);
      await this.switchOrAddTargetChain(providerWithInfo.provider);

      await new Promise((res) => setTimeout(res, 800)); // 等待钱包完成切换
      // ❗切换完成后，重新创建 BrowserProvider
      ethersProvider = new ethers.BrowserProvider(providerWithInfo.provider);
      // signer = await ethersProvider.getSigner();
      network = await ethersProvider.getNetwork();
      chainId = Number(network.chainId);
    }

    this.log("✅ Connected:", { account, chainId });

    this.setupChainChangeListener(providerWithInfo.provider);
    this.setupUserSwitchListener(providerWithInfo.provider);

    this.opts.setAccount?.(account);
    this.opts.setChainId?.(chainId);
    this.opts.onConnected?.( account, ethersProvider );

    // localStorage.setItem("connectedWallet", providerWithInfo.info.uuid);
      // 存储连接信息
      sessionStorage.setItem("providerinfoname", providerWithInfo.info.name);
      sessionStorage.setItem("connectedAccount", account);
      // sessionStorage.setItem("isLogin", "true");
  } catch (error) {
    console.error("❌ connect error:", error);
    this.opts.showError?.((error as Error).message || "Failed to connect wallet");
  } finally {
    this.connecting = false;
  }
}


  /** ============================
   * 自动恢复钱包连接状态
   * ============================ */
  async autoReconnectWallet() {
    this.connecting=true
    try { 
      const providerName = sessionStorage.getItem("providerinfoname");
      const savedAccount = sessionStorage.getItem("connectedAccount");
      if (!providerName) {this.opts.setIsShowBtn?.(true); return;}

      const w = window as any;
      let provider: any = null;


if (w.ethereum && providerName.toLowerCase().includes("metamask")) {

  provider = w.ethereum;
} else if (w.okxwallet && providerName.toLowerCase().includes("okx")) {

  provider = w.okxwallet;
} else if (w.bitkeep?.ethereum && providerName.toLowerCase().includes("bitget")) {

  provider = w.bitkeep.ethereum;
} else if (
  (w.coinbaseWalletExtension && providerName.toLowerCase().includes("coinbase")) ||
  (w.ethereum?.isCoinbaseWallet && providerName.toLowerCase().includes("coinbase"))
) {

  provider = w.coinbaseWalletExtension || w.ethereum;
}


      // if (w.ethereum && providerName.toLowerCase().includes("metamask")) provider = w.ethereum;
      // else if (w.okxwallet && providerName.toLowerCase().includes("okx")) provider = w.okxwallet;
      // else if (w.bitkeep?.ethereum && providerName.toLowerCase().includes("bitget")) provider = w.bitkeep.ethereum;

      if (!provider)  {this.opts.setIsShowBtn?.(true); return;};

      this.providerRef.current = { info: { uuid: "", name: providerName }, provider };
      const accounts: string[] = await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const accs = await provider.request({ method: "eth_accounts" });
            resolve(accs);
          } catch {
            resolve([]);
          }
        }, 600);
      });

      // const accounts: string[] = await provider.request({ method: "eth_accounts" });
      if (!accounts?.length)  {this.opts.setIsShowBtn?.(true); return;};

      const account = accounts[0];
       // ✅ 如果缓存的账号和当前钱包账号不一致，不自动恢复（避免自动切错账号）
    if (savedAccount && account.toLowerCase() !== savedAccount.toLowerCase()) {
      console.warn("[autoReconnectWallet] 检测到账户不一致，跳过自动登录");
      this.opts.setIsShowBtn?.(true);
      return;
    }
  // ✅ 初始化 ethers provider / signer / 网络
  let ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  let network = await ethersProvider.getNetwork();
  let chainId = Number(network.chainId);

  if (this.opts.targetChain && chainId !== this.opts.targetChain.chainId) {
    this.log(`⚠️ 当前网络 (${chainId}) 与目标网络 (${this.opts.targetChain.chainId}) 不匹配，正在切换...`);
    await this.switchOrAddTargetChain(provider);

    await new Promise((res) => setTimeout(res, 600)); // 等待钱包完成切换
    // ❗切换完成后，重新创建 BrowserProvider
    ethersProvider = new ethers.BrowserProvider(provider);
    // signer = await ethersProvider.getSigner();
    network = await ethersProvider.getNetwork();
    chainId = Number(network.chainId);
  }

      // if (this.opts.targetChain && chainId !== this.opts.targetChain.chainId) {
      //   await this.switchOrAddTargetChain(provider);
      //   network = await ethersProvider.getNetwork();
      //   chainId = Number(network.chainId);
      // }

      this.setupChainChangeListener(provider);
      this.setupUserSwitchListener(provider);

      // sessionStorage.setItem("isLogin", "true");
      this.opts.setAccount?.(account);
      this.opts.setChainId?.(chainId);
      this.opts.onConnected?.(account, ethersProvider);

      return { account, chainId, ethersProvider, signer };
  } catch (error) {
      console.error(error)
  }finally{
    // console.log("auto is okkkkkkkkkkkkkkkkkkkkkk")
    this.connecting=false;
  }
  }

  /** ============================
   * 断开钱包连接
   * ============================ */
  disconnectWallet() {
    sessionStorage.removeItem("providerinfoname");
    sessionStorage.removeItem("connectedAccount");

    this.providerRef.current = null;

    this.netWorkSwitchRef.current?.();
    this.netWorkSwitchRef.current = null;

    this.userSwitchRef.current?.();
    this.userSwitchRef.current = null;

    this.opts.setAccount?.(null);
    this.opts.setChainId?.(null);
    this.opts.onDisconnected?.();
  }
/** ============================
 * 网络切换监听（增强版）
 * ============================ */
private setupChainChangeListener(provider: any) {
  // 移除旧监听器，避免重复绑定
  this.netWorkSwitchRef.current?.();

  const handler = async (chainIdHex: string) => {
    const chainId = parseInt(chainIdHex, 16);
    this.log(`🔄 检测到网络切换: ${chainId}`);

    // 更新状态
    // this.opts.setChainId?.(chainId);

    // 1️⃣ 如果指定了目标网络
    // if (this.opts.targetChain) {
    //   const targetId = this.opts.targetChain.chainId;
    //   if (chainId !== targetId) {
    //     console.warn(
    //       `[WalletManager] 检测到网络切换 (${chainId}) ≠ 目标网络 (${targetId})，自动登出。`
    //     );
     
        // 自动登出
        this.disconnectWallet();
    //     return;
    //   }
    // }

    // 2️⃣ 网络正确，重新同步连接信息
    // if (this.providerRef.current) {
    //   try {
    //     const ethersProvider = new ethers.BrowserProvider(this.providerRef.current.provider);
    //     const accounts: string[] = await this.providerRef.current.provider.request({
    //       method: "eth_accounts",
    //     });
    //     const account = accounts?.[0] ?? null;

    //     if (account) {
    //       this.opts.setAccount?.(account);
    //       this.opts.onConnected?.(account, ethersProvider);
          
    //     } else {
    //       // 没有账户，视为断开
    //       this.disconnectWallet();
    //     }
    //   } catch (err) {
    //     console.error("[chainChanged handler] 处理错误:", err);
      
    //   }
    // }
  };

  provider.on?.("chainChanged", handler);
  this.netWorkSwitchRef.current = () => provider.removeListener?.("chainChanged", handler);
}


  /** ============================
   * 账户切换监听
   * ============================ */
  private setupUserSwitchListener(provider: any) {

    console.log("setupUserSwitchListenersetupUserSwitchListenersetupUserSwitchListenersetupUserSwitchListener")
    this.userSwitchRef.current?.();

    const handler = async (accounts: string[]) => {
      const newAccount = accounts?.[0] ?? null;
      this.opts.setAccount?.(newAccount);

      if (!newAccount) {
        this.disconnectWallet();
        this.opts.setIsShowBtn?.(true);
        return;
      }

      if (this.providerRef.current) {
        const ethersProvider = new ethers.BrowserProvider(this.providerRef.current.provider);
        this.opts.onConnected?.(newAccount, ethersProvider);
        this.opts.onSwitch?.();
        sessionStorage.setItem("connectedAccount", newAccount);

      }
    };

    provider.on?.("accountsChanged", handler);
    this.userSwitchRef.current = () => provider.removeListener?.("accountsChanged", handler);
  }
}
