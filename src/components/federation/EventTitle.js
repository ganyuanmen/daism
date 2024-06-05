
import { Card } from 'react-bootstrap';
import MemberItem from './MemberItem';
import ShowAddress from '../ShowAddress';
import EditItem from './EditItem';
import Link from 'next/link';
import { useSelector} from 'react-redux';
import { LocationSvg,DateSvg,UserSvg,WebsitSvg } from '../../lib/jssvg/SvgCollection';

export default function EventTitle({eventsData,actor,loginsiwe,statInfo,closeTip,showClipError,t,tc,showTip}) {
    // const daoAddress = useSelector((state) => state.valueData.daoAddress)
    let MenuAttch=undefined;
    if (actor && actor.member_address===eventsData.member_address && statInfo.noAudit>0)
        MenuAttch={path:`/enki/events/join/${eventsData.id}`,title:`${t('audit')}: ${statInfo.noAudit} ${t('people')}`}


    return (
       <>
     
            <div className="row mb-2" >
                <div className="col-auto me-auto " >
                    <MemberItem record={eventsData} />
                </div>
                <div className='col-auto d-flex align-items-center '>
                    <div style={{textAlign:'center',width:'100%'}} >
                        <span>{t('participateText')}:{statInfo.amount}</span>{'  '}
                      

                        {eventsData?.state===2?<span className='text-secondary'>({t('alreadyEndText')}) </span>
                        :eventsData?.state===1?<span className='text-info'>({t('processingText')}...) </span>
                        :<>{loginsiwe && <Link  href={`/enki/events/join/${eventsData.id}`} >({t('I want to participate')})</Link>}</>
                        }
                    </div> 
                    {actor && (actor?.member_address?.toLowerCase()===eventsData?.member_address?.toLowerCase() ) && 
                     <EditItem message={eventsData} showTip={showTip}  t={t} tc={tc}
                     closeTip={closeTip} showClipError={showClipError} path='events' replyLevel={0} attach={MenuAttch} />
                     
                    }
                </div>  
            </div>
     
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
      
           
       </>

    );
}
