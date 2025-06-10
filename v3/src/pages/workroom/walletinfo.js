import ShowAddress from '../../components/ShowAddress'
import Table from 'react-bootstrap/Table';
import { useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import ShowErrorBar from '../../components/ShowErrorBar';
import { useTranslations } from 'next-intl'
import PageLayout from '../../components/PageLayout';
import { getEnv } from '../../lib/utils/getEnv';
import Head from 'next/head';
import useMyTokens from '../../hooks/useMyTokens';
/**
 * 我的钱包
 */
export default function ShowWalletInfo({env,locale}) {
    const t = useTranslations('wallet')
    const tc = useTranslations('Common')
   
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const tokensData = useMyTokens(user.account)
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const [utokenBalance,setUtokenBalance]=useState('0')
   

      useEffect(() => { 
        if(user.connected===1 && window.daismDaoapi) {
           window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})  
        }     
        }, [user]);

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
                            <img height={24} width={24} alt='' src={obj.dao_logo?obj.dao_logo:'/logo.svg'}  />{'  '}
                            {obj.dao_symbol} {' '}  {t('balanceText')}
                            </td><td >{obj.token_cost}</td></tr>
                        ))
                        }
                     
                    </tbody>
            </Table>}
            </div>
            </PageLayout></>
    );
}




export const getServerSideProps = ({ locale }) => {
  // export const getStaticProps = ({ locale }) => {
  
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
