import { Card } from "react-bootstrap";

/**
 * dao 关注者列表展示
 */
export default function Follower_div({record,t}) {  
   
    return (
        <Card className='mb-2 daism-title' >
        <Card.Header>{t('followerText')}</Card.Header>
        <Card.Body>
            
        {  record.map((obj,idx)=>(
                <div className='row mb-2 p-1' style={{borderBottom:'1px solid gray'}}  key={idx}>
                    
                        <div className='col-md-6 col-sm-12' >
                            <img src={obj.actor_icon?obj.actor_icon:'/logo.svg'} width={32} height={32} alt='' style={{borderRadius:'50%'}} />
                            <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.actor_account}</span>
                        </div>
                        <div className='col-md-6 col-sm-12'>
                            {obj.createtime}
                        </div>
                        
                </div>
            ))
        }
        </Card.Body>
    </Card>
    );
}




