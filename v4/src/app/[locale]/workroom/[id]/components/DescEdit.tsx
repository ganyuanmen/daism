
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EditSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismTextarea,{type DaismTextareaHandle} from '@/components/form/DaismTextarea';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    upPro:(_address:string,_vote:number,_desc:string,proposalType:number)=>void;
}
export default function DescEdit({daoData,ismember,upPro}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);

    const descRef=useRef<DaismTextareaHandle>(null);

    
//修改dao描述
const modifyDesc=()=>{
    const _desc=descRef.current?.getData();
    if(!_desc) return;
    setShow(false)
    upPro(daoData.dao_manager,2,_desc,2) 
}

  return ( <>
   <div className='mb-3 p-1'  style={{borderBottom: '1px solid gray'}}>
            <b>{t('descText')}:</b>  {'  '} 
            {ismember && 
                <Button style={{marginLeft:30}}  onClick={()=>{setShow(true);}}  variant='primary'> 
                    <EditSvg size={16} /> {t('changeDescText')} 
                </Button>
            }
            <p className='mt-3' >{daoData.dao_desc}</p>
        </div>
        <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                
                <DaismTextarea ref={descRef} defaultValue={daoData.dao_desc} title={t('daoDescText')}></DaismTextarea>    
                <div style={{textAlign:'center'}} >
                <Button onClick={modifyDesc} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                </div>
            </Modal.Body>
        </Modal>
</>)
  }
  