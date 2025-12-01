import { useState } from 'react';
import {Button,Modal} from "react-bootstrap";
import { ToolsSvg } from '../../lib/jssvg/SvgCollection';
import DaoForm from './DaoForm';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState,type AppDispatch,setErrText } from '@/store/store';
import { useTranslations } from 'next-intl';

interface CreateDaoProps {
    setRefresh?: () => void;
  }

export default function CreateDao({setRefresh}: CreateDaoProps) {
    
    const [show, setShow] = useState(false); 
    const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;
    
    const dispatch = useDispatch<AppDispatch>();
    function showErrorTip(str:string){dispatch(setErrText(str))}
    const t = useTranslations('my')
    const tc = useTranslations('Common')
   
    const setW=()=>{
        if(user.connected===1) setShow(true)
        else showErrorTip(tc('noConnectText'))
    }

    return (<div className='mb-2' >
        <Button size="lg" variant="primary" onClick={setW} ><ToolsSvg size={24} />mint {t('smartcommon')} </Button> 
        <Modal className='daism-title'  size="lg" show={show} onHide={() => {setShow(false)}} >
        <Modal.Header closeButton>mint {t('smartcommon')}</Modal.Header>
         <Modal.Body>
            <DaoForm setRefresh={setRefresh} setShow={setShow} />
       </Modal.Body>
        </Modal>
        </div>
    );
}