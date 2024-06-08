import { Card } from "react-bootstrap"
// import Sh from "./MemberItem"
import EditItem from "./EditItem"
import TimesItem from "./TimesItem"
import ShowImg from "../ShowImg"
import { User1Svg } from '../../lib/jssvg/SvgCollection';
// import { useSelector } from 'react-redux';

export default function MessageItemmin({record,actor,showTip,closeTip,showClipError,path,replyLevel,t,tc,isrealyImg,noLink})  
{ 

    // const daoAddress = useSelector((state) => state.valueData.daoAddress)

    return  <Card className='mb-3'>
        <Card.Header>
        <div className='row'  >
            <div className='col-auto me-auto' >
                {record.member_icon?<>
                        {isrealyImg?<img src={record.member_icon} alt='' style={{width:"24px",height:"24px",borderRadius:'50%' }} />
                                :<ShowImg path={record.member_icon} alt='' width="24px" height="24px" borderRadius='50%' /> 

                        }
                    </>
                :<User1Svg size={24} />
                }
                {record.member_nick}
      
            </div>
            <div className='col-auto d-flex align-items-center '>
                {actor && (actor?.member_address?.toLowerCase()===record?.member_address?.toLowerCase()) && 
                    <EditItem  message={record} showTip={showTip} closeTip={closeTip} 
                    showClipError={showClipError} replyLevel={replyLevel} path={path}  t={t} tc={tc} ></EditItem>
                }
                <TimesItem times={record.times} t={t} ></TimesItem>
                </div>
            </div>
        </Card.Header>
            <Card.Body>
           
           
            <div style={{paddingTop:'16px',paddingLeft:'4px'}} dangerouslySetInnerHTML={{__html: record.content}}></div>
            </Card.Body>
            </Card>
}