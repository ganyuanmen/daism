import { useState } from 'react';
import {Button,Modal} from "react-bootstrap";
import { ToolsSvg } from '../../lib/jssvg/SvgCollection';
import DaoForm from './DaoForm';
import {setTipText,setMessageText} from '../../data/valueData'
import { useTranslations } from 'next-intl'
import {useEipTypes} from '../../hooks/useMessageData'
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';

export default function CreateDao({setRefresh,env}) {
    
    const [show, setShow] = useState(false); 
    const typeData=useEipTypes() //所有eip类型
    const t = useTranslations('my')
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showErrorTip(str){dispatch(setMessageText(str))}


    const setW=()=>{
        if(user.connected===1) setShow(true)
        else showErrorTip(tc('noConnectText'))
    }

    return (<div className='mb-2' >
        <Button size="lg" variant="primary" onClick={setW} ><ToolsSvg size={24} />mint {t('smartcommon')} </Button> 
        <Modal className='daism-title'  size="lg" show={show} onHide={(e) => {setShow(false)}} >
        <Modal.Header closeButton>mint {t('smartcommon')}</Modal.Header>
         <Modal.Body>
            <DaoForm env={env} showErrorTip={showErrorTip} showTip={showTip} closeTip={closeTip} typeData={typeData} user={user} setRefresh={setRefresh} t={t} tc={tc} setShow={setShow} />
       </Modal.Body>
        </Modal>
        </div>
    );
}