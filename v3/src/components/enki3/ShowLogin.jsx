// import { useSelector, useDispatch } from 'react-redux'
// import {setShowNotice} from '../../data/valueData'
import { useTranslations } from 'next-intl'
// import {useNotice} from '../../hooks/useMessageData';
// import { client } from '../../lib/api/client';
import { Button,Modal } from 'react-bootstrap';
// import Loginsign from '../Loginsign'
import { useRef } from 'react';
import LoginButton from '../LoginButton';

export default function ShowLogin({show,setShow}) {
    const loginRef=useRef(null)
    const t = useTranslations('Common')
   
    return (
        <Modal className="modal-dialog-scrollable daism-title " centered show={show } onHide={(e) => {setShow(false)}}>
                  <Modal.Header closeButton>
                      <Modal.Title>{t('loginFailure')}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="daism-tip-body">
                      <img alt="" src='/mess.svg' width={32} height={32} />
                      <div className="daism-tip-text">
                        {t('reLoginText')}   <Button variant="primary"  onClick={()=>{
                            loginRef.current.siweLogin();
                            setShow(false);

                        }} >
                  <img alt='' src='/loginbutton.svg' width={18} height={18} style={{color:'white'}} />  {'  '}
                  <LoginButton second_login={true} ref={loginRef} />
                </Button>

                      </div>
                  </Modal.Body>
              </Modal>

    )
}

