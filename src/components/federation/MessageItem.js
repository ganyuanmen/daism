import { Card } from "react-bootstrap"
import MemberItem from "./MemberItem"
import EditItem from "./EditItem"
import TimesItem from "./TimesItem"
import { useSelector } from 'react-redux';

export default function MessageItem({record,actor,showTip,closeTip,showClipError,path,replyLevel,t,tc,isrealyImg,noLink})  
{ 
    console.log(['MessageItem',isrealyImg,noLink])
    const daoAddress = useSelector((state) => state.valueData.daoAddress)

    return  <Card className='mb-3'>
            <Card.Body>
            <div className='row' >
                <div className='col-auto me-auto' >
                    <MemberItem  record={record} isrealyImg={isrealyImg} noLink={noLink} ></MemberItem>
                </div>
                <div className='col-auto'>
                {actor && (actor?.member_address?.toLowerCase()===record?.member_address?.toLowerCase() || actor?.member_address?.toLowerCase()===daoAddress['administrator']?.toLowerCase()) && 
                    <EditItem  message={record} showTip={showTip} closeTip={closeTip} 
                    showClipError={showClipError} replyLevel={replyLevel} path={path}  t={t} tc={tc} ></EditItem>
                }
                <TimesItem times={record.times} t={t} ></TimesItem>
                </div>
            </div>
           
            <div style={{paddingTop:'16px',paddingLeft:'4px'}} dangerouslySetInnerHTML={{__html: record.content}}></div>
            </Card.Body>
            </Card>
}