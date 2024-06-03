import { useEffect, useState } from 'react';
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { Card,Button,Row,Col} from 'react-bootstrap';
import MessageItem from '../../../../../components/federation/MessageItem';
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { getJsonArray } from '../../../../../lib/mysql/common';
import Link from 'next/link';
import EventTitle from '../../../../../components/federation/EventTitle';
import Rmenu from '../../../../../components/Rmenu';

//查看
export default function EventDiscussions({eventsData,records,statInfo}) {
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <Rmenu>
        {
        eventsData.id?<Message eventsData={eventsData} records={records} t={t} tc={tc} statInfo={statInfo} />
        :<ShowErrorBar errStr={t('noEventsExist')} />        
        }
    </Rmenu>
    );

}


function Message({eventsData,records,t,tc,statInfo})
{
    const [childData,setChildData]=useState([])
    const router=useRouter()
    useEffect(()=>{setChildData(records)},[records])

 

    return <>
      
       <EventTitle eventsData={eventsData}  statInfo={statInfo} t={t} tc={tc} />
      <Card>
        <Card.Body>
        <Link href={`/enki/events/message/nomenu/[id]`} as={`/enki/events/message/nomenu/${eventsData.id}`} >{t('eventsContent')}...</Link>
        </Card.Body>
      </Card>
       
      
        <div className='mt-2' >   
        {childData.length===0 && <ShowErrorBar errStr={t('noCommont')}></ShowErrorBar>} 
        {childData.length>0 && childData.map((obj,idx)=>(
                    <div key={idx} >
                        <Card className='mt-2 daism-title' >
                        <Card.Body>
                            <MessageItem  record={obj}  noLink={obj.send_id && obj.send_id.startsWith('http')} 
                              isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  t={t} tc={tc} />
                            <Row>
                                <Col className='Col-auto me-auto' >
                                    <Button size='sm' onClick={e=>{router.push(`/enki/events/reply/nomenu/${obj.id}`, { scroll: false })}} variant='light'>{t('searchReply')}</Button>
                                </Col>
                                <Col className='col-auto' >
                                        <span>{t('replyText')}：{obj.reply_count}</span>
                                </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </div>
                ))
            }

        
    </div>
    
</>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {
 
    let statInfo={amount:0,noAudit:0}
    let eventsData=await getJsonArray("eview",[query.id],true)
    if(eventsData.id) {
        let re= await getJsonArray('ejoin1',[query.id])
        if(re && re[0]) statInfo.amount=re[0].amount
        re= await getJsonArray('ejoin2',[query.id])
        if(re && re[0]) statInfo.noAudit=re[0].amount
    }


    return {
      props: {
        messages: {
          ...require(`../../../../../messages/shared/${locale}.json`),
          ...require(`../../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        records:await getJsonArray('ecview',[query.id]),
        statInfo
      }
    }
  }


  