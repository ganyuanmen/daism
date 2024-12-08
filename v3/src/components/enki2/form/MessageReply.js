
import React, { useImperativeHandle, useState, useRef, forwardRef, useEffect } from "react";
import { Modal, Button,Form } from 'react-bootstrap';
import { ReplySvg } from '../../../lib/jssvg/SvgCollection';
import Editor from "./Editor";
import RichEditor from "../../enki3/RichEditor";

//addReplyCallBack 新增后的回调 data_index 从列表中新增的列表序号，用于更新前端 reply_index修改列表序号
//回复按钮 isd 是否允许回复
const MessageReply = forwardRef(({ t, tc, actor, total, currentObj, addReplyCallBack, afterEditcall,
     replyObj, setReplyObj, showTip, closeTip, showClipError,isEdit,data_index,accountAr }, ref) => {

    const [showWin, setShowWin] = useState(false); //回复窗口显示

    const [typeIndex,setTypeIndex]=useState(0)
    const editorRef=useRef(); 
    const richEditorRef=useRef(); 
    const nums=500;

    useEffect(()=>{
        if(replyObj?.type_index) setTypeIndex(replyObj.type_index);
        else setTypeIndex(0);
        },[replyObj])

    //用于从下拉菜单修改时显示调用
    useImperativeHandle(ref, () => ({ show: () => { setShowWin(true) }, }));

    const getHTML=()=>{
        if(typeIndex===0){
            const contentText = editorRef.current.getData();
            if (!contentText || contentText.length < 4) {
                showClipError(t('noEmptyle4'));
                return '';
            }
            if (contentText.length >nums) {
                   showClipError(`字数不能大于${nums}!`);
                   return '';
            }
      
            let temp=contentText.replaceAll('\n','</p><p>')
            return `<p>${temp}</p>`;
        } else {
            const contentHTML =richEditorRef.current.getData();
            if (!contentHTML || contentHTML.length < 10) {
                showClipError(t('contenValidText'));
                return '';
            }
            return contentHTML;
        }
    }

    const submit = async () => {
        const contentHTML = getHTML();
        if(!contentHTML) return;
        setShowWin(false)
        showTip(t('submittingText'))
        const formData = new FormData();
        formData.append('rid', replyObj ? replyObj.id : 0);  //修改id 
        formData.append('pid', currentObj.id);
        formData.append('content', contentHTML); //，内容
        formData.append('actorid', actor.id); //，回复者id
        formData.append('account', actor.actor_account); //，回复者id
        formData.append('sctype', currentObj.dao_id > 0 ? 'sc' : '');
        formData.append('typeIndex', typeIndex);  //长或短
        formData.append('vedioURL',(typeIndex===0?editorRef:richEditorRef).current.getVedioUrl());  //视频网址
        formData.append('image',(typeIndex===0?editorRef:richEditorRef).current.getImg()); //图片
        formData.append('fileType',(typeIndex===0?editorRef:richEditorRef).current.getFileType()); //后缀名

        fetch(`/api/admin/addCommont`, {
            method: 'POST',
            headers: { encType: 'multipart/form-data' },
            body: formData
        })
            .then(async response => {
                closeTip()
                let obj = await response.json()
                if (obj.errMsg) { showClipError(obj.errMsg); return }
                if (replyObj) afterEditcall.call(this,{...replyObj,...obj});
                else addReplyCallBack.call(this,obj,data_index); 
            })
            .catch(error => {
                closeTip()
                showClipError(`${tc('dataHandleErrorText')}!${error}`)

            });
    }

 
    return (
        <>
            <button type="button" disabled={!(isEdit && currentObj?.is_discussion == 1)} onClick={() => {setShowWin(true);
                if(setReplyObj) setReplyObj(null); //表示新增
                }} className="btn btn-light" data-bs-toggle="tooltip" data-bs-html="true" title={t('replyText')}>  
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"  aria-hidden="true"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"></path></svg>
                {total}
            </button>

            <Modal size='lg' className='daism-title' show={showWin} onHide={(e) => { setShowWin(false) }} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Check inline label={t('shortText')} name="regroup1" type='radio' checked={typeIndex===0} 
                    onChange={e=> {if(e.target.checked) setTypeIndex(0)}}  id='reinline-2' />
                    <Form.Check inline label={t('longText')} name="regroup1" type='radio' checked={typeIndex===1} 
                    onChange={e=> {if(e.target.checked) setTypeIndex(1)}}  id='reinline-1' />
                    </Form>
                    {typeIndex===0?<Editor  ref={editorRef} currentObj={replyObj} t={t} tc={tc} nums={nums} accountAr={accountAr} actor={actor} showProperty={false} />
                    :<RichEditor  ref={richEditorRef} currentObj={replyObj} t={t} tc={tc} accountAr={accountAr} actor={actor} showProperty={false} />}
                    <div className='mt-2 mb-2' style={{ textAlign: 'center' }} >
                        <Button onClick={submit} variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button>
                    </div>
                </Modal.Body>
            </Modal>               
        </>
    )
});
export default React.memo(MessageReply);
