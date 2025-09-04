'use client';
import {ReactNode} from 'react';
import {useLocale, useTranslations } from 'next-intl';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'
import React, { memo } from 'react';



import Wallet from './wallet/Index';

type Props = {
  children?: ReactNode;
};

const PageLayout = memo(({children}: Props) => {

 
  const t = useTranslations('Navigation')
  const locale = useLocale();
  const pathWiLocale = usePathname() || ''; // 当前路径，例如 /en/about
  const pathname = pathWiLocale.replace(`/${locale}`, '') || '/';
  // const { locale, locales, route,query } = useRouter()
  // const [showAlert, setShowAlert] = useState(true);
  // const otherLocale = locales?.find((cur) => cur !== locale)
  // const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  // const path=`${route}${restoredURL.length>1?restoredURL:''}`
  const tc = useTranslations('Common')
  // const handleCloseAlert=()=>{ setShowAlert(false);}
  return (
    <>
  
    <Container style={{paddingTop:'50px'}}  >
      <div style={{backgroundColor:'white',height:'50px',width:'100%',position:'fixed',top:'0px',zIndex:999}} >
        
      </div>
       <Navbar collapseOnSelect expand="lg"  className='pnavbar'>
        <Container className='pmenu'>
            <Navbar.Brand href={locale==='zh'?'/zh':`/en`}>
            <Image src="/logo.svg"  alt="daism Logo"  width={32} height={32}   />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end"  id="basic-navbar-nav">
            
                <Nav  style={{width:'100%'}}>
                  <div className="d-flex flex-row p-0 m-0 ">
                  <Nav.Link className={pathname === '/'  ? 'pnavactive'  : ''}  href={`/${locale}`}><div className='no-wrap' > {t('home')}</div></Nav.Link>
                  <NavDropdown className={pathname.startsWith('/communities') ? 'pnavactive'  : ''} title={t('social')} id="basic-nav-dropdown1">   
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={pathname === '/communities/enki' ? 'pnavactive'  : ''} href={`/${locale}/communities/enki?v=${process.env.NEXT_PUBLIC_VERSION}`} > {t('myCommunity')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={pathname === '/communities/SC' ? 'pnavactive'  : ''} href={`/${locale}/communities/SC?v=${process.env.NEXT_PUBLIC_VERSION}`} > {t('publicCommunities')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={pathname === '/communities/enkier' ? 'pnavactive'  : ''} href={`/${locale}/communities/enkier?v=${process.env.NEXT_PUBLIC_VERSION}`} > {t('personalSocial')}</NavDropdown.Item>
                  </NavDropdown>
                
                  <Nav.Link className={pathname === '/smartcommons' ? 'pnavactive' : ''} href={`/${locale}/smartcommons`}><div className='no-wrap' >{t('smarcommon')}</div></Nav.Link> 
                  <Nav.Link className={pathname === '/honortokens' ? 'pnavactive'  : ''} href={`/${locale}/honortokens`} ><div className='no-wrap' >{t('nft')}</div></Nav.Link> 
                  
                  <Nav.Link style={{display:'none'}} href='/listbook' >listBook</Nav.Link> 

                  </div>
                  <div  className="d-flex flex-row p-0 m-0 ">
                 
                  {/* <Nav.Link className={pathname === '/deval'  ? 'pnavactive'  : ''}  href={`/${locale}/deval`}><div className='no-wrap' >{t('iadd')}</div></Nav.Link> */}

                  <NavDropdown title={t('college')} id="basic-nav-dropdown2">
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale==='en'?"https://learn.daism.io":"https://learn.daism.io/zh"}><div className='no-wrap' >{t('daism')}</div></NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale==='en'?"https://learn.daism.io/docs.html":"https://learn.daism.io/zh/docs.html"}><div className='no-wrap' >{t('doc')}</div></NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link className={pathname === '/workroom' ? 'pnavactive'  : ''}  href={`/${locale}/workroom`} ><div className='no-wrap' >{t('my')}</div></Nav.Link>
                  </div>
                </Nav>
                <Navbar.Text>
                  <Wallet /> 
                </Navbar.Text>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <div  >
            {children}
        </div>
    
    </Container>
    {!pathname.startsWith('/communities') && !pathname.startsWith('/smartcommons/actor') && 
      <footer className="d-flex justify-content-center daism-foot align-items-center flex-column  " style={{margin:'10px',padding:'20px'}} >
          <div className="fs-4 mb-2"><strong> DAism.io</strong></div>
          <div>
            <div className="fs-5 mb-1">{tc('footerText')}</div> 
            <div className="fs-6">{tc('foot11')} 1.15792x10<sup>69</sup> UTO {tc('foot12')}</div>
            <div className="fs-6">{tc('foot2')} : jeedd</div>  
            <div className="fs-6">{tc('foot31')} : uToken（{tc('foot32')}：UTO）</div>  
          </div>
      </footer>
    }   
      
    </>
  )
});

PageLayout.displayName = 'PageLayout'; // 帮助调试

export default PageLayout;

