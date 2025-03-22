import { Nav, NavDropdown,Modal } from 'react-bootstrap';
import LoginButton from '../LoginButton';
import { useRef, useState } from 'react';
import { UserSvg,WalletSvg ,AccountSvg,LoginSvg,ExitSvg,ExitWalletSvg,DateSvg,SwapTokenSvg,TokenSvg,AppSvg,UploadSvg   } from '../../lib/jssvg/SvgCollection'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import {setTipText,setMessageText} from '../../data/valueData'
import { useDispatch,useSelector} from 'react-redux';
import Loginsign from '../Loginsign';

export default function User({user,loginsiwe,t,env,...props}) {

  const loginRef=useRef()
  const router = useRouter();
  const [show,setShow]=useState(false)
  const [upshow,setUpshow]=useState(false)
  const [file, setFile] = useState(null);
  const actor = useSelector((state) => state.valueData.actor)
  

  const dispatch = useDispatch();
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  

  const handleSelect =async (eventKey) =>{ 
    switch(eventKey)
    {
        case "1":
          router.push(`/workroom/walletinfo`, { scroll: false })
          break;
        case "2":
          router.push(`/smartcommons/actor`, { scroll: false })
          break;
        case "3":
          router.push(`/smartcommons/mySC`, { scroll: false })
          break;
        case "4":
           router.push(`/workroom/dividend`, { scroll: false })
           break;
        case "5":
        case "7":
          props.disconnect()
          break;
        case '6':
          loginRef.current.siweLogin()  
          break;
        case '8':
          setShow(true)
          break;
          // case "9":
          //   router.push(`/transfer`, { scroll: false })
          //   break;
        // case 'a':
        //   showTip('正在创建荣誉通证，请稍候...')
        //   try {
        //     await window.daismDaoapi.Unft.mint();
        //     showError('荣誉通证创建成功_*_');
        //   } catch (err) {
        //     showError("错误："+(err.message ? err.message : err));
        //   }finally{
        //     closeTip()
        //   }
        //   break;
        case 'b':
         // if (fileInputRef.current) {fileInputRef.current.click()}
         setUpshow(true)
          break;
        default:
          break;
     
    } 
   
}

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!actor?.actor_account && !actor.actor_account?.includes('@')){
      return showError(t('notRegisterEnki'))
    }
    if(actor.actor_account.split('@')[1]!=env.domain) {
      return showError(t('registerDomain',{domain:env.domain}))
    }

    const formData = new FormData();
    formData.append('jsonFile', file);
    showTip(t('uploadingText'))
    const response = await fetch('/api/mastodon', {
      method: 'POST',
      // headers:{encType:'multipart/form-data'},
      body: formData,
    });
    closeTip()
    const data = await response.json();

    if (response.ok) {
      showError(`${data.msg}_*_`);
    } else {
      showError(data.errMsg);
    }
   
    setUpshow(false)
  };

    return (<>
      <Nav onSelect={handleSelect}  style={{display:"inline-block"}} >
      <NavDropdown   title={
        <span className='daism-color' >{actor?.avatar?<img src={actor.avatar}  alt={actor?.actor_account} width={32} height={32} /> :<AccountSvg /> }  </span>
      } >
        {/* <NavDropdown.Item eventKey="a"><span className='daism-color' ><SwapTokenSvg size={24}/></span> 中本聪 荣誉通证 </NavDropdown.Item>  */}
        <NavDropdown.Item eventKey="1"><span className='daism-color' ><WalletSvg  size={24}/></span> {t('myWalletText')}...</NavDropdown.Item>
        <NavDropdown.Item eventKey="2"><span className='daism-color' ><UserSvg size={24}/></span> {t('myAccount')}...</NavDropdown.Item>
        <NavDropdown.Item eventKey="3"><span className='daism-color' ><AppSvg  size={24}/></span> {t('daoGroupApprove')} </NavDropdown.Item>
        <NavDropdown.Item eventKey="4"><span className='daism-color' ><TokenSvg  size={24}/></span> {t('daoDividend')} </NavDropdown.Item>
        {/* <NavDropdown.Item eventKey="9"><span className='daism-color' ><SwapTokenSvg size={24}/></span> {t('getTestEth')} </NavDropdown.Item> */}
       {actor?.actor_account && <NavDropdown.Item eventKey="b"><span className='daism-color' ><SwapTokenSvg size={24}/></span> {t('importText')} mastodon </NavDropdown.Item>}
       {/* {admin && <NavDropdown.Item eventKey="4"><span className='daism-color' ><MemberVerify size={24}/></span> {t('daoMemberVerify')}</NavDropdown.Item> } */}
        <NavDropdown.Divider />
      {loginsiwe?<NavDropdown.Item eventKey="5"><span className='daism-color' ><ExitSvg size={24}/></span> {t('exitText')}</NavDropdown.Item>
      :<><NavDropdown.Item eventKey="6"><span className='daism-color' ><LoginSvg size={24}/></span>  <LoginButton  ref={loginRef}  /></NavDropdown.Item>
      <NavDropdown.Item eventKey="7"><span className='daism-color' > <ExitWalletSvg size={24}/></span> {t('exitWalletText')}</NavDropdown.Item>
      </>
      }
      <NavDropdown.Item eventKey="8"><span className='daism-color' ><DateSvg size={24}/></span> {t('about')} </NavDropdown.Item>
      </NavDropdown>
    </Nav>
    <Modal className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
        <Modal.Header closeButton>About </Modal.Header>
        <Modal.Body  >
          <div className='d-flex justify-content-start align-items-center' >
            <Image src="/enki.svg"  width={64}  height={64}  alt="Dasim"    /> 
            <span style={{fontSize:"42px",marginLeft:"30px",fontWeight:"bold" }} >  EnKi</span>
         </div>
        <hr/>
        <div className='mb-3 mt-3' >
         <strong>  Version:{env.version} </strong>
        </div>
        </Modal.Body>
    </Modal>
    <Modal className='daism-title' show={upshow} onHide={(e) => {setUpshow(false)}}>
        <Modal.Header closeButton>{t('uploadWalletText')} </Modal.Header>
        <Modal.Body  >
        { loginsiwe?
          <form onSubmit={handleSubmit}>
            <h4>{t('selectOutboxjson')}</h4>
            <div className='mb-3 mt-3'>
            <input type="file" accept=".json" onChange={handleFileChange} required />
            </div>
            
            <div>

            </div>
            <div style={{textAlign:"center"}} className='mb-3 mt-3' >
            <button className='btn btn-primary'  type="submit"> <UploadSvg size={24} /> {t('submitText')}</button>
            </div>
           
          </form>
          :<><h4>{t('notLoginText')}</h4><br/> <Loginsign /></>}
          
       
        </Modal.Body>
    </Modal>

  
    </>
    );
}
