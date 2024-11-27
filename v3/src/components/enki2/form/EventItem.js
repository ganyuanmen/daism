import { Row,Col } from "react-bootstrap";
import { LocationSvg,DateSvg,WebsitSvg } from '../../../lib/jssvg/SvgCollection';

//活动附加信息
export default function EventItem({t,currentObj})
{
    return(
        <Row className="mt-2" >
            <Col className="col-auto me-auto " >
                <div><DateSvg size={24} /> <strong>{t('fromText')}</strong> :{currentObj.start_time}(UTC+8) </div>
                <div><DateSvg size={24} /> <strong>{t('toText')}</strong> :{currentObj.end_time}(UTC+8) </div>
            </Col>
            <Col className="col-auto" >
                <div><LocationSvg size={24} /> <strong>{t('addressText')}:</strong> {currentObj.event_address} </div>
                <div><WebsitSvg size={24} /> <strong>{t('urlText')}:</strong> {currentObj.event_url}</div>
            </Col>
        </Row>
    );
}

