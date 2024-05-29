import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Navbar,Container,Nav } from 'react-bootstrap'
import Wallet from './Wallet'
import Loddingwin from '../components/Loddingwin'
import ShowTip from '../components/ShowTip'
import styles from '../styles/pageLayout.module.css'

// import { MetaMaskProvider } from "@metamask/sdk-react";

export default function PageLayout({children}) {

  const t = useTranslations('Navigation')
  const { locale, locales, route,query } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)
  const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  const path=`${route}${restoredURL.length>1?restoredURL:''}`
  const tc = useTranslations('Common')
  return (
    <>
  
    <Container className="daism-body"  >
       <Navbar collapseOnSelect expand="lg" className={styles.pnavbar}>
        <Container className={styles.pmenu} >
            <Navbar.Brand href={locale==='en'?'/':`/${locale}`}>
            <img src="/logo.svg"  alt="daism Logo"  width={32} height={32}   />
            </Navbar.Brand>
            <Navbar.Toggle  />
            <Navbar.Collapse >
                <Nav style={{width:'100%'}} className="d-flex align-items-center p-0 m-0 ">
                  <Link className={route === '/' ? styles.pnavactive  : ''}  href="/">{t('iadd')}</Link>
                  <Link className={route === '/home' ? styles.pnavactive : ''}  href="/home">{t('home')}</Link> 
                  <Link className={route === '/my' ? styles.pnavactive  : ''}  href="/my">{t('my')}</Link>
                  <Link className={route === '/info' ? styles.pnavactive  : ''}  href="/info">{t('info')}</Link> 
                  <Link className={route === '/nft' ? styles.pnavactive  : ''}  href="/nft">{t('nft')}</Link> 
                  <Link className={route === '/docs' ? styles.pnavactive  : ''}  href="/docs">{t('doc')}</Link> 
                  
                  <div style={{flex:'1'}} ></div>
                
                 <Wallet /> 
                 

                <div className={styles.wlanguage} >
                      <Link  href={path} locale={otherLocale}>
                        {t('switchLocale', { locale: otherLocale })}
                  </Link>
                  </div>
          
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <Container className="daism-content" >
            {children}
        </Container>
        </Container>
        <footer className="d-flex justify-content-center daism-foot align-items-center flex-column  " style={{height:'120px',marginTop:'20px'}} >
            <div className="fs-4 mb-2"><strong> DAism.io</strong></div>
            <div className="fs-5">{tc('footerText')}</div>  
          
        </footer>
        <Loddingwin />
        <ShowTip />
    </>
  )
}
