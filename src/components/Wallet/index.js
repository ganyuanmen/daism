import {useRef,useState,useEffect } from 'react';

import { Dropdown,Modal,Button } from 'react-bootstrap';

import DaoApi from '../../lib/contract';
import { ethers } from "ethers";
import ShowAddress from '../ShowAddress'
import User from './User';
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import {setEthBalance,setDaoActor,setActor,setUser,setTokenList,setTokenFilter,setLoginsiwe,setDaoAddress,setMessageText} from '../../data/valueData'
import { client } from '../../lib/api/client';
import LoginButton from '../LoginButton';
import { useSyncProviders } from '../../hooks/useSyncProviders'


/**
 * 钱包登录管理 
 */
function Wallet() {
    const router = useRouter()
    const providers = useSyncProviders()
    const [showMetaMask, setShowMetaMask] = useState(false); //没安装metMASK提示
    const [connecting,setConnecting]=useState(false); //正在登录
    const providerRef=useRef(); //已选择的provider
    const connectWalletRef=useRef()  // 连接钱包接口

    const [loginAccount,setLoginAccount]=useState('')
    // const [netName,setNetName]=useState('')
    // const [chainId,setChainId]=useState('')

    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const dispatch = useDispatch();
    function setEth(value){dispatch(setEthBalance(value))}
    const t = useTranslations('Common')
    const daoAddress=useSelector((state) => state.valueData.daoAddress)
    const loginRef=useRef() //siwe 登录

    function showError(str){dispatch(setMessageText(str))}


    useEffect(() => {
        if (!window.ethereum) { setShowMetaMask(true); } //提示安装metmask

        //恢复siwe 登录
        if(providers.length) {
            if(window.sessionStorage.getItem("loginsiwe")==='1'){
                dispatch(setLoginsiwe(true))
                let _dao=window.sessionStorage.getItem("daoActor")
                if(_dao) dispatch(setDaoActor(JSON.parse(_dao)))
                let _actor=window.sessionStorage.getItem("actor")
                if(_actor) dispatch(setActor(JSON.parse(_actor)))
            }

            let _name=window.sessionStorage.getItem("providerinfoname")
            if(_name){
                for(let i=0;i<providers.length;i++)
                {
                    if(_name===providers[i].info.name)
                    {
                        providerRef.current=providers[i]
                        break
                    }
                }
            }


            let _address=window.sessionStorage.getItem("daoAddress")
            if(_address) {
                let _daoaddress=JSON.parse(_address)
                dispatch(setDaoAddress(_daoaddress))

                 if(window.sessionStorage.getItem("isLogin")==='1') connectWalletRef.current(providerRef.current, _daoaddress)
            }
            else {    
                fetch("/api/siwe/administrutor").then(async res=>{
                    if(res.status===200)
                    {
                        let _daoaddress=await res.json();
                        dispatch(setDaoAddress(_daoaddress))
                        window.sessionStorage.setItem("daoAddress",JSON.stringify(_daoaddress))
                        if(window.sessionStorage.getItem("isLogin")==='1') connectWalletRef.current(providerRef.current,_daoaddress)
                    } 
                })
            }
        }

    }, [providers]);  
    
 
    
  
    const connectWallet=async(providerWithInfo,_daoaddress)=>{//连接钱包
        if(providerWithInfo)
            providerRef.current=providerWithInfo    
        else 
            if (!window.ethereum) { setShowMetaMask(true); return;} //提示安装metmask
    
        setConnecting(true);
        try{
            if(providerWithInfo) {
            const accounts = await providerWithInfo.provider.request({method: 'eth_requestAccounts' });
            let tempAccount=accounts?.[0]
            setLoginAccount(tempAccount)

            providerWithInfo.provider.on('chainChanged', _chainId=>{
                if(_chainId!=='0xaa36a7')
                {
                    showError(t('mustLoginText'))
                    onDisconnect()
                }
                window.location.reload()       //0x1 //0xaa36a7  parseInt(chainIdHex)  parseInt('0xaa36a7')=11155111
            });
          
            const provider = new ethers.BrowserProvider(providerWithInfo.provider);
            window.loginProvider=provider
            const signer =await provider.getSigner()
            window.daism_signer=signer

            const network=await provider.getNetwork()
            let tempChainId = network.chainId.toString()
            if(tempChainId!=='11155111')
            {
                showError(t('mustLoginText'))
                setConnecting(false);
                return
            }
            
            console.info("login network:",network.name,tempChainId)


            window.sessionStorage.setItem("providerinfoname", providerWithInfo.info.name)
            
            dispatch(setUser({connected:1,account:tempAccount,networkName:network.name, chainId:tempChainId}))
            provider.getBalance(tempAccount).then(_balance=>{setEth(ethers.formatEther(_balance))})
            if(router.pathname==='/' ) getTokens(tempAccount)
            
            if(_daoaddress && _daoaddress['UnitToken']) //刷新创建
            {
                window.daismDaoapi = new DaoApi(signer,tempAccount,_daoaddress)
            }
            else  //点击按钮创建 
            {
                window.daismDaoapi = new DaoApi(signer,tempAccount,daoAddress)
            }
            
            
         
         //   providerWithInfo.provider.on('accountsChanged', _account=>{ switchDisconnect(); reConnect(_account?.[0]);});
         providerWithInfo.provider.on('accountsChanged', _account=>{switchDisconnect(); window.location.reload();});
            // window.addEventListener('beforeunload', e=>{sdk?.disconnect()})  
            // window.addEventListener('pagehide', e=>{logout()})  

        //    //siwe签名登录
        //    if(window.sessionStorage.getItem("loginsiwe")!=='1' && !loginsiwe )
        //    {
        //     loginRef.current.siweLogin() 
        //    }
            }
            else 
            {
              
                
               const provider= new ethers.BrowserProvider(window.ethereum);
                await provider.send('eth_requestAccounts', [])
                window.ethereum.on('chainChanged', _chainId=>{  if(_chainId!=='0xaa36a7')
                {
                    showError(t('mustLoginText'))
                    onDisconnect()
                }
                window.location.reload()});
                window.loginProvider=provider
                const signer =await provider.getSigner()
                window.daism_signer=signer
                const network=await provider.getNetwork()
                let tempChainId = network.chainId.toString()
                if(tempChainId!=='11155111')
                {
                    showError(t('mustLoginText'))
                    setConnecting(false);
                    return
                }
                let tempAccount= signer.address;
                console.info("login network:",network.name,tempChainId)
             
                dispatch(setUser({connected:1,account:tempAccount,networkName:network.name, chainId:tempChainId}))
                provider.getBalance(tempAccount).then(_balance=>{setEth(ethers.formatEther(_balance))})
                if(router.pathname==='/' ) getTokens(tempAccount)
                
                if(_daoaddress && _daoaddress['UnitToken']) //刷新创建
                {
                    window.daismDaoapi = new DaoApi(signer,tempAccount,_daoaddress)
                }
                else  //点击按钮创建 
                {
                    window.daismDaoapi = new DaoApi(signer,tempAccount,daoAddress)
                }
                
                
                window.sessionStorage.setItem("providerinfoname", '')
             
                window.ethereum.on('accountsChanged', _account=>{switchDisconnect(); window.location.reload();});
               // window.addEventListener('beforeunload', e=>{logout()})  
               // window.addEventListener('pagehide', e=>{logout()})  
    
            }

            window.sessionStorage.setItem("isLogin", "1")
          
        }catch (err)
        {
            console.error(err)
           // showTip(err);
        }
        setConnecting(false);
    }

    connectWalletRef.current=connectWallet

    function getTokens(did)
    {
        client.get(`/api/getData?did=${did}`,'getToekn').then(res =>{ 
            if(res.status===200) {
                dispatch(setTokenList(res.data))
                dispatch(setTokenFilter(res.data))
            }
            else console.error(res.statusText)
        })
    }

    //退出
    const onDisconnect = async () => {
        console.info("unconnect.........")
        fetch('/api/siwe/logout?')
        setEth('0')
        dispatch(setUser({...user,connected:0,account:'',chainId:0}))
        dispatch(setLoginsiwe(false))
        dispatch(setActor(null))
        dispatch(setDaoActor(null))
        window.sessionStorage.setItem("isLogin", "0")
        window.sessionStorage.setItem("loginsiwe", "0")
        window.sessionStorage.setItem("daoActor", '')
        window.sessionStorage.setItem("actor", '')
        window.sessionStorage.setItem("providerinfouuid", '')
        
        window.daismDaoapi=null
        if(router.pathname==='/') getTokens('')
    }

     //切换
     const switchDisconnect = async () => {   
        fetch('/api/siwe/logout?')
        dispatch(setLoginsiwe(false))
        dispatch(setActor(null))
        dispatch(setDaoActor(null))
        
        window.sessionStorage.setItem("loginsiwe", "0")
        window.sessionStorage.setItem("daoActor", '')
        window.sessionStorage.setItem("actor", '')
        window.daismDaoapi=null
    }

    // async function reConnect(_account){
    //     setLoginAccount(_account)
    //     window.daismDaoapi = new DaoApi(window.daism_signer,_account,daoAddress)
    //     const network=await window.loginProvider.getNetwork()
    //     let tempChainId = network.chainId.toString()
     
    //     dispatch(setUser({connected:1,account:_account,networkName:network.name, chainId:tempChainId}))
    //     window.loginProvider.getBalance(_account).then(_balance=>{setEth(ethers.formatEther(_balance))})
    //     if(router.pathname==='/')  getTokens(_account)

    // }


    return (
        <>
          <div>
              {user.connected >0 && <User t={t} loginsiwe={loginsiwe} disconnect={onDisconnect} user={user} daoAddress={daoAddress} />}
          </div>
          <div  style={{marginTop:'6px',marginRight:'10px'}}  >
            {user.connected >0?<ShowAddress  address={loginAccount} ></ShowAddress>
           :providers.length > 0?
            <Dropdown>
                <Dropdown.Toggle style={{borderRadius:'12px !important',marginLeft:'16px !important'}} variant="primary" size="sm" disabled={connecting}  id="dropdown-basic">
                    <img alt=""  src='/wallet.svg' width={18} height={18} /> 
                    <span> {connecting?t('connectingText'): t('connectText')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
               { providers.length > 0 && providers?.map((provider) => (
                     <Dropdown.Item href="#" key={provider.info.uuid} onClick={() => connectWallet(provider)}><span className='daism-color' >
                         <img src={provider.info.icon} alt={provider.info.name}  width={24} height={24} />
                         </span> {provider.info.name}
                     </Dropdown.Item>
                 ))
                 }
                </Dropdown.Menu>
            </Dropdown>
            :  <Button style={{borderRadius:'12px !important',marginLeft:'16px !important'}} variant="primary" size="sm" disabled={connecting} 
            onClick={e=>{connectWallet(null,null)}} >
            <img alt="" style={{color:'red'}} src='/wallet.svg' width={18} height={18} /> {'  '}
            {connecting?t('connectingText'): t('connectText')}
        </Button> 

            }
          </div> 
                  
          {/* 安装metmask提示窗口 */}
          <Modal centered show={showMetaMask}  onHide={e=>{setShowMetaMask(false)}}>
          <Modal.Header closeButton>
            <Modal.Title>{t('tipText')}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='daism-tip-body' > 
             <img alt="" src="/mess.svg" width={32} height={32} />
            <div className='daism-tip-text'>
                <div>
                    {t('metmaskTip1')} {'  '}
                    <a href='https://metamask.io' target='_blank'  rel="noreferrer"  alt="metamask" >https://metamask.io</a>
                </div>
                <div>  {t('metmaskTip2')}</div>
            </div>
          </Modal.Body>
          </Modal>
          <LoginButton  ref={loginRef} command={true} />
        </>
    );
}

export default Wallet;