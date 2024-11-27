// import { useState,forwardRef,useEffect,useImperativeHandle } from 'react';
import {Button,Card} from "react-bootstrap";
import DaismImg from '../../form/DaismImg';
import DaismInputGroup from '../../form/DaismInputGroup';
// import Editor from '../form/Editor';
import { useRef } from 'react';
import { SendSvg } from '../../../lib/jssvg/SvgCollection';
// import DateTimeItem from '../../form/DateTimeItem';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../RichTextEditor'), { ssr: false });

//currentObj 有值表示修改
export default function MeCreate({t,tc,actor,currentObj,afterEditCall,addCallBack,setActiveTab,fetchWhere,setFetchWhere}) {

    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    const titleRef=useRef(); //标题
    const editorRef=useRef(); 
    const imgstrRef=useRef();
    const discussionRef=useRef();
    const sendRef=useRef();

    const transformHTML=(html)=> {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let result = '';
        const allNodes = doc.body.childNodes;  
        allNodes.forEach(node => {
          if(node.textContent.trim())  result += `<p>${node.textContent.trim()}</p>`;
        });
      
        return result;
    }

    const submit=async ()=>{ 

        const titleText=titleRef.current.getData()
        if (!titleText || titleText.length > 256) {
            titleRef.current.notValid(t('titleValidText'))
            return
        }
        const contentText=editorRef.current.value
        if (!contentText || contentText.length < 10) {
            showClipError(t('contenValidText'))
            return
        }
        const elements5 = document.querySelectorAll('.jodit-wysiwyg');
       let words =transformHTML(elements5[0].innerHTML); 
           
        showTip(t('submittingText'))  
        const formData = new FormData();
        formData.append('id', currentObj?currentObj.id:0);  
        formData.append('account',actor.actor_account); //社交帐号
        formData.append('title', titleText);  //标题
        formData.append('textContent', words);  //推送非enki 站点
        formData.append('content', contentText); //，内容
        formData.append('image', imgstrRef.current.getFile()); //图片
        formData.append('fileType',imgstrRef.current.getFileType()); //后缀名
        formData.append('isSend',sendRef.current.checked?1:0);
        formData.append('isDiscussion',discussionRef.current.checked?1:0);

     
        fetch(`/api/admin/addMessage`, {
            method: 'POST',
            headers:{encType:'multipart/form-data'},
            body: formData
        })
        .then(async response => {
        closeTip()
        let re=await response.json()
        if(re.errMsg) { showClipError(re.errMsg); return }
        if(currentObj) {  //修改回调
            let _obj={...currentObj,...re} 
            afterEditCall.call(this,_obj) 
        }
        else {  addCallBack.call(this);  } //新增回调
        })
        .catch(error => {
        closeTip()
        showClipError(`${tc('dataHandleErrorText')}!${error}`)
        });   
    }

    return (
        <Card>
        <Card.Body>
            <DaismImg title={t('selectTopImg')} defaultValue={currentObj?currentObj.top_img:''} ref={imgstrRef}  maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp' />
            <DaismInputGroup title={t('titileText')} defaultValue={currentObj?currentObj.title:''}  ref={titleRef} horizontal={true}  />
            <RichTextEditor defaultValue={currentObj?currentObj.content:''}  title={t('contenText')}  editorRef={editorRef} />
       
            <div className="form-check form-switch  mt-3">
                <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?(currentObj.is_discussion===1?true:false):true} />
                <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
            </div>
            <div className="form-check form-switch mb-3 mt-3">
                <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?(currentObj.is_send===1?true:false):true} />
                <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
            </div>
         
        </Card.Body>
        <Card.Footer className='d-flex justify-content-center'  >
            <div>
                <Button  onClick={()=>{setFetchWhere({...fetchWhere,currentPageNum:0});setActiveTab(0);}}  variant="light">  {t('esctext')} </Button> {' '}
                <Button  onClick={submit}  variant="primary"> <SendSvg size={16} /> {t('submitText')}</Button> 
            </div>
        </Card.Footer>
        </Card>
    );
}

