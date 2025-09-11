import EnkiMember from "./EnkiMember";
import { Row, Col } from "react-bootstrap";
import EnKiUnFollow from "./EnKiUnFollow";
import { useSelector } from "react-redux";

import { type RootState } from "@/store/store";

/**
 * 我关注谁的 item
 * @followObj 关注信息对象
 * @isEdit 是否显示取关按钮
 */

interface Props {
  followObj: ActorInfo;
  isEdit?: boolean;
}

export default function MyFollow({ followObj,  isEdit = false }: Props) {
  
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);




  return (
    <Row
      className="d-flex align-items-center"
      style={{ borderBottom: "1px solid #D2D2D2", padding: "5px 2px" }}
    >
      <Col>
       <EnkiMember url={followObj.url} hw={32} account={followObj.account} manager={followObj?.manager??''}
        isLocal={Boolean(followObj?.actor_id && followObj.actor_id > 0)} avatar={followObj.avatar}  />
      </Col>
      {isEdit && loginsiwe && (
        <Col>
          <EnKiUnFollow searObj={followObj} />
        </Col>
      )}
      <Col>{followObj.createtime}(UTC+8)</Col>
    </Row>
  );
}
