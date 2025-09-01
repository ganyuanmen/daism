import { useState } from "react";
import { BookTap } from "@/lib/jssvg/SvgCollection";
import { useGetHeartAndBook } from "@/hooks/useMessageData";
import { client } from "../../../lib/api/client";
import { useSelector, useDispatch } from "react-redux";
import {
  type RootState,
  type AppDispatch,
  setTipText,
  setErrText,
} from "@/store/store";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";
import Loadding from "@/components/Loadding";
import ShowErrorBar from "@/components/ShowErrorBar";

interface EnKiBookmarkProps {
  isEdit: boolean;
  currentObj: EnkiMessType;
  path: string;
}


/**
 * 收藏嗯文
 */
export default function EnKiBookmark({
  isEdit,
  currentObj,
  path,
}: EnKiBookmarkProps) {
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

  const actor = useSelector((state: RootState) => state.valueData.actor);
  const t = useTranslations("ff");
  const tc = useTranslations("Common");
  const [refresh, setRefresh] = useState(false);

  const getSctype = (): string => {
    return path === "enki" || path === "SC"
      ? "sc"
      : path === "enkier"
      ? ""
      : currentObj?.dao_id && currentObj.dao_id > 0
      ? "sc"
      : "";
  };

  const resData = useGetHeartAndBook(actor?.actor_account,currentObj?.message_id,refresh,"bookmark",getSctype())  ;

  const submit = async (flag: 0 | 1) => {
    //0 取消收藏  1 收藏
    showTip(t("submittingText"));
    const upData={
      account: actor?.actor_account,
      pid: currentObj?.message_id,
      flag,
      table: "bookmark",
      sctype: getSctype(),
    };

    const re= await fetch("/api/postwithsession", {
      method: 'POST',
      headers: { 'x-method': 'handleHeartAndBook' },
      body: JSON.stringify(upData)
    });
    if(re.ok){
       setRefresh(!refresh);
    }else{
      const reData=await re.json();
      showClipError(`${tc("dataHandleErrorText")}!\n ${reData?.errMsg}`);
    }
    closeTip();

   
  };
const geneButton=()=>{
  return (
   <Button
      size="sm"
      variant="light"
      disabled={!isEdit}
      onClick={() => {
        submit(resData.data.pid ? 0 : 1);
      }}
      title={t("bookmastText")}
    >
      {resData.data.pid ? (
        <span style={{ color: "red" }}>
          <BookTap size={18} />
        </span>
      ) : (
        <BookTap size={18} />
      )}
      {resData.data.total}
    </Button>
  );
}
  return (
     <>
      {
        resData.status==='loading'?<Loadding isImg={true} spinnerSize="sm" />
        :resData.status==='failed'? <ShowErrorBar errStr={resData.error??'get data err'} />
        :geneButton()
      }
    </>
  );
}
