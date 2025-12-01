"use client";
import { setErrText, setTipText, type AppDispatch} from '@/store/store';
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Loading from '@/components/Loadding';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false,
    loading: () => <Loading />, // 加载中显示
 });

interface PropsType{
    text:string;
    local:string;
    t:(v:string)=>string;
    tc:(v:string)=>string;
}

export default function SmarcommonText({text,local,t,tc}:PropsType) {

    const [content,setContent]=useState(text);
    const [show,setShow]=useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const showError=(str:string)=>{ dispatch(setErrText(str));}
    const closeTip = () => dispatch(setTipText(""));
    const showTip = (str: string) => dispatch(setTipText(str));

    const save=async ()=>{
        showTip(t("submittingText"));
        const re=await fetch('/api/postwithsession',{
            method:'POST',
            headers:{'x-method':'updateSet'},
            body:JSON.stringify({text:content,local,id:2})});

        if(re.ok){
            setShow(false);
        }else {
            const reData=await re.json();
            showError(`${tc("dataHandleErrorText")}!\n ${reData?.errMsg}`);
        }
         
        closeTip();
    }

  return (
    <>
    <Button onClick={()=>{setShow(true)}} >{local==='en'?t('enText'):t('zhText')}</Button>
    
    <Modal  className="daism-title"   backdrop="static" keyboard={false} size="lg" show={show} onHide={() => { setShow(false);}}>
        <Modal.Header closeButton>{local==='en'?t('enText'):t('zhText')}</Modal.Header>
        <Modal.Body >
        <Button className='mb-1' onClick={save} >{t('saveText')}</Button>
        <RichTextEditor title="" content={content} setContent={setContent} />
        </Modal.Body>
    </Modal>
    </>
    );
}
