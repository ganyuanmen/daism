import { useState } from 'react';
import {Button,Modal} from "react-bootstrap";
import { ToolsSvg } from '../../lib/jssvg/SvgCollection';
import DaoForm from './DaoForm';


export default function CreateDao({user,setRefresh,t,tc}) {
    const [show, setShow] = useState(false); 

    return (<div className='mb-2' >
        <Button size="lg" variant="primary" onClick={e=>{setShow(true)}} ><ToolsSvg size={24} />mint {t('smartcommon')} </Button> 
        <Modal className='daism-title'  size="lg" show={show} onHide={(e) => {setShow(false)}} >
        <Modal.Header closeButton>mint {t('smartcommon')}</Modal.Header>
         <Modal.Body>
            <DaoForm user={user} setRefresh={setRefresh} t={t} tc={tc} setShow={setShow}/>
       </Modal.Body>
        </Modal>
        </div>
    );
}