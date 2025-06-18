
import { Row,Col } from "react-bootstrap";



export default function TipToMe({messageObj,locale,env}) {

 
 
    return (
        
            <Row className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col className="d-flex  align-items-center" ><img src={messageObj.avatar} width={32} height={32} /><span>{messageObj.actor_account}</span></Col>
                <Col>{messageObj.utoken} UTO</Col>
                <Col><a href={`https://${env.domain}/${locale}/communities/enki${messageObj.dao_id===0?'er':''}/${messageObj.message_id}`} >Enki Article</a> </Col>
                <Col>{messageObj._time}(UTC+8)</Col>
            </Row>
          
      
    );
}

