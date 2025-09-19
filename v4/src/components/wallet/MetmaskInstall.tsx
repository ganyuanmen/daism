'use client';

import { Modal, Button } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {  useState } from 'react';



export default function MetmaskInstall() {
    const [showMetaMask, setShowMetaMask] = useState(false); // 显示MetaMask安装提示
    const tc = useTranslations('Common');


 
   
  return (
    <>
     <Button 
              variant="primary" 
              size="sm"
              style={{ 
                borderRadius: '12px', 
                marginLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setShowMetaMask(true)}
            >
              <Image alt="wallet" src='/wallet.svg' width={18} height={18} /> 
              {tc('connectText')}
    </Button>


    <Modal
      centered
      show={showMetaMask}
      onHide={() => setShowMetaMask(false)}
      className="wallet-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{tc('tipText')}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="daism-tip-body d-flex align-items-center">
        <div className="me-3">
          <Image alt="info" src="/mess.svg" width={40} height={40} />
        </div>
        <div className="daism-tip-text">
          <p>
            {tc('metmaskTip1')}{' '}
            <Link
              href="https://metamask.io"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              https://metamask.io
            </Link>
          </p>
          <p>{tc('metmaskTip2')}</p>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
}

//import { Dispatch, SetStateAction } from 'react';
// interface MetmaskInstallProps {
//     showMetaMask: boolean;
//     setShowMetaMask: Dispatch<SetStateAction<boolean>>;
//   }
// export default function MetmaskInstall({
//     showMetaMask,
//     setShowMetaMask
//   }: MetmaskInstallProps)