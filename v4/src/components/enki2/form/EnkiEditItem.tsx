import { useEffect, useState } from "react";
import { EditSvg, DeleteSvg, Pin, AnnounceSvg } from "../../../lib/jssvg/SvgCollection";
import { Nav, NavDropdown } from "react-bootstrap";
import ConfirmWin from "../../federation/ConfirmWin";
import { client } from "../../../lib/api/client";
import { useSelector, useDispatch } from "react-redux";
import {type RootState,setTipText,setMessageText} from "@/store/store";
import { useTranslations } from "next-intl";


// ==== props 类型 ====
interface EnkiEditItemProps {
  path: string;
  messageObj:EnkiMessType;
  delCallBack?: (type: string) => void;
  preEditCall: () => void;
  sctype: string;
  isEdit: boolean;
}

export default function EnkiEditItem({
  path,
  messageObj,
  delCallBack,
  preEditCall,
  sctype,
  isEdit
}: EnkiEditItemProps) {
  const [showLogin, setShowLogin] = useState(false);
  const t = useTranslations("ff");
  const tc = useTranslations("Common");
  const dispatch = useDispatch();
  const [isAn, setIsAn] = useState(false); //转发
  const [show, setShow] = useState(false);

  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(""));
  const showClipError = (str: string) => dispatch(setMessageText(str));
  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;

  const isAnnoce = () => {
    if (!actor?.actor_account || !actor.actor_account.includes("@")) return false;
    if (messageObj.actor_account === actor.actor_account) return false;
    if (messageObj.send_type === 9 && messageObj.receive_account === actor.actor_account) return false;
    if (process.env.NEXT_PUBLIC_DOMAIN !== actor.actor_account.split("@")[1]) return false;

    return true;
  };

  // 找是否已转发
  useEffect(() => {
    const controller = new AbortController();
    let _isAn = isAnnoce();
    if (_isAn) {
     
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/getData?id=${messageObj.message_id}&account=${actor?.actor_account}`,
             { signal: controller.signal,headers:{'x-method':'getAnnoce'} });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length === 0) setIsAn(true);
            else setIsAn(false);
          }
        } catch (err: any) {
          if (err.name === 'AbortError') return; // 请求被取消
        
        }
      };
      fetchData();
    } else setIsAn(false);

    return () => { controller.abort();};
  }, [messageObj,actor]);

  const handle = async (method: string, body: any) => {
    const res = await fetch("/api/siwe/getLoginUser?t=" + new Date().getTime());
    const res_data = await res.json();
    if (res_data.state !== 1) {
      setShowLogin(true);
      return;
    }
    showTip(t("submittingText"));
    const res1 = await client.post("/api/postwithsession", method, body);
    closeTip();
    if (res.status === 200) {
      if (typeof delCallBack === "function") delCallBack("del");
    } else {
      showClipError(
        `${tc("dataHandleErrorText")}!${res1?.statusText}\n ${
          res1?.data.errMsg ? res1?.data?.errMsg : ""
        }`
      );
    }
  };

  //置顶
  const handlePin = async (flag: number, id: string) => {
    showTip(t("submittingText"));
    const res = await client.post("/api/postwithsession", "setTopMessage", { sctype, flag, id });

    if (res.status === 200) {
      if (typeof delCallBack === "function") delCallBack("top");
      closeTip();
    } else {
      showClipError(
        `${tc("dataHandleErrorText")}!${res?.statusText}\n ${res?.data.errMsg ? res?.data?.errMsg : ""}`
      );
    }
  };

  //转发
  const handleAnnounce = async () => {
    const res = await fetch("/api/siwe/getLoginUser?t=" + new Date().getTime());
    const res_data = await res.json();
    if (res_data.state !== 1) {
      setShowLogin(true);
      return;
    }
    showTip(t("submittingText"));
    const re = await client.post("/api/postwithsession", "setAnnounce", {
      account: actor?.actor_account,
      toUrl: messageObj.actor_url,
      id: messageObj.message_id,
      linkurl: messageObj.link_url,
      content: messageObj.content,
      topImg: messageObj.top_img,
      vedioUrl: messageObj.vedio_url,
      sctype: messageObj.dao_id && messageObj.dao_id > 0 ? "sc" : "",
    });

    if (res.status === 200) {
      if (typeof delCallBack === "function") delCallBack("annoce");
      closeTip();
    } else {
      showClipError(
        `${tc("dataHandleErrorText")}!${re?.statusText}\n ${re?.data?.errMsg ? re?.data?.errMsg : ""}`
      );
    }
  };

  const isDelete =
    isEdit || (actor?.actor_account && messageObj?.receive_account && actor?.actor_account === messageObj.receive_account);

  const handleSelect = (eventKey: string | null) => {
    switch (eventKey) {
      case "1":
        preEditCall();
        break;
      case "2":
        setShow(true);
        break;
      case "3":
        handlePin(messageObj.is_top ? 0 : 1, messageObj.message_id);
        break;
      case "4":
        handleAnnounce();
        break;
      default:
        break;
    }
  };

  const deldiscussions = () => {
    handle("messageDel", {
      mid: messageObj?.message_id,
      account: messageObj?.actor_account,
      sctype,
      path,
      rAccount: messageObj?.receive_account ?? "",
    });
    setShow(false);
  };

  return (
    <>
        <Nav onSelect={handleSelect} style={{ display: "inline-block" }}>
          <NavDropdown title=" ......" active={false} drop= "up">
            <NavDropdown.Item disabled={!isEdit} eventKey="1">
              <span style={{ color: isEdit ? "black" : "gray" }}>
                <EditSvg size={24} /> {t("editText")}...
              </span>
            </NavDropdown.Item>
            <NavDropdown.Item disabled={!isDelete} eventKey="2">
              <span style={{ color: isDelete ? "black" : "gray" }}>
                <DeleteSvg size={24} /> {t("deleteText")}...
              </span>
            </NavDropdown.Item>
            {isAn && messageObj?.actor_account !== actor?.actor_account  && (
              <NavDropdown.Item eventKey="4">
                <span>
                  <AnnounceSvg size={24} /> {t("amouseText")}...
                </span>
              </NavDropdown.Item>
            )}
            <NavDropdown.Item disabled={!isEdit} eventKey="3">
              <span style={{ color: isEdit ? "black" : "gray" }}>
                <Pin size={24} /> {messageObj.is_top ? t("dropTopText") : t("setTopText")}...
              </span>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
     
      <ConfirmWin show={show} setShow={setShow} callBack={deldiscussions} question={t("deleteSureText")} />

    </>
  );
}
