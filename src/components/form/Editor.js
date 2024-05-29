import React, {useImperativeHandle,useRef,forwardRef,useCallback ,lazy,Suspense,useState,useMemo, useEffect } from "react";
import { useSelector} from 'react-redux';
import {  Button,Modal } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { useTranslations } from 'next-intl'
import DaismInputGroup from '../../components/form/DaismInputGroup';

const QuillBox = lazy(() => import('react-quill'));
const Editor = forwardRef(({title,defaultValue}, ref) => {
    const [quillKey, setQuillKey] = useState(0);
    const [showImgWindow, setShowImgWindow] = useState(false);
	// const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const messageText = useSelector((state) => state.valueData.messageText) 
    const tipText = useSelector((state) => state.valueData.tipText) 
    const tc = useTranslations('Common')
    const quillRef = useRef(null); 
    const imgRef=useRef()

    const getData = () => {
      return quillRef.current.value.replaceAll('<p><br></p>','');
    };

    const getText=()=>{
      const quill = quillRef.current.getEditor(); // 获取 Quill 实例
      const plainText = quill.getText(); // 获取纯文本内容
      return plainText.replaceAll("\r",'').replaceAll('\n','');
    }
    
    const refresh=()=>{setQuillKey(()=>{return quillKey+1})}
    const refreshRef=useRef()
    refreshRef.current=refresh

    useEffect(()=>{ refreshRef.current()},[messageText,tipText])

    useImperativeHandle(ref, () => ({
      getData: getData,
      getText:getText
    }));

   
    // const handleImageUpload =async (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const formData = new FormData();
    //         formData.append('image', file);
    //         fetch(`${user.url}/api/admin/upload`, {
    //             method: 'POST',
    //             headers:await generateCrypto(user.url),
    //             body: formData
    //         })
    //         .then(async response => {
    //             if (response.ok) {
    //                 const {imgPath} = await response.json();
    //                 const quill = quillRef.current.getEditor();
    //                 const range = quill.getSelection();
    //                 quill.insertEmbed(range.index, 'image', imgPath);
    //                 quill.setSelection(range.index + 1);
    //             } else {
    //                 throw new Error('Failed to upload image');
    //             }
    //         })
    //         .catch(error => { console.error(error);});   
    //     }
    // };
  
    function setImg()
    {
      let imageUrl=imgRef.current.getData()
      if(imageUrl && !/^((https|http)?:\/\/)[^\s]+/.test(imageUrl)){
        imgRef.current.notValid(tc('uriValidText'))
        return
      }
      const quillEditor = quillRef.current.getEditor();
      const range = quillEditor.getSelection(true);
      quillEditor.insertEmbed(range.index, "image", imageUrl, "user");

      setShowImgWindow(false)
    }

    const imageHandler = useCallback(() => {
      setShowImgWindow(true)
      // // Create an input element of type 'file'
      // const input = document.createElement("input");
      // input.setAttribute("type", "file");
      // input.setAttribute("accept", "image/*");
      // input.click();
  
      // // When a file is selected
      // input.onchange = () => {
      //   const file = input.files[0];
      //   const reader = new FileReader();
  
      //   // Read the selected file as a data URL
      //   reader.onload = () => {
      //     const imageUrl = reader.result;
      //     const quillEditor = quillRef.current.getEditor();
  
      //     // Get the current selection range and insert the image at that index
      //     const range = quillEditor.getSelection(true);
      //     quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      //   };
  
      //   reader.readAsDataURL(file);
      // };
    }, []);

    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'], // 文字样式
      ['link','image', 'video'], // 插入链接、图片、视频
      ['blockquote', 'code-block'], // 引用、代码块
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序列表、无序列表
      [{ 'align': [] }], // 文本对齐
      ['clean'] // 清除样式
    ];

    const modules = useMemo(
      () => ({
        toolbar: {
          container: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "blockquote", 'strike'],
            [{ color: [] }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image","video"],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        clipboard: {
          matchVisual: true,
        },
      }),
      [imageHandler]
    );
    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "color",
      "clean",
    ];
  
  
    return (<>
      <div className="mb-3" style={{minHeight:'220px'}} >
          <label className="mb-0" style={{marginLeft:'6px'}}><b>{title}:</b></label>
          <Suspense fallback={<div>Loading...</div>}>
                <QuillBox  key={quillKey} ref={quillRef}   
                formats={formats}
                modules={modules}
         defaultValue={defaultValue?defaultValue:'<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>'} theme="snow"  />
          </Suspense>
      </div>
        <Modal className='daism-title' show={showImgWindow} onHide={(e) => {setShowImgWindow(false)}} >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          
            <DaismInputGroup title={tc('imgUriText')} ref={imgRef}  ></DaismInputGroup>
            <div style={{textAlign:'center'}} >
               <Button onClick={setImg} variant='primary'> {tc('confirmText')} </Button>
            </div>
        </Modal.Body>
    </Modal>
    </>
    );
});

export default React.memo(Editor);
