import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Navbar,Container,Nav } from 'react-bootstrap'
import styles from '../styles/pageLayout.module.css'

export default function Rmenu({children}) {

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
                <Nav style={{width:'100%'}} className="d-flex align-items-center p-0 m-0 ">
                    <Link className={route === '/' ? styles.pnavactive  : ''}  href="/">{tc('rmenuText')}</Link>
                    <div style={{flex:'1'}} ></div>
                    <div className={styles.wlanguage} >
                        <Link  href={path} locale={otherLocale}>{t('switchLocale', { locale: otherLocale })}</Link>
                    </div>
                </Nav>
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
    </>
  )
}
