"use client";
import React, { useImperativeHandle, useState, useRef, forwardRef, useEffect } from "react";
import { Modal, Button,Form } from 'react-bootstrap';
import { ReplySvg } from '@/lib/jssvg/SvgCollection';
import Editor from "./Editor";
import RichEditor from "../../enki3/RichEditor";
import { useSelector, useDispatch } from 'react-redux';
import {setTipText,setErrText} from '@/store/store';
import { useTranslations } from 'next-intl'
import ShowLogin, { ShowLoginRef } from "@/components/enki3/ShowLogin";

/**
 * @currentObj 回复的嗯文对象
 * @addReplyCallBack 新增回复后的数据处理
 * @afterEditcall修改回复后的数据操作
 * @replyObj 修改的回复对象
 * @setReplyObj 新增回复时清空界面的值
 * @isEdit 是否允许回复
 * @data_index 嗯文列表的序号，用于直接从嗯文列表中添加回复时，更新回复总数
 * @isTopShow 从Contentdiv 回复，对嗯文回复 
 */
// 子组件暴露给父组件的方法
export interface MessageReplyRef {
    show: (v:string) => void;
  }
  
  // Props 类型
  interface MessageReplyProps {
    currentObj: EnkiMessType; // 回复的嗯文对象
    addReplyCallBack: (obj?: DaismReplyType,isNew?:boolean) => void;
    isEdit: boolean;
    // bid?:string; //回复评论的排序号
    // setBid?:(v:string)=>void;
    isTopShow?: boolean;  //true首页回复按钮，false进到嗯文明细后回复按钮
  }
  
  const MessageReply = forwardRef<MessageReplyRef, MessageReplyProps>(
    (
      {
        currentObj,
        addReplyCallBack,
        isEdit,
        // bid,
        // setBid,
        isTopShow = false,
      },
      ref
    ) => {
      const [bid,setBid]=useState(''); // '' 新增加， 非空，对评论的回复排序号
      const [showWin, setShowWin] = useState(false); // 回复窗口显示
      const dispatch = useDispatch();
      function showTip(str: string) {
        dispatch(setTipText(str));
      }
      function closeTip() {
        dispatch(setTipText(""));
      }
      function showClipError(str: string) {
        dispatch(setErrText(str));
      }
      const actor = useSelector((state: any) => state.valueData.actor);
      const t = useTranslations("ff");
      const tc = useTranslations("Common");
      const [typeIndex, setTypeIndex] = useState<number>(0);  //0 短文 1 长文
      const editorRef = useRef<any>(null);
      const richEditorRef = useRef<any>(null);
      const nums = 500;
  
      const loginRef=useRef<ShowLoginRef>(null);
      
      // 用于从下拉菜单修改时显示调用
      useImperativeHandle(ref, () => ({
        show: (v:string) => {
          setShowWin(true);
          setBid(v);
        },
      }));
  
      const getHTML = (): string => {
        if (typeIndex === 0) { //短文 加上html 标签，有字数限制
          const contentText: string = editorRef.current.getData();
          if (!contentText || contentText.length < 4) {
            showClipError(t("noEmptyle4"));
            return "";
          }
          if (contentText.length > nums) {
            showClipError(`字数不能大于${nums}!`);
            return "";
          }
  
          let temp = contentText.replaceAll("\n", "</p><p>");
          return `<p>${temp}</p>`;
        } 
        else { //长文 无字数限制
          const contentHTML: string = richEditorRef.current.getData();
          if (!contentHTML || contentHTML.length < 10) {
            showClipError(t("contenValidText"));
            return "";
          }
          return contentHTML;
        }
      };
  
      const submit = async () => {
        if(!loginRef.current?.checkLogin()) return;
        const contentHTML = getHTML();
        if (!contentHTML) return;
        setShowWin(false);
        showTip(t("submittingText"));
        const formData = new FormData();
  
        formData.append("bid", isTopShow ? "" : bid);
        formData.append("pid", currentObj.message_id);
        formData.append("account", currentObj.actor_account);
        formData.append("content", contentHTML); // 内容
        formData.append("actorid", actor?.id??0); // 回复者id
        formData.append("inbox", currentObj.actor_inbox); // 回复者id
        formData.append("sctype", currentObj.dao_id > 0 ? "sc" : "");
        formData.append("typeIndex", String(typeIndex)); // 长或短
        formData.append("vedioURL",(typeIndex === 0 ? editorRef : richEditorRef).current.getVedioUrl()); // 视频网址
        formData.append("file", (typeIndex === 0 ? editorRef : richEditorRef).current.getImg()); // 图片
        
        fetch(`/api/admin/addCommont`, {
          method: "POST",
          // headers: { encType: "multipart/form-data" },
          body: formData,
        })
          .then(async (response) => {
            closeTip();
            let obj = await response.json();
            if (obj.errMsg) {
              showClipError(obj.errMsg);
              return;
            }
           
             addReplyCallBack(obj,!!bid);
          })
          .catch((error) => {
            closeTip();
            showClipError(`${tc("dataHandleErrorText")}!${error}`);
          });
      };
  
      return (
        <>
          <Button
            variant="light"
            disabled={!(isEdit && currentObj?.is_discussion == 1)}
            onClick={() => {  //直接点击， 非show方式
              setBid('') //新增加，非对评论的回复
              setShowWin(true);
            }}
            title={t("replyText")}
          >
            <ReplySvg size={24} />
            {currentObj.total}
          </Button>
  
          <Modal
            size="lg"
            className="daism-title"
            show={showWin}
            onHide={() => {
              setShowWin(false);
            }}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Check
                  inline
                  label={t("shortText")}
                  name="regroup1"
                  type="radio"
                  checked={typeIndex === 0}
                  onChange={(e) => {
                    if (e.target.checked) setTypeIndex(0);
                  }}
                  id="reinline-2"
                />
                <Form.Check
                  inline
                  label={t("longText")}
                  name="regroup1"
                  type="radio"
                  checked={typeIndex === 1}
                  onChange={(e) => {
                    if (e.target.checked) setTypeIndex(1);
                  }}
                  id="reinline-1"
                />
              </Form>
              
              {typeIndex === 0 ? (
                <Editor ref={editorRef}  nums={nums} showProperty={false} />
              ) : (
                <RichEditor ref={richEditorRef}  />
              )}
              <div className="mt-2 mb-2" style={{ textAlign: "center" }}>
                <Button onClick={submit} variant="primary">
                  <ReplySvg size={16} /> {t("replyText")}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
          <ShowLogin ref={loginRef} />
        </>
      );
    }
  );
  
  export default React.memo(MessageReply);