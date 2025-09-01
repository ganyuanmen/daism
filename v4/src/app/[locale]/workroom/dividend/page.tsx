"use client";
import { useState } from "react";
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";
import { Table } from "react-bootstrap";
import { useTranslations } from 'next-intl'
import PageItem from "@/components/PageItem";
import { useSelector } from 'react-redux';

import { type RootState } from "@/store/store";
import ShowAddress from '@/components/ShowAddress'

import { usePageFetch, type FetchResult } from "@/hooks/usePageFetch"; // 导入 FetchResult 类型

interface DividType {
  delegator: string;
  account: string;
  utoken_amount: number;
  _time: string;
  dao_owner: string;
  pre_time: string;
  dao_name: string;
  dao_symbol: string;
  dao_logo: string;
}

interface DividendPageProps {
  dividendData: FetchResult<DividType[]>; // 使用 FetchResult 类型
}

interface UseGetDividendParams {
  currentPageNum: number;
  did: string;
}

/**
 * 我的奖励
 */
export default function Dividend() {
  const t = useTranslations('my')
  const tc = useTranslations('Common')

  const user = useSelector((state: RootState) => state.valueData.user) //钱包用户信息

  const [currentPageNum, setCurrentPageNum] = useState<number>(1); //当前页
  const dividendData = useGetDividend({ currentPageNum, did: user.account })

  return (
  <>
    <div style={{ marginTop: "20px" }} >
      {user.connected < 1 ? <ShowErrorBar errStr={tc('noConnectText')} />
        :<>
          {dividendData.status === 'loading'?<Loadding />
          :dividendData.status === 'failed'?<ShowErrorBar errStr={dividendData.error || ''} />
          :dividendData.rows.length===0?<ShowErrorBar errStr={tc('noDataText')} />
            :<>
                <DividendPage dividendData={dividendData} />
                <PageItem 
                records={dividendData.total} 
                pages={dividendData.pages} 
                currentPageNum={currentPageNum} 
                setCurrentPageNum={setCurrentPageNum} 
                postStatus={dividendData.status} 
                />
            </>
           }
        </>
       }
    </div>
  
  </>);

}

function DividendPage({ dividendData }: DividendPageProps) {
  const t = useTranslations('my')
  return <Table striped bordered hover>
    <thead>
      <tr>
        <th style={{ textAlign: 'center' }} >dao info</th>
        <th style={{ textAlign: 'center' }}>{t('dividendAddress')}</th>
        <th style={{ textAlign: 'center' }}>{t('dividendAmount')}(UTO)</th>
        <th style={{ textAlign: 'center' }}>{t('dividendTime')}</th>
      </tr>
    </thead>
    <tbody>
      {dividendData.rows.map((obj, idx) =>

        <tr key={idx}  >
          <td  >
            <img alt="" width={32} height={32} src={obj.dao_logo ? obj.dao_logo : '/logo.svg'} />
            {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
          </td>
          <td><ShowAddress address={obj.account} /></td>
          <td style={{ textAlign: 'right' }}>{obj.utoken_amount} </td>
          <td>{obj._time} </td>
        </tr>
      )
      }
    </tbody>
  </Table>
}

function useGetDividend({ currentPageNum, did }: UseGetDividendParams): FetchResult<DividType[]> {
  return usePageFetch<DividType[]>(`/api/getData?ps=20&pi=${currentPageNum}&did=${did}`, 'getDividend');
}