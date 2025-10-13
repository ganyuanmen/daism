
import { useEffect } from 'react';
import MetmaskInstall from './MetmaskInstall';
import WalletInfo from './WalletInfo';
import User from './User';
import {useDispatch, useSelector} from 'react-redux';
import {type RootState, type AppDispatch, setUser,setEthBalance,setErrText, setLoginsiwe, setDaoActor, setActor, setMyFollow, setUtoBalance} from '@/store/store';
import { ethers } from 'ethers';
import { setDaismContract } from "@/lib/globalStore";
import DaoApi from '@/lib/contract';
import { useLayout } from '@/contexts/LayoutContext';
import { useProviders } from '@/hooks/useProviders';
import Loading from '../Loadding';
import { useWalletManager } from '@/hooks/useWalletManager';
import ShowAddress from '../ShowAddress';
import LocaleSwitcher from '../LocaleSwitcher';


// const TARGET_CHAIN = {
//   chainId: 11155111, // Sepolia
//   chainName: "Sepolia Testnet",
//   rpcUrls: [process.env.NEXT_PUBLIC_HTTPS_URL as string],
//   nativeCurrency: { name: "Sepolia ETH", symbol: "SEP", decimals: 18 },
//   blockExplorerUrls: ["https://sepolia.etherscan.io"],
// };
const TARGET_CHAIN = {
  chainId: 1,
  chainName: "Ethereum Mainnet",
  rpcUrls: [
    "https://ethereum.publicnode.com",
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com/eth"
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },
  blockExplorerUrls: ["https://etherscan.io"]
};


/**
 * 钱包登录管理组件
 */
function Wallet({isPhone}:{isPhone:boolean}) {
    const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
    const dispatch = useDispatch<AppDispatch>();
    const { setIsShowBtn } = useLayout();  //是否开始显示 连接钱包按钮，先检测是否已登录。后显示连接按钮
    const showError=(str:string)=>{ dispatch(setErrText(str));}
    const [providers, loading] = useProviders();
 
    const recorLogin=()=>{
      dispatch(setLoginsiwe(true));
      const daoActor = window.sessionStorage.getItem("daoActor");
      const actor = window.sessionStorage.getItem("actor");
      const myFollow = window.sessionStorage.getItem("myFollow");

      if(daoActor) dispatch(setDaoActor(JSON.parse(daoActor)));
      if(actor) dispatch(setActor(JSON.parse(actor)));
      if(myFollow)  dispatch(setMyFollow(JSON.parse(myFollow)));
    }

           
// 连接钱包


const connectWallet1 =async (account: string,provider: ethers.BrowserProvider) => {
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    const daismObj=new DaoApi(signer,account);
    setDaismContract(daismObj); 

   
  daismObj.UnitToken.balanceOf(account).then(e=>{dispatch(setUtoBalance(e.utoken)) })
  
  // 更新 Redux 状态
  dispatch(setUser({ connected: 1, account: account, networkName: network.name, chainId }));
  
  // 获取余额
  provider.getBalance(account).then((balance:bigint) => { dispatch(setEthBalance(ethers.formatEther(balance))); });
  
  // 获取代币数据
  // if(pathname==='/forge')  getTokens(tempAccount);

  // 保存到 sessionStorage
  // window.sessionStorage.setItem("providerinfoname", (walletProvider.info.name));
  // window.sessionStorage.setItem("isLogin", "1"); // 标记用户已登录



  setTimeout(() => {
    setIsShowBtn(true)
  }, 100);

   
    
  }

  // 退出登录
  const onDisconnect=()=> {
    try {fetch('/api/siwe/logout',{method:'POST'});
    } catch (err) {
      console.error("Logout error:", err);
    }
    
    dispatch(setEthBalance('0'))
    dispatch(setUser({networkName:'', connected: 0, account: '', chainId: 0 }));
    dispatch(setLoginsiwe(false));
    dispatch(setActor(null));
    dispatch(setDaoActor(null));
    
    // window.sessionStorage.setItem("isLogin", "0");
    window.sessionStorage.setItem("loginsiwe", "0");
    // window.sessionStorage.setItem("providerinfouuid", '');
    setDaismContract(undefined);  
  };


  const {  connecting, connectWallet, disconnectWallet } = useWalletManager({
    targetChain: TARGET_CHAIN,
    debug: true,
    showError,
    setIsShowBtn,
    onConnected:connectWallet1,
    onDisconnected:onDisconnect,
    onSwitch:()=>{
      window.sessionStorage.setItem("loginsiwe", "0");
      dispatch(setLoginsiwe(false));
      dispatch(setActor(null));
      dispatch(setDaoActor(null));
    }
  });

    

  
  useEffect(()=>{
    if(!loading && providers.length===0){
      setIsShowBtn(true) //不安装钱包，直接显示界面
    }
//eslint-disable-next-line react-hooks/exhaustive-deps
  },[loading,providers])

  
    return (
    <>
      <div className={`d-flex ${isPhone?'justify-content-start':'justify-content-end'} align-items-center`} style={{ minWidth:isPhone?'100px':'300px' }}> 
        <div style={{ marginTop: '6px', marginRight: '10px' }}>
          {user.connected > 0 ? 
          <div className=' d-flex align-items-center' >
            <User onDisconnect={disconnectWallet}/>
            <ShowAddress address={user.account} />
          </div>
          :<>{ loading? <Loading spinnerSize='sm' containerSize='sm' />
              : providers.length > 0 ? <WalletInfo providers={providers} connectWallet={connectWallet} connecting={connecting} recorLogin={recorLogin} /> 
              :<MetmaskInstall  />
             }
          </>
          }
        </div>
        {!isPhone && <LocaleSwitcher flag={true} />}
      </div>   
    </>
  );
}

export default Wallet;



// import { useEffect } from 'react';
// import ShowAddress from '../ShowAddress';
// import { useProviders } from '@/hooks/useProviders';
// import LocaleSwitcher from '../LocaleSwitcher';
// import MetmaskInstall from './MetmaskInstall';
// import WalletInfo from './WalletInfo';
// import User from './User';
// import {useDispatch, useSelector} from 'react-redux';
// import {type RootState, type AppDispatch, setUser,setLoginsiwe,setActor,setDaoActor,setUtoBalance,
//   setEthBalance,setErrText,setMyFollow} from '@/store/store';

// import { ethers } from 'ethers';
// import { setDaismContract } from "@/lib/globalStore";
// import DaoApi from '@/lib/contract';
// import {useTranslations } from 'next-intl';
// // import { usePathname } from 'next/navigation';
// // import { useFetchToken } from '@/hooks/useFetchToken';
// import { useLayout } from '@/contexts/LayoutContext';
// /**
//  * 钱包登录管理组件
//  */
// function Wallet({isPhone}:{isPhone:boolean}) {
//     const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
//     // const [providers, setProviders] = useState<WalletProviderType[]>([]); // 钱包提供者列表
//     // const allProviders = useSyncProviders() as WalletProviderType[];
//     const [providers, loading] = useProviders();
//     const dispatch = useDispatch<AppDispatch>();
//     const NETWORKNAME=process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || '';
//     // const locale = useLocale();
//     // const pathWiLocale = usePathname() || ''; // 当前路径，例如 /en/about
//     // const pathname = pathWiLocale.replace(`/${locale}`, '') || '/';
//     const { setIsShowBtn } = useLayout();  //是否开始显示 连接钱包按钮，先检测是否已登录。后显示连接按钮
//     const showError=(str:string)=>{ dispatch(setErrText(str));}
//     const tc = useTranslations('Common');
//     // 获取代币数据
//     // const getTokens=useFetchToken();

   
//     useEffect(()=>{
//       if(!loading && providers.length===0){
//         setIsShowBtn(true) //不安装钱包，直接显示界面
//       }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     },[loading,providers])


//     const NET: Record<string, string> = {
//       '_0xaa36a7': 'sepolia',
//       '_0x4268': 'holesky',
//       '_0x1': 'mainnet',
//       '_11155111': 'sepolia',
//       '_17000': 'holesky',
//       '_1': 'mainnet'
//     };

//   // 退出登录
//   const onDisconnect=()=> {
    
//     try {fetch('/api/siwe/logout',{method:'POST'});
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
//     setDaismContract(undefined);  
    
//     // if(pathname==='/') getTokens('');
//   };

  
// const checkNetwork= (chainId: number): boolean=>  {
  
//   const chainIdKey = `_${chainId}`;
//     if (NET[chainIdKey] !== NETWORKNAME) {
//       showError(tc('mustLoginText', { netName: NETWORKNAME }));
//       return false;
//     }
//     return true;
// };

//   // 数据登录
// const updateLoginData=async (tempAccount:string,walletProvider:WalletProviderType)=> {

//   const provider = new ethers.BrowserProvider(walletProvider.provider);
//   const signer = await provider.getSigner();
//   const network = await provider.getNetwork();
//   const chainId = parseInt(network.chainId.toString());

      
//   // 检查网络
//   if (!checkNetwork(chainId)) return ;

//   // 设置全局对象
//   // setEthersProver(provider);
//   // setSigneredObj(signer);
//   const daismObj=new DaoApi(signer,tempAccount);
//   setDaismContract(daismObj); 
//   daismObj.UnitToken.balanceOf(tempAccount).then(e=>{dispatch(setUtoBalance(e.utoken)) })
  
//   // 更新 Redux 状态
//   dispatch(setUser({ connected: 1, account: tempAccount, networkName: network.name, chainId }));
  
//   // 获取余额
//   provider.getBalance(tempAccount).then((balance:bigint) => { dispatch(setEthBalance(ethers.formatEther(balance))); });
  
//   // 获取代币数据
//   // if(pathname==='/forge')  getTokens(tempAccount);

//   // 保存到 sessionStorage
//   window.sessionStorage.setItem("providerinfoname", (walletProvider.info.name));
//   window.sessionStorage.setItem("isLogin", "1"); // 标记用户已登录
//   setTimeout(() => {
//     setIsShowBtn(true)
//   }, 100);
// };


// const recorLogin=()=>{
//   dispatch(setLoginsiwe(true));
//   const daoActor = window.sessionStorage.getItem("daoActor");
//   const actor = window.sessionStorage.getItem("actor");
//   const myFollow = window.sessionStorage.getItem("myFollow");

//  if(daoActor) dispatch(setDaoActor(JSON.parse(daoActor)));
//  if(actor) dispatch(setActor(JSON.parse(actor)));
//  if(myFollow)  dispatch(setMyFollow(JSON.parse(myFollow)));
// }
//   return (
//     <>
//       <div className={`d-flex ${isPhone?'justify-content-start':'justify-content-end'} align-items-center`} style={{ minWidth:isPhone?'100px':'300px' }}> 
//         {user.connected >0  && <User onDisconnect={onDisconnect} />}
//         <div style={{ marginTop: '6px', marginRight: '10px' }}>
//           {user.connected > 0 ? <ShowAddress address={user.account} />
//           :<>{ providers.length > 0 ? <WalletInfo providers={providers} onDisconnect={onDisconnect} 
//             updateLoginData={updateLoginData} checkNetwork={checkNetwork} recorLogin={recorLogin} showError={showError} /> 
//               :<>{!loading && <MetmaskInstall  />}</>
//              }
//           </>
//           }
//         </div>
//         {!isPhone && <LocaleSwitcher flag={true} />}
//       </div>     
//     </>
//   );
// }

// export default Wallet;
