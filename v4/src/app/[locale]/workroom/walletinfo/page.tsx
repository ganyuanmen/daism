'use client';

import ShowAddress from '@/components/ShowAddress';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import ShowErrorBar from '@/components/ShowErrorBar';
import { useTranslations } from 'next-intl';
// import {useMyTokens} from '@/hooks/useMyTokens';
import { type RootState } from '@/store/store';
import Image from 'next/image';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { getDaismContract } from '@/lib/globalStore';


/**
 * 我的钱包
 */
export default function ShowWalletInfo() {
  const t = useTranslations('wallet');
  const tc = useTranslations('Common');

  const user = useSelector(
    (state: RootState) => state.valueData.user
  ) as DaismUserInfo;

  // const tokensData: MyTokensResult = useMyTokens(user.account);
  const tokensData = useFetch<DaismToken[]>(`/api/getData?did=${user.account}`,
    'getMyTokens',[]);
  const ethBalance = useSelector((state: RootState) => state.valueData.ethBalance);
  const utokenBalance = useSelector((state: RootState) => state.valueData.utoBalance);

  return (
    <>  
      <div>
        <div style={{ marginTop: '20px' }}>
          {user.connected !== 1 ? (
            <ShowErrorBar errStr={tc('noConnectText')} />
          ) : (
            <Table striped bordered hover style={{ width: '100%', marginTop: '4px' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'right' }}>{t('accountText')}</td>
                  <td>
                    <ShowAddress address={user.account} />
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>{t('chainText')}</td>
                  <td>
                    {user.networkName}({user.chainId})
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>ETH {t('balanceText')}</td>
                  <td>{ethBalance}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>UTO {t('balanceText')}</td>
                  <td>{utokenBalance}</td>
                </tr>
                {tokensData.data && tokensData.data.map((obj, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'right' }}>
                      <Image
                        height={24}
                        width={24}
                        alt=""
                        src={obj.dao_logo ? obj.dao_logo : '/logo.svg'}
                      />{'  '}
                      {obj.dao_symbol} {t('balanceText')}
                    </td>
                    <td><ShowToken obj={obj} /> </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}

function ShowToken({obj}:{obj:DaismToken}){
  const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
  const daismObj=getDaismContract();
  const [token,setToken]=useState(0);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const res=await daismObj?.DaoToken.balanceOf(obj.token_id,user.account);
        setToken(Number(res?.token??'0'))       
      } catch (err) {
        console.error("fetch token from BLOCKCHAIN failed", err);
      
      }
    };

    fetchData();

  },[obj])




  return(<span>{token}</span>);

}