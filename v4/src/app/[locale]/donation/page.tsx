"use client";
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { InputGroup,Button,Form } from 'react-bootstrap';
import { useDispatch} from 'react-redux';
import {setTipText,setErrText,type RootState,type AppDispatch} from '@/store/store'
import ConfirmWin from '@/components/federation/ConfirmWin';
import ShowErrorBar from '@/components/ShowErrorBar';
import ShowAddress from '@/components/ShowAddress';
import { getDaismContract } from '@/lib/globalStore';
import Image from 'next/image';
import Link from 'next/link';

interface DonaType{
    block_num:bigint;
    donationAmount:number;
    uTokenAmount:number;
    totalDonationETH:number;
    donationTime:number;
    donor_address:string;
    tokenid:number;
}

export default function Donation() {

  const [donationAmount, setDonationAmount] = useState('');
  const [donationStatus, setDonationStatus] = useState<DonaType>({} as DonaType );
  const [show,setShow]=useState(false);

  const user = useSelector((state:RootState) => state.valueData.user);

  const locale = useLocale();
  const tc = useTranslations('Common')
  const t = useTranslations('wallet')
  const dispatch = useDispatch<AppDispatch>();
  function showError(str:string){dispatch(setErrText(str))}
  function showTip(str:string){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}

  const donateHandle=(v:number)=>{
    const daismObj=getDaismContract();
    // const v=Number(donationAmount|| '0');
    showTip( t('submitDonate'))
    daismObj?.Donate.donate(v).then(() => {
      setShow(false)
        setTimeout(async () => {
          const res = await fetch(`/api/getData?did=${user.account}`,{headers:{'x-method':'getLastDonate'}});
          if(res.ok){
            const data=await res.json() as DonaType;
            setDonationStatus(data);
          }
          closeTip();
        }, 2000);
       
      }, err => {
          console.error(err);
          closeTip();
          showError(tc('errorText')+(err.message?err.message:err));
      }
    );

  }

  const handleDonation = () => {
    if(isNaN(Number(donationAmount))){showError(t('donateMinDonate'));return;}
    const v=Number(donationAmount || '0');
    if(v<=0){showError(t('donateMinDonate'));return;}
    if(v>100){showError(t('donateMaxDonate'));return;}
    if(v>10) setShow(true); else donateHandle(v);

  };

  return (
    <div style={{maxWidth:'700px',margin:'0 auto',fontSize:'1.2em'}} >
     
        <h1 style={{color:'#e74c3c',textAlign:'center'}} ><Image src="/logo.svg" alt="道易程" className="logo" /> {t('donateTitle')}</h1>
      

      <div style={{backgroundColor:'#f9f9f9',padding:'10px',borderRadius:'10px'}}>
        <p>{t('donateTop1')}
        {t('donateTop2')} (<Link href={locale==='zh'?`https://learn.daism.io/zh/blogcn/136-pol.html`:'https://learn.daism.io/coreblog/138-pol?format=html'} target="_blank" rel="noopener noreferrer">{t('loveText')}</Link>)
        —— {t('donateTop3')}
        </p>
        <ul>
          <li>{t('donatePromptText')}</li>
          <li>{t('donatePromptText1')}</li>
        </ul>      
      </div>

      {donationStatus?.block_num ? <div className='mt-3 mb-3'  style={{backgroundColor:'#f0f0f0',padding:'10px',borderRadius:'10px'}}>
          {t('donationStatusText',{num:donationAmount})}<br/>
          {t('donorText')} <Link href='/honortokens'>{t('donorTextLink')}</Link><br/>
          {t('rewardUTOText')}{' '}:{' '}{donationStatus?.uTokenAmount} <br/>
          {t('registerText')}(<Link href='/smartcommons/actor' > {t('justRegister')} </Link>)<br/>
          <Link href='/smartcommons/actor' > {t('alreadyRegister')} </Link>
        </div>:<> <div style={{display:'flex',justifyContent:'center'}} >
            <div className='mt-3 mb-3' style={{maxWidth:'340px'}} >
              <InputGroup size='lg' >
                            <InputGroup.Text>{t('donateNum')}</InputGroup.Text>
                            <Form.Control value={donationAmount} onChange={e=>{setDonationAmount(e.target.value)}}  style={{textAlign:"right"}}  />
                            <InputGroup.Text>ETH</InputGroup.Text>
                        </InputGroup> 
              <div className='mt-1'  style={{textAlign:'right'}} >
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}}  onClick={()=>{setDonationAmount('0.1')}}>0.1</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount('0.2')}}>0.2</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount('0.5')}}>0.5</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount('1')}}>1</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount('2')}}>2</Button>
              </div>
            </div>
          </div>
          
            {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />

            :<div style={{textAlign:'center'}} >
              <div style={{display:'flex',justifyContent:'center'}} >
                <div style={{maxWidth:'340px'}}><Button style={{width:'100px'}} onClick={handleDonation} >{t('donateText')}</Button></div>
              </div>
              <div className='mb-3' style={{color:'#777',fontSize:'0.9em'}} ><input type="checkbox" checked={true} disabled={true}  /> {t('donateCSS0Text')}</div>
            </div>
            }
       </>
      }
      
        <div className='mt-3'  style={{backgroundColor:'#f0f0f0',textAlign:'center',padding:'10px',borderRadius:'10px'}} >
        <p>{t('donatrQcodeText')}：</p>
        <Image src='/donate.png' alt=''  /> 

        <div className='mt-3 mb-t' >
          <div> {t('donateAddress')}:{' '} <ShowAddress address={process.env.NEXT_PUBLIC_DONATION as string} /></div>
          <pre>{process.env.NEXT_PUBLIC_DONATION}</pre>
        </div>

       <span style={{color:'#777',fontSize:'0.9em'}} > {t('donatePromptText2')} </span>
      </div>
      <ConfirmWin show={show} setShow={setShow} callBack={donateHandle} question={t('donateConfirmText',{num:donationAmount})}/>
    </div>
  );
};


