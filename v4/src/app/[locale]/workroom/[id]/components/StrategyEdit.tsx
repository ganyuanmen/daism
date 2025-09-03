
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
export default function StrategyEdit({daoData,ismember,upPro}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);

    const strategyRef=useRef<DaismInputGroupHandle>(null);

//修改策略
const strategy=()=>{
    const _vote=parseInt(strategyRef.current?.getData()??'0')
    if (isNaN(_vote) || _vote <0 || _vote>100 ) {strategyRef.current?.notValid(t('passRateText'));return;}
    setShow(false)
    upPro('0x0000000000000000000000000000000000000000',Math.floor(655.35*_vote),'',0) 
}


  return ( <>
    <div className='mb-3 p-1' style={{borderBottom: '1px solid gray'}} >
            <b>{t('proStrategyText')}:</b> {'  '} (<span>{t('voteRateText')}:</span> {daoData.strategy} %)
            {ismember && <Button  style={{marginLeft:30}} onClick={()=>{setShow(true);
                        }}  variant='primary'> <EditSvg size={16} /> {t('changeStrategyText')} 
                </Button>
            }
        </div>
        <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                
                <DaismInputGroup title={`${t('voteRateText')}%(0-100)`} ref={strategyRef} defaultValue={100} ></DaismInputGroup>
                <div style={{textAlign:'center'}} >
                <Button onClick={strategy} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                </div>
            </Modal.Body>
        </Modal>
        
</>)
  }
  