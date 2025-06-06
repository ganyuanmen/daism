import React, {useRef, useState } from "react";
import { Modal,Button,InputGroup,Form } from "react-bootstrap";
import ErrorBar from "../form/ErrorBar";
import { useTranslations } from 'next-intl'
import SimpleVideoUpload from "./SimpleVideoUpload";

/**
 * 上传视频链接
 * @vedioUrl 修改的视频地址，新增为空
 * @setVedioUrl 设置视频地址，给上层显示视频用
 */
const Video = ({show,setShow,vedioUrl,setVedioUrl,insertVideo}) => {
    const urlRef=useRef();
    const t = useTranslations('ff');
    const [showError,setShowError]=useState(false);
    const [typeIndex,setTypeIndex]=useState(0);

    function isValidUrl(input) {
        try {
          const url = new URL(input);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch (err) {
          return false;
        }
    }

    function validateUrl(input) {
        if (!input) return false;
      
        const isValidFormat = isValidUrl(input); 
        const videoExt = /\.(mp4|webm|ogg)(\?.*)?$/i.test(input);
        const isIframe = /(youtube\.com|youtu\.be|bilibili\.com|vimeo\.com)/i.test(input);
      
        return isValidFormat && (videoExt || isIframe);
    }
      


    const handle = () => {
        const url = urlRef.current.value.trim();
        if (validateUrl(url)) {
            setVedioUrl(url);
            setShow(false);
            if(typeof insertVideo ==='function') insertVideo.call(null,url)
        } else {
            setShowError(true)
        }
    };


    const handleClose = () => setShow(false);
   
    return (
                <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton >
                <Modal.Title>{t('uploadVedioText')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                             
                    <Form>
                    <Form.Check inline label={t('vedioLinkText')} name="group1" type='radio' defaultChecked={typeIndex===0} onClick={e=>
                        {if(e.target.checked) setTypeIndex(0)}}  id='vinline-2' />
                    <Form.Check inline label={t('uploadVedioText')} disabled={true} name="group1" type='radio' defaultChecked={typeIndex===1} onClick={e=>
                        {if(e.target.checked) setTypeIndex(1)}}  id='vinline-1' />
                    </Form>

                   {typeIndex===0 ? <> <InputGroup className="mb-2">
                    <Form.Control ref={urlRef} isInvalid={showError} type="text" defaultValue={vedioUrl} 
                    placeholder={t('vedioUrlText')} onFocus={() => { setShowError(false);}}/>
                       <Button  onClick={handle}> 
                        {t('saveText')}
                        </Button>
                    </InputGroup>
                    <ErrorBar show={showError} target={urlRef} placement='bottom' invalidText={t('videoURLValid')} ></ErrorBar>
                    </>:
                    <SimpleVideoUpload setShow={setShow} setVedioUrl={setVedioUrl} />
                   }
                </Modal.Body>
            </Modal>

    );
};

export default React.memo(Video);

