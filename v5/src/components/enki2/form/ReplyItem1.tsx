import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "./EnkiMember"
import { useState,useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { DeleteSvg, Down, ReplySvg, Up } from "@/lib/jssvg/SvgCollection";
import { type RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import ConfirmWin from "@/components/federation/ConfirmWin";
import { Button } from "react-bootstrap";
import ShowAddress from "@/components/ShowAddress";
import GeneImg from "@/components/enki3/GeneImg";


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
    user:DaismUserInfo;
  }
  
  export default function ReplyItem1({replyObj,delCallBack,replyCallBack,reply_index,pleft,user}: ReplyItemProps) {

    const [show,setShow]=useState(false)
    const [exPandID,setExPandID]=useState(''); //扩展的ID
    const t = useTranslations('ff')
    const [showToggle, setShowToggle] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = contentRef.current;
      if (el && el.scrollHeight > 200) {
        setShowToggle(true);
      }
    }, []);
  
    
    //回复 该评论
    const replyHandle = (reply_index:number, bid: string) => {
        replyCallBack(reply_index,bid);
    };
  
    //删除
    const delHandle = () => {
      delCallBack(reply_index,replyObj.message_id);
      setShow(false);
      
    };
  

  
    const isCanDelete = (): boolean => {
      if(user.connected===1 && user.account===replyObj.manager) return true; else return false;
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
            { replyObj.actor_account?
            <EnkiMember url={replyObj.actor_url}  manager={replyObj.manager}  account={replyObj.actor_account}
             avatar={replyObj.avatar} 
            isLocal={false} hw={32} />:<div className="mt-2 mb-2" style={{display:'flex',alignItems:'center',justifyContent:'start'}} >
                 <GeneImg avatar="./user.svg" hw={32} />
                  <ShowAddress address={replyObj.manager} />
            </div>
            
           
  }
          </div>
        
        {/* {user.connected===1 && <div>
              <button
                onClick={() => replyHandle(reply_index, String(replyObj.bid))}
                className="daism-ff"
              >
                <ReplySvg size={24} />
              </button>
            </div>
  } */}

          <div style={{ paddingRight: "10px" }}>
          {/* {isCanDelete() && <button  style={{border:0}} onClick={()=>{setShow(true)}}  > <DeleteSvg   size={20} /></button> } */}
            <TimesItem_m currentObj={replyObj} />
          </div>
        </div>
        <div className="daism-reply-item" style={{ paddingBottom: "10px" }}>
          <div ref={contentRef} className={replyObj.message_id===exPandID?'':'daism-expand'} style={{ minHeight: "40px", }}
            dangerouslySetInnerHTML={{ __html: replyObj.content }}/>
        
          {showToggle && (
          <Button
            variant="light"
            onClick={() => setExPandID(exPandID?'':replyObj.message_id)}
            style={{ position: "absolute", right: 0, bottom: 0 }}
            title={t("showmore")}
          >
           {exPandID?<Up size={24} />:<Down size={24}/> }
            
          </Button>
        )}
        
        </div>
      </div>
      <ConfirmWin show={show} setShow={setShow} callBack={delHandle} question={t('deleteSureText')}/>
      </>
    );
  }

