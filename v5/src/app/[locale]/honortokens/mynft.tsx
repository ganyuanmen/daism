'use client'

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import Loadding from '@/components/Loadding';
import ShowErrorBar from '@/components/ShowErrorBar';
import Nftmint from './Nftmint';
import Nftlist from './Nftlist';
import { RootState } from '@/store/store';
import { useFetch } from '@/hooks/useFetch';
import { useLayout } from '@/contexts/LayoutContext';

/** 
 * 荣誉通证页面组件
 */
export default function Mynft() {

  const tc = useTranslations('Common')
  const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;
  const { isShowBtn } = useLayout();  //是否开始显示 连接钱包按钮，先检测是否已登录。后显示连接按钮
  const { data, status, error } = useFetch<NftObjType[]>(
    `/api/getData?did=${user.account}`,
    'getMynft',
    []
  );

  // 渲染逻辑
  const renderContent = useMemo(() => {
    if (status === 'loading') return <Loadding />;

    if (status === 'failed') return <ShowErrorBar errStr={error || tc('dataHandleErrorText')} />;

    if (status === 'succeeded' && (data?.length ?? 0) === 0) return <ShowErrorBar errStr={tc('noDataText')} />;

    return data? <Nftlist mynftData={data} />:<ShowErrorBar errStr={error??''} />;
  }, [data,status,error, tc]); // 依赖 daoData / tc，当它们变化时才重新计算

  return (
       <> 
        {isShowBtn?
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
          :<Loadding />
          }
      </>

  );
}

