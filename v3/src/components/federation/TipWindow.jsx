
import { Modal,Button,InputGroup,Form, Alert} from "react-bootstrap";
import { YesSvg } from "../../lib/jssvg/SvgCollection";
import { useTranslations } from 'next-intl'
import { useEffect,useState } from "react";
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
import Member from "./Member";

/**
 * 确认窗口
 * @show 窗口显示标志
 * @setShow 关闭窗口
 * @owner 打赏人
 * @manager 打赏给的作者
*/
export default function TipWindow({owner,messageObj,locale}) 
{
    const [utokenBalance,setUtokenBalance]=useState('0');
    const [donationAmount, setDonationAmount] = useState('');
    const [hash, setHash] = useState('');
    const [uping, setUping] = useState(false);
    const [isMint, setIsMint] = useState(true);
    const t = useTranslations('ff');
    const tc = useTranslations('Common');
    const [show,setShow]=useState(false); //显示打赏窗口
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    useEffect(() => { 
      if(window.daismDaoapi) {
         window.daismDaoapi.UnitToken.balanceOf(owner).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})  
      }     
      }, [owner]);
   
 const callBack=()=>{
    const _uto=parseFloat(utokenBalance);
    const _tip=parseInt(donationAmount) || 0

    if(_tip<1) {
        showClipError(t('lessThenOne'));
        return;
    }
    if(_tip>_uto) {
        showClipError(t('InsufficientBalance'));
        return;
    }

    showTip(t('tipsing') );
    setUping(true)
    window.daismDaoapi.SingNft.mintTip(_tip,messageObj.manager,owner,isMint,`${messageObj.dao_id},${messageObj.message_id}`).then((re) => {
        setHash(re.hash)
        // setShow(false)
        closeTip();
        setUping(false)
     
       
      }, err => {
        setShow(false)
          console.error(err);
          closeTip();
          setUping(false)
          showClipError(tc('errorText')+(err.message?err.message:err));
      }
    );

 }
    
    return (<>
    <button className="daism-ff"  onClick={()=>setShow(true)} title={t('tipsTitle',{tips:messageObj.tips,utoken:messageObj.utoken})}> 🎁 </button>
        <Modal className="daism-title " show={show} onHide={() => {setShow(false);setHash('');setUping(false);}}>
            <Modal.Header closeButton>
                <Modal.Title>{t('tipText')}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
            <div className="mb-1" style={{fontSize:'1.2rem',paddingLeft:'10px'}} >{t('blanceText')} : {utokenBalance} UTO</div>
            <div className="input-group mb-1 input-group-lg">
            <span className="input-group-text" >{t('tipAuthor')}</span>
            <div className="form-control" ><Member messageObj={messageObj} locale={locale} /></div>
            </div>

               {hash?<Alert className="daism-tip-text mt-3 mb-3" >{t('alreadyTips')} {parseInt(donationAmount)} UTO<br/> hash:{hash}</Alert>
               :<>
                  <InputGroup size='lg' className="mb-2" >
                            <InputGroup.Text>{t('tipAmount')}</InputGroup.Text>
                            <Form.Control value={donationAmount} disabled={uping} onChange={e=>{setDonationAmount(e.target.value)}}  style={{textAlign:"right"}}  />
                            <InputGroup.Text>UTO</InputGroup.Text>
                </InputGroup> 
                <Form.Check className='mb-3' type="switch" id="custom-switch2" checked={isMint} onChange={()=>{setIsMint(e=>!e)}} label={t('minthonorText')} />
                <div className="mt-3 mb-3" style={{textAlign:'center'}} >
                    <Button variant="primary" disabled={uping}  onClick={callBack} ><YesSvg size={20} /> {t('tipButton')}</Button>
                </div>
                </>
                }
            </Modal.Body>
        </Modal>
        </>
    )
   
  

  }
  



