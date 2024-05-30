
import EventTitle from '../../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { Card,Button} from 'react-bootstrap';
import { useRouter } from 'next/navigation'
import { ChatSvg } from '../../../../../lib/jssvg/SvgCollection';
import { getJsonArray } from '../../../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import ShowImg from '../../../../../components/ShowImg';
import Rmenu from '../../../../../components/Rmenu';

//查看
export default function MessagePage({eventsData,statInfo}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <Rmenu>
        {
        eventsData.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} />
        : <ShowErrorBar errStr={t('noEventsExist')} />       
        }
    </Rmenu>
    );
}

function Message({eventsData,statInfo,t,tc}) {
    const router = useRouter()
    const openDiscussion=()=>{
        router.push(`/info/events/discussion/nomenu/${eventsData.id}`, { scroll: false })
    }
  
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
          ...require(`../../../../../messages/shared/${locale}.json`),
          ...require(`../../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        statInfo
      }
    }
  }


  