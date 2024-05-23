import { Card } from "react-bootstrap";
import ShowAddress from '../ShowAddress';
import ShowImg from "../ShowImg";
/**
 * dao成员 信息列表展示
 */
export default function Daomember_div({record,t,dao_manager}) {  
   
    return (
        <Card className='mb-2  daism-title' >
        <Card.Header>{t('daoMember')}</Card.Header>
        <Card.Body>
        { record.map((obj,idx)=>(
                <div className='row mb-2 p-1' style={{borderBottom:'1px solid gray'}}  key={idx}>
                    <div className='col' >
                            <ShowAddress  address={obj.member_address} ></ShowAddress>
                        </div>
                        <div className='col' >
                            {
                            obj.member_icon?
                            <ShowImg path={obj.member_icon}  width="32px" alt='' height="32px" borderRadius='50%' />
                            : <img src='/logo.svg' width={32} alt='' height={32} style={{borderRadius:'50%'}} />
                            }
                           
                            <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.member_nick}</span>
                        </div>
                        <div className='col' >
                        {dao_manager.toLowerCase()===obj.member_address.toLowerCase()?<span>{t('daoManagerText')}</span>:<span>{t('originMember')}</span>}
                        </div> 
                </div>
            ))
        }
        </Card.Body>
    </Card>
    );
}




