
import EventTitle from '../../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { Card} from 'react-bootstrap';
// import { useRouter } from 'next/navigation'
// import { ChatSvg } from '../../../../../lib/jssvg/SvgCollection';
import { getJsonArray } from '../../../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import ShowImg from '../../../../../components/ShowImg';
import Rmenu from '../../../../../components/Rmenu';
import { useState,useEffect } from 'react';
import EventDuscussion from '../../../../../components/federation/EventDuscussion';

//查看
export default function MessagePage({eventsData,statInfo,records}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <Rmenu>
        {
        eventsData.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} records={records} />
        : <ShowErrorBar errStr={t('noEventsExist')} />       
        }
    </Rmenu>
    );
}

function Message({eventsData,statInfo,t,tc,records}) {
    const [childData,setChildData]=useState([])
    // const router = useRouter()
    // const openDiscussion=()=>{
    //     router.push(`/enki/events/discussion/nomenu/${eventsData.id}`, { scroll: false })
    // }
  
    useEffect(()=>{setChildData(records)},[records])
    return ( 
    <>
     
        <div style={{ position:'relative', textAlign:'center'}} >
            <ShowImg path={eventsData.top_img} alt='' maxHeight="200px" />   
        </div>

       <EventTitle eventsData={eventsData}  statInfo={statInfo}  t={t} tc={tc} />

        <Card className="mb-3" >
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: eventsData.content}}></div>
        </Card.Body>
        </Card>
     
       {/* <Button variant='light' onClick={openDiscussion} > <ChatSvg size={64} /> </Button> */}
       <div className='mt-2' >   
        {childData.length===0 && <ShowErrorBar errStr={t('noCommont')}></ShowErrorBar>} 
        {childData.length>0 && childData.map((obj,idx)=>(
                    <div key={idx} >
                        <Card className='mt-2 daism-title' >
                        <Card.Body>
                            <EventDuscussion record={obj}  t={t} tc={tc}  />
                        </Card.Body>
                        </Card>
                    </div>
                ))
            }

        
    </div>
      
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
        records:await getJsonArray('ecview',[query.id]),

      }
    }
  }


  