
import { useState, useEffect } from 'react';
import ShowAddress from '../ShowAddress';
import { useSyncProviders } from "@/hooks/useSyncProviders";
import LocaleSwitcher from '../LocaleSwitcher';
import MetmaskInstall from './MetmaskInstall';
import WalletInfo from './WalletInfo';
import User from './User';
import {useDispatch, useSelector} from 'react-redux';
import {type RootState, type AppDispatch, setUser,setLoginsiwe,setActor,setDaoActor,setUtoBalance,
  setEthBalance,setErrText,setMyFollow} from '@/store/store';

import { ethers } from 'ethers';
import { setDaismContract } from "@/lib/globalStore";
import DaoApi from '@/lib/contract';
import {useTranslations } from 'next-intl';
// import { usePathname } from 'next/navigation';
// import { useFetchToken } from '@/hooks/useFetchToken';
import { useLayout } from '@/contexts/LayoutContext';
/**
 * 钱包登录管理组件
 */
function Wallet() {
    const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
    const [providers, setProviders] = useState<WalletProviderType[]>([]); // 钱包提供者列表
    const allProviders = useSyncProviders() as WalletProviderType[];
    const dispatch = useDispatch<AppDispatch>();
    const NETWORKNAME=process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || '';
    // const locale = useLocale();
    // const pathWiLocale = usePathname() || ''; // 当前路径，例如 /en/about
    // const pathname = pathWiLocale.replace(`/${locale}`, '') || '/';
    const { setIsShowBtn } = useLayout();  //是否开始显示 连接钱包按钮，先检测是否已登录。后显示连接按钮
    const showError=(str:string)=>{ dispatch(setErrText(str));}
    const tc = useTranslations('Common');
    // 获取代币数据
    // const getTokens=useFetchToken();

    // 初始化组件
     useEffect(() => {
       setProviders(allProviders);  // 设置提供者列表
    }, [allProviders]);

    const NET: Record<string, string> = {
      '_0xaa36a7': 'sepolia',
      '_0x4268': 'holesky',
      '_0x1': 'mainnet',
      '_11155111': 'sepolia',
      '_17000': 'holesky',
      '_1': 'mainnet'
    };

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
    
    window.sessionStorage.setItem("isLogin", "0");
    window.sessionStorage.setItem("loginsiwe", "0");
    window.sessionStorage.setItem("providerinfouuid", '');
    setDaismContract(undefined);  
    
    // if(pathname==='/') getTokens('');
  };

  
const checkNetwork= (chainId: number): boolean=>  {
  
  const chainIdKey = `_${chainId}`;
    if (NET[chainIdKey] !== NETWORKNAME) {
      showError(tc('mustLoginText', { netName: NETWORKNAME }));
      return false;
    }
    return true;
};

  // 数据登录
const updateLoginData=async (tempAccount:string,walletProvider:WalletProviderType)=> {

  const provider = new ethers.BrowserProvider(walletProvider.provider);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const chainId = parseInt(network.chainId.toString());

      
  // 检查网络
  if (!checkNetwork(chainId)) return ;

  // 设置全局对象
  // setEthersProver(provider);
  // setSigneredObj(signer);
  const daismObj=new DaoApi(signer,tempAccount);
  setDaismContract(daismObj); 
  daismObj.UnitToken.balanceOf(tempAccount).then(e=>{dispatch(setUtoBalance(e.utoken)) })
  
  // 更新 Redux 状态
  dispatch(setUser({ connected: 1, account: tempAccount, networkName: network.name, chainId }));
  
  // 获取余额
  provider.getBalance(tempAccount).then((balance:bigint) => { dispatch(setEthBalance(ethers.formatEther(balance))); });
  
  // 获取代币数据
  // if(pathname==='/deval')  getTokens(tempAccount);

  // 保存到 sessionStorage
  window.sessionStorage.setItem("providerinfoname", (walletProvider.info.name));
  window.sessionStorage.setItem("isLogin", "1"); // 标记用户已登录
  console.log("11111111111111111111111111111111111111111111111")
  setTimeout(() => {
    setIsShowBtn(true)
  }, 100);
};


const recorLogin=()=>{
  dispatch(setLoginsiwe(true));
  const daoActor = window.sessionStorage.getItem("daoActor");
  const actor = window.sessionStorage.getItem("actor");
  const myFollow = window.sessionStorage.getItem("myFollow");

 if(daoActor) dispatch(setDaoActor(JSON.parse(daoActor)));
 if(actor) dispatch(setActor(JSON.parse(actor)));
 if(myFollow)  dispatch(setMyFollow(JSON.parse(myFollow)));
}
  return (
    <>
      <div className='d-flex justify-content-end align-items-center' style={{ minWidth: '300px' }}> 
        {user.connected >0  && <User onDisconnect={onDisconnect} />}
        <div style={{ marginTop: '6px', marginRight: '10px' }}>
          {user.connected > 0 ? <ShowAddress address={user.account} />
          :<>{ providers.length > 0 ? <WalletInfo providers={providers} onDisconnect={onDisconnect} 
            updateLoginData={updateLoginData} checkNetwork={checkNetwork} recorLogin={recorLogin} showError={showError} /> 
              : <MetmaskInstall  />
             }
          </>
          }
        </div>
        <LocaleSwitcher />
      </div>     
    </>
  );
}

export default Wallet;
