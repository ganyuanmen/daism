import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import ErrorBar from "../../../../components/form/ErrorBar";

const ImgUpload = forwardRef(({maxSize,fileTypes,fileStr,setFileStr,tc,t,setFileType}, ref) => {
    const imgRef=useRef()
    const fileInputRef = useRef(null);
    const fileTypeRef=useRef('')
    // const [showError,setShowError]=useState(false)
    const [invalidText,setInvalidText]=useState('')

    useImperativeHandle(ref, () => ({
      getData: ()=>{return fileStr},
      getFileType:()=>{ return fileTypeRef.current},
      getFile:()=>{return  fileTypeRef.current?fileInputRef.current.files[0]:null},
    }));

    //选择图片后处理
    const fielChange = (event) => {
        if (!event.currentTarget.files || !event.currentTarget.files[0]) { return; }
        // binaryRef.current=''
        let file = event.currentTarget.files[0];
        fileTypeRef.current =file.name.indexOf('.')>0?file.name.toLowerCase().split('.').splice(-1)[0]:''; //获取上传的文件的后缀名  
       
        //检查后缀名
        if (!fileTypes.includes(fileTypeRef.current)) {
            setInvalidText(`${tc('onlySuport')} ${fileTypes} ${tc('ofImgText')} [${file.name}]`);
            setFileType('')
            return;
        }
        //检查文件大小
        if (file.size > maxSize) {
            setInvalidText(`${tc('fileSizeMax')} ${maxSize/1024} k `);
            // setShowError(true)
            setFileStr('')
            // binaryRef.current=''
            fileTypeRef.current='';
            setFileType('')
            return;
        }

        setFileType(fileTypeRef.current)
     
        let reader = new FileReader() 
            reader.addEventListener('loadend', function (e) { 
                setFileStr(e.target.result)
                });
            reader.readAsDataURL(file)
    }

    const triggerClick = (event) => {
        // event.preventDefault();
        // event.stopPropagation();
        setInvalidText('')
        fileInputRef.current.click();
    };

    return (
        <>
            <button onClick={triggerClick} ref={imgRef}  type="button" className="btn btn-light btn-sm" data-bs-toggle="tooltip" data-bs-html="true" title={t('uploadPitruseText')}>  
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"  aria-hidden="true"><path d="M360-384h384L618-552l-90 120-66-88-102 136Zm-48 144q-29.7 0-50.85-21.15Q240-282.3 240-312v-480q0-29.7 21.15-50.85Q282.3-864 312-864h480q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H312Zm0-72h480v-480H312v480ZM168-96q-29.7 0-50.85-21.15Q96-138.3 96-168v-552h72v552h552v72H168Zm144-696v480-480Z"></path></svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}  onChange={fielChange} />
            <ErrorBar show={invalidText} target={imgRef} placement='right' invalidText={invalidText} ></ErrorBar>
        </>
    );
});

export default React.memo(ImgUpload);

