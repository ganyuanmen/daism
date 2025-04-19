
import JoditEditor from 'jodit-react';
import {setTipText} from '../data/valueData'
import { useDispatch} from 'react-redux';
import { useTranslations } from 'next-intl'
//isFix固定标题

const RichTextEditor = ({title,defaultValue,editorRef,isFix=false}) => {
  const t = useTranslations('ff')
  const dispatch = useDispatch();
  // function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}

 
  const config = {
    toolbarSticky: isFix,              // ✅ 固定工具栏
    height: isFix?'500':'auto',     

    buttons: [
      'image','source', '|',
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', 'brush', 'paragraph', '|',
        'outdent', 'indent', '|',
        'fontsize','link' , '|',
        'table','superscript','subscript', '|',
        'left', 'center', 'right', 'justify', '|',
         'undo', 'redo', '|',
         'preview', 'fullsize','eraser'
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
      headers:{encType:'multipart/form-data'},
      prepareData: function(){
        showTip(t('uploadImg'))
      },
   
      isSuccess: function(resp){
          return !resp.error;
      },
      getMsg: function(resp){
          return '' //resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
      },
      process: function(resp){
          return{
              path: resp.imageUrl
          };
      },
      defaultHandlerSuccess: function(data, resp){
          if(data.path){
                this.selection.insertImage(data.path);
          }
          closeTip()
      },
      defaultHandlerError: function(resp){
        closeTip()
          // this.events.fire('errorPopap', this.i18n(resp.msg));
      }
  }
  };

  return (
    <>
    
    {title &&<label className="mb-0" style={{marginLeft:'6px'}}><b>{title}</b></label>}
      <JoditEditor
      value={defaultValue}
      config={config}
      ref={editorRef}
    />
    </>
  );
}


export default RichTextEditor;
