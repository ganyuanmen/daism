"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { EditSvg } from '@/lib/jssvg/SvgCollection';
import { useLocale, useTranslations } from 'next-intl';
import { getDaismContract } from '@/lib/globalStore';
import { ethers } from 'ethers';
import { Card, Button, Modal } from 'react-bootstrap';
import { type RootState, type AppDispatch, setTipText,setErrText,setMessageText } from '@/store/store';
import Link from 'next/link';
import { daism_getTime } from '@/lib/utils/windowjs';
import { type DaoRecord } from '@/lib/mysql/daism';
import LogoEdit from './components/LogoEdit';
import DappVersion from './components/DappVersion';
import ManagerEdit from './components/ManagerEdit';
import DescEdit from './components/DescEdit';
import StrategyEdit from './components/StrategyEdit';
import TypeEdit from './components/TypeEdit';
import MemberAdd from './components/MemberAdd';
import MemberList from './components/MemberList';
import Image from 'next/image';



export default function ClientId({daoData}:{daoData:DaoRecord}) {
  const user = useSelector((state: RootState) => state.valueData.user);
  const t = useTranslations('dao');
  const tc = useTranslations('Common');
  
  const [mess, setMess] = useState(false); //显示操作后的提示窗口
  const [divdend, setDivdend] = useState('0');
  const [ismember, setIsmember] = useState(false); //是dao成员

  const dispatch = useDispatch<AppDispatch>();
  const showError = (str: string) => dispatch(setErrText(str));
  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));
  const locale = useLocale();

  const checkAddress = (v:string) => {
    return /^0x[0-9,a-f,A-F]{40}$/.test(v);
    }; 

  useEffect(() => {
    let ignore = false;
    if (user.connected === 1 && daoData.delegator){
        const _is = daoData.child.find(
            (obj) => obj.member_address.toLowerCase() === user.account.toLowerCase()
          );
          setIsmember(!!_is);
          
        const daismObj=getDaismContract();
        daismObj?.Dao.dividend(daoData.delegator, user.account).then((e: any) => {
            if (!ignore) setDivdend(parseFloat(ethers.formatUnits(e, 8)).toFixed(4));
          });
    }
    return () => {
      ignore = true;
    };
  }, [user, daoData]);

//提交提案
const upPro=(_address:string,_vote:number,_desc:string,proposalType:number)=>{
    showTip(t('submitingProText'));
    const pro:Proposal={
        account:_address,
        dividendRights:_vote,
        createTime:Math.floor(Date.now() / 1000),
        rights:0,
        antirights:0,
        desc:_desc,
        proposalType
      }

     const daismObj=getDaismContract();
     daismObj?.Dao.addProposal(daoData.delegator,pro).then(() => {
        closeTip();
        setMess(true);
        }, err => {
            console.error(err);
            closeTip();
            if(err.message && err.message.includes('proposal cooling period'))  showError(t('noCooling'))
            else if(err.message && err.message.includes('valid proposal exists'))  showError(t('noComplete'))
            else showError(tc('errorText')+(err.message?err.message:err));
        }
        );
}


//获取奖励权
const getDivdend=async ()=>{
    if(parseFloat(divdend)===0)
    {
        showError(t('currentAmount'))
        return
    }
    showTip(t('getDivdending')); 
    const daismObj=getDaismContract();
    daismObj?.Dao.getDividend(daoData.delegator,user.account).then(() => {
        closeTip()
        dispatch(setMessageText(t('divdendComplete')))
        // showError(`${t('divdendComplete')}_*_`)
        setDivdend('0')
      }, err => {
          console.error(err);closeTip();
          showError(tc('errorText')+(err.message?err.message:err));
      }
    );
}

  const bStyle: React.CSSProperties = { borderBottom: '1px solid gray' };
  
  return ( <>
        <Card className='daism-title mt-3'>
        <Card.Header> Smart Commons {t('infoText')}</Card.Header>
        <Card.Body>
            {/* 修改 logo */}
            <LogoEdit daoData={daoData} setMess={setMess} ismember={ismember} />

            {/* 更改dapp版本 */}
            <DappVersion daoData={daoData} ismember={ismember} user={user} checkAddress={checkAddress}
                showTip={showTip} closeTip={closeTip} showError={showError} />

            {/* 修改管理员 */}
            <ManagerEdit daoData={daoData} ismember={ismember} checkAddress={checkAddress} upPro={upPro} />

            {/* 修改描述 */}
            <DescEdit daoData={daoData} ismember={ismember} upPro={upPro} />

            {/* 提案策略 */}
            <StrategyEdit  daoData={daoData} ismember={ismember} upPro={upPro} />

            {/* 当前奖励数 */}
            { ismember && <div className='mb-3 p-1' style={bStyle}> {/*  当前奖励 */}
                <b>{t('currentDividend')}:</b> {'  '}(<span>UTO :</span> {divdend})
                <Button  style={{marginLeft:30}} onClick={getDivdend}  variant='primary'> <EditSvg size={16} /> {t('obtainDividends')} </Button>
                </div>
            }
            {/* 修改类型 dapp/eip/... */}
            <TypeEdit  daoData={daoData} ismember={ismember} upPro={upPro} />
        
            <div className='mb-3 p-1'  style={bStyle}>
                <span>{t('proLifeTime')} :</span> {daism_getTime(daoData.lifetime,t)} 
                <span style={{marginLeft:30}} >{t('proCoolTime')} :</span> {daism_getTime(daoData.cool_time,t)}  
            </div>

            {/* 增加成员  */}
            <MemberAdd  daoData={daoData} ismember={ismember} user={user} checkAddress={checkAddress} upPro={upPro}/>

            {/* 成员列表 */}
            <MemberList daoData={daoData} ismember={ismember} upPro={upPro} />
        </Card.Body>
        </Card>
       
     
            {/* 提示窗口 */}
        <Modal className="modal-dialog-scrollable daism-title " centered show={mess} onHide={() => {setMess(false)}} >
            <Modal.Header closeButton>
                <Modal.Title>{tc('tipText')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="daism-tip-body">
                <Image alt="" src='/mess1.svg' width={32} height={32} />
                <div className="daism-tip-text">
                    {t("uploadPro")}<br/>
                    <Link  href={`/${locale}/workroom#3`} as={`/${locale}/workroom#3`}>
                        {t('nowVote')}
                    </Link>
                </div>
            </Modal.Body>
        </Modal>
  </>
  );
}


