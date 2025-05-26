
import JoditEditor from 'jodit-react';
import {setTipText,setMessageText} from '../data/valueData'
import { useDispatch} from 'react-redux';
import { useTranslations } from 'next-intl';
import Video from './enki3/Video';
import { Jodit } from "jodit";

import React, { useRef, useState, useMemo, useEffect } from "react";
// import JoditEditor from "jodit-react";

//isFix固定标题

const RichTextEditor = ({title,defaultValue,editorRef}) => {
  const t = useTranslations('ff')
  const dispatch = useDispatch();
  const [show,setShow]=useState(false)
  const [vedioUrl,setVedioUrl]=useState('')
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}

  const[isFix,setIsFix]=useState(false)
   
   // 插入视频/iframe 逻辑
   const insertVideo = (url) => {
    let html = "";
    // mp4/webm/ogg 视频格式
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      html = `<video controls width="100%" style="max-width: 440px;">
                <source src="${url}" type="video/mp4" />
                ${t('noSupotVideo')}
              </video><br/>`;
    }
    // iframe 支持主流视频网站
    else if (/(youtube\.com|youtu\.be|bilibili\.com|vimeo\.com)/i.test(url)) {
      html = `<iframe
                src="${url.replace('youtu.be','www.youtube.com/embed')}"
                height="560"
                frameborder="0"
                allowfullscreen
                style="width: 100%;"
              ></iframe><br/>`;
              
    } else {
      showError(t('noSuportType'));
      return;
    }
     editorRef.current?.s?.insertHTML(html);
  };

    // ✅ config 必须通过 useMemo 包装，避免重复创建
    const config = useMemo(() => ({
      toolbarSticky: isFix,              // ✅ 固定工具栏
      height: isFix?'500':'auto',     
      buttons: [
        'image','insertCustomVideo','source', '|',
          'bold', 'italic', 'underline', '|',
          'ul', 'ol', 'brush', 'paragraph', '|',
          'outdent', 'indent', '|',
          'fontsize','link' , '|',
          'table','superscript','subscript', '|',
          'left', 'center', 'right', 'justify', '|',
          'undo', 'redo', '|',
          'preview', 'fullsize','eraser', "toggleHeight" // 👈 插入按钮
      ],

        toolbarAdaptive: false,
        readonly: false, 

        uploader:{
          insertImageAsBase64URI: false,
          imagesExtensions: ['jpg', 'png', 'jpeg', 'gif','svg','webp'],
          withCredentials: true,
          format: 'json',
          method: 'POST',
          url: '/api/admin/upload',
          
          prepareData: function(){showTip(t('uploadImg'));},
          isSuccess: function(resp){return resp;},
          getMsg: function(resp){return resp;},
          process: function(resp){return resp;},
          defaultHandlerSuccess: function(resp){
            if(resp.success) this.selection.insertImage(resp.imageUrl);
            else showError(`${resp.data.messages[0].message}\n ${t('maxImageSize',{num:1})}`);
            closeTip()
          }
        },
        controls: {
          insertCustomVideo: {
            name: 'insertCustomVideo',
            icon: 'video', // 使用 Jodit 内置图标
            tooltip: t('vedioLinkText'),
            exec: (editor) => { setShow(true);}
          },
          toggleHeight:{
            name: t('isFixButton'),
            tooltip: t('isFixButton'),
            exec: (editor) => {setIsFix(!isFix)}
          }
        }
    }), [isFix]);


  return (
    <>
    
    {title &&<label className="mb-0" style={{marginLeft:'6px'}}><b>{title}</b></label>}
      <JoditEditor 
      value={defaultValue}
      config={config}
      ref={editorRef}
    />

    <Video show={show} setShow={setShow} vedioUrl={vedioUrl} setVedioUrl={setVedioUrl} insertVideo={insertVideo} />
          
    </>
  );
}


export default RichTextEditor;
