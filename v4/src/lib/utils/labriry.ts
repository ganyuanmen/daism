// 'use client'
// import {type RootState, type AppDispatch, setUser,setLoginsiwe,setActor,setDaoActor,setMessageText,
//     setEthBalance,setTipText,setTokenList,setTokenFilter,setMyFollow,setErrText} from '@/store/store';

// import {useDispatch, useSelector} from 'react-redux';
// import { client } from '../client';
// import { ethers } from 'ethers';
// import { setSigneredObj,setEthersProver } from "@/lib/globalStore";
// import { setDaismObj } from "@/lib/getDaismStore";
// import DaoApi from '@/lib/contract';


// const dispatch = useDispatch<AppDispatch>();
// const tc = useTranslations('Common');
// const NETWORKNAME=process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || '';
// const locale = useLocale();
// const pathWiLocale = usePathname() || ''; // 当前路径，例如 /en/about
// const pathname = pathWiLocale.replace(`/${locale}`, '') || '/';

// export function showMessage(str:string){ dispatch(setMessageText(str));}
// export function showError(str:string){ dispatch(setErrText(str));}
// export function showTip(str: string) {dispatch(setTipText(str));}
// export function closeTip() { dispatch(setTipText(''));}



//   // 退出登录
//   export function onDisconnect() {

//     try {fetch('/api/siwe/logout');
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
    
//     dispatch(setEthBalance('0'))
//     dispatch(setUser({networkName:'', connected: 0, account: '', chainId: 0 }));
//     dispatch(setLoginsiwe(false));
//     dispatch(setActor(null));
//     dispatch(setDaoActor(null));
    
//     window.sessionStorage.setItem("isLogin", "0");
//     window.sessionStorage.setItem("loginsiwe", "0");
//     window.sessionStorage.setItem("providerinfouuid", '');
    
//     if(pathname==='/') getTokens('');
//   };

//     // 获取代币数据
//   export function getTokens(did: string) {
//     client.get(`/api/getData?did=${did}`, 'getToken').then(res => {
//       if (res.status === 200) {
//         dispatch(setTokenList(res.data));
//         dispatch(setTokenFilter(res.data));
//       } else {
//         console.error("Token fetch error:", res.statusText);
//       }
//     }).catch(err => {
//       console.error("Token fetch failed:", err);
//     });
//   };

  
// export function checkNetwork (chainId: number): boolean  {
//     const chainIdKey = `_${chainId}`;
//     if (DaismNetwork[chainIdKey as keyof typeof DaismNetwork] !== NETWORKNAME) {
//         showMessage(tc('mustLoginText', { netName:NETWORKNAME}));
//       return false;
//     }
//     return true;
//   };

//   // 数据更新
// export async function updateLoginData(tempAccount:string,walletProvider:WalletProviderType) {
   
//     const provider = new ethers.BrowserProvider(walletProvider.provider);
//     const signer = await provider.getSigner();
//     const network = await provider.getNetwork();
//     const chainId = parseInt(network.chainId.toString());
        
//     // 检查网络
//     if (!checkNetwork(chainId)) return false;
  
//     // 设置全局对象
//     setEthersProver(provider);
//     setSigneredObj(signer);
//     setDaismObj(new DaoApi(signer,tempAccount));  
    
//     // 更新 Redux 状态
//     dispatch(setUser({ connected: 1, account: tempAccount, networkName: network.name, chainId }));
    
//     // 获取余额
//     walletProvider.provider.getBalance(tempAccount).then((balance:string) => { dispatch(setEthBalance(ethers.formatEther(balance))); });
    
//     // 获取代币数据
//     if(pathname==='/deval')  getTokens(tempAccount);

//     // 保存到 sessionStorage
//     window.sessionStorage.setItem("providerinfoname", (walletProvider.info.name));
//     window.sessionStorage.setItem("isLogin", "1"); // 标记用户已登录
// };

// export function recorLogin(){
//     dispatch(setLoginsiwe(true));
//     const daoActor = window.sessionStorage.getItem("daoActor");
//     const actor = window.sessionStorage.getItem("actor");
//     const myFollow = window.sessionStorage.getItem("myFollow");

//     daoActor && dispatch(setDaoActor(JSON.parse(daoActor)));
//     actor && dispatch(setActor(JSON.parse(actor)));
//     myFollow && dispatch(setMyFollow(JSON.parse(myFollow)));
// }