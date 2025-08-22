import { useSelector, useDispatch } from 'react-redux'
import {setShowNotice} from '../../data/valueData'
import { useTranslations } from 'next-intl'
import {useNotice} from '../../hooks/useMessageData';
import { client } from '../../lib/api/client';
import { Button,Modal } from 'react-bootstrap';

export default function ShowNotice() {
    const showNotice = useSelector((state) => state.valueData.showNotice)
    const t = useTranslations('Common')
    const dispatch = useDispatch();
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const noticeData=useNotice(user)

    const clickNotice=()=>{
        client.post('/api/postwithsession',"updateNotice",{manager:user.account})
        window.location.href='/smartcommons/actor?notice=9';  
      }

    return (
        <Modal className="modal-dialog-scrollable daism-title " centered show={showNotice && loginsiwe && noticeData?.data?.length } onHide={(e) => {dispatch(setShowNotice(false))}}>
                  <Modal.Header closeButton>
                      <Modal.Title>{t('byTipText')}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="daism-tip-body">
                      <img alt="" src='/vita.svg' width={32} height={32} />
                      <div className="daism-tip-text">
                        {t('alreatyTip')}  <Button variant="primary"  onClick={clickNotice} > {t('viewText')}  </Button>

                      </div>
                  </Modal.Body>
              </Modal>

    )
}

