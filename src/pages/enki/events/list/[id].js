import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import Loadding from '../../../../components/Loadding';
import { useTranslations } from 'next-intl'
import Breadcrumb from '../../../../components/Breadcrumb';
import { AddSvg } from '../../../../lib/jssvg/SvgCollection';
import PageItem from '../../../../components/PageItem';
import useInfoList from '../../../../hooks/useInfoList';
import { getJsonArray } from '../../../../lib/mysql/common';
import PageLayout from '../../../../components/PageLayout';
import Wecome from '../../../../components/federation/Wecome';
import EventItem from '../../../../components/federation/EventItem'

export default function ListsPage({daoDataServer}) {
 
  const tc = useTranslations('Common')
  const t = useTranslations('ff')
  const [daoData,setDaoData]=useState([])
  const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
  const pageData=useInfoList({currentPageNum,pages:8,daoid:daoData.dao_id,method:'eventsPageData'})
  // const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
  // const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  
  const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
  const [isVist,setIsVist]=useState(true)  //是不是游客
  useEffect(()=>{
    if(daoActor && daoActor.length) {
    let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(daoData.dao_id)})
    if(_daoData) setIsVist(false) ; else setIsVist(true);
    }
    else setIsVist(true);

   },[daoActor,daoData])

   useEffect(()=>{setDaoData(daoDataServer)},[daoDataServer])
   
  return (
    <PageLayout>
       
            <Breadcrumb menu={[ {url:`/enki/visit/${daoData.dao_id}`,title:daoData.dao_name}]} currentPage='discussions' ></Breadcrumb>
            {!isVist && <Link className="btn btn-primary" href={`/enki/events/new/[id]`} as={`/enki/events/new/${daoData.dao_id}`} > <AddSvg size={20} />{t('createEventsText')} </Link> }
            {pageData.rows.length?
              <>
                <ListMain rows={pageData.rows} t={t} /> 
                <PageItem records={pageData.total} pages={pageData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={pageData.status} />
              </>
              :pageData.status==='failed'?<ShowErrorBar errStr={pageData.error} />
              :pageData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
              :<Loadding />
            }
        
    </PageLayout>  
  );
}

function ListMain({rows,t})
{
  return <>
         <div className="d-flex justify-content-start align-items-start flex-wrap mb-3 g-3" >
            {rows.map((obj,idx)=>(
              <Link key={idx} className='daism-a' href={`/enki/events/message/[id]`} as={`/enki/events/message/${obj.id}`} >
                <EventItem  record={obj} t={t} />
            </Link>
            ))}
          </div>
         
          
</>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {

  return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`),
        },
        daoDataServer:await getJsonArray('daodata2',[query.id],true)
      }
    }
}

  