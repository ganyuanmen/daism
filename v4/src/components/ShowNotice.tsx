'use client';

import { useSelector, useDispatch } from 'react-redux'
import {type RootState,  setShowNotice} from '../store/store';

import { useTranslations } from 'next-intl'
// import { client } from '../lib/api/client';
import { Button,Modal } from 'react-bootstrap';
import Image from 'next/image';

import { useFetch } from "@/hooks/useFetch";
import { headers } from 'next/headers';
export interface NoticeData {
    id: number;
  }

  function useNotice(account?: string) {
    return useFetch<NoticeData[]>(`/api/getData?manager=${account}` ,'getNotice');
  }




export default function ShowNotice() {
    const showNotice = useSelector((state:RootState) => state.valueData.showNotice)
    const t = useTranslations('Common')
    const dispatch = useDispatch();
    const user = useSelector((state:RootState) => state.valueData.user)
    const loginsiwe = useSelector((state:RootState) => state.valueData.loginsiwe)
    const noticeData=useNotice(user.account);


    const clickNotice=()=>{
        fetch('/api/postwithsession',{
          method:'POST',
          headers:{'x-method':'updateNotice'},
          body:JSON.stringify({manager:user.account})})
        window.location.href='/smartcommons/actor?notice=9';  
      }

    return (
        <Modal className="modal-dialog-scrollable daism-title " centered show={showNotice && loginsiwe && noticeData?.data?.length>0 }
         onHide={() => {dispatch(setShowNotice(false))}}>
                  <Modal.Header closeButton>
                      <Modal.Title>{t('byTipText')}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="daism-tip-body">
                      <Image alt="" src='/vita.svg' width={32} height={32} />
                      <div className="daism-tip-text">
                        {t('alreatyTip')}  <Button variant="primary"  onClick={clickNotice} > {t('viewText')}  </Button>

                      </div>
                  </Modal.Body>
              </Modal>

    )
}

