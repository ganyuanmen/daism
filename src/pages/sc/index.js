import { useTranslations } from 'next-intl'
import { useState } from "react"
import PageLayout from '../../components/PageLayout'
import ShowErrorBar from "../../components/ShowErrorBar";
import Loadding from "../../components/Loadding";
import DaosPage from "../../components/home/DaosPage";
import useDaoList from '../../hooks/useDaoList';


export default function Home() {
  const t = useTranslations('Common')
  const [currentPageNum, setCurrentPageNum] = useState(1) //当前页
  const [orderIndex, setOrderIndex] = useState(0)
  const [orderField, setOrderField] = useState("dao_time") //排序字段
  const [searchText, setSearchText] = useState("") //模糊查询内容
  const [orderType, setOrderType] = useState(false) //排序类型
  const daosData =useDaoList({currentPageNum, orderField, searchText, orderType})

  return (
    <PageLayout>
      { daosData.rows.length?<DaosPage daosData={daosData} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum}
          orderIndex={orderIndex} setOrderIndex={setOrderIndex}  orderType={orderType} setOrderType={setOrderType} setOrderField={setOrderField} 
          setSearchText={setSearchText} postStatus={daosData.status}/>
        :daosData.status==='failed'?<ShowErrorBar errStr={daosData.error} />
        :daosData.status==='succeeded' ? <ShowErrorBar errStr={t('noDataText')} />
        :<Loadding />
      }
    </PageLayout>
  )
}

export const getStaticProps  = ({ req, res,locale }) => {
 
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/dao/${locale}.json`),
        }
      }
    }
  }



  