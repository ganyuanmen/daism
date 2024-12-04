import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import { Modal,Button,InputGroup,Form } from "react-bootstrap";
import ErrorBar from "../../../../components/form/ErrorBar";

const VideoUpload = forwardRef(({ videoUrl,setVideoUrl,tc,t}, ref) => {
    const [show,setShow]=useState(false)
    const urlRef=useRef();
    const titleRef=useRef()
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
        setVideoUrl(_url);
        setShow(false);
    }
    return (
        <>
            <button onClick={e=>{setShow(true)}} type="button" className="btn btn-light btn-sm" data-bs-toggle="tooltip" data-bs-html="true" title={t('uploadVideoText')}>  
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
                <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            </button>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{t('uploadVideoText')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-2">
                    <Form.Control ref={urlRef} isInvalid={showError} type="text" defaultValue={videoUrl} placeholder={t('urlText')} onFocus={() => { setShowError(false);}}/>
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

export default React.memo(VideoUpload);

