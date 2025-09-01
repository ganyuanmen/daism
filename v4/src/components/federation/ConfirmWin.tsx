import React from 'react';
import { Modal, Button } from "react-bootstrap";
import { YesSvg, NoSvg } from "@/lib/jssvg/SvgCollection";
import { useTranslations } from 'next-intl';

interface ConfirmWinProps {
  show: boolean;
  setShow: (show: boolean) => void;
  callBack: (v?:any) => void;
  question: string;
}

/**
 * 确认窗口
 * @param show - 窗口显示标志
 * @param setShow - 关闭窗口的函数
 * @param callBack - 确认后回调事件
 * @param question - 窗口显示的内容
 */
const ConfirmWin: React.FC<ConfirmWinProps> = ({ show, setShow, callBack, question }) => {
  const t = useTranslations('Common');
  
  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    callBack();
    setShow(false); // 通常确认后也关闭弹窗
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <div className="mb-3">{question}</div>
        <div style={{ textAlign: 'center' }} >
          <Button variant="link" onClick={handleClose}>
            <NoSvg size={20} /> {t('cancelText')}
          </Button>
          {'   '}
          <Button variant="primary" onClick={handleConfirm}>
            <YesSvg size={20} /> {t('confirmText')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmWin;