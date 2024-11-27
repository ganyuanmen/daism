
import React, { useImperativeHandle, useState, useRef, forwardRef } from "react";
import { Modal, Button } from 'react-bootstrap';
import { ReplySvg, EditSvg } from '../../../lib/jssvg/SvgCollection';
import Editor from './Editor';


//回复按钮 isd 是否允许回复
const MessageReply = forwardRef(({ t, tc, actor, total, currentObj, addReplyCallBack, afterEditcall, replyObj, setReplyObj, showTip, closeTip, showClipError,isEdit }, ref) => {
    const [showWin, setShowWin] = useState(false); //回复窗口显示
    const editorRef = useRef()

    //用于从下拉菜单修改时显示调用
    useImperativeHandle(ref, () => ({ show: () => { setShowWin(true) }, }));

    const submit = async () => {
        let textValue = editorRef.current.getData()
        if (!textValue || textValue.length < 4) {
            editorRef.current.notValid(t('noEmptyle4'))
            return
        }
        setShowWin(false)
        showTip(t('submittingText'))

        const formData = new FormData();
        formData.append('rid', replyObj ? replyObj.id : 0);  //修改id 
        formData.append('pid', currentObj.id);
        formData.append('content', textValue); //，内容
        formData.append('actorid', actor.id); //，回复者id
        formData.append('sctype', currentObj.dao_id > 0 ? 'sc' : '');
        fetch(`/api/admin/addCommont`, {
            method: 'POST',
            headers: { encType: 'multipart/form-data' },
            body: formData
        })
            .then(async response => {
                closeTip()
                let re = await response.json()
                if (re.errMsg) { showClipError(re.errMsg); return }
                if (replyObj) afterEditcall();
                else addReplyCallBack.call();
            })
            .catch(error => {
                closeTip()
                showClipError(`${tc('dataHandleErrorText')}!${error}`)

            });
    }

 
    return (
        <>
            {(isEdit && currentObj?.is_discussion == 1) ? <div>
                <Button onClick={() => {
                    setShowWin(true);
                    setReplyObj(null); //表示新增
                }} variant="light"><EditSvg size={24} /> {t('replyText')} {total}
                </Button>

                <Modal size='lg' className='daism-title' show={showWin} onHide={(e) => { setShowWin(false) }} >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <Editor title={t('replyContent')} defaultValue={replyObj ? replyObj.content : ''} t={t} ref={editorRef} />
                        <div className='mt-2 mb-2' style={{ textAlign: 'center' }} >
                            <Button onClick={submit} variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
                : <div>{t('replyText')} {total}</div>
            }
        </>
    )
});
export default React.memo(MessageReply);
