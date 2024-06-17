import { Nav, NavDropdown,Modal } from 'react-bootstrap';
import LoginButton from '../LoginButton';
import { useEffect, useRef, useState } from 'react';
import { UserSvg,WalletSvg ,AccountSvg,Member,LoginSvg,ExitSvg,ExitWalletSvg,DateSvg } from '../../lib/jssvg/SvgCollection'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import ShowImg from '../ShowImg';
import Image from 'next/image'

export default function User({user,daoAddress,loginsiwe,t,...props}) {

  
  const loginRef=useRef()
  const router = useRouter();
  // const [admin,setAdmin]=useState(false) //是否是超级管理员
  const [show,setShow]=useState(false)

  const actor = useSelector((state) => state.valueData.actor)
   
  // useEffect(() => {
  //  setAdmin(daoAddress.administrator?.toLowerCase()===user.account?.toLowerCase())
  // }, [user.account,daoAddress]);

  const handleSelect = (eventKey) =>{ 
    switch(eventKey)
    {
        case "1":
           router.push(`/workroom/walletinfo`, { scroll: false })
        break;
        case "2":
          router.push(`/communities/actor`, { scroll: false })
          break;
        case "3":
          router.push(`/communities/mydao`, { scroll: false })
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
        default:
        break;
     
    } 
   
}
    return (<>
      <Nav onSelect={handleSelect}  style={{display:"inline-block"}} >
      <NavDropdown   title={
        <span className='daism-color' >{actor && actor.member_icon?<ShowImg path={actor.member_icon} alt='' width="32px" height="32px" borderRadius='50%'/> :<AccountSvg /> }  </span>
      } >
        <NavDropdown.Item eventKey="1"><span className='daism-color' ><WalletSvg  size={24}/></span> {t('myWalletText')}...</NavDropdown.Item>
        <NavDropdown.Item eventKey="2"><span className='daism-color' ><UserSvg size={24}/></span> {t('myAccount')}...</NavDropdown.Item>
        <NavDropdown.Item eventKey="3"><span className='daism-color' ><Member size={24}/></span> {t('daoGroupApprove')} </NavDropdown.Item>
        <NavDropdown.Item eventKey="4"><span className='daism-color' ><Member size={24}/></span> {t('daoDividend')} </NavDropdown.Item>
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
            <Image src="/communities.svg" style={{borderRadius:'50%'}}  width={64}  height={64}  alt="Dasim"    /> 
            <span style={{fontSize:"42px",marginLeft:"30px",fontWeight:"bold" }} >  EnKi</span>
         </div>
        <hr/>
        <div className='mb-3 mt-3' >
         <strong>  Version:0.1 </strong>
        </div>
        </Modal.Body>
    </Modal>
    </>
    );
}
