import { useEffect, useState } from 'react';
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { Card} from 'react-bootstrap';
import MessageItem from '../../../../../components/federation/MessageItem';
import EventTitle from '../../../../../components/federation/EventTitle';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../../../lib/mysql/common';
import Link from 'next/link';
import Rmenu from '../../../../../components/Rmenu';

//查看
export default function EventReply({commontData,replyData,statInfo}) {


let tc = useTranslations('Common')
let t = useTranslations('ff')
return (
<Rmenu>
    {
    commontData.id?<Message commontData={commontData} replyData={replyData} t={t} tc={tc} statInfo={statInfo} />
    :<ShowErrorBar errStr={t('noEventsExist')} />
    
    }
</Rmenu>
);
}


function Message({commontData,replyData,t,tc,statInfo})
{
  
    const [childData,setChildData]=useState([])
    useEffect(()=>{setChildData(replyData)},[replyData])

  
    return <>
            <div className='mt-2' >   
             
                <EventTitle eventsData={commontData}  statInfo={statInfo}  t={t} tc={tc} />

                <Card className='mb-2' >
                    <Card.Body>
                         <MessageItem  record={commontData} t={t} tc={tc} />
                    </Card.Body>
                </Card>
                
                <Card>
                    <Card.Body>
                    <Link href={`/enki/events/discussion/nomenu/[id]`} as={`/enki/events/discussion/nomenu/${commontData.pid}`} >{t('moreCommont')}...</Link>
                    </Card.Body>
                </Card>
                


                {childData.length===0 && <ShowErrorBar errStr={t('noReply')}></ShowErrorBar>} 
                {childData.length>0 && childData.map(
                    (obj,idx)=>(
                                    <div key={idx} >
                                        <Card className='mt-2 daism-title' >
                                        <Card.Body>
                                            <MessageItem  record={obj} 
                                            noLink={obj.send_id && obj.send_id.startsWith('http')} 
                                            isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  
                                            t={t} tc={tc} />
                                        </Card.Body>
                                        </Card>
                                    </div>
                                )
                    )
                }

           
            </div>
          </>
}





export const getServerSideProps = async ({ req, res,locale,query }) => {
    
    let commontData={}
    let replyData=[]
    let _commontData=await getJsonArray('ecviewid',[query.id])
    if(_commontData.length)
    {
        commontData['is_discussion']=_commontData[0]['is_discussion'] 
        commontData['pid']=_commontData[0]['pid']
        commontData['id']=_commontData[0]['id']
        commontData['content']=_commontData[0]['content']
        commontData['times']=_commontData[0]['times']

        let _data=await getJsonArray("eview",[commontData['pid']])
        if(_data.length)
        {
            commontData['dao_id']=_data[0]['dao_id'] 
            commontData['dao_name']=_data[0]['dao_name'] 
            commontData['title']=_data[0]['title'] 
            commontData['member_address']=_data[0]['member_address'] 
     
            commontData['start_time']=_data[0]['start_time'] 
            commontData['end_time']=_data[0]['end_time'] 
            commontData['original']=_data[0]['original'] 
            commontData['address']=_data[0]['address'] 
            commontData['event_url']=_data[0]['event_url'] 
            
            

        }
        replyData= await getJsonArray('ecrview',[query.id]);
    }
 
    let statInfo={amount:0,noAudit:0}
    if(commontData.id) {
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
        commontData,
        replyData,
        statInfo
      }
    }
  }


  