import EnkiMember from "./EnkiMember";
import { Row, Col } from "react-bootstrap";
import EnKiFollow from "./EnKiFollow";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

/**
 * 谁关注我的 item
 * @followObj 关注者信息
 * @isEdit 是否显示关注按钮
 */

interface Props {
  followObj: ActorInfo;
  isEdit?: boolean;
}

export default function FollowMe({ followObj, isEdit = false }: Props) {


  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe) as boolean;
  const myFollow = useSelector((state: RootState) => state.valueData.myFollow) as DaismFollow[];

  const checkFollow = (): boolean => {
    const item = myFollow.find((f: DaismFollow) => f.actor_account.toLowerCase() === followObj.account?.toLowerCase());
    return !!item;
  };

  // // 实时获取关注者当前的头像
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(`/api/getData?url=${followObj.url}`,
  //          { signal: controller.signal,headers:{'x-method':'getUserFromUrl'} });
  //       if (res.ok) {
  //         const data = await res.json();
  //         if (data && data?.avatar)  setData({ ...followObj, avatar: data.avatar });
  //       }
  //     } catch (err: any) {
  //       if (err.name === 'AbortError') return; // 请求被取消
  //     }
  //   };
  
  //    fetchData();
  //   return () => { controller.abort();};

  // }, [followObj,setData]);


  return (
    <Row
      className="d-flex align-items-center"
      style={{ borderBottom: "1px solid #D2D2D2", padding: "5px 2px" }}
    >
      <Col>
      <EnkiMember url={followObj.url} hw={32} isLocal={Boolean(followObj?.actor_id && followObj.actor_id > 0)}
       account={followObj.account} avatar={followObj.avatar} manager={followObj?.manager??''} />

      </Col>
      <Col>
        {isEdit && loginsiwe && actor?.actor_account && !checkFollow() && (
          <EnKiFollow url={followObj.url} inbox={followObj.inbox} account={followObj.account} showText={true} />
        )}
      </Col>
      <Col>{followObj.createtime}(UTC+8)</Col>
    </Row>
  );
}
