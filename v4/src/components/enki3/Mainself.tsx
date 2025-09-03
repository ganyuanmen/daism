
'use client';

import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslations } from 'next-intl';
import { fetchJson } from "@/lib/utils/fetcher";
import ShowErrorBar from '../ShowErrorBar';
import Loadding from '../Loadding';
import Contentdiv from './Contentdiv';
/**
 * 嗯文列表
 * @locale zh/cn
 * @setCurrentObj 设当前嗯文
 * @setActiveTab 设主页模块
 * @fetchWhere 根据此对象从服务器下载数据
 * @setFetchWhere 设置下载数据
 * @delCallBack 删除嗯文后回调
 * @afterEditCall 修改嗯文后回调
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人  
 * @path enki/enkier
 * @daoData 个人所属的smart common 集合
 */


  // props 类型
  interface MainselfProps {
    setCurrentObj: (obj: EnkiMessType | null) => void;
    setActiveTab: (tab: number) => void;
    fetchWhere: FetchWhere;
    filterTag?: (param: string) => void;
    tabIndex: number;
    setFetchWhere: Dispatch<SetStateAction<FetchWhere>>;
    afterEditCall: (obj: EnkiMessType) => void;
    refreshPage: () => void;
    path: string;
    daoData?: DaismDao[]|null;
  }
  
  export default function Mainself({
    setCurrentObj,
    setActiveTab,
    fetchWhere,
    filterTag,
    tabIndex,
    setFetchWhere,
    afterEditCall,
    refreshPage,
    path,
    daoData,
  }: MainselfProps) {

    const [data, setData] = useState<EnkiMessType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [err, setErr] = useState('');
    const t = useTranslations('ff');

    
    const listRef = useRef<HTMLDivElement>(null);
const triedRef = useRef(0);

const fetchMoreData = useCallback(() => {
  if (!isLoading && hasMore) {
    setFetchWhere((pre) => ({ ...pre, currentPageNum: pageNum }));
  }
}, [isLoading, hasMore, pageNum, setFetchWhere]);

useEffect(() => {
  if (data && data.length) {
    const _id = parseInt(sessionStorage.getItem('daism-list-id') || '', 10);
    if (!isNaN(_id)) {
      const itemElement = listRef.current?.querySelector<HTMLElement>(
        `#item-${_id}`
      );
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sessionStorage.removeItem('daism-list-id');
        triedRef.current = 0;
      } else if (hasMore && triedRef.current < 10) {
        fetchMoreData();
        triedRef.current += 1;
      }
    }
  }
}, [data, fetchMoreData, hasMore]);

      
    // const wRef=useRef<Dispatch<SetStateAction<FetchWhere>>>(setFetchWhere);

    // const listRef = useRef<HTMLDivElement>(null);
  
    // const fetchMoreData =useCallback(() => {
    //   if (!isLoading && hasMore) {
    //     wRef.current(pre=>({ ...pre, currentPageNum: pageNum }));
        
    //   }
    // },[isLoading,hasMore,pageNum]);
  

    useEffect(() => {
      if (fetchWhere.currentPageNum === 0) setPageNum(0);
    }, [fetchWhere]);
  
    // useEffect(() => {
    //   // 数据加载完成后，尝试滚动到特定 item
    //   if (data && data.length) {
    //     const _id = parseInt(sessionStorage.getItem('daism-list-id') || '', 10);
    //     if (!isNaN(_id)) {
    //       const itemElement = listRef.current?.querySelector<HTMLElement>(
    //         `#item-${_id}`
    //       );
    //       if (itemElement) {
    //         itemElement.scrollIntoView({ behavior: 'auto' });
    //         sessionStorage.removeItem('daism-list-id');
    //       } else {
    //         fetchMoreData(); // 循环读取数据，直到找到
    //       }
    //     }
    //   }
    // }, [data,fetchMoreData]);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
  
        if (fetchWhere.currentPageNum === 0) setData([]);
        try {
          const resData = await fetchJson<EnkiMessType[]>(
            `/api/getData?pi=${fetchWhere.currentPageNum}&menutype=${
              fetchWhere.menutype
            }&daoid=${fetchWhere.daoid ?? ''}&actorid=${
              fetchWhere.actorid ?? ''
            }&w=${fetchWhere.where ?? ''}&order=${
              fetchWhere.order ?? ''
            }&eventnum=${fetchWhere.eventnum ?? ''}&account=${
              fetchWhere.account ?? ''
            }&v=${fetchWhere.v ?? ''}`,
            { headers: { 'x-method': 'messagePageData' } }
          );
  
          if (resData) {
            setHasMore(resData.length > 0);
            setPageNum((pageNum) => pageNum + 1);
            if (fetchWhere.currentPageNum === 0) setData(resData);
            else setData((prev) => [...prev, ...resData]);
            setErr('');
          } else {
            setHasMore(false);
            setErr(
              (resData as any)?.errMsg || 'Failed to read data from the server'
            );
          }
        } catch (error: any) {
          console.error(error);
          setHasMore(false);
          setErr(error?.message);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (!isLoading && fetchWhere.currentPageNum > -1) {
        if (fetchWhere.eventnum === 8) fetchData();
        else if (
          fetchWhere.menutype === 3 &&
          (fetchWhere.eventnum === 5 || fetchWhere.account)
        )
          fetchData();
        else if (
          fetchWhere.menutype === 1 &&
          (fetchWhere.daoid || (fetchWhere.v ?? 0) > 0)
        )
          fetchData();
        else if (fetchWhere.menutype === 2) fetchData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchWhere]);
  
    const footerdiv = () => {
      if (!isLoading) {
        if (err) return <ShowErrorBar errStr={err} />;
        if (Array.isArray(data) && data.length === 0)
          return <div className="mt-3">{t('noFounData')}</div>;
        if (!hasMore)
          return (
            <div style={{ textAlign: 'center' }}>---{t('emprtyData')}---</div>
          );
      } else {
        return <Loadding />;
      }
    };
  
    const replyAddCallBack = (index: number) => {
      data[index].total = data[index].total + 1;
      setData([...data]);
    };
  
    return (
      <div className="sccontent">
        <div ref={listRef}>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}  
          >
            {data.map((obj, idx) => (
              <Contentdiv
                path={path}
                messageObj={obj}
                tabIndex={tabIndex}
                key={idx}
                afterEditCall={afterEditCall}
                data_index={idx}
                filterTag={filterTag}
                setCurrentObj={setCurrentObj}
                setActiveTab={setActiveTab}
                replyAddCallBack={replyAddCallBack}
                refreshPage={refreshPage}
                daoData={daoData}
              />
            ))}
          </InfiniteScroll>
        </div>
        <div className="mt-3 mb-3" style={{ textAlign: 'center' }}>
          {footerdiv()}
        </div>
      </div>
    );
  }
 