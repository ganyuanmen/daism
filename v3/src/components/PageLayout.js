import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'
import Wallet from './Wallet'
import Loddingwin from './Loddingwin'
import ShowTip from './ShowTip'
import ShowNotice from './enki3/ShowNotice'
// import React, { useState } from 'react';

export default function PageLayout({children,env}) {

  const t = useTranslations('Navigation')
  const { locale, locales, route,query } = useRouter()
  // const [showAlert, setShowAlert] = useState(true);
  const otherLocale = locales?.find((cur) => cur !== locale)
  // const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  // const path=`${route}${restoredURL.length>1?restoredURL:''}`
  const tc = useTranslations('Common')
  // const handleCloseAlert=()=>{ setShowAlert(false);}
  return (
    <>
  
    <Container style={{paddingTop:'60px'}}  >
      <div style={{backgroundColor:'white',height:'60px',width:'100%',position:'fixed',top:'0px',zIndex:999}} >
        
      </div>
       <Navbar collapseOnSelect expand="lg"  className='pnavbar'>
        <Container className='pmenu'>
            <Navbar.Brand href={locale!='zh'?'/':`/${locale}`}>
            <img src="/logo.svg"  alt="daism Logo"  width={32} height={32}   />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end"  id="basic-navbar-nav">
            
                <Nav  style={{width:'100%'}}>
                  <div className="d-flex flex-row flex-sm-wrap p-0 m-0 ">
                  <Nav.Link className={route === '/'  ? 'pnavactive'  : ''}  href={`/${locale!='zh'?'':'zh'}`}>{t('home')}</Nav.Link>
                  <Nav.Link className={route === '/deval'  ? 'pnavactive'  : ''}  href={`${locale!='zh'?'':'/zh'}/deval`}>{t('iadd')}</Nav.Link>
                  <Nav.Link className={route === '/smartcommons' ? 'pnavactive' : ''} href={`${locale!='zh'?'':'/zh'}/smartcommons`}>{t('smarcommon')}</Nav.Link> 
                  <Nav.Link className={route === '/honortokens' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/honortokens`} >{t('nft')}</Nav.Link> 
                  
                  <Nav.Link style={{display:'none'}} href='/listbook' >listBook</Nav.Link> 

                  </div>
                  <div  className="d-flex flex-row flex-sm-wrap p-0 m-0 ">
                  <Nav.Link className={route === '/workroom' ? 'pnavactive'  : ''}  href={`${locale!='zh'?'':'/zh'}/workroom`} >{t('my')}</Nav.Link>
                  <NavDropdown className={route.startsWith('/communities') ? 'pnavactive'  : ''} title={t('social')} id="basic-nav-dropdown1">   
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/enki' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/enki?v=${env.version}`} > {t('myCommunity')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/SC' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/SC?v=${env.version}`} > {t('publicCommunities')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/enkier' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/enkier?v=${env.version}`} > {t('personalSocial')}</NavDropdown.Item>
                    {/* <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/enkier1' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/enkier1`} > 个人社交(测试)</NavDropdown.Item> */}
                  </NavDropdown>

                  <NavDropdown title={t('college')} id="basic-nav-dropdown2">
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale!='zh'?"https://learn.daism.io":"https://learn.daism.io/zh"}>{t('daism')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale!='zh'?"https://learn.daism.io/docs.html":"https://learn.daism.io/zh/docs.html"}>{t('doc')}</NavDropdown.Item>
                  </NavDropdown>
                  </div>
                </Nav>
                <Navbar.Text>
                  <Wallet env={env} query={query} route={route} otherLocale={otherLocale} tc={t}  /> 
                </Navbar.Text>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <div  >
            {children}
        </div>
    
    </Container>
    {!route.startsWith('/communities') && !route.startsWith('/smartcommons/actor') && <footer className="d-flex justify-content-center daism-foot align-items-center flex-column  " style={{margin:'10px',padding:'20px'}} >
          
          <div className="fs-4 mb-2"><strong> DAism.io</strong></div>
         
          <div>
          <div className="fs-5 mb-1">{tc('footerText')}</div> 
          <div className="fs-6">{tc('foot11')} 1.15792x10<sup>69</sup> UTO {tc('foot12')}</div>
          <div className="fs-6">{tc('foot2')} : jeedd</div>  
          <div className="fs-6">{tc('foot31')} : uToken（{tc('foot32')}：UTO）</div>  
          </div>
        </footer>
        }   

      {/* {showAlert && <Alert className='utofont' style={{textAlign:'center',position:'fixed',bottom:'-16px',right:'2px',zIndex:9876}} >
          {locale==='zh'?<>
            <span>总量1.15792x10</span><sup>69</sup><span> UTO 的 </span><strong>Satoshi UTO Fund</strong><span> 于2024年11月21日问世！</span>
          </>:<>
          <strong>Satoshi UTO Fund</strong><span>, with a total of 1.15792x10</span><sup >69</sup><span> UTO, was launched on October 21, 2024!</span>
          </>}
          {'  '}
          <button type="button" className="close" onClick={handleCloseAlert} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </Alert>  
      } */}
        <Loddingwin />
        <ShowTip />
        <ShowNotice />
    </>
  )
}
