import React, { useState,useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { InputGroup,Button,Form } from 'react-bootstrap';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
// import { EditSvg } from '../../lib/jssvg/SvgCollection';
// 
import ConfirmWin from '../federation/ConfirmWin';
import { client } from '../../lib/api/client';


// 引入二维码生成库

import ShowErrorBar from '../ShowErrorBar';
import ShowAddress from '../ShowAddress';

const DonationPage = ({env,locale}) => {

  const [donationAmount, setDonationAmount] = useState('');
  const [donationStatus, setDonationStatus] = useState({});
  const [show,setShow]=useState(false);

  const user = useSelector((state) => state.valueData.user);
  const inputRef=useRef();

  let tc = useTranslations('Common')
  let t = useTranslations('wallet')
  const dispatch = useDispatch();
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}

  const donateHandle=()=>{
    const v=parseFloat(donationAmount|| 0);
    showTip( t('submitDonate'))
    window.daismDaoapi.Donate.donate(v).then(() => {
      setShow(false)
        setTimeout(async () => {
          const res = await client.get(`/api/getData?did=${user.account}`,'getLastDonate');
          console.log(res)
          if(res.status===200){
            setDonationStatus(res.data);
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
     
        <h1><img src="/logo.svg" alt="道易程" className="logo" /> {t('donateTitle')}</h1>
      

      <div>
        <p>{t('donateTop1')}
        {t('donateTop2')} (<a href={locale==='zh'?`https://learn.daism.io/zh/blogcn/136-pol.html`:'https://learn.daism.io/coreblog/138-pol?format=html'} target="_blank" rel="noopener noreferrer">{t('loveText')}</a>)
        —— {t('donateTop3')}
        </p>
        <p>{t('donatePromptText')}<br/>
        {t('donatePromptText1')}<br/>
        {t('donatePromptText2')}</p>
       
      </div>
     <div className='mt-3 mb-3' style={{maxWidth:'340px'}} >
      <InputGroup>
                    <InputGroup.Text>{t('donateNum')}</InputGroup.Text>
                    <Form.Control value={donationAmount} onChange={e=>{setDonationAmount(e.target.value)}}  style={{textAlign:"right"}}  />
                    <InputGroup.Text>ETH</InputGroup.Text>
                </InputGroup> 
      <div style={{textAlign:'right'}} >
          <Button variant="light" onClick={()=>{setDonationAmount(0.1)}}>0.1</Button>
          <Button variant="light" onClick={()=>{setDonationAmount(0.2)}}>0.2</Button>
          <Button variant="light" onClick={()=>{setDonationAmount(0.5)}}>0.5</Button>
          <Button variant="light" onClick={()=>{setDonationAmount(1)}}>1</Button>
          <Button variant="light" onClick={()=>{setDonationAmount(2)}}>2</Button>
      </div>

      </div>
    
   <ConfirmWin show={show} setShow={setShow} callBack={donateHandle} question={t('donateConfirmText',{num:donationAmount})}/>


        {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />

        :<><div style={{maxWidth:'340px'}}><Button style={{width:'100%'}} onClick={handleDonation} >{t('donateText')}</Button></div>
        
        <div className='mb-3' style={{color:'#999',fontSize:'0.9em'}} >{t('donateCSS0Text')}</div></>
        }

   
        <p>{t('donatrQcodeText')}：</p>
        <p><img src='/donate.png'  /> </p>

        <div className='mt-3 mb-t' >
          <div> {t('donateAddress')}:{' '} <ShowAddress address={env?.Donation} /></div>
          <pre>{env?.Donation}</pre>
        </div>

      {donationStatus?.block_num && (
        <div>
          <p>{t('donationStatusText',{num:donationAmount})}</p>
          <p>{t('donorText')} <a href='/honortokens'>{t('donorTextLink')}</a></p>
          <p>{t('rewardUTOText')}:{donationStatus?.uTokenAmount} </p>
          <p>{t('registerText')}</p>
          <p> <a href='/smartcommons/actor' > {t('justRegister')} </a></p>
          <p> <a href='/smartcommons/actor' > {t('alreadyRegister')} </a></p>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
