import { Row, Col } from "react-bootstrap";
import {useLocale} from 'next-intl';
import Image from "next/image";

interface TipToMeProps {
  tipObj: DaismTipType;
}

export default function TipToMe({ tipObj }: TipToMeProps) {
  const locale = useLocale();
  return (
    <Row
      className="d-flex align-items-center"
      style={{ borderBottom: "1px solid #D2D2D2", padding: "5px 2px" }}
    >
      <Col className="d-flex align-items-center">
        <Image src={tipObj.avatar} width={32} height={32} alt="" />
        <span style={{ marginLeft: "8px" }}>{tipObj.actor_account}</span>
      </Col>
      <Col>{tipObj.utoken} UTO</Col>
      <Col>
        <a
          href={`https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enki${
            tipObj.dao_id === 0 ? "er" : ""
          }/${tipObj.message_id}`}
        >
          Enki Article
        </a>
      </Col>
      <Col>{tipObj._time} (UTC+8)</Col>
    </Row>
  );
}
