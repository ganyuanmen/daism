import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "./EnkiMember"
import ShowVedio from "./ShowVedio";
import EnKiFollow from "./EnKiFollow";
import { useState,useEffect } from "react";
import { useSelector } from 'react-redux';
import { DeleteSvg, ReplySvg } from "@/lib/jssvg/SvgCollection";
import { type RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import ConfirmWin from "@/components/federation/ConfirmWin";
// import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";


/**
 * 回复Item

 * @replyObj 回复内容
 * @delCallBack 删除回复后回调
 * @replyCallBack 修改回复前调用
 * @reply_index 回复列表中的序号
 */

  // props 类型
  interface ReplyItemProps {
    replyObj: DaismReplyType;
    delCallBack: (replyIndex: number,mid:string) => void;
    replyCallBack:(i:number, bid:string)=>void;
    reply_index: number; //回复的排序号 
    pleft: number; //左边距离
  }
  
  export default function ReplyItem({replyObj,delCallBack,replyCallBack,reply_index,pleft}: ReplyItemProps) {

    const [show,setShow]=useState(false)
    const [isFollow, setIsFollow] = useState(true); // 默认已关注

    const myFollow = useSelector((state: RootState) => state.valueData.myFollow);
    const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
    const actor = useSelector((state: RootState) => state.valueData.actor);
    const t = useTranslations('ff')
    
    //回复 该评论
    const replyHandle = (reply_index:number, bid: string) => {
        replyCallBack(reply_index,bid);
    };
  
    //删除
    const delHandle = () => {
      delCallBack(reply_index,replyObj.message_id);
      setShow(false);
      
    };
  
    useEffect(() => {
      const item = myFollow.find(
        (obj) =>
          obj.actor_account?.toLowerCase() ===
          replyObj?.actor_account?.toLowerCase()
      );
      // 本人不能关注本人 / 跨域不显示关注按钮
      if (
        item ||
        actor?.actor_account === replyObj.actor_account ||
        process.env.NEXT_PUBLIC_DOMAIN !== actor?.actor_account?.split("@")[1]
      )
        setIsFollow(true);
      else setIsFollow(false);
    }, [myFollow, actor, replyObj]);
  
    const isCanDelete = (): boolean => {
      if (!loginsiwe) return false;
      if (!actor?.actor_account || !actor.actor_account.includes("@")) return false;
      if (replyObj?.httpNetWork) return false; // 远程服务器不可回复
      return actor?.actor_account === replyObj.actor_account;
    };
  
    return ( <>
      <div
        style={{
          borderBottom: "1px solid #D2D2D2",
          width: "100%",
          paddingLeft: `${pleft}px`,
        }}
      >
        <div
          style={{ width: "100%", paddingLeft: "10px" }}
          className="d-inline-flex justify-content-between align-items-center"
        >
          <div style={{ width: "50%" }}>
            <EnkiMember url={replyObj.actor_url} account={replyObj.actor_account} avatar={replyObj.avatar} isLocal={false} hw={32} />
          </div>
          {loginsiwe && actor?.actor_account && (
            <div>
              <button
                onClick={() => replyHandle(reply_index, String(replyObj.bid))}
                className="daism-ff"
              >
                <ReplySvg size={24} />
              </button>
            </div>
          )}
          {!isFollow && (
            <div>
              <EnKiFollow  url={replyObj.actor_url} account={replyObj.actor_account} />
            </div>
          )}
  
          <div style={{ paddingRight: "10px" }}>
          {isCanDelete() && <button  style={{border:0}} onClick={()=>{setShow(true)}}  > <DeleteSvg   size={20} /></button> }
            <TimesItem_m currentObj={replyObj} />
          </div>
        </div>
        <div className="daism-reply-item" style={{ paddingBottom: "10px" }}>
          <div
            style={{ minHeight: "40px" }}
            dangerouslySetInnerHTML={{ __html: replyObj.content }}
          ></div>
          {replyObj?.content_link && (
            <div dangerouslySetInnerHTML={{ __html: replyObj.content_link }}></div>
          )}
          {replyObj?.top_img &&<ImageWithFallback src={replyObj?.top_img}  alt=""  style={{ maxWidth: "100%" }} />}
          {/* {replyObj?.top_img && (
            <Image
              className="mt-2 mb-2"
              alt=""
              src={replyObj.top_img}
              style={{ maxWidth: "100%" }}
            />
          )} */}
          {replyObj?.vedio_url && <ShowVedio videoUrl={replyObj.vedio_url} />}
        </div>
      </div>
      <ConfirmWin show={show} setShow={setShow} callBack={delHandle} question={t('deleteSureText')}/>
      </>
    );
  }

