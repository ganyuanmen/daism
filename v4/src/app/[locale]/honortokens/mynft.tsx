'use client'

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import Loadding from '@/components/Loadding';
import ShowErrorBar from '@/components/ShowErrorBar';
import Nftmint from './Nftmint';
import Nftlist from './Nftlist';
import { RootState } from '@/store/store';
import { useFetch } from '@/hooks/useFetch';


/** 
 * 荣誉通证页面组件
 */
export default function Mynft() {

  const tc = useTranslations('Common')
  const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;

  const mynftData = useMynft(user.account);

  // 渲染逻辑
  const renderContent = useMemo(() => {
    if (mynftData.status === 'loading') return <Loadding />;

    if (mynftData.status === 'failed') return <ShowErrorBar errStr={mynftData.error || tc('dataHandleErrorText')} />;

    if (mynftData.status === 'succeeded' && (mynftData.data?.length ?? 0) === 0) return <ShowErrorBar errStr={tc('noDataText')} />;

    return <Nftlist mynftData={mynftData.data} />;
  }, [mynftData, tc]); // 依赖 daoData / tc，当它们变化时才重新计算

  return (
    <>
    {
      user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
      :
      <> 
        <Nftmint />
        {renderContent}
      </>
    }
    </>
  );
}



  export function useMynft(account?: string) {
    return useFetch<NftObjType[]>(`/api/getData?did=${account}` ,'getMynft');
  }
