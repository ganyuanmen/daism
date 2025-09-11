'use client';
import { useTranslations } from 'next-intl';
import { Button, Modal } from 'react-bootstrap';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import LoginButton,{type LoginButtonRef} from '../LoginButton';
import { useState } from 'react';
import Image from 'next/image';

type ShowLoginProps = unknown;

export interface ShowLoginRef {
  checkLogin: () => Promise<boolean>;
}

const ShowLogin = forwardRef<ShowLoginRef, ShowLoginProps>((_, ref) => {
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef<LoginButtonRef>(null);
  const t = useTranslations('Common');

  const checkLogin=async ()=>{
    const res = await fetch('/api/siwe/getLoginUser?t=' + new Date().getTime());
    const res_data = await res.json();

    if (!res_data.isLogin) {
      setShowLogin(true);
      return false
    }

    return true;
  }


  useImperativeHandle(ref, () => ({ checkLogin }));

  return (
    <Modal
      className="modal-dialog-scrollable daism-title"
      centered
      show={showLogin}
      onHide={() => setShowLogin(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('loginFailure')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="daism-tip-body">
        <Image alt="" src="/mess.svg" width={32} height={32} />
        <div className="daism-tip-text">
          {t('reLoginText')}{' '}
          <Button
            variant="primary"
            onClick={() => {
              loginRef.current?.siweLogin();
              setShowLogin(false);
            }}
          >
            <Image
              alt=""
              src="/loginbutton.svg"
              width={18}
              height={18}
              style={{ color: 'white' }}
            />{' '}
            <LoginButton second_login={true} ref={loginRef} />
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});
ShowLogin.displayName="ShowLogin";
export default ShowLogin;