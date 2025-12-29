'use client';
import { ReactNode, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Navbar, Container, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import React, { memo } from 'react';

import Wallet from './wallet/Index';
import LocaleSwitcher from './LocaleSwitcher';

type Props = {
  children?: ReactNode;
};

const PageLayout = memo(({ children }: Props) => {
  const t = useTranslations('Navigation');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const pathWiLocale = usePathname() || '';
  const pathname = pathWiLocale.replace(`/${locale}`, '') || '/';

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [collegeOpen, setCollegeOpen] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const handleMenuClick = () => {
    setShowOffcanvas(false);
    setSocialOpen(false);
    setCollegeOpen(false);
  };

  const toggleSocial = () => setSocialOpen(!socialOpen);
  const toggleCollege = () => setCollegeOpen(!collegeOpen);

  const renderNavLinks = (onClick?: () => void, isOffcanvas = false) => (
    <>
      <Nav.Link className={pathname === '/' ? 'pnavactive' : ''} href={`/${locale}`} onClick={onClick}>
        <div className="no-wrap">{t('home')}</div>
      </Nav.Link>

      {isOffcanvas ? (
        <>
          {/* Social Dropdown */}
          <div className="d-flex flex-column">
            <div
              className={`d-flex justify-content-between align-items-center ${
                pathname.startsWith('/communities') ? 'pnavactive' : ''
              }`}
              style={{ cursor: 'pointer', padding: '0.375rem 0' }}
              onClick={toggleSocial}
            >
              <span>{t('social')}</span>
              <motion.span
                animate={{ rotate: socialOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block' }}
              >
                ▼
              </motion.span>
            </div>
            <AnimatePresence>
              {socialOpen && (
                <motion.div
                  className="d-flex flex-column ps-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Nav.Link
                    className={pathname === '/communities/enki' ? 'pnavactive' : ''}
                    href={`/${locale}/communities/enki`}
                    onClick={onClick}
                  >
                    {t('myCommunity')}
                  </Nav.Link>
                  <Nav.Link
                    className={pathname === '/communities/SC' ? 'pnavactive' : ''}
                    href={`/${locale}/communities/SC`}
                    onClick={onClick}
                  >
                    {t('publicCommunities')}
                  </Nav.Link>
                  <Nav.Link
                    className={pathname === '/communities/enkier' ? 'pnavactive' : ''}
                    href={`/${locale}/communities/enkier`}
                    onClick={onClick}
                  >
                    {t('personalSocial')}
                  </Nav.Link>

                    <Nav.Link
                    className={pathname === '/accountlist' ? 'pnavactive' : ''}
                    href={`/${locale}/accountlist`}
                    onClick={onClick}
                  >
                    {t('accountlistText')}
                  </Nav.Link>

                      <Nav.Link
                    className={pathname === '/comment' ? 'pnavactive' : ''}
                    href={`/${locale}/comment`}
                    onClick={onClick}
                  >
                    {t('commentText')}
                  </Nav.Link>


                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* College Dropdown */}
          <div className="d-flex flex-column mt-2">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', padding: '0.375rem 0' }}
              onClick={toggleCollege}
            >
              <span>{t('college')}</span>
              <motion.span
                animate={{ rotate: collegeOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block' }}
              >
                ▼
              </motion.span>
            </div>
            <AnimatePresence>
              {collegeOpen && (
                <motion.div
                  className="d-flex flex-column ps-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Nav.Link
                    target="_blank"
                    href={locale === 'en' ? 'https://learn.daism.io' : 'https://learn.daism.io/zh'}
                    onClick={onClick}
                  >
                    {t('daism')}
                  </Nav.Link>
                  <Nav.Link
                    target="_blank"
                    href={locale === 'en' ? 'https://learn.daism.io/docs.html' : 'https://learn.daism.io/zh/docs.html'}
                    onClick={onClick}
                  >
                    {t('doc')}
                  </Nav.Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 其他链接 */}
          <Nav.Link className={pathname === '/smartcommons' ? 'pnavactive' : ''} href={`/${locale}/smartcommons`} onClick={onClick}>
            <div className="no-wrap">{t('smarcommon')}</div>
          </Nav.Link>
          <Nav.Link className={pathname === '/honortokens' ? 'pnavactive' : ''} href={`/${locale}/honortokens`} onClick={onClick}>
            <div className="no-wrap">{t('nft')}</div>
          </Nav.Link>
          <Nav.Link className={pathname === '/forge' ? 'pnavactive' : ''} href={`/${locale}/forge`} onClick={onClick}>
            <div className="no-wrap">{t('iadd')}</div>
          </Nav.Link>
          <Nav.Link className={pathname === '/workroom' ? 'pnavactive' : ''} href={`/${locale}/workroom`} onClick={onClick}>
            <div className="no-wrap">{t('my')}</div>
          </Nav.Link>
        </>
      ) : (
        <>
          {/* 桌面 NavDropdown */}
          <NavDropdown
            className={pathname.startsWith('/communities') ? 'pnavactive' : ''}
            title={t('social')}
            id="nav-dropdown-communities"
          >
            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              className={pathname === '/communities/enki' ? 'pnavactive' : ''}
              href={`/${locale}/communities/enki`}
            >
              {t('myCommunity')}
            </NavDropdown.Item>
            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              className={pathname === '/communities/SC' ? 'pnavactive' : ''}
              href={`/${locale}/communities/SC`}
            >
              {t('publicCommunities')}
            </NavDropdown.Item>
            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              className={pathname === '/communities/enkier' ? 'pnavactive' : ''}
              href={`/${locale}/communities/enkier`}
            >
              {t('personalSocial')}
            </NavDropdown.Item>

            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              className={pathname === '/accountlist' ? 'pnavactive' : ''}
               href={`/${locale}/accountlist`}
            >
              {t('accountlistText')}
            </NavDropdown.Item>
              <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              className={pathname === '/comment' ? 'pnavactive' : ''}
               href={`/${locale}/comment`}
            >
              {t('commentText')}
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link className={pathname === '/smartcommons' ? 'pnavactive' : ''} href={`/${locale}/smartcommons`}>
            <div className="no-wrap">{t('smarcommon')}</div>
          </Nav.Link>
          <Nav.Link className={pathname === '/honortokens' ? 'pnavactive' : ''} href={`/${locale}/honortokens`}>
            <div className="no-wrap">{t('nft')}</div>
          </Nav.Link>
          <Nav.Link className={pathname === '/forge' ? 'pnavactive' : ''} href={`/${locale}/forge`}>
            <div className="no-wrap">{t('iadd')}</div>
          </Nav.Link>
          <NavDropdown title={t('college')} id="nav-dropdown-college">
            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              target="_blank"
              href={locale === 'en' ? 'https://learn.daism.io' : 'https://learn.daism.io/zh'}
            >
              {t('daism')}
            </NavDropdown.Item>
            <NavDropdown.Item
              style={{ paddingLeft: '20px' }}
              target="_blank"
              href={locale === 'en' ? 'https://learn.daism.io/docs.html' : 'https://learn.daism.io/zh/docs.html'}
            >
              {t('doc')}
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className={pathname === '/workroom' ? 'pnavactive' : ''} href={`/${locale}/workroom`}>
            <div className="no-wrap">{t('my')}</div>
          </Nav.Link>
        </>
      )}
    </>
  );

  return (
    <>
      <Container style={{ paddingTop: '50px' }}>
      
        <div
          style={{
            backgroundColor: 'white',
            height: '50px',
            width: '100%',
            position: 'fixed',
            top: 0,
            zIndex: 999,
          }}
          className="d-none d-lg-block"
        ></div>

        <Navbar expand="lg" className="pnavbar">
          <Container className="pmenu">
            <Navbar.Brand href={locale === 'zh' ? '/zh' : `/en`}>
              <Image src="/logo.svg" alt="daism Logo" width={32} height={32} />
            </Navbar.Brand>
           {/* 手机端显示 */}
          
            <div className="d-lg-none" style={{ position: 'fixed', top: 0, zIndex: 1000, background: 'white'}}>
              <Wallet isPhone={true} />
            </div>

            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />

            <Navbar.Collapse className="justify-content-end d-none d-lg-flex" id="basic-navbar-nav">
              <Nav style={{ width: '100%' }}>
                <div className="d-flex flex-row p-0 m-0">{renderNavLinks()}</div>
              </Nav>
              <Wallet isPhone={false}  />
            </Navbar.Collapse>
          
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="start">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                  <Image src="/logo.svg" alt="daism Logo" width={32} height={32} />{' '}
                  <LocaleSwitcher flag={false} />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column">{renderNavLinks(handleMenuClick, true)}</Nav>
              
              </Offcanvas.Body>
            </Offcanvas>
          </Container>
        </Navbar>

        <div>{children}</div>
      </Container>

      {!pathname.startsWith('/communities') && !pathname.startsWith('/smartcommons/actor') && (
        <footer
          className="d-flex justify-content-center daism-foot align-items-center flex-column"
          style={{ margin: '10px', padding: '20px' }}
        >
          <div className="fs-4 mb-2">
            <strong> DAism.io</strong>
          </div>
          <div>
            <div className="fs-5 mb-1">{tc('footerText')}</div>
            <div className="fs-6">
              {tc('foot11')} 1.15792x10<sup>69</sup> UTO {tc('foot12')}
            </div>
            <div className="fs-6">{tc('foot2')} : jeedd</div>
            <div className="fs-6">{tc('foot31')} : uToken（{tc('foot32')}：UTO）</div>
          </div>
        </footer>
      )}
    </>
  );
});

PageLayout.displayName = 'PageLayout';

export default PageLayout;
