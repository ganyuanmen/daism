
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ShowAddress from '@/components/ShowAddress';
import { EditSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismInputGroup,{type DaismInputGroupHandle} from '@/components/form/DaismInputGroup';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    checkAddress:(v:string)=>boolean;
    upPro:(_address:string,_vote:number,_desc:string,proposalType:number)=>void;
}
export default function ManagerEdit({daoData,ismember,checkAddress,upPro}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);


    const managerRef=useRef<DaismInputGroupHandle>(null);

  
//修改dao管理者
const manager=()=>{
    const _address=managerRef.current?.getData();
    if(!_address) return;
    if (!checkAddress(_address)) {managerRef.current?.notValid(t('managerAddressValid'));return;}
    const _member=daoData.child.find((obj)=>{return obj.member_address.toLowerCase()===_address.toLowerCase()})
    if(!_member) {managerRef.current?.notValid(t('onlyMemberText'));return;}
    if(_address.toLowerCase()===daoData.dao_manager.toLowerCase()) {managerRef.current?.notValid(t('alreadyManagerText'));return;}
    setShow(false)
    upPro(_address,3,'',3) 
}

  return ( <>
    <div className='mb-3 p-1' style={{borderBottom: '1px solid gray'}} >
            {t('managerText')}:<ShowAddress  address={daoData.dao_manager} />  {'  '} 
            {ismember && <Button  style={{marginLeft:30}} onClick={()=>{setShow(true);}}  variant='primary'> 
                <EditSvg size={16} /> {t('updateManagerText')}</Button>}
        </div>
        <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <DaismInputGroup title={t('newManagerText')} ref={managerRef}  ></DaismInputGroup>
                <div style={{textAlign:'center'}} >
                <Button onClick={manager} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                </div>
            </Modal.Body>
        </Modal>
</>)
  }
  