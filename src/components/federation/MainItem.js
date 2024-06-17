


import Card from "react-bootstrap/Card";
import TimesItem from "./TimesItem";
import EventItem from "./EventItem";
import { NewsSvg,ChatSvg,EventsSvg,AddSvg,FindSvg,User1Svg } from "../../lib/jssvg/SvgCollection";
import Link from "next/link";
import ShowImg from "../ShowImg";

import { useRouter } from "next/router";


export default function MainItem({daoid,path,data,t,isVist}) {
    const { locale } = useRouter()
    const aStyle={
        textDecoration:'none',
        color:'black'
    }
    const cardData={
        discussions:{
            title:t('discussionText'),
            newTitle:t('createDiscussion')
        }, news:{
            title:t('newsText'),
            newTitle:t('createNews')
        }, events:{
            title:t('eventsText'),
            newTitle:t('createEventsText')
        }

    }
   
    return (
   
        <Card className="daism-title" >
            <Card.Header className="d-flex align-items-center justify-content-between m-0 p-1"  >
                <div>{
                       path==='news'?<NewsSvg />
                     : path==='events'?<EventsSvg />
                     : <ChatSvg />
                     }
                   {'  '} {cardData[path].title}
                </div>
                <div>
                   {!isVist &&  <Link  className="btn btn-primary"  href={`/${locale}/communities/${path}/new/[id]`} as={`/${locale}/communities/${path}/new/${daoid}`}  ><AddSvg size={20} />  {cardData[path].newTitle}</Link>  }
                </div>
                <div>
                    <Link  href={`/${locale}/communities/${path}/list/[id]`} as={`/${locale}/communities/${path}/list/${daoid}`} style={aStyle} > <FindSvg /> {t('serachText')}... </Link>
                </div>
            </Card.Header>
            <Card.Body style={{minHeight:'220px'}} >
                {
                path==='events'?  
                <div className="d-flex justify-content-start align-items-start flex-wrap mb-3 g-3" >
                    {data.map((obj,idx)=>(
                        <Link className="daism-a"  style={aStyle} key={path+idx} href={`/${locale}/communities/events/message/[id]`}  as={`/${locale}/communities/events/message/${obj.id}`}  >
                        <EventItem  record={obj} t={t} ></EventItem>
                        </Link>
                    ))}      
                </div> :     

                data.map((obj,idx)=>(
                    <Link key={path+idx}  style={aStyle}  href={`/${locale}/communities/${path}/message/[id]` }  as={`/${locale}/communities/${path}/message/${obj.id}`} >
                    <div className="row mb-1 p-1 border " >
                            <div className="col-auto me-auto d-inline-flex align-items-center" >
                            {obj.member_icon?<ShowImg path={obj.member_icon} alt="" width="32px" height="32px"  borderRadius='50%' />
                            :<User1Svg size={32} />
                            }
                            
                            <div style={{paddingLeft:'4px'}} >{obj.title}</div>
                            </div>
                            <div className="col-auto d-inline-flex align-items-center" >
                                <TimesItem  times={obj.times} t={t} ></TimesItem>
                            </div>
                    </div>
                    </Link>
                ))
                }
               
            </Card.Body>
        </Card>
    );
}
