"use client";
import { Button, Form } from "react-bootstrap";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTipText, setErrText } from "@/store/store";
import { SendSvg, BackSvg } from "../../lib/jssvg/SvgCollection";
import RichEditor from "./RichEditor";
import Editor from "../enki2/form/Editor";
import { useTranslations } from "next-intl";
import DaismInputGroup from "../form/DaismInputGroup";
import ShowLogin, {type ShowLoginRef}  from "./ShowLogin";
import { type RootState } from "@/store/store";


//currentObj,afterEditCall,addCallBack,accountAr,callBack}
// Props 类型
interface CreateMessProps {
  currentObj: EnkiMessType|null;
  afterEditCall: (obj: EnkiMessType) => void;
  addCallBack?: () => void;
  accountAr: AccountType[];
  refreshPage: () => void;
}

/**
 * 个人嗯文编辑
 * @currentObj 嗯文对象
 * @afterEditCall 修改嗯文后回调
 * @addCallBack 增加嗯文后回调
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @callBack 回退到主页处理 
 */

export default function CreateMess({currentObj,afterEditCall,addCallBack,accountAr,refreshPage}: CreateMessProps) {
  // const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  function showTip(str: string) {dispatch(setTipText(str));}
  function closeTip() {dispatch(setTipText(""));}
  function showClipError(str: string) {dispatch(setErrText(str));}
  const showLoginRef=useRef<ShowLoginRef>(null);
  const [typeIndex, setTypeIndex] = useState<number>(currentObj?.type_index ?? 0);

  // Refs
  const editorRef = useRef<any>(null);
  const richEditorRef = useRef<any>(null);
  const discussionRef = useRef<HTMLInputElement>(null);
  const sendRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<any>(null);
  // const inputRef=useRef();

  const nums = 500;
  const t = useTranslations("ff");
  const tc = useTranslations("Common");
  const actor = useSelector((state: RootState) => state.valueData.actor);

  const getHTML = (): string => {
    if (typeIndex === 0) {
      const contentText: string = editorRef.current.getData();
      if (!contentText || contentText.length < 10) {
        showClipError(t("contenValidText"));
        return "";
      }
      if (contentText.length > nums) {
        showClipError(`字数不能大于${nums}!`);
        return "";
      }

      const temp = contentText.replaceAll("\n", "</p><p>");
      return `<p>${temp}</p>`;
    } else {
      const contentHTML: string = richEditorRef.current.getData();
      if (!contentHTML || contentHTML.length < 10) {
        showClipError(t("contenValidText"));
        return "";
      }
      return contentHTML;
    }
  };

  const submit = async () => {
   if(!showLoginRef.current?.checkLogin()) return;

    const contentHTML = getHTML();
    if (!contentHTML) return;

    showTip(t("submittingText"));
    const formData = new FormData();

    if (currentObj?.message_id)
      formData.append("messageId", currentObj.message_id);

    formData.append("avatar", actor?.avatar ?? "");
    formData.append("account", actor?.actor_account ?? ""); //社交帐号
    formData.append(
      "vedioURL",
      (typeIndex === 0 ? editorRef : richEditorRef).current.getVedioUrl()
    ); //视频网址
    formData.append(
      "propertyIndex",
      (typeIndex === 0 ? editorRef : richEditorRef).current.getProperty()
    ); //
    formData.append(
      "accountAt",
      (typeIndex === 0 ? editorRef : richEditorRef).current.getAccount()
    ); //@用户
    formData.append(
      "textContent",
      typeIndex === 0
        ? contentHTML
        : richEditorRef.current.getTextContent()
    ); //文本
    formData.append("typeIndex", String(typeIndex)); //长或短
    formData.append("content", contentHTML); //html内容
    formData.append("actorid", String(actor?.id ?? ""));
    formData.append("title", titleRef.current.getData());
    formData.append("actorName", actor?.actor_name ?? "");
    formData.append("file", (typeIndex === 0 ? editorRef : richEditorRef).current.getImg()); // 图片
  
    formData.append("isSend", sendRef.current?.checked ? "1" : "0");
    formData.append("isDiscussion", discussionRef.current?.checked ? "1" : "0");
    // formData.append('tags',JSON.stringify(inputRef.current.getData()));

    fetch(`/api/admin/addMessage`, {
      method: "POST",
      headers: { encType: "multipart/form-data" },
      body: formData,
    })
      .then(async (response) => {
        closeTip();
        const obj = await response.json();
        if (obj.errMsg) {
          showClipError(obj.errMsg || "fail");
          return;
        }
        if (currentObj) afterEditCall(obj); //修改
        else if (typeof addCallBack === "function") addCallBack(); //新增加
      })
      .catch((error: unknown) => {
        closeTip();
        if (error instanceof Error) {
          showClipError(`${tc("dataHandleErrorText")}!${error.message}`);
        } else {
          showClipError(`${tc("dataHandleErrorText")}!${String(error)}`);
        }
      });
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <Form>
          <Form.Check
            inline
            label={t("shortText")}
            name="group1"
            type="radio"
            defaultChecked={typeIndex === 0}
            onClick={(e: any) => {
              if (e.target.checked) setTypeIndex(0);
            }}
            id="inline-2"
          />
          <Form.Check
            inline
            label={t("longText")}
            name="group1"
            type="radio"
            defaultChecked={typeIndex === 1}
            onClick={(e: any) => {
              if (e.target.checked) setTypeIndex(1);
            }}
            id="inline-1"
          />
        </Form>

        <DaismInputGroup
          horizontal={true}
          title={t("htmlTitleText")}
          ref={titleRef}
          defaultValue={currentObj ? currentObj.title : ""}
        />

        {typeIndex === 0 ? (
          <Editor
            ref={editorRef}
            currentObj={currentObj}
            nums={nums}
            accountAr={accountAr}
            showProperty={true}
          />
        ) : (
          <RichEditor
            ref={richEditorRef}
            currentObj={currentObj}
            accountAr={accountAr}
          />
        )}

        <div className="form-check form-switch  mt-3">
          <input
            ref={discussionRef}
            className="form-check-input"
            type="checkbox"
            id="isSendbox"
            defaultChecked={
              currentObj ? currentObj.is_discussion === 1 : true
            }
          />
          <label className="form-check-label" htmlFor="isSendbox">
            {t("emitDiscussion")}
          </label>
        </div>
        <div className="form-check form-switch mb-3 mt-3">
          <input
            disabled={true}
            ref={sendRef}
            className="form-check-input"
            type="checkbox"
            id="isDiscussionbox"
            defaultChecked={currentObj ? currentObj.is_send === 1 : true}
          />
          <label className="form-check-label" htmlFor="isDiscussionbox">
            {t("sendToFollow")}
          </label>
        </div>

        <div style={{ textAlign: "center" }}>
          <Button onClick={refreshPage} variant="light">
            <BackSvg size={24} /> {t("esctext")}
          </Button>{" "}
          <Button onClick={submit} variant="primary">
            <SendSvg size={24} /> {t("submitText")}
          </Button>
        </div>
      </div>
      <ShowLogin ref={showLoginRef} />
    </>
  );
}
