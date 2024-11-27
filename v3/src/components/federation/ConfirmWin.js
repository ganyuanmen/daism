
import { Modal,Button} from "react-bootstrap";
import { YesSvg,NoSvg } from "../../lib/jssvg/SvgCollection";
import { useTranslations } from 'next-intl'

/**
 * 确认窗口
*/
export default function ConfirmWin({show,setShow,callBack,question}) {
    const t = useTranslations('Common')
   
    return  <Modal show={show} onHide={() => {setShow(false)}}>
            <Modal.Body>
            <div className="mb-3">{question}</div>
            <div style={{textAlign:'center'}} >
            <Button variant="link"  onClick={e=>setShow(false)} ><NoSvg size={20} /> {t('cancelText')}</Button>{'   '}
            <Button variant="primary"  onClick={callBack} ><YesSvg size={20}/ > {t('confirmText')}</Button>
            </div>
            </Modal.Body>
            </Modal>
  }
  



