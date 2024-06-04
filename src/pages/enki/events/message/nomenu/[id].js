
import EventTitle from '../../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { Card} from 'react-bootstrap';
import { getJsonArray } from '../../../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import { useState,useEffect } from 'react';
import ShowImg from '../../../../../components/ShowImg';
import EventDuscussion from '../../../../../components/federation/EventDuscussion';
import Loadding from '../../../../../components/Loadding';
import PageItem from '../../../../../components/PageItem';
import useDiscusionList from "../../../../../hooks/useDiscusionList"
import Rmenu from '../../../../../components/Rmenu';

//不登录也可以查看
export default function MessagePage({eventsData,statInfo}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <Rmenu>
        {
        eventsData?.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} />
        : <ShowErrorBar errStr={t('noEventsExist')} />        
        }
    </Rmenu>
    );
}

function Message({eventsData,statInfo,t,tc}) {
 
    const [childData,setChildData]=useState([])
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const pageData=useDiscusionList({currentPageNum,pid:eventsData.id,pages:10,method:'ecviewPageData'})
    useEffect(()=>{ if(pageData && pageData.rows) setChildData(pageData.rows) },[pageData])
   
 

    return ( 
    <>
        <div style={{ position:'relative', textAlign:'center'}} >
            <ShowImg path={eventsData.top_img} alt='' maxHeight="200px"  />   
        </div>
        <h1>{eventsData.title}</h1>
        <Card className="mb-3" >
            <Card.Header>
            <EventTitle eventsData={eventsData} statInfo={statInfo}  t={t} tc={tc} />
            </Card.Header>
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: eventsData.content}}></div>
        </Card.Body>
        </Card>
     
        {childData.length?
                  <>
                    {childData.map((obj,idx) => (
                            <EventDuscussion key={idx} record={obj}  t={t} tc={tc}  />
                    ))
                    }
                    <PageItem records={pageData.total} pages={pageData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={pageData.status} />
                  </>
                  :pageData.status==='failed'?<ShowErrorBar errStr={pageData.error} />
                  :pageData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
                  :<Loadding />
        }

    </>
    );
}


export const getServerSideProps = async ({ req, res,locale,query }) => {

    let eventsData=await getJsonArray('eview',[query.id],true)
    let statInfo={amount:0,noAudit:0}
    if(eventsData.id) {
        let re= await getJsonArray('ejoin1',[query.id]);
        if(re && re[0]) statInfo.amount=re[0].amount
        re= await getJsonArray('ejoin2',[query.id]);
        if(re && re[0]) statInfo.noAudit=re[0].amount
    }

    return {
      props: {
        messages: {
          ...require(`../../../../../messages/shared/${locale}.json`),
          ...require(`../../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        statInfo,
        // records:await getJsonArray('ecview',[query.id]),
      }
    }
  }


  