import {Button,Form,Popover,OverlayTrigger} from "react-bootstrap";
import { useRef, useState } from 'react';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData';
import { SendSvg,BackSvg } from "../../lib/jssvg/SvgCollection";
import RichEditor from "./RichEditor";
import Editor from "../enki2/form/Editor";
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';
// import TagShow from "./TagShow";
/**
 * 个人嗯文编辑
 * @currentObj 嗯文对象
 * @afterEditCall 修改嗯文后回调
 * @addCallBack 增加嗯文后回调
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @callBack 回退到主页处理 
 */
export default function CreateMess({currentObj,afterEditCall,addCallBack,accountAr,callBack}) {
    
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const [typeIndex,setTypeIndex]=useState(currentObj?.type_index?currentObj.type_index:0)
    const editorRef=useRef(); 
    const richEditorRef=useRef(); 
    const discussionRef=useRef();
    const sendRef=useRef();
    // const inputRef=useRef();
    const nums=500;
    const t = useTranslations('ff')
    const tc = useTranslations('Common')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息

    const getHTML=()=>{
        if(typeIndex===0){
            const contentText = editorRef.current.getData();
            if (!contentText || contentText.length < 10) {
                showClipError(t('contenValidText'));
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

    const submit=async ()=>{ 
        const contentHTML = getHTML();
        if(!contentHTML) return;

     
        showTip(t('submittingText'))  
        const formData = new FormData();
        formData.append('id', currentObj?currentObj.id:0);  
        formData.append('account',actor.actor_account); //社交帐号
        formData.append('vedioURL',(typeIndex===0?editorRef:richEditorRef).current.getVedioUrl());  //视频网址
        formData.append('propertyIndex',(typeIndex===0?editorRef:richEditorRef).current.getProperty());  //
        formData.append('accountAt',(typeIndex===0?editorRef:richEditorRef).current.getAccount());  //@用户
        formData.append('textContent', typeIndex===0?'':richEditorRef.current.getTextContent());  //文本
        formData.append('typeIndex', typeIndex);  //长或短
        formData.append('content', contentHTML); //，html内容
        formData.append('actorid', actor.id);
        formData.append('image',(typeIndex===0?editorRef:richEditorRef).current.getImg()); //图片
        formData.append('fileType',(typeIndex===0?editorRef:richEditorRef).current.getFileType()); //后缀名
        formData.append('isSend',sendRef.current.checked?1:0);
        formData.append('isDiscussion',discussionRef.current.checked?1:0);
        // formData.append('tags',JSON.stringify(inputRef.current.getData()));

     
        fetch(`/api/admin/addMessage`, {
            method: 'POST',
            headers:{encType:'multipart/form-data'},
            body: formData
        })
        .then(async response => {
        closeTip()
        let obj=await response.json()
        if(obj.errMsg) { showClipError(obj.errMsg|| 'fail'); return }
        if(currentObj) afterEditCall.call(this,obj)  //修改回调
        else addCallBack.call(this); //新增回调
        })
        .catch(error => {
        closeTip()
        showClipError(`${tc('dataHandleErrorText')}!${error}`)
        });   
    }

    return (
      <div style={{padding:'20px'}} >
          <Form>
                <Form.Check inline label={t('shortText')} name="group1" type='radio' defaultChecked={typeIndex===0} onClick={e=>
                    {if(e.target.checked) setTypeIndex(0)}}  id='inline-2' />
                <Form.Check inline label={t('longText')} name="group1" type='radio' defaultChecked={typeIndex===1} onClick={e=>
                    {if(e.target.checked) setTypeIndex(1)}}  id='inline-1' />
            </Form>
        {typeIndex===0?<Editor  ref={editorRef} currentObj={currentObj} nums={nums} accountAr={accountAr} showProperty={true} />
        :<RichEditor  ref={richEditorRef} currentObj={currentObj} accountAr={accountAr} />}
     
        {/* <TagShow ref={inputRef} cid={currentObj?.id} type='' t={t} /> */}
        <div className="form-check form-switch  mt-3">
            <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?(currentObj.is_discussion===1?true:false):true} />
            <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
        </div>
        <div className="form-check form-switch mb-3 mt-3">
            <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?(currentObj.is_send===1?true:false):true} />
            <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
        </div>
        
        <div style={{textAlign:'center'}} >
            <Button  onClick={callBack}  variant="light"> <BackSvg size={24} />  {t('esctext')} </Button> {' '}
            <Button onClick={submit} variant="primary"> <SendSvg size={24} /> {t('submitText')}</Button>
        </div>
      
      </div>
    );
}

