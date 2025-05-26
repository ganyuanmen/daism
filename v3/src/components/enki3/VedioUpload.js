import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslations } from 'next-intl'
import { UploadVedio } from "../../lib/jssvg/SvgCollection";
import Video from "./Video";

/**
 * 上传视频链接
 * @vedioUrl 修改的视频地址，新增为空
 * @setVedioUrl 设置视频地址，给上层显示视频用
 */
const VedioUpload= ({vedioUrl,setVedioUrl}) => {
    const [show,setShow]=useState(false)

    const t = useTranslations('ff');
   

    return (
        <>
            <Button variant="light" size="sm" onClick={e=>{setShow(true)}}  title={t('uploadVedioText')}>  
            <UploadVedio size={20} />
            </Button>
           <Video show={show} setShow={setShow} vedioUrl={vedioUrl} setVedioUrl={setVedioUrl} />
          
        </>
    );
};

export default React.memo(VedioUpload);

