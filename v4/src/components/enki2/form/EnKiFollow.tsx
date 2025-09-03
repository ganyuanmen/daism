import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch, setTipText, setErrText, setMyFollow } from "@/store/store";
import { useTranslations } from "next-intl";
import { Follow } from "../../../lib/jssvg/SvgCollection";
import { Button } from "react-bootstrap";


interface Props {
  url:string; //被关注者url
  account:string; //被关注者帐号
  showText?: boolean; //显示文字，不显示按钮
}

export default function EnKiFollow({ url,account, showText = false }: Props) {

  const [showBtn, setShowBtn] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(""));
  }
  function showClipError(str: string) {
    dispatch(setErrText(str));
  }

  const myFollow = useSelector((state: RootState) => state.valueData.myFollow) as DaismFollow[];
  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const t = useTranslations("ff");

  const followHandle = async () => {
    showTip(t("submittingText"));

    const body = {
      account: actor.actor_account,  // 本地用户账号
      url
    };
    
    fetch("/api/activitepub/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 必须，告诉服务端这是 JSON
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(data => {
        if (data.msg === "ok") {
          closeTip();
          setShowBtn(false);
          const newFollowList = [...myFollow, { actor_account: account }];
          window.sessionStorage.setItem("myFollow", JSON.stringify(newFollowList));
          dispatch(setMyFollow(newFollowList));
        } else {
          closeTip();
          showClipError(data.errMsg);
        }
      })
      .catch(() =>{ 
        closeTip();
        showClipError("Unknown error occurred");
      });

 
  };

  return (
    <>
      {showText ? (
        <>
          {showBtn ? (
            <Button onClick={followHandle}>{t("follow")}</Button>
          ) : (
            <div>{t("alreadysubmitText")}...</div>
          )}
        </>
      ) : (
        <>
          {showBtn && (
            <button className="daism-ff" onClick={followHandle} title={t("follow")}>
              <Follow size={24} />
            </button>
          )}
        </>
      )}
    </>
  );
}
