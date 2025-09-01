import { Card,Row,Col } from "react-bootstrap";
import EnkiMember from "../enki2/form/EnkiMember";
import { useTranslations } from "next-intl";

/**
 * dao 关注者列表展示
 */
export default function Follower_div({record}:{record:ActorInfo[]}) {  
    const t = useTranslations('ff');

    return (
        <Card className='mb-2 daism-title' >
        <Card.Header>{t('followerText')}</Card.Header>
        <Card.Body>
        {  record.map((obj,idx)=> <Row key={idx} className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember url={obj.url} account={obj.account} avatar={obj.avatar} isLocal={false} hw={32} /></Col>
                <Col>{obj.createtime}(UTC+8)</Col>
            </Row>)}
        </Card.Body>
    </Card>
    );
}




