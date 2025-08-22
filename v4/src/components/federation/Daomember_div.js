import { Card } from "react-bootstrap";
import ShowAddress from '../ShowAddress';
import { User1Svg } from "../../lib/jssvg/SvgCollection";
// import ShowImg from "../ShowImg";

//成员列表
export default function Daomember_div({record,t,dao_manager}) {  
   
    return (
        <Card className='mb-2  daism-title' >
        <Card.Header>{t('daoMember')}</Card.Header>
        <Card.Body>
        { record.map((obj,idx)=>
                <div className='row mb-2 p-1' style={{borderBottom:'1px solid gray'}}  key={idx}>
                    <div className='col' >
                            <ShowAddress  address={obj.member_address} ></ShowAddress>
                        </div>
                        <div className='col' >
                            {!!obj.actor_url &&
                                  <a href={obj.actor_url}  className="daism-a">
                                  {obj.avatar?
                                  <img src={obj.avatar} alt='' style={{width:"32px",height:"32px",borderRadius:'10px'}} />
                                  :<User1Svg size={32} />
                                  }
                                  <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.actor_account}</span>
                              </a>
                           
                            }
                           
                            
                        </div>
                        <div className='col' >
                        {dao_manager.toLowerCase()===obj.member_address.toLowerCase()?<span>{t('daoManagerText')}</span>:<span>{t('originMember')}</span>}
                        </div> 
                </div>
            )
        }
        </Card.Body>
    </Card>
    );
}




