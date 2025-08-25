'use client'
import { useTranslations } from 'next-intl'
import { useState } from "react"
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";
import DaosPage from "@/components/home/DaosPage";
import CreateDao from '@/components/my/CreateDao';
import { usePageFetch } from '@/hooks/usePageFetch';
import { type DaoRecord } from '@/components/home/DaosPage';

/**
 * 智能公器列表
 */
export default function ClientContent() {
  const t = useTranslations('Common')
  const [currentPageNum, setCurrentPageNum] = useState(1) //当前页
  const [orderIndex, setOrderIndex] = useState(0); //列举的三个， 默认按第几个排序
  const [orderField, setOrderField] = useState("dao_time") //排序字段
  const [searchText, setSearchText] = useState("") //模糊查询内容
  const [orderType, setOrderType] = useState(false) //排序类型
  
  const daosData =useDaoList(currentPageNum, orderField, searchText, orderType)

  const setRefresh=()=>{setOrderIndex(1)}

  return (
  <>
      <div style={{marginTop:'20px'}} >
      <CreateDao   setRefresh={setRefresh} />
      { daosData?.rows?.length?<DaosPage daosData={daosData} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum}
          orderIndex={orderIndex} setOrderIndex={setOrderIndex}  orderType={orderType} setOrderType={setOrderType} setOrderField={setOrderField} 
          setSearchText={setSearchText} postStatus={daosData.status}/>
        :daosData.status==='failed'?<ShowErrorBar errStr={daosData.error??'get data err'} />
        :daosData.status==='succeeded' ? <ShowErrorBar errStr={t('noDataText')} />
        :<Loadding />
      }
      </div>

  </>
  )
}



export function useDaoList(currentPageNum: number,orderField:string,searchText:string,orderType:boolean,) {
  return usePageFetch<DaoRecord[]>(`/api/getData?ps=10&pi=${currentPageNum}&orderField=${orderField}&orderType=${orderType}&searchText=${searchText}` ,'getDaosData');
}
