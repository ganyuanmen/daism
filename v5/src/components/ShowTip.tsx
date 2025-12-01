
'use client';

import {type RootState, type AppDispatch, setMessageText} from '../store/store';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl'


export default function ShowTip() {
    const messageText = useSelector((state:RootState) => state.valueData.messageText)
    const t = useTranslations('Common')
    const dispatch = useDispatch<AppDispatch>();
   

    return (
        <Modal className="modal-dialog-scrollable daism-title " 
        centered show={messageText!==''} onHide={() => {dispatch(setMessageText(''))}}>
            <Modal.Header closeButton>
                <Modal.Title>{t('tipText')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="daism-tip-body">
                <Image alt="" src={`/mess1.svg`} width={32} height={32} />
                <div className="daism-tip-text">{messageText}</div>
            </Modal.Body>
        </Modal>
    )
}

