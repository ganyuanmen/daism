
import JoditEditor from 'jodit-react';

const RichTextEditor = ({title,defaultValue,editorRef}) => {
  
  const config = {
    buttons: [
        'image','source', '|',
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', 'brush', 'paragraph', '|',
        'outdent', 'indent', '|',
        'fontsize',  '|',
        'table','superscript','subscript', '|',
        'left', 'center', 'right', 'justify', '|',
        // 'undo', 'redo', '|',
         'preview', 'fullsize','eraser'
      ],
      toolbarAdaptive: false,
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    // uploader: {
    //   insertImageAsBase64URI: true
    // }
    uploader:{
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif','svg','webp'],
      // withCredentials: true,
      // format: 'json',
      // method: 'POST',
      // url: '/api/upload',
      // headers:{encType:'multipart/form-data'},
      // prepareData: function(formData){
      //   const fileInput = document.querySelector('input[type="file"]');
     
      //   //  data.append('image', data.getAll('files'));
      //     return formData;
      // },
   
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
      <label className="mb-0" style={{marginLeft:'6px'}}><b>{title}:</b></label>
      <JoditEditor
      value={defaultValue}
      config={config}
      ref={editorRef}
    />
    </>
  );
}


export default RichTextEditor;
