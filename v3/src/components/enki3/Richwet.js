
import JoditEditor from 'jodit-react';

const Richwet = ({defaultValue,editorRef,isFix=false}) => {
  
  const config = {
    toolbarSticky: isFix,              // ✅ 固定工具栏
    height: isFix?'500':'auto',
    buttons: [
        // 'image',
        'source', '|',
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', 'brush', 'paragraph', '|',
        'outdent', 'indent', '|',
        'fontsize', 'link', '|',
        'table','superscript','subscript', '|',
        'left', 'center', 'right', 'justify', '|',
        'undo', 'redo', '|',
         'preview', 'fullsize','eraser'
      ],
      toolbarAdaptive: false,
    readonly: false, 
    uploader:{
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif','svg','webp'],
      isSuccess: function(resp){
          return !resp.error;
      },
      getMsg: function(resp){
          return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
      },
      process: function(resp){
          return{
              files: [resp.data],
              path: '',
              baseurl: '',
              error: resp.error ? 1 : 0,
              msg: resp.msg
          };
      },
      defaultHandlerSuccess: function(data, resp){
          const files = data.files || [];
          if(files.length){
              this.selection.insertImage(files[0], null, 250);
          }
      },
      defaultHandlerError: function(resp){
          this.events.fire('errorPopap', this.i18n(resp.msg));
      }
  }
  };

  return (
    <>
      <JoditEditor
      value={defaultValue}
      config={config}
      ref={editorRef}
    />
    </>
  );
}


export default Richwet;
