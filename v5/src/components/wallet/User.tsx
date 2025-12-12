import { Nav, NavDropdown, Modal } from 'react-bootstrap';
import LoginButton, {type LoginButtonRef } from '../LoginButton';
import { useRef, useState, ChangeEvent, FormEvent } from 'react';
import { AccountSvg, SwapTokenSvg, UploadSvg } from '@/lib/jssvg/SvgCollection';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Loginsign from '../Loginsign';
import { useTranslations } from 'next-intl';
import {type RootState,type AppDispatch,setErrText,setMessageText,setTipText} from '@/store/store';
import GeneImg from '../enki3/GeneImg';

interface ChildProps { 
  onDisconnect:()=>void,
}
export default function User({onDisconnect}: ChildProps) {

  const loginRef = useRef<LoginButtonRef>(null);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [upshow, setUpshow] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
  const t = useTranslations('Common');
  const dispatch = useDispatch<AppDispatch>();

  const showError=(str:string)=>{ dispatch(setErrText(str));}
  const showTip=(str: string)=> {dispatch(setTipText(str));}
  const closeTip=()=> { dispatch(setTipText(''));}

  const handleSelect = async (eventKey: string | null) => {
    switch (eventKey) {
      case '1':
        router.push(`/workroom/walletinfo`, { scroll: false });
        break;
      case '2':
        router.push(`/smartcommons/actor`, { scroll: false });
        break;
      case '3':
        router.push(`/smartcommons/mySC`, { scroll: false });
        break;
      case '4':
        router.push(`/honortokens`, { scroll: false });
        break;
      case '5':
      case '7':

        onDisconnect();
        break;
      case '6':
        loginRef.current?.siweLogin();
        break;
      case '8':
        setShow(true);
        break;
      case '9':
        router.push(`/donation`, { scroll: false });
        break;
      case 'b':
        setUpshow(true);
        break;
      case 'c':
        router.push(`/set`, { scroll: false });
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!actor?.actor_account && !actor?.actor_account?.includes('@')) {
      return showError(t('notRegisterEnki'));
    }
    if (actor?.actor_account.split('@')[1] !== process.env.NEXT_PUBLIC_DOMAIN) {
      return showError(
        t('registerDomain', { domain: process.env.NEXT_PUBLIC_DOMAIN || '' })
      );
    }

    const formData = new FormData();
    if (file) {
      formData.append('jsonFile', file);
    }
    showTip(t('uploadingText'));
    const response = await fetch('/api/mastodon', {
      method: 'POST',
      body: formData,
    });
    closeTip();
    const data = await response.json();

    if (response.ok) {
      dispatch(setMessageText(data.msg))
      // showError(`${data.msg}_*_`);
    } else {
      showError(data.errMsg);
    }

    setUpshow(false);
  };

  return (
    <>
      <Nav onSelect={handleSelect} style={{ display: 'inline-block' }}>
        <NavDropdown
          title={
            <span className="daism-color">
              {actor?.avatar ? <GeneImg avatar={actor.avatar} hw={32} />
               :<AccountSvg />}{' '}
            </span>
          }
        >
          <NavDropdown.Item eventKey="1">
            <span className="daism-color"> 💼 </span> {t('myWalletText')}...
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="2">
            <span className="daism-color"> 🧑 </span> {t('myAccount')}...
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="3">
            <span className="daism-color"> 🏠 </span> {t('daoGroupApprove')}
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="4">
            <span className="daism-color"> 🏆 </span> {t('daoDividend')}
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="c">
            <span className="daism-color"> ⚙️ </span> {t('siteSetText')}
          </NavDropdown.Item>

          {actor?.actor_account && (
            <NavDropdown.Item eventKey="b">
              <span className="daism-color">
                <SwapTokenSvg size={24} />
              </span>{' '}
              {t('importText')} mastodon
            </NavDropdown.Item>
          )}
          <NavDropdown.Divider />
          {loginsiwe ? (
            <NavDropdown.Item eventKey="5">
              <span className="daism-color"> ⛔️ </span> {t('exitText')}
            </NavDropdown.Item>
          ) : (
            <>
              <NavDropdown.Item eventKey="6">
                <span className="daism-color"> 🔐 </span>{' '}
                <LoginButton ref={loginRef} />
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="7">
                <span className="daism-color"> 👉 </span> {t('exitWalletText')}
              </NavDropdown.Item>
            </>
          )}
          <NavDropdown.Item eventKey="9">
            <span className="daism-color"></span> 🤝 {t('donationText')}
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="8">
            <span className="daism-color"> ℹ️ </span> {t('about')}
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Modal className="daism-title" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>About </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-start align-items-center">
            <Image
              src="/enki.svg"
              width={64}
              height={64}
              alt="Dasim"
            />
            <span
              style={{
                fontSize: '42px',
                marginLeft: '30px',
                fontWeight: 'bold',
              }}
            >
              EnKi
            </span>
          </div>
          <hr />
          <div className="mb-3 mt-3">
            <strong>Version:2.0</strong>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        className="daism-title"
        show={upshow}
        onHide={() => setUpshow(false)}
      >
        <Modal.Header closeButton>{t('uploadWalletText')} </Modal.Header>
        <Modal.Body>
          {loginsiwe ? (
            <form onSubmit={handleSubmit}>
              <h4>{t('selectOutboxjson')}</h4>
              <div className="mb-3 mt-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div style={{ textAlign: 'center' }} className="mb-3 mt-3">
                <button className="btn btn-primary" type="submit">
                  <UploadSvg size={24} /> {t('submitText')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h4>{t('notLoginText')}</h4>
              <br /> <Loginsign />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
