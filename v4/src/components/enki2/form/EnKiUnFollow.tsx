import { Button } from "react-bootstrap";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch, setTipText, setErrText, setMyFollow } from "@/store/store";
import { useTranslations } from "next-intl";


/**
 * 取关按钮
 * @searObj 关注者信息 
 */

interface Props {
  searObj: ActorInfo;
}

export default function EnKiUnFollow({ searObj }: Props) {
  // const account: string | undefined = searObj.account;
  const [showBtn, setShowBtn] = useState<boolean>(true);

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

  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const t = useTranslations("ff");
  const myFollow = useSelector((state: RootState) => state.valueData.myFollow) as DaismFollow[];

  const unfollow = async () => {
    showTip(t("submittingText"));
    const res = await fetch("/api/activitepub/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({account: actor?.actor_account, url: searObj.url,inbox:searObj.inbox, id: searObj.id}),
    });
  
    if (res.ok) {
   
      closeTip();
      setShowBtn(false);
      const newMyFollow = myFollow.filter(
        (item: DaismFollow) =>
          item.actor_account?.toLowerCase() !== searObj.account?.toLowerCase()
      );
      window.sessionStorage.setItem("myFollow", JSON.stringify(newMyFollow));
      dispatch(setMyFollow(newMyFollow));
    } else {
      const re=await res.json();
      showClipError(re?.errMsg ?? "Unknown error");
      closeTip();
    }
  };

  return (
    <>
      {showBtn ? (
        <Button onClick={unfollow}>{t("cancelRegister")}</Button>
      ) : (
        <div>{t("alreadysubmitText")}...</div>
      )}
    </>
  );
}
