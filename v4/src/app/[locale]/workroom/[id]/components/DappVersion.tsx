
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import { getDaismContract } from '@/lib/globalStore';
import ShowAddress from '@/components/ShowAddress';
import { EditSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismInputGroup,{type DaismInputGroupHandle} from '@/components/form/DaismInputGroup';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    user:DaismUserInfo;
    checkAddress:(v:string)=>boolean;
    showTip:(v:string)=>void;
    closeTip:()=>void;
    showError:(v:string)=>void;
}
export default function DappVersion({daoData,ismember,user,checkAddress,showTip,closeTip,showError}:PropsType) {
    const t = useTranslations('dao');
    const tc = useTranslations('Common');
    const [show,setShow]=useState(false);
    const [showPopover, setShowPopover] = useState(false);

    const updateRef=useRef<DaismInputGroupHandle>(null);

     // Popover 类型
  const popover = (
    <Popover>
      <Popover.Header as="div" className="d-flex justify-content-between align-items-center">
        <div>{t('upgradeText')}</div>
        <Button
          style={{ margin: 0, padding: 0 }}
          variant="link"
          onClick={() => setShowPopover(false)}
        >
          &times;
        </Button>
      </Popover.Header>
      <Popover.Body>
        {daoData?.version.map((obj, idx) => (
          <div key={idx} className="mb-2" style={{ borderBottom: '1px solid gray' }}>
            <div>{t('dateText')}: {obj._time}</div>
            <div>{t('addressText')}: <ShowAddress address={obj.creator} /></div>
            <div>{t('lastVersion')}: {obj.dao_version}</div>
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );
  
  //直接修改，不用提案
const creatorEdit=()=>{
    const _address=updateRef.current?.getData();
    if(!_address) return;
    if (!checkAddress(_address)) {updateRef.current?.notValid(t('managerAddressValid'));return;}
    if(_address.toLowerCase()===daoData.creator.toLowerCase()) {updateRef.current?.notValid(t('alreadyCreatorText'));return;}
    setShow(false)
    showTip(t('submittingText'));
    const daismObj=getDaismContract();
    daismObj?.Register.proposeUpdate(daoData.dao_id,_address).then(() => {
        setTimeout(() => {closeTip();}, 1000);
    }, err => {
        console.error(err);closeTip();showError(tc('errorText')+(err.message?err.message:err));
    });
}


  return ( <>
    {daoData.sctype==='dapp' && <div className='mb-3 p-1' style={{borderBottom: '1px solid gray'}}  >
            {t('execText')}:<ShowAddress  address={daoData.creator} />  {'  '} 
            {ismember &&  user.account.toLowerCase()===daoData.dao_manager.toLowerCase() &&
                <Button  style={{marginLeft:30}} onClick={()=>{  setShow(true);}}  variant='primary'> 
                <EditSvg size={16} /> {t('updateText')}</Button>
            }{'  '} 
         
           
        {/* 显示版本号记录 */}
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover} show={showPopover} 
            onToggle={(show) => setShowPopover(show)}>
                <Button variant="success" onClick={() => setShowPopover(!showPopover)}>{t('versionText')}</Button>
            </OverlayTrigger>
        </div>
        }
        <Modal className='daism-title' show={show} onHide={() => {setShow(false)}} >
        <Modal.Header closeButton></Modal.Header>
         <Modal.Body>
            <DaismInputGroup title={t('newCreatroText')} ref={updateRef}  ></DaismInputGroup>
            <div style={{textAlign:'center'}} >
            <Button onClick={creatorEdit} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
            </div>
        </Modal.Body>
        </Modal>
</>)
  }
  