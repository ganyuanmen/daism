import { useRef } from 'react';
import LoginButton,{type LoginButtonRef} from './LoginButton';
import ShowErrorBar from './ShowErrorBar';
import { Button } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store/store';
import Image from 'next/image';


export default function Loginsign() {
  
  const loginRef = useRef<LoginButtonRef>(null);
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user);

  return (
    <>
      {user.connected === 1 ? (
        <Button
          variant="primary"
          onClick={() => loginRef.current?.siweLogin()}
        >
          <Image
            alt=""
            src="/loginbutton.svg"
            width={18}
            height={18}
            style={{ color: 'white' }}
          />{'  '}
          <LoginButton ref={loginRef} />
        </Button>
      ) : (
        <ShowErrorBar errStr={tc('noConnectText')} />
      )}
    </>
  );
}
