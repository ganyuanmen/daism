import ShowAddress from '../../components/ShowAddress'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useSelector,useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import ShowErrorBar from '../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../data/valueData'
import { LockSvg } from '../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import PageLayout from '../../components/PageLayout';
import Loadding from '../../components/Loadding';
import { getEnv } from '../../lib/utils/getEnv';
import Head from 'next/head';
import useMyTokens from '../../hooks/useMyTokens';
/**
 * 我的钱包
 */
export default function ShowWalletInfo({env,locale}) {
    const t = useTranslations('wallet')
    const tc = useTranslations('Common')
   
    // const [utokenApprove,setUtokenApprove]=useState(undefined)
    // const [tokenApprove,setTokenApprove]=useState(undefined)
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const tokensData = useMyTokens(user.account)
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const [utokenBalance,setUtokenBalance]=useState('0')
    const dispatch = useDispatch();
    // function showTip(str){dispatch(setTipText(str))}
    // function closeTip(){dispatch(setTipText(''))}
    // function showError(str){dispatch(setMessageText(str))}

    // //获取已授权的项目
    // const getAppove=async ()=>{
    //     window.daismDaoapi.UnitToken.allowance(user.account, window.daismDaoapi.IADD.address).then(r => { setUtokenApprove(parseFloat(r.approveSum))})
    //     window.daismDaoapi.DaoToken.allowanceGlobal(user.account, window.daismDaoapi.IADD.address).then((r) => {setTokenApprove(r.status)})
       
    //   }    

      useEffect(() => { 
        if(user.connected===1 && window.daismDaoapi) {
          //  getAppove()  
           window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})  
        }     
        }, [user]);

      // //取消utoken授权
      // function utokenAppove()
      // {
      //   showTip(t('unauthorizedingText'))
      //   window.daismDaoapi.UnitToken.approve(window.daismDaoapi.IADD.address, '0').then(
      //       e => {closeTip();setUtokenApprove(0);}, 
      //       err => {closeTip(); showError(tc('errorText') + (err.message ? err.message : err));}
      //   );
      // }

      // //取消token授权
      // function tokenAppove()
      // {
      //   showTip(t('unauthorizedingText'))
      //   window.daismDaoapi.DaoToken.approveGlobal(window.daismDaoapi.IADD.address, false).then(
      //       e => {closeTip();setTokenApprove(false);}, 
      //       err => {closeTip();showError(tc('errorText') + (err.message ? err.message : err));}
      //   );
      // }

      

    return (<>
      <Head>
          <title>{tc('myWalletTitle')}</title>
      </Head>
        <PageLayout env={env}>
          <div style={{marginTop:"10px"}} >
        {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />:
            <Table striped bordered hover style={{width:'100%',marginTop:'4px'}} >
                    <tbody>
                        <tr><td style={{ textAlign: 'right' }} >{t('accountText')}</td><td  >
                            <ShowAddress  address={user.account} ></ShowAddress></td></tr>
                        <tr><td style={{ textAlign: 'right' }}>{t('chainText')}</td><td >{ user.networkName}({user.chainId})</td></tr>
                        <tr><td style={{ textAlign: 'right' }}>ETH {t('balanceText')}</td><td >{ethBalance}</td></tr>
                        <tr><td style={{ textAlign: 'right' }}>UTO {t('balanceText')}</td><td >{utokenBalance}</td></tr>
                        {tokensData.data.map((obj,idx)=>(
                          <tr key={idx}><td style={{ textAlign: 'right' }}>
                            <img height={24} width={24} alt='' src={obj.dao_logo?obj.dao_logo:'/logo.svg'} style={{borderRadius:'50%'}} />{'  '}
                            {obj.dao_symbol} {' '}  {t('balanceText')}
                            </td><td >{obj.token_cost}</td></tr>
                        ))
                        }
                        {/* <tr><td style={{ textAlign: 'right' }} >UTO {t('authorizeText')}</td>
                            <td>{utokenApprove===undefined?<Loadding size='sm' />:utokenApprove>0?utokenApprove:t('noauthorizeText')}</td>
                            <td>{utokenApprove>0 && <Button  size="sm" variant="primary" onClick={utokenAppove}><LockSvg size={18} /> {t('cancelAuthorizationText')}</Button>}</td>
                        </tr>
                        <tr><td style={{ textAlign: 'right' }} >TOKEN {t('authorizeText')}</td>
                            <td>{tokenApprove===undefined?<Loadding size='sm' />:tokenApprove?t('globalAuthorizationText'):t('noauthorizeText')}</td>
                            <td>{tokenApprove && <Button  size="sm" variant="primary" onClick={tokenAppove}><LockSvg size={18} /> {t('cancelAuthorizationText')}</Button>}</td>
                        </tr> */}
                      
                    </tbody>
            </Table>}
            </div>
            </PageLayout></>
    );
}



export const getServerSideProps = ({ locale }) => {
    
  
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/wallet/${locale}.json`),
          },locale
          ,env:getEnv()
        }
      }
    }
