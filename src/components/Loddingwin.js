import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useTranslations } from 'next-intl'
import { useSelector} from 'react-redux'

export default function Loddingwin() {
    const [dwin, setDwin] = useState(0); //滚动窗口显示 
    const tipText = useSelector((state) => state.valueData.tipText)
    const t = useTranslations('Common')

    useEffect(() => {
        var win_i = 0;
        if (tipText!=='') {
            var timein = setInterval(() => {
                if (win_i >= 3) win_i = 0;
                else win_i++;
                setDwin(win_i);
            }, 10000);
        }

        return () => {
            setDwin(0); win_i = 0;
            clearInterval(timein);
        }
    }, [tipText]);

    return (

        <Modal className='daism-title' centered show={tipText!==''} backdrop="static" keyboard={false}>
            <Modal.Header >
                <Modal.Title>{t('tipText')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='daism-tip-body' >
                {/* 动态图标 */}
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                {/* 根据dwin显示文本 */}
                <div className='daism-tip-text'  >
                    {dwin === 0 && <div style={{ color: '#007bff' }}> {tipText}</div>}
                    {dwin === 1 && <div style={{ color: '#28a745' }}> {t('blockchainText1')}</div>}
                    {dwin === 2 && <div style={{ color: '#dc3545' }}> {t('blockchainText2')}</div>}
                    {dwin === 3 && <div style={{ color: '#6f42c1' }}> {t('blockchainText3')}</div>}
                </div>
            </Modal.Body>
        </Modal>
    )
}

