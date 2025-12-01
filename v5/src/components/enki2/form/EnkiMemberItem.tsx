import TimesItem from "../../federation/TimesItem";
import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "./EnkiMember";
import EnKiFollow from "./EnKiFollow";
import { useState, useEffect, useRef } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MoreBtn, Noreplay, PinTop } from "../../../lib/jssvg/SvgCollection";
import TipWindow from "../../federation/TipWindow";
import {useLocale, useTranslations} from 'next-intl';
import type { RootState } from "@/store/store";
import { useHonorData,type HonorItem } from "@/hooks/useHonorData";
import { SvgImage } from "@/components/SvgImage";
// import { setCache,getCache } from "@/lib/utils/windowCache";

interface EnkiMemberItemProps {
  messageObj: EnkiMessType;
}

// interface HonorObj {
//   tokensvg: string;
// }

export default function EnkiMemberItem({messageObj}: EnkiMemberItemProps) {
  // const [honor, setHonor] = useState<HonorObj[]>([]);
  // const [isTop, setIsTop] = useState<boolean>(!!messageObj.is_top);
  const [isFollow, setIsFollow] = useState<boolean>(true); // 默认已关注

  const myFollow = useSelector(
    (state: RootState) => state.valueData.myFollow
  );
  const actor = useSelector((state: RootState) => state.valueData.actor);
  const user = useSelector((state: RootState) => state.valueData.user);

  // const t = useTranslations("ff");
  const honor = useHonorData(messageObj.manager, messageObj.dao_id);

  useEffect(() => {
    const item = myFollow.find(
      (obj) =>
        obj.actor_account?.toLowerCase() ===
        messageObj?.actor_account?.toLowerCase()
    );
    // 本人不能关注本人；用户不在注册地登录的，设为已注册，不需要显示关注按钮
    if (
      item ||
      actor?.actor_account === messageObj.actor_account ||
     process.env.NEXT_PUBLIC_DOMAIN !== actor?.actor_account?.split("@")[1]
    )
      setIsFollow(true);
    else setIsFollow(false);
  }, [myFollow, actor, messageObj]);

  const isTip = (): boolean => {
    if (user.connected !== 1) return false;
    if (!messageObj.manager) return false;
    if (user.account.toLowerCase() === messageObj.manager.toLowerCase())
      return false;
    if (messageObj.message_id.startsWith("http")) return false;

    if (messageObj?.receive_account)
      return messageObj.send_type! > 0 && messageObj.send_type! < 3;
    else return true;
  };


  // useEffect(() => {
  //   const controller = new AbortController();
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(`/api/getData?did=${messageObj.manager}`,
  //          { signal: controller.signal,headers:{'x-method':'getMynft'} });
  //       if (res.ok) {
  //         const data = await res.json();
  //         if (Array.isArray(data)) setHonor(data.map((item: any) => ({ tokensvg: item.tokensvg })));
  //       }
  //     } catch (err: any) {
  //       if (err.name === 'AbortError') return; // 请求被取消
      
  //     }
  //   };
  
  //   if (messageObj.dao_id === 0 && messageObj.manager) {
  //     fetchData();

  //   }
  //   return () => { controller.abort();};
  // }, [messageObj]);

  const isforward=()=>{
    if(messageObj.send_type>7) return true;
    if(messageObj.send_type===0 && messageObj.receive_account) return true;
    return false;
  }

  return (
    <>
      {/* 桌面端 */}
      <div className="desktop-only ">
        <div
          style={{ width: "100%" }}
          className="d-inline-flex justify-content-between align-items-center"
        >
          <div style={{ width: "56%" }}>

          <EnkiMember url={messageObj.actor_url} isLocal={messageObj?.actor_id > 0}  account={messageObj.actor_account} 
          avatar={messageObj.avatar} manager={messageObj.manager} isForward={isforward()}
           REaccount={messageObj.receive_account} />
            
          </div>
          {isTip() && (
            <TipWindow owner={user.account} messageObj={messageObj}  />
          )}
          {honor.length > 0 && (
            <div>
              <Honor honor={honor} manager={messageObj.manager}  />
            </div>
          )}
           {messageObj.is_discussion!==1 && <span style={{color:'red'}}><Noreplay size={16} /></span>}
          {!isFollow && <div><EnKiFollow url={messageObj.actor_url} inbox={messageObj.actor_inbox} account={messageObj.actor_account} /></div>}
          {(messageObj.is_top === 1) && (
            <div>
              <PinTop size={24} />
            </div>
          )}
          <div style={{ paddingLeft: "4px" }}>
            <TimesItem currentObj={messageObj} />
          </div>
        </div>
      </div>

      {/* 移动端 */}
      <div className="mobile-only">
        <div
          style={{ width: "100%" }}
          className="d-inline-flex justify-content-between align-items-center"
        >
          <div style={{ width: "60%" }}>
          <EnkiMember url={messageObj.actor_url} isLocal={messageObj?.actor_id > 0}  account={messageObj.actor_account} 
          avatar={messageObj.avatar} manager={messageObj.manager} isForward={isforward()}
           REaccount={messageObj.receive_account} />
          </div>
          {isTip() && (
            <TipWindow owner={user.account} messageObj={messageObj} />
          )}
          {honor.length > 0 && (
            <div style={{ paddingLeft: "8px" }}>
              <Honor_m honor={honor} manager={messageObj.manager}  />
            </div>
          )}
          {!isFollow && <div><EnKiFollow  url={messageObj.actor_url} inbox={messageObj.actor_inbox} account={messageObj.actor_account} /></div>}
          <div style={{ paddingLeft: "4px" }}>
            <TimesItem_m currentObj={messageObj} />
          </div>
        </div>
      </div>
    </>
  );
}


function Honor({honor,manager}: {honor: HonorItem[]; manager: string}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("ff");
    const [show, setShow] = useState(false);
    const target = useRef<HTMLButtonElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }, []);

    if (honor.length === 3) {
      return honor.map((obj, idx) => (
        <SvgShow manager={manager} tokensvg={obj.tokensvg} key={`lk${idx}`} />
      ));
    } else if (honor.length > 2) {
      return (
        <>
          <SvgShow manager={manager} tokensvg={honor[0].tokensvg} />
          <SvgShow manager={manager} tokensvg={honor[1].tokensvg} />
          <button
            className="daism-ff"
            ref={target}
            onClick={() => setShow(!show)}
            title={t("moreText")}
          >
            <MoreBtn size={20} />
          </button>
          <Overlay ref={overlayRef} target={target.current} show={show} placement="bottom">
            {(props) => (
              <Tooltip id="overlay-example78" {...props}>
                {honor.map((obj, idx) => (
                  <SvgShow  manager={manager} tokensvg={obj.tokensvg} key={`lk${idx}`} />
                ))}
              </Tooltip>
            )}
          </Overlay>
        </>
      );
    } else {
      return honor.map((obj, idx) => (
        <SvgShow manager={manager}
          tokensvg={obj.tokensvg}
          key={`lk${idx}`}
        />
      ));
    }
  }


function Honor_m({honor, manager }: {honor: HonorItem[];  manager: string;}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const target = useRef<HTMLButtonElement | null>(null);
  const t = useTranslations("ff");

  const handleClickOutside = (event: MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <button
        className="daism-ff"
        ref={target}
        onClick={() => setShow(!show)}
        title={t("moreText")}
      >
        <MoreBtn size={20} />
      </button>
      <Overlay ref={overlayRef} target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example78" {...props}>
            {honor.map((obj, idx) => (
              <SvgShow  manager={manager} tokensvg={obj.tokensvg} key={`lk${idx}`} />
            ))}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

function SvgShow({tokensvg,manager}: {tokensvg: string; manager: string;}) {

    const locale = useLocale();

    // const svgToBase = (svgCode: string): string => {
    //     const utf8Bytes = new window.TextEncoder().encode(svgCode);
    //     return (
    //     "data:image/svg+xml;base64," +
    //     window.btoa(String.fromCharCode.apply(null, Array.from(utf8Bytes)))
    //     );
    // };

  return (
    <a href={`/${locale}/honortokens/${manager}`} aria-label="honor">
      <SvgImage svgCode={tokensvg} width={24} height={24} className="honor"  />
    </a>
  );
}
