import { useTranslations } from 'next-intl'
import { useState } from "react"
import PageLayout from '../../components/PageLayout'
import ShowErrorBar from "../../components/ShowErrorBar";
import Loadding from "../../components/Loadding";
import DaosPage from "../../components/home/DaosPage";
import useDaoList from '../../hooks/useDaoList';
import CreateDao from '../../components/my/CreateDao';
import { getEnv } from '../../lib/utils/getEnv';
import Head from 'next/head';
/**
 * 智能公器列表
 */
export default function Home({env,locale}) {
  const t = useTranslations('Common')
  const [currentPageNum, setCurrentPageNum] = useState(1) //当前页
  const [orderIndex, setOrderIndex] = useState(0)
  const [orderField, setOrderField] = useState("dao_time") //排序字段
  const [searchText, setSearchText] = useState("") //模糊查询内容
  const [orderType, setOrderType] = useState(false) //排序类型
  const daosData =useDaoList({currentPageNum, orderField, searchText, orderType})

  const setRefresh=()=>{setOrderIndex(1)}

  return (
  <>
    <Head>
        <title>{t('smartTitle')}</title>
    </Head>

    <PageLayout env={env}>
      <div style={{marginTop:'20px'}} >
      <CreateDao env={env}  setRefresh={setRefresh} />
      { daosData.rows.length?<DaosPage daosData={daosData} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum}
          orderIndex={orderIndex} setOrderIndex={setOrderIndex}  orderType={orderType} setOrderType={setOrderType} setOrderField={setOrderField} 
          setSearchText={setSearchText} postStatus={daosData.status}/>
        :daosData.status==='failed'?<ShowErrorBar errStr={daosData.error} />
        :daosData.status==='succeeded' ? <ShowErrorBar errStr={t('noDataText')} />
        :<Loadding />
      }
      </div>
    </PageLayout>
  </>
  )
}



export const getStaticProps  = ({ locale }) => {
  // export const getServerSideProps  = ({ locale }) => {
 
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/dao/${locale}.json`),
          ...require(`../../messages/my/${locale}.json`),
        },locale
        ,env:getEnv()
      }
    }
  }



  