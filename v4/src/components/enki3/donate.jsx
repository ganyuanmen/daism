import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { InputGroup,Button,Form } from 'react-bootstrap';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
import ConfirmWin from '../federation/ConfirmWin';
import { client } from '../../lib/api/client';
import ShowErrorBar from '../ShowErrorBar';
import ShowAddress from '../ShowAddress';
import { getDaismContract } from '@/lib/globalStore';

const DonationPage = ({env,locale}) => {

  const [donationAmount, setDonationAmount] = useState('');
  const [donationStatus, setDonationStatus] = useState({});
  const [show,setShow]=useState(false);

  const user = useSelector((state) => state.valueData.user);

  let daismObj=getDaismContract();

  let tc = useTranslations('Common')
  let t = useTranslations('wallet')
  const dispatch = useDispatch();
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}

  const donateHandle=()=>{
    if(!daismObj) daismObj=getDaismContract();
    const v=parseFloat(donationAmount|| 0);
    showTip( t('submitDonate'))
    daismObj?.Donate.donate(v).then(() => {
      setShow(false)
        setTimeout(async () => {
          const res = await fetch(`/api/getData?did=${user.account}`,{headers:{'x-method':'getLastDonate'}});
          if(res.ok){
            const data=await res.json()
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
    if(isNaN(donationAmount)){showError(t('donateMinDonate'));return;}
    const v=parseFloat(donationAmount || 0);
    if(v<=0){showError(t('donateMinDonate'));return;}
    if(v>100){showError(t('donateMaxDonate'));return;}
    if(v>10) setShow(true); else donateHandle();

  };

  return (
    <div style={{maxWidth:'700px',margin:'0 auto',fontSize:'1.2em'}} >
     
        <h1 style={{color:'#e74c3c',textAlign:'center'}} ><img src="/logo.svg" alt="道易程" className="logo" /> {t('donateTitle')}</h1>
      

      <div style={{backgroundColor:'#f9f9f9',padding:'10px',borderRadius:'10px'}}>
        <p>{t('donateTop1')}
        {t('donateTop2')} (<a href={locale==='zh'?`https://learn.daism.io/zh/blogcn/136-pol.html`:'https://learn.daism.io/coreblog/138-pol?format=html'} target="_blank" rel="noopener noreferrer">{t('loveText')}</a>)
        —— {t('donateTop3')}
        </p>
        <ul>
          <li>{t('donatePromptText')}</li>
          <li>{t('donatePromptText1')}</li>
        </ul>      
      </div>

      {donationStatus?.block_num ? <div className='mt-3 mb-3'  style={{backgroundColor:'#f0f0f0',padding:'10px',borderRadius:'10px'}}>
          {t('donationStatusText',{num:donationAmount})}<br/>
          {t('donorText')} <a href='/honortokens'>{t('donorTextLink')}</a><br/>
          {t('rewardUTOText')}{' '}:{' '}{donationStatus?.uTokenAmount} <br/>
          {t('registerText')}(<a href='/smartcommons/actor' > {t('justRegister')} </a>)<br/>
          <a href='/smartcommons/actor' > {t('alreadyRegister')} </a>
        </div>:<> <div style={{display:'flex',justifyContent:'center'}} >
            <div className='mt-3 mb-3' style={{maxWidth:'340px'}} >
              <InputGroup size='lg' >
                            <InputGroup.Text>{t('donateNum')}</InputGroup.Text>
                            <Form.Control value={donationAmount} onChange={e=>{setDonationAmount(e.target.value)}}  style={{textAlign:"right"}}  />
                            <InputGroup.Text>ETH</InputGroup.Text>
                        </InputGroup> 
              <div className='mt-1'  style={{textAlign:'right'}} >
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}}  onClick={()=>{setDonationAmount(0.1)}}>0.1</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount(0.2)}}>0.2</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount(0.5)}}>0.5</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount(1)}}>1</Button>{' '}
                  <Button variant="light" style={{backgroundColor:'#e74c3c',color:'white',width:'60px'}} onClick={()=>{setDonationAmount(2)}}>2</Button>
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
        <img src='/donate.png'  /> 

        <div className='mt-3 mb-t' >
          <div> {t('donateAddress')}:{' '} <ShowAddress address={env?.Donation} /></div>
          <pre>{env?.Donation}</pre>
        </div>

       <span style={{color:'#777',fontSize:'0.9em'}} > {t('donatePromptText2')} </span>
      </div>
      <ConfirmWin show={show} setShow={setShow} callBack={donateHandle} question={t('donateConfirmText',{num:donationAmount})}/>
    </div>
  );
};

export default DonationPage;
