import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import ErrorBar from "../form/ErrorBar";
import { useTranslations } from 'next-intl'
import { Button } from "react-bootstrap";
import { UploadImg } from "../../lib/jssvg/SvgCollection";

/**
 * 图片上传组件
 * @maxSize 图片允许的最大值 1024*500 指 500k
 * @fileTypes 允许的文件类型
 * @setFileStr 设图片的base64码，用于图片的显示
 * @setFileType 设图片后缀名
 */

const ImgUpload = forwardRef(({maxSize,fileTypes,setFileStr,setFileType}, ref) => {
    const t = useTranslations('ff')
    const tc = useTranslations('Common')
    const imgRef=useRef()
    const fileInputRef = useRef(null);
    const fileTypeRef=useRef('')
    const [invalidText,setInvalidText]=useState('')

    useImperativeHandle(ref, () => ({
      getFileType:()=>{ return fileTypeRef.current},
      getFile:()=>{return  fileTypeRef.current?fileInputRef.current.files[0]:null},
    }));

    //选择图片后处理
    const fielChange = (event) => {
        if (!event?.currentTarget?.files || !event?.currentTarget?.files[0]) { return; }
        let file = event?.currentTarget?.files[0] || event?.currentTarget?.files[0];
        fileTypeRef.current =file.name.indexOf('.')>0?file.name.toLowerCase().split('.').splice(-1)[0]:''; //获取上传的文件的后缀名  
        const clear=()=>{setFileType('');setFileStr('');fileTypeRef.current='';}
        //检查后缀名
        if (!fileTypes.includes(fileTypeRef.current)) {
            setInvalidText(`${tc('onlySuport')} ${fileTypes} ${tc('ofImgText')} [${file.name}]`);
            return clear();
        }
        //检查文件大小
        if (file.size > maxSize) {
            setInvalidText(`${tc('fileSizeMax')} ${maxSize/1024} k `);
            return clear();
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
            <Button variant="light" size="sm" onClick={triggerClick} ref={imgRef} title={t('uploadPitruseText')}>  
               <UploadImg size={24} />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}  onChange={fielChange} />
            <ErrorBar show={invalidText} target={imgRef} placement='left' invalidText={invalidText} />
        </>
    );
});

export default React.memo(ImgUpload);

