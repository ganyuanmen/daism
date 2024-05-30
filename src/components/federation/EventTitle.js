
import { Card } from 'react-bootstrap';
import MemberItem from './MemberItem';
import ShowAddress from '../ShowAddress';
import EditItem from './EditItem';
import Link from 'next/link';
import { useSelector} from 'react-redux';
import { LocationSvg,DateSvg,UserSvg,WebsitSvg } from '../../lib/jssvg/SvgCollection';

export default function EventTitle({eventsData,actor,statInfo,closeTip,showClipError,t,tc,showTip}) {
    const daoAddress = useSelector((state) => state.valueData.daoAddress)
    let MenuAttch=undefined;
    if (actor && actor.member_address===eventsData.member_address && statInfo.noAudit>0)
        MenuAttch={path:`/info/events/join/${eventsData.id}`,title:`${t('audit')}: ${statInfo.noAudit} ${t('people')}`}


    return (
       <>
        <h1>{eventsData.title}</h1>
        <Card className='mb-2' >
        <Card.Body>
            <div className="row" >
                <div className="col-auto me-auto " >
                    <MemberItem record={eventsData} />
                </div>
                <div className="col-auto" >
                    <div style={{textAlign:'center',width:'100%'}} >
                        <span>{t('participateText')}:{statInfo.amount}</span>{'  '}
                      

                        {eventsData?.state===2?<span className='text-secondary'>({t('alreadyEndText')}) </span>
                        :eventsData?.state===1?<span className='text-info'>({t('processingText')}...) </span>
                        :<Link  href={`/info/events/join/${eventsData.id}`} >({t('I want to participate')})</Link>
                        }
                    </div> 
                    {actor && (actor?.member_address?.toLowerCase()===eventsData?.member_address?.toLowerCase() || actor?.member_address?.toLowerCase()===daoAddress['administrator']?.toLowerCase()) && 
                     <EditItem message={eventsData} showTip={showTip}  t={t} tc={tc}
                     closeTip={closeTip} showClipError={showClipError} path='events' replyLevel={0} attach={MenuAttch} />
                     
                    }
                </div>  
            </div>
        </Card.Body>
        </Card>

        <Card className='mb-2' >
        <Card.Body>
            <div className="row" >
                <div className="col-auto me-auto " >
                    <div><DateSvg size={24} /> <strong>{t('timesText')}：</strong> {t('fromText')}{'  '}{eventsData.start_time} {t('toText')}{'  '}{eventsData.end_time} </div>
                    <div><UserSvg size={24} /> <strong> {t('managerText')}：</strong> <ShowAddress address={eventsData.original} ></ShowAddress>  </div>
                </div>
                <div className="col-auto" >
                    <div><LocationSvg size={24} /> <strong>{t('addressText')}:</strong> {eventsData.address} </div>
                    <div><WebsitSvg size={24} /> <strong>{t('urlText')}:</strong> {eventsData.event_url}</div>
                </div>
            </div>
        </Card.Body>
        </Card>
           
       </>

    );
}
