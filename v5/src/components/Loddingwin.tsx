'use client';

import { useEffect, useState } from 'react';
import type { RootState } from '../store/store';
import Modal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';

export default function Loddingwin() {
  const [dwin, setDwin] = useState<number>(0); // 滚动窗口显示，明确类型为 number
  const tipText = useSelector((state: RootState) => state.valueData.tipText);
  const t = useTranslations('Common');

  useEffect(() => {
    let win_i = 0;
    let timein: ReturnType<typeof setInterval> | undefined;

    if (tipText !== '') {
      timein = setInterval(() => {
        if (win_i >= 3) win_i = 0;
        else win_i++;
        setDwin(win_i);
      }, 10000);
    }

    return () => {
      setDwin(0);
      win_i = 0;
      if (timein) clearInterval(timein);
    };
  }, [tipText]);

  return (
    <Modal
      className="daism-title"
      centered
      show={tipText !== ''}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{t('tipText')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="daism-tip-body">
        {/* 动态图标 */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* 根据 dwin 显示文本 */}
        <div className="daism-tip-text">
          {dwin === 0 && <div style={{ color: '#007bff' }}> {tipText}</div>}
          {dwin === 1 && <div style={{ color: '#28a745' }}> {t('blockchainText1')}</div>}
          {dwin === 2 && <div style={{ color: '#dc3545' }}> {t('blockchainText2')}</div>}
          {dwin === 3 && <div style={{ color: '#6f42c1' }}> {t('blockchainText3')}</div>}
        </div>
      </Modal.Body>
    </Modal>
  );
}
