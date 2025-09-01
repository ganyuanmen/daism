'use client';

import ShowAddress from '@/components/ShowAddress';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import ShowErrorBar from '@/components/ShowErrorBar';
import { useTranslations } from 'next-intl';
import {useMyTokens} from '@/hooks/useMyTokens';
import { type RootState } from '@/store/store';


interface MyTokensResult {
  data: DaismToken[];
}

/**
 * 我的钱包
 */
export default function ShowWalletInfo() {
  const t = useTranslations('wallet');
  const tc = useTranslations('Common');

  const user = useSelector(
    (state: RootState) => state.valueData.user
  ) as DaismUserInfo;

  const tokensData: MyTokensResult = useMyTokens(user.account);
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
                      <img
                        height={24}
                        width={24}
                        alt=""
                        src={obj.dao_logo ? obj.dao_logo : '/logo.svg'}
                      />{'  '}
                      {obj.dao_symbol} {t('balanceText')}
                    </td>
                    <td>{obj.token_cost}</td>
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
