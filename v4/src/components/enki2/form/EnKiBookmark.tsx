import { useState } from "react";
import { BookTap } from "@/lib/jssvg/SvgCollection";
import { useGetHeartAndBook } from "@/hooks/useMessageData";
import { client } from "../../../lib/api/client";
import { useSelector, useDispatch } from "react-redux";
import {
  type RootState,
  type AppDispatch,
  setTipText,
  setMessageText,
} from "@/store/store";
import { useTranslations } from "next-intl";
import {type HeartAndBookType } from '@/hooks/useMessageData'
import { Button } from "react-bootstrap";

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
    dispatch(setMessageText(str));
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
    let res = await client.post(
      "/api/postwithsession",
      "handleHeartAndBook",
      {
        account: actor?.actor_account,
        pid: currentObj?.message_id,
        flag,
        table: "bookmark",
        sctype: getSctype(),
      }
    );
    if (res.status === 200) setRefresh(!refresh);
    else
      showClipError(
        `${tc("dataHandleErrorText")}!${res.statusText}\n ${
          res.data.errMsg ? res.data.errMsg : ""
        }`
      );
    closeTip();
  };

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
