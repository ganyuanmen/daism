import EnkiMember from "./EnkiMember";
import { Row, Col } from "react-bootstrap";
import EnKiFollow from "./EnKiFollow";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { client } from "../../../lib/api/client";
import { type RootState } from "@/store/store";

/**
 * 谁关注我的 item
 * @followObj 关注者信息
 * @isEdit 是否显示关注按钮
 */

interface Props {
  followObj: EnkiFollowType;
  isEdit?: boolean;
}

export default function FollowMe({ followObj, isEdit = false }: Props) {
  const [data, setData] = useState<EnkiFollowType>(followObj);

  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe) as boolean;
  const myFollow = useSelector((state: RootState) => state.valueData.myFollow) as DaismFollow[];

  const checkFollow = (obj: EnkiFollowType): boolean => {
    const item = myFollow.find((f: DaismFollow) => f.actor_account.toLowerCase() === followObj.account?.toLowerCase());
    return !!item;
  };

  // 实时获取关注者当前的头像
  useEffect(() => {
    let ignore = false;
    client.get(`/api/getData?url=${followObj.url}`, "getUserFromUrl").then((res: any) => {
      if (!ignore && res.status === 200 && res?.data?.avatar) {
        if (res.data.avatar !== followObj.avatar) {
          setData({ ...followObj, avatar: res.data.avatar });
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
      <EnkiMember url={followObj.url} hw={32} isLocal={followObj.actor_id>0} account={followObj.account} avatar={followObj.avatar}  />

      </Col>
      <Col>
        {isEdit && loginsiwe && actor?.actor_account && !checkFollow(followObj) && (
          <EnKiFollow url={followObj.url} account={followObj.account} showText={true} />
        )}
      </Col>
      <Col>{followObj.createtime}(UTC+8)</Col>
    </Row>
  );
}
