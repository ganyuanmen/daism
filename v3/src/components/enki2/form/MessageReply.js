
import React, { useImperativeHandle, useState, useRef, forwardRef, useEffect } from "react";
import { Modal, Button,Form } from 'react-bootstrap';
import { ReplySvg } from '../../../lib/jssvg/SvgCollection';
import Editor from "./Editor";
import RichEditor from "../../enki3/RichEditor";
import { useSelector, useDispatch } from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useTranslations } from 'next-intl'

/**
 * @currentObj 回复的嗯文对象
 * @addReplyCallBack 新增回复后的数据处理
 * @afterEditcall修改回复后的数据操作
 * @replyObj 修改的回复对象
 * @setReplyObj 新增回复时清空界面的值
 * @isEdit 是否允许回复
 * @data_index 嗯文列表的序号，用于直接从嗯文列表中添加回复时，更新回复总数
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 */

const MessageReply = forwardRef(({ currentObj, addReplyCallBack, afterEditcall,setReplyObj,
     replyObj,isEdit,data_index,accountAr,bid,setBid, isTopShow }, ref) => {

    const [showWin, setShowWin] = useState(false); //回复窗口显示
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')
    const tc = useTranslations('Common')
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
        // formData.append('rid', replyObj ? replyObj.id : 0);  //修改id 
        formData.append('rid', 0)
        formData.append('pid', currentObj.id);
        formData.append('bid', isTopShow?'':bid);
        formData.append('ppid', currentObj.message_id);
        formData.append('content', contentHTML); //，内容
        formData.append('actorid', actor?.id); //，回复者id
        formData.append('inbox', currentObj.actor_inbox); //，回复者id
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
                if (replyObj) afterEditcall.call(this,obj,data_index); //其实是新增，没有修改
                else addReplyCallBack.call(this,obj,data_index); 
            })
            .catch(error => {
                closeTip()
                showClipError(`${tc('dataHandleErrorText')}!${error}`)

            });
    }

 
    return (
        <>
            <Button variant="light" disabled={!(isEdit && currentObj?.is_discussion == 1)} onClick={() => {
                if(setBid) setBid(''); 
                setShowWin(true);
                if(setReplyObj) setReplyObj(null); //表示新增
                }}  title={t('replyText')}>  
                <ReplySvg size={24} />
                {currentObj.total}
            </Button>

            <Modal size='lg' className='daism-title' show={showWin} onHide={(e) => { setShowWin(false) }} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Check inline label={t('shortText')} name="regroup1" type='radio' checked={typeIndex===0} 
                    onChange={e=> {if(e.target.checked) setTypeIndex(0)}}  id='reinline-2' />
                    <Form.Check inline label={t('longText')} name="regroup1" type='radio' checked={typeIndex===1} 
                    onChange={e=> {if(e.target.checked) setTypeIndex(1)}}  id='reinline-1' />
                      <Form.Check inline label={t('isFixButton')} name="group1" type='radio' defaultChecked={typeIndex===2} onClick={e=>
                    {if(e.target.checked) setTypeIndex(2)}}  id='inline-3' />
                    </Form>
                    {typeIndex===0?<Editor  ref={editorRef} currentObj={null} nums={nums} accountAr={accountAr} showProperty={false} />
                    :<RichEditor  ref={richEditorRef} currentObj={null}  isFix={typeIndex===2}  />}
                    <div className='mt-2 mb-2' style={{ textAlign: 'center' }} >
                        <Button onClick={submit} variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button>
                    </div>
                </Modal.Body>
            </Modal>               
        </>
    )
});
export default React.memo(MessageReply);
