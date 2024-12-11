import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import { Modal,Button,InputGroup,Form } from "react-bootstrap";
import ErrorBar from "../form/ErrorBar";
import { useTranslations } from 'next-intl'
import { UploadVedio } from "../../lib/jssvg/SvgCollection";

/**
 * 上传视频链接
 * @vedioUrl 修改的视频地址，新增为空
 * @setVedioUrl 设置视频地址，给上层显示视频用
 */
const VedioUpload = forwardRef(({ vedioUrl,setVedioUrl}, ref) => {
    const [show,setShow]=useState(false)
    const urlRef=useRef();
    const t = useTranslations('ff')
    const [showError,setShowError]=useState(false)

    useImperativeHandle(ref, () => ({
      getData: ()=>{return fileStr},
      getFileType:()=>{ return fileTypeRef.current},
      getFile:()=>{return  fileTypeRef.current?fileInputRef.current.files[0]:null},
    }));

  

 
    const handleClose = () => setShow(false);
    const handle= () => {
       let _url = urlRef.current.value;
        if (!_url || !/^((https|http)?:\/\/)[^\s]+/.test(_url)) {
           setShowError(true);
            return;
        }
        setVedioUrl(_url);
        setShow(false);
    }
    return (
        <>
            <Button variant="light" size="sm" onClick={e=>{setShow(true)}}  title={t('uploadVedioText')}>  
            <UploadVedio size={20} />
            </Button>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{t('uploadVedioText')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-2">
                    <Form.Control ref={urlRef} isInvalid={showError} type="text" defaultValue={vedioUrl} 
                    placeholder={t('vedioUrlText')} onFocus={() => { setShowError(false);}}/>
                    </InputGroup>
                    <ErrorBar show={showError} target={urlRef} placement='bottom' invalidText={t('uriValidText')} ></ErrorBar>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> {t('closeText')}</Button>
                <Button variant="primary" onClick={handle}> {t('saveText')}</Button>
                </Modal.Footer>
            </Modal>
          
        </>
    );
});

export default React.memo(VedioUpload);

