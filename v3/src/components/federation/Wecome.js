
import { useRef } from "react";
import { Button } from "react-bootstrap";
import LoginButton from "../LoginButton";
import { useTranslations } from 'next-intl'



export default function Wecome() {
    const t = useTranslations('ff')
    const loginRef=useRef(null)
    
    return (
        
        <div style={{paddingTop:'30px'}}>
            <div style={{fontSize:'1.8em',fontWeight:'bold',textAlign:'center',marginBottom:'6px'}} >{t('federationWecomeText0')}</div>
            <div style={{display:'flex',alignItems:'flex-start'}} >
                <div style={{borderRight:'1px solid gray',paddingRight:'30px'}} >
                    <div style={{fontSize:'1.4em',fontWeight:'bold'}} >{t('federationWecomeText1')}:</div>
                    <ul style={{fontSize:'1.3em',lineHeight:'2em'}}>
                        <li>{t('federationWecomeText2')}</li>
                        <li>{t('federationWecomeText3')}</li>
                        <li>{t('federationWecomeText4')}</li>
                        <li>{t('federationWecomeText5')}</li>
                        <li>{t('federationWecomeText6')}</li>
                        <li>{t('federationWecomeText7')}</li>
                    </ul>
                </div >
                <div style={{paddingLeft:'30px',fontSize:'2em',paddingBottom:'30px'}}  >
                    <Button variant="primary" onClick={()=>loginRef.current.siweLogin()} >
                        <img alt='' src='/loginbutton.svg' width={18} height={18} style={{color:'white'}} />  {'  '}
                        <LoginButton  ref={loginRef} ></LoginButton>
                    </Button>
                </div>
            </div>           
        </div>
    );
}

