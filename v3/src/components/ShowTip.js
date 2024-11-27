import { useSelector, useDispatch } from 'react-redux'
import {setMessageText} from '../data/valueData'
import Modal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react';

export default function ShowTip() {
    const messageText = useSelector((state) => state.valueData.messageText)
    const t = useTranslations('Common')
    const dispatch = useDispatch();
    const [img,setImg]=useState('mess.svg');
    const [text,setText]=useState('');
    const [tip,setTip]=useState('');
    useEffect(()=>{
        if(messageText){
            if(messageText.endsWith('_*_')){ //提示信息
                setImg('mess1.svg');
                setText(messageText.replace('_*_',''));
                setTip(t('tipText'));
            }else 
            {
                setImg('mess.svg');
                setText(messageText);
                setTip(t('tipText1'));
            }
        }
    },[messageText])
    

    return (
        <Modal className="modal-dialog-scrollable daism-title " centered show={messageText!==''} onHide={(e) => {dispatch(setMessageText(''))}}>
            <Modal.Header closeButton>
                <Modal.Title>{tip}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="daism-tip-body">
                <img alt="" src={`/${img}`} width={32} height={32} />
                <div className="daism-tip-text">{text}</div>
            </Modal.Body>
        </Modal>
    )
}

