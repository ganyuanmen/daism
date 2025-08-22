import { Card,Row,Col } from "react-bootstrap";
import EnkiMember from "../enki2/form/EnkiMember";

/**
 * dao 关注者列表展示
 */
export default function Follower_div({record,locale,t}) {  
   
    return (
        <Card className='mb-2 daism-title' >
        <Card.Header>{t('followerText')}</Card.Header>
        <Card.Body>
        {  record.map((obj,idx)=> <Row key={idx} className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember locale={locale} messageObj={obj} isLocal={false} hw={32} /></Col>
                <Col>{obj.createtime}(UTC+8)</Col>
            </Row>)}
        </Card.Body>
    </Card>
    );
}




