import { useState } from "react";
import { useDispatch } from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData';
import { useTranslations } from 'next-intl'
import { Button } from 'react-bootstrap';


const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function SimpleVideoUpload({setVedioUrl,setShow}) {
  const [video, setVideo] = useState(null);
  

  const t = useTranslations('ff');
  const dispatch = useDispatch();
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  function showClipError(str){dispatch(setMessageText(str))}  

  const handleUpload = async () => {
    if (!video) return;

    

    const formData = new FormData();
    formData.append("video", video);

    showTip(t('uploaddingText'));
    const res = await fetch("/api/admin/uploaVedio", {method: "POST", body: formData});

    if(res.status!==200) showClipError(`${res.statusText}\n ${t('maxImageSize',{num:100})}`)
    else {
      const data = await res.json(); 
      setVedioUrl(data.path);
    }
    closeTip();
    setShow(false);
  };

  
const handleChange = (e) => {
  const file = e.target.files[0];
  if(file){
    if (!file.type.startsWith("video/")) {
      showClipError(t("selectVedioText"))
      return;
    }

    if (file.size > MAX_SIZE) showClipError(t('vedioSizeText'));
    else setVideo(file);
  }
};
  return (
    <div>
      <input type="file" accept="video/*" onChange={handleChange} />
     {video && <Button onClick={handleUpload}>{t('uploadVedioText')} </Button>}
    </div>
  );
}
