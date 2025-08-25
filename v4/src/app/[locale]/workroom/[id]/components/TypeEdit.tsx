
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EditSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismInputGroup,{type DaismInputGroupHandle} from '@/components/form/DaismInputGroup';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    upPro:(_address:string,_vote:number,_desc:string,proposalType:number)=>void;
}
export default function TypeEdit({daoData,ismember,upPro}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);

    const typeRef=useRef<DaismInputGroupHandle>(null);

  //修改类型
  const typeEdit=()=>{
    let _type=typeRef.current?.getData();

    if(!_type) {typeRef.current?.notValid(t('noEmpty'));return;}
    setShow(false)
    upPro('0x1000000000000000000000000000000000000000',4,_type,4) 
}



  return ( <>
    <div className='mb-3 p-1' style={{borderBottom: '1px solid gray'}} >
            <b>{t('typeName')}:</b> {'  '} ({daoData.sctype})
            {ismember && <Button  style={{marginLeft:30}} onClick={e=>{setShow(true)}}  variant='primary'> 
                <EditSvg size={16} /> {t('editTypeText')}
                </Button>
            }
        </div>
        <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <DaismInputGroup title={t('typeName')} ref={typeRef}  ></DaismInputGroup>
                <div style={{textAlign:'center'}} >
                <Button onClick={typeEdit} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                </div>
            </Modal.Body>
        </Modal>
        
</>)
  }
  