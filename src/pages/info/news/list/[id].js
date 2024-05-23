import { useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import Loadding from '../../../../components/Loadding';
import { useTranslations } from 'next-intl'
import Breadcrumb from '../../../../components/Breadcrumb';
import ListItem from '../../../../components/federation/ListItem';
import Wecome from '../../../../components/federation/Wecome';
import { AddSvg } from '../../../../lib/jssvg/SvgCollection';
import PageItem from '../../../../components/PageItem';
import useInfoList from '../../../../hooks/useInfoList';
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';


export default function ListsPage({daoData}) {
  const t = useTranslations('ff')
  const tc = useTranslations('Common')
  const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
  const pageData=useInfoList({currentPageNum,pages:20,daoid:daoData.dao_id,method:'newsPageData'})
  const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  
  const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
  const [isVist,setIsVist]=useState(true)  //是不是游客
  useEffect(()=>{
    if(daoActor && daoActor.length) {
    let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(daoData.dao_id)})
    if(_daoData) setIsVist(false) ; else setIsVist(true);
    }
    else setIsVist(true);

   },[daoActor])


  
  return (
    <PageLayout>
        {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
         :!loginsiwe?<Wecome />
         :<>
           <Breadcrumb menu={[{url:`/info/visit/${daoData.dao_id}`,title:daoData.dao_name}]} currentPage='news' ></Breadcrumb>
           {!isVist && <Link className="btn btn-primary" href={`/info/news/new/[id]`} as={`/info/news/new/${daoData.dao_id}`} > <AddSvg size={20} />{t('createNews')} </Link>}
            { pageData.rows.length?
              <>
                <ListMain rows={pageData.rows} t={t} /> 
                <PageItem records={pageData.total} pages={pageData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={pageData.status} />
              </>
              :pageData.status==='failed'?<ShowErrorBar errStr={pageData.error} />
              :pageData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
              :<Loadding />
            }
          </>
        }  
    </PageLayout>  
  );
}


function ListMain({rows,t})
{
  return <>
        
      {rows.map((obj,idx)=>(
        <ListItem key={idx} record={obj}  path='news' t={t} />
      ))}
          
  </>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {

  return {
    props: {
      messages: {
        ...require(`../../../../messages/shared/${locale}.json`),
        ...require(`../../../../messages/federation/${locale}.json`),
      },
      daoData:await getJsonArray('daodata2',[query.id],true)
    }
  }
}


  