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

export default function ShowWalletInfo() {
    const t = useTranslations('wallet')
    const tc = useTranslations('Common')
    const [utokenApprove,setUtokenApprove]=useState(undefined)
    const [tokenApprove,setTokenApprove]=useState(undefined)
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const [utokenBalance,setUtokenBalance]=useState('0')
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showError(str){dispatch(setMessageText(str))}

    //获取已授权的项目
    const getAppove=async ()=>{
        window.daismDaoapi.UnitToken.allowance(user.account, window.daismDaoapi.IADD.address).then(r => { setUtokenApprove(parseFloat(r.approveSum))})
        window.daismDaoapi.DaoToken.allowanceGlobal(user.account, window.daismDaoapi.IADD.address).then((r) => {setTokenApprove(r.status)})
       
      }    

      useEffect(() => { 
        if(user.connected===1 && window.daismDaoapi) {
           getAppove()  
           window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})  
        }     
        }, [user,getAppove]);

      //取消utoken授权
      function utokenAppove()
      {
        showTip(t('unauthorizedingText'))
        window.daismDaoapi.UnitToken.approve(window.daismDaoapi.IADD.address, '0').then(
            e => {closeTip();setUtokenApprove(0);}, 
            err => {closeTip(); showError(tc('errorText') + (err.message ? err.message : err));}
        );
      }

      //取消token授权
      function tokenAppove()
      {
        showTip(t('unauthorizedingText'))
        window.daismDaoapi.DaoToken.approveGlobal(window.daismDaoapi.IADD.address, false).then(
            e => {closeTip();setTokenApprove(false);}, 
            err => {closeTip();showError(tc('errorText') + (err.message ? err.message : err));}
        );
      }

      

    return (
        <PageLayout>
        {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />:
            <Table striped bordered hover style={{width:'100%',marginTop:'4px'}} >
                    <tbody>
                        <tr><td style={{ textAlign: 'right' }} >{t('accountText')}</td><td colSpan="2" >
                            <ShowAddress  address={user.account} ></ShowAddress></td></tr>
                        <tr><td style={{ textAlign: 'right' }}>{t('chainText')}</td><td colSpan="2">{ user.networkName}({user.chainId})</td></tr>
                        <tr><td style={{ textAlign: 'right' }}>ETH {t('balanceText')}</td><td colSpan="2">{ethBalance}</td></tr>
                        <tr><td style={{ textAlign: 'right' }}>UTO {t('balanceText')}</td><td colSpan="2">{utokenBalance}</td></tr>
                        <tr><td style={{ textAlign: 'right' }} >UTO {t('authorizeText')}</td>
                            <td>{utokenApprove===undefined?<Loadding size='sm' />:utokenApprove>0?utokenApprove:t('noauthorizeText')}</td>
                            <td>{utokenApprove>0 && <Button  size="sm" variant="primary" onClick={utokenAppove}><LockSvg size={18} /> {t('cancelAuthorizationText')}</Button>}</td>
                        </tr>
                        <tr><td style={{ textAlign: 'right' }} >TOKEN {t('authorizeText')}</td>
                            <td>{tokenApprove===undefined?<Loadding size='sm' />:tokenApprove?t('globalAuthorizationText'):t('noauthorizeText')}</td>
                            <td>{tokenApprove && <Button  size="sm" variant="primary" onClick={tokenAppove}><LockSvg size={18} /> {t('cancelAuthorizationText')}</Button>}</td>
                        </tr>
                      
                    </tbody>
            </Table>}
            </PageLayout>
    );
}



export const getStaticProps = ({ req, res,locale }) => {
    
  
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/wallet/${locale}.json`),
          }

        }
      }
    }
