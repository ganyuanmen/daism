
import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AddSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismInputGroup,{type DaismInputGroupHandle} from '@/components/form/DaismInputGroup';

interface PropsType{
    daoData:DaoRecord;
    ismember:boolean; //是否为dao成员
    user:DaismUserInfo;
    checkAddress:(v:string)=>boolean;
    upPro:(_address:string,_vote:number,_desc:string,proposalType:number)=>void;
}
export default function MemberAdd({daoData,ismember,upPro,user,checkAddress}:PropsType) {
    const t = useTranslations('dao');
    const [show,setShow]=useState(false);

    const memberAddressRef=useRef<DaismInputGroupHandle>(null);
    const voteRef=useRef<DaismInputGroupHandle>(null);

  
   //增加成员
   const add=()=>{
    const _address=memberAddressRef.current?.getData();
    if (!_address || !checkAddress(_address)) {
        memberAddressRef.current?.notValid(t('managerAddressValid'))
      return
    }

    const _vote=parseInt(voteRef.current?.getData()??'0')
    if (isNaN(_vote) || _vote <1 ) {
        voteRef.current?.notValid(t('voteErr'))
      return
    }

    const _member=daoData.child.find((obj)=>{return obj.member_address.toLowerCase()===_address.toLowerCase()})
    if(_member) {
        memberAddressRef.current?.notValid(t('alreadyMember'))
        return
    }
    setShow(false)
    upPro(_address,_vote,'',9) 

}



  return ( <>
    <div className='mb-3 p-1' >
            <b>{t('daoMemberText')}:</b>
            {ismember && <Button style={{marginLeft:30}} onClick={()=>{setShow(true);
                        }}  variant='primary'> <AddSvg size={16} /> {t('addMember')} 
                </Button>
            }
        </div>
        <Modal  className='daism-title' show={show} onHide={() => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <DaismInputGroup title={t('memberAddress')} ref={memberAddressRef} defaultValue={user.account} ></DaismInputGroup>
                <DaismInputGroup title={t('memberVoteText')} ref={voteRef} defaultValue={10} ></DaismInputGroup>
                <div style={{textAlign:'center'}} >
                <Button onClick={add} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                </div>
            </Modal.Body>
        </Modal>
        
</>)
  }
  