
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import LogoPro from '../LogoPro';
import Image from 'next/image';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    setMess: (show: boolean) => void; //显示操作后的提示窗口
}
export default function LogoEdit({daoData,ismember,setMess}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);

  return ( <>
    <div className='mb-3 p-1' style={{ borderBottom: '1px solid gray'}} >
        <Image height={32} width={32} alt='' src={daoData.dao_logo?daoData.dao_logo:'/logo.svg'} />{'  '}
        <b>{daoData.dao_name}({daoData.dao_symbol})</b> {'  '}
        {ismember && <Button  style={{marginLeft:30}} variant="primary" onClick={()=>{setShow(true)}} >
            {t('logoChangeText')}
            </Button>
        }
    </div>
    <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <LogoPro daoName={daoData.dao_name} setMess={setMess}
             setChangeLogo={setShow} delegator={daoData.delegator} />
        </Modal.Body>
    </Modal>
</>)
  }
  