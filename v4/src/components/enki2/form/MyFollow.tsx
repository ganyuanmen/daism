import EnkiMember from "./EnkiMember";
import { Row, Col } from "react-bootstrap";
import EnKiUnFollow from "./EnKiUnFollow";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { client } from "../../../lib/api/client";
import { type RootState } from "@/store/store";

/**
 * 我关注谁的 item
 * @followObj 关注信息对象
 * @isEdit 是否显示取关按钮
 */

interface Props {
  followObj: EnkiFollowType;
  isEdit?: boolean;
}

export default function MyFollow({ followObj,  isEdit = false }: Props) {
  const [data, setData] = useState<EnkiFollowType>(followObj);
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);


  //实时更新头像
  useEffect(() => {
    let ignore = false;
    client.get(`/api/getData?url=${followObj.url}`, "getUserFromUrl").then((res: any) => {
      if (!ignore) {
        if (res.status === 200 && res?.data?.avatar) {
          if (res.data.avatar !== followObj.avatar) {
            setData({ ...followObj, avatar: res.data.avatar });
          }
        }
      }
    });
    return () => {
      ignore = true;
    };
  }, [followObj]);

  return (
    <Row
      className="d-flex align-items-center"
      style={{ borderBottom: "1px solid #D2D2D2", padding: "5px 2px" }}
    >
      <Col>
       <EnkiMember url={followObj.url} hw={32} account={followObj.account} isLocal={followObj.actor_id>0} avatar={followObj.avatar}  />
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
