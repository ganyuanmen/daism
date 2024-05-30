import { useSelector,useDispatch} from 'react-redux';
import EventTitle from '../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import { Card,Button} from 'react-bootstrap';
import {setTipText,setMessageText} from '../../../../data/valueData'
import { useRouter } from 'next/navigation'
import Breadcrumb from '../../../../components/Breadcrumb';
import { ChatSvg } from '../../../../lib/jssvg/SvgCollection';
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import { useState,useEffect } from 'react';
import ShowImg from '../../../../components/ShowImg';

//不登录也可以查看
export default function MessagePage({eventsData,statInfo}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <PageLayout>
        {
        eventsData.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} />
        :<>
        <Breadcrumb menu={[]} currentPage='events' />
        <ShowErrorBar errStr={t('noEventsExist')} />
        </>
        
        }
    </PageLayout>
    );
}

function Message({eventsData,statInfo,t,tc}) {
    const router = useRouter()
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch();
    
    // const uref=useRef()
    
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

    // const [menu,setMenu]=useState([])
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const [isVist,setIsVist]=useState(true)  //是不是游客
    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(eventsData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
  
     },[daoActor])
  

   
    const openDiscussion=()=>{
        router.push(`/info/events/discussion/${eventsData.id}`, { scroll: false })
    }
 
    const menu=[
        {url:`/info/visit/${eventsData.dao_id}`,title:eventsData.dao_name},
        {url:`/info/events/list/${eventsData.dao_id}`,title:'events'}
    ]

    return ( 
    <>
        <Breadcrumb menu={menu} currentPage={eventsData.title}> </Breadcrumb>
        <div style={{ position:'relative', textAlign:'center'}} >
            <ShowImg path={eventsData.top_img} alt='' maxHeight="200px"  />   
        </div>

       <EventTitle eventsData={eventsData} actor={actor} showTip={showTip} statInfo={statInfo} closeTip={closeTip} 
       showClipError={showClipError}  t={t} tc={tc} />

        <Card className="mb-3" >
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: eventsData.content}}></div>
        </Card.Body>
        </Card>
     
       <Button variant='light' onClick={openDiscussion} > <ChatSvg size={64} /> </Button>
      
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
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        statInfo
      }
    }
  }


  