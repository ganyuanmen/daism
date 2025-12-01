"use client";
import { setErrText, setTipText, type AppDispatch} from '@/store/store';
import { Button, Card } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRef, useState } from 'react';
import ShowLogin, { ShowLoginRef } from '@/components/enki3/ShowLogin';

interface PropsTye{
    srcimg:string;
    title:string;
    field:string;
    t:(v:string)=>string;
    tc:(v:string)=>string;
}

export default function HomeImg({srcimg,title,field,t,tc}:PropsTye) {

    const dispatch = useDispatch<AppDispatch>();
    const showError=(str:string)=>{ dispatch(setErrText(str));}  
    const [previewURL, setPreviewURL] = useState<string>(srcimg || '');
    const [file,setFile]=useState<File|null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const showLoginRef=useRef<ShowLoginRef>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      if (selectedFile) handleFile(selectedFile);
    };
  
    const closeTip = () => dispatch(setTipText(""));
    const showTip = (str: string) => dispatch(setTipText(str));
    
    const handleFile = (selectedFile: File) => {
      if (!selectedFile) return;
      setFile(selectedFile);
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];
      if (!validTypes.includes(selectedFile.type)) {
        showError('Invalid file type. Only JPG/PNG/GIF/SVG allowed.');
        return;
      }
  
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);
    
    };

    const triggerClick = () => {
      fileInputRef.current?.click();
    };

    const submit = async () => {
      if(!showLoginRef.current?.checkLogin()) return;
       showTip(t("submittingText"));
       const formData = new FormData();
       formData.append("file", file??''); // 图片
       formData.append("field", field);
       fetch(`/api/homeImg`, {
         method: "POST",
         headers: { encType: "multipart/form-data" },
         body: formData,
       })
         .then(async (response) => {
           closeTip();
           const obj = await response.json();
           if (obj.errMsg) {
             showError(obj.errMsg || "fail");
             return;
           }
        
         })
         .catch((error: unknown) => {
           closeTip();
           if (error instanceof Error) {
             showError(`${tc("dataHandleErrorText")}!${error.message}`);
           } else {
            showError(`${tc("dataHandleErrorText")}!${String(error)}`);
           }
         });
     };

  return (<>
    <Card style={{width:'25%'}} >
    <Card.Header>{title}</Card.Header>
    <Card.Body>
       { previewURL && <Image src={previewURL} width={100} height={100}
            style={{
                width: "100%",        
                height: "auto",      
                flexShrink: 1,        
                transition: "all 0.2s ease-in-out",
            }} alt="" />
        }
    </Card.Body>
    <Card.Footer>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}} >
        <Button onClick={triggerClick} >{t('updateText')}</Button>
        <Button disabled={previewURL===srcimg}  onClick={submit} >{t('uploadText')}</Button>
      </div>
    </Card.Footer>
</Card>
<input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.svg"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
    />
          <ShowLogin ref={showLoginRef} />
    </>
  );
}
