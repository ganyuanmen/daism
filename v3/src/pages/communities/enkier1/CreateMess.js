// import { useState,forwardRef,useEffect,useImperativeHandle } from 'react';
import {Button,Card} from "react-bootstrap";
// import DaismImg from '../../form/DaismImg';
// import DaismInputGroup from '../../form/DaismInputGroup';
// import Editor from '../form/Editor';
import { useRef } from 'react';
// import { SendSvg } from '../../../lib/jssvg/SvgCollection';
// import DateTimeItem from '../../form/DateTimeItem';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
// import dynamic from 'next/dynamic';

// const RichTextEditor = dynamic(() => import('../../RichTextEditor'), { ssr: false });

import Editor from "../../../components/enki2/form/Editor";
import DaismImg from "../../../components/form/DaismImg";

//currentObj 有值表示修改
export default function CreateMess({t,tc,actor,currentObj,afterEditCall,addCallBack,setActiveTab,fetchWhere,setFetchWhere,accountAr}) {

    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    const titleRef=useRef(); //标题
    const editorRef=useRef(); 
    const imgstrRef=useRef();
    const discussionRef=useRef();
    const sendRef=useRef();
    const nums=500;

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
        const contentText = editorRef.current.getData()
        if (!contentText || contentText.length < 10) {
          return  showClipError(t('contenValidText'))
        }
        if (contentText.length >nums) {
            return  showClipError(`字数不能大于${nums}!`)
        }

           
        console.log(contentText)
        let geneHTML=contentText.replaceAll('\n','</p><p>')

  
        showTip(t('submittingText'))  
        const formData = new FormData();
        formData.append('id', currentObj?currentObj.id:0);  
        formData.append('account',actor.actor_account); //社交帐号
        formData.append('videoURL',editorRef.current.getVedioUrl());  //视频网址
        formData.append('propertyIndex',editorRef.current.getProperty());  //
        formData.append('accountAt',editorRef.current.getAccount());  //@用户
        formData.append('textContent', contentText);  //文本
        formData.append('typeIndex', 0);  //长或短
        formData.append('content', `<p>${geneHTML}</p>`); //，html内容
        formData.append('image', editorRef.current.getImg()); //图片
        formData.append('fileType',editorRef.current.getFileType()); //后缀名
        formData.append('isSend',sendRef.current.checked?1:0);
        formData.append('isDiscussion',discussionRef.current.checked?1:0);

     
        fetch(`/api/admin/addMessage`, {
            method: 'POST',
            headers:{encType:'multipart/form-data'},
            body: formData
        })
        .then(async response => {
            debugger
        closeTip()
        let re=await response.json()
        if(re.errMsg) { showClipError(re.errMsg|| 'fail'); return }
        if(currentObj) {  //修改回调
            let _obj={...currentObj,...re} 
            afterEditCall.call(this,_obj) 
        }
        else {  addCallBack.call(this);  } //新增回调
        })
        .catch(error => {
            debugger
        closeTip()
        showClipError(`${tc('dataHandleErrorText')}!${error}`)
        });   
    }

    return (
      <div style={{padding:'20px'}} >
        <Editor currentObj={currentObj} t={t} tc={tc} ref={editorRef} nums={nums} accountAr={accountAr} />
     
            <div className="form-check form-switch  mt-3">
                <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?(currentObj.is_discussion===1?true:false):true} />
                <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
            </div>
            <div className="form-check form-switch mb-3 mt-3">
                <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?(currentObj.is_send===1?true:false):true} />
                <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
            </div>
         
      
            <div style={{textAlign:'center'}} >
                <Button  onClick={()=>window.history.go(-1)}  variant="light">  {t('esctext')} </Button> {' '}
                <Button  onClick={submit}  variant="primary"> {t('submitText')}</Button> 
            </div>
      
      </div>
    );
}

