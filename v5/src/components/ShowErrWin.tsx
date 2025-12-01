

'use client';

import {type RootState, type AppDispatch, setErrText} from '../store/store';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl'

export default function ShowErrWin() {
    const errText = useSelector((state:RootState) => state.valueData.errText)
    const t = useTranslations('Common')
    const dispatch = useDispatch<AppDispatch>();
 
    return (
        <Modal className="modal-dialog-scrollable daism-title " 
        centered show={errText!==''} onHide={() => {dispatch(setErrText(''))}}>
            <Modal.Header closeButton>
                <Modal.Title>{t('tipText1')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="daism-tip-body">
                <Image alt="" src={`/mess.svg`} width={32} height={32} />
                <div className="daism-tip-text">{errText}</div>
            </Modal.Body>
        </Modal>
    )
}

