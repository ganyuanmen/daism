import EnkiMemberItem from "../enki2/form/EnkiMemberItem";
import MessageReply from "../enki2/form/MessageReply";
import EnKiBookmark from "../enki2/form/EnKiBookmark";
import EnKiHeart from "../enki2/form/EnKiHeart";
import EnkiShare from "../enki2/form/EnkiShare";
import ShowVedio from "../enki2/form/ShowVedio";
import {useState, useEffect, useCallback, useRef } from "react";
import { Down } from "@/lib/jssvg/SvgCollection";
import EnkiEditItem from "../enki2/form/EnkiEditItem";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import ShowAddress from "../ShowAddress";
import Image from "next/image";
import ImageWithFallback from "../ImageWithFallback";

// ========== 类型定义 ==========
interface ActorType {
  actor_account?: string;
  domain?: string;
  manager?: string;
}

interface ContentdivProps {
  path: string;
  messageObj: EnkiMessType;
  setCurrentObj: (obj: EnkiMessType) => void;
  filterTag?: (param: string) => void;
  setActiveTab: (index: number) => void;
  replyAddCallBack: (index: number) => void;
  refreshPage: () => void;
  afterEditCall: (obj: EnkiMessType) => void;
  data_index: number;  //嗯文列表中的序号
  daoData?: DaismDao[]|null;
  tabIndex: number;
}


/**
 * 列表中的单个嗯文
 * @path enki/enkier 
 * @env 环境变量
 * @locale zh/cn
 * @messageObj 嗯文对象
 * @setCurrentObj 设置当前嗯文
 * @setActiveTab 主页模块显示
 * @replyAddCallBack 回复增加后回调
 * @delCallBack 删除嗯文后回调
 * @afterEditCall 修改嗯文后回调
 * @data_index 主页嗯文列表中的当前序号
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @daoData 个人所属的smart common 集合
 */

export default function Contentdiv({
  path,
  messageObj,
  setCurrentObj,
  filterTag,
  setActiveTab,
  replyAddCallBack,
  refreshPage,
  afterEditCall,
  data_index,
  daoData,
  tabIndex,
}: ContentdivProps) {
  const actor = useSelector((state: any) => state.valueData.actor as ActorType);
  const loginsiwe = useSelector((state: any) => state.valueData.loginsiwe);
  const t = useTranslations("ff");
  const [divContent, setDivContent] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  // // 提取内容 & 判断是否显示“展开更多”
  // const handleDivRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (node !== null) {
  //       setDivContent(node?.textContent?.slice(0, 120).replaceAll("\n", "") || null);
  //       if (node.scrollHeight > 400) setShowBtn(true);
  //     }
  //   },
  //   [messageObj]
  // );

  const handleDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = handleDivRef.current;
    if (node !== null) {
      setDivContent(node?.textContent?.slice(0, 120).replaceAll("\n", "") || null);
      if (node.scrollHeight > 400) setShowBtn(true);
    }
  }, [messageObj]);


         
    //新增加回复
    const addReplyCallBack=()=>{
      replyAddCallBack(data_index)
  }

  useEffect(() => {
    const checkIsEdit = (): boolean => {
      if (!loginsiwe) return false;
      if (!messageObj?.actor_account || !messageObj?.actor_account.includes("@")) return false;
      if (!actor?.actor_account || !actor?.actor_account.includes("@")) return false;

      // 远程不可修改
      if (process.env.NEXT_PUBLIC_DOMAIN !== messageObj.actor_account.split("@")[1]) return false;

      if (messageObj.dao_id && messageObj.dao_id > 0) {
        // SC
        if (path !== "enki") return false;
        if(daoData){
          const _member = daoData.find((obj) => obj.dao_id === messageObj.dao_id);
          if (_member) return true;
        }
      } else {
        // 个人
        if (path !== "enkier") return false;
        if (actor?.actor_account.split("@")[1] !== process.env.NEXT_PUBLIC_DOMAIN) return false;

        if (messageObj.send_type === 0) {
          if (actor?.actor_account === messageObj.actor_account) return true;
        }
      }

      // 超级管理员
      if (
        actor?.manager?.toLowerCase() ===
        (process.env.NEXT_PUBLIC_ADMI_ACTOR as string)?.toLowerCase()
      )
        return true;

      return false;
    };

    setIsEdit(checkIsEdit());
  }, [actor, messageObj,path,loginsiwe,daoData]);

  // 是否允许回复、点赞、收藏
  const ableReply = (): boolean => {
    if (!loginsiwe || !actor?.actor_account) return false;
    if (messageObj?.httpNetWork) return false;
    return true;
  };

  const months = t("monthText").split(",");
  const getMonth = () => {
    let m ;
    if(messageObj?.start_time) m= new Date(messageObj.start_time);
    else m=new Date();
    return months[m.getMonth()];
  };
  const getDay = () => {
    let m ;
    if(messageObj?.start_time) m= new Date(messageObj.start_time);
    else m=new Date();
    return m.getDate();
  };

  const bStyle: React.CSSProperties = {
    width: "80px",
    position: "absolute",
    top: "0",
    left: "0",
    borderRadius: "0.3rem",
    backgroundColor: "white",
  };

  // 标签替换
  const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
  const replacedText = messageObj?.content.replace(regex, (match, p1) => {
    const escapedParam = p1.replace(/"/g, "&quot;");
    return `<span class="tagclass" data-param="${escapedParam}">#${p1}</span>`;
  });

  // 点击处理
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("tagclass")) {
        const param = target.dataset.param;
        if (param) {
          filterTag?.(param);
        } else {
          afterEditCall(messageObj);
        }
      } else {
        afterEditCall(messageObj);
      }
    },
    [messageObj, afterEditCall, filterTag]
  );

  return (
    <div
      id={`item-${messageObj.id}`}
      style={{ padding: "10px", borderBottom: "1px solid #D9D9E8" }}
    >
      <EnkiMemberItem messageObj={messageObj} />

      <div
        style={{ position: "relative" }}
        className="daism-a mt-2 mb-3"
        onClick={handleClick}
      >
        <div
          className="daismCard"
          ref={handleDivRef}
          style={
            messageObj._type === 1
              ? { paddingLeft: "90px", minHeight: "80px", maxHeight: "400px", overflow: "hidden" }
              : { maxHeight: "400px", overflow: "hidden" }
          }
          dangerouslySetInnerHTML={{ __html: replacedText }}
        />
        {messageObj._type === 1 && (
          <div className="border" style={bStyle}>
            <div
              style={{ borderRadius: "0.3rem 0.3rem 0 0", backgroundColor: "red", height: "26px" }}
            ></div>
            <div className="fs-4" style={{ textAlign: "center" }}>
              <strong>
                {getDay()}
                {t("dayText")}
              </strong>
            </div>
            <div className="fs-7 mb-2" style={{ textAlign: "center" }}>
              <strong>{getMonth()}</strong>
            </div>
          </div>
        )}
        {showBtn && (
          <Button
            variant="light"
            onClick={handleClick}
            style={{ position: "absolute", right: 0, bottom: 0 }}
            title={t("showmore")}
          >
            <Down size={24} />...
          </Button>
        )}
      </div>

      {messageObj?.content_link && (
        <div dangerouslySetInnerHTML={{ __html: messageObj.content_link }} />
      )}
      {messageObj?.top_img && (
        <div className="image-container">
          {messageObj?.top_img &&<ImageWithFallback src={messageObj?.top_img}  alt="" 
           onClick={() => afterEditCall(messageObj)}  className="daism-a mt-2 mb-2" style={{ maxWidth: "100%" }} />}
          {/* <Image
            onClick={() => afterEditCall(messageObj)}
            className="daism-a mt-2 mb-2"
            alt=""
            src={messageObj.top_img}
          /> */}
        </div>
      )}
      {messageObj?.vedio_url && <ShowVedio videoUrl={messageObj.vedio_url} />}

      {/* 发起者 */}
      {messageObj?.self_account && (
        <div className="d-flex align-items-center mt-1">
          <div className="d-inline-flex align-items-center">
            <span style={{ display: "inline-block", paddingRight: "4px" }}>{t("proposedText")}:</span>
            <ImageWithFallback src={messageObj.self_avatar} width={32} height={32} alt="=" />
            {/* {messageObj?.self_avatar && <Image alt="" width={32} height={32} src={messageObj.self_avatar}  style={{borderRadius:'10px'}}
              onError={(e) => {
                // 图片加载失败时使用默认logo
                const target = e.target as HTMLImageElement;
                target.src = '/user.svg';
              }}
            />
            } */}
          
          </div>
          <div
            style={{ flex: 1 }}
            className="d-flex flex-column flex-md-row justify-content-between "
          >
            <span>{messageObj?.self_account}</span>
            <div>
              <ShowAddress address={messageObj?.manager} />
            </div>
          </div>
        </div>
      )}

      <div
        className="d-flex justify-content-between align-items-center"
        style={{ padding: "4px 8px" }}
      >
    
        <MessageReply currentObj={messageObj} isEdit={ableReply()} isTopShow={true} addReplyCallBack={addReplyCallBack} />

        <EnKiHeart
          isEdit={ableReply() && actor?.domain === process.env.NEXT_PUBLIC_DOMAIN}
          currentObj={messageObj}
          path={path}
        />
        <EnKiBookmark
          isEdit={ableReply() && actor?.domain === process.env.NEXT_PUBLIC_DOMAIN}
          currentObj={messageObj}
          path={path}
        />

        {divContent && <EnkiShare content={divContent} currentObj={messageObj} />}

 
        {path !== "SC" && actor?.domain === process.env.NEXT_PUBLIC_DOMAIN && (
          <EnkiEditItem
            path={path}
            isEdit={isEdit}
            messageObj={messageObj}
            refreshPage={refreshPage}
            preEditCall={() => {
              setCurrentObj(messageObj);
              setActiveTab(tabIndex);
            }}
          />
        )}
      </div>
    </div>
  );
}