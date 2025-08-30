'use client';

import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcher from '@/components/LocaleSwitcher';
// import PageLayout from '@/components/PageLayout';

import FreeDatePicker,{type DateRef} from '@/components/FreeDatePicker';

import {useDispatch, useSelector} from 'react-redux';
// import {increment, decrement} from '../../store/store';
import {type RootState, type AppDispatch, setUser,setMessageText} from '@/store/store';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { getDaismContract } from '@/lib/globalStore';

import { useSession } from '@/components/SessionProvider';
export default function Index() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const dateRef=useRef<DateRef>(null);

  const user = useSelector((state: RootState) => state.valueData.user);
  const dispatch = useDispatch<AppDispatch>();

  const { did, isAuthenticated, isLoading } = useSession();
  


  const aa=()=>{
    // alert(0);
    // alert(dateRef.current?.getDate());

    const daismObj=getDaismContract();

  }

  return (
    <>
      <p>{t('topContentText')}</p>
      <LocaleSwitcher />
    <Button onClick={aa}>revgeggrtgrtgrhrhrh</Button>

    {/* <PopupDatePicker /> */}
    <FreeDatePicker ref={dateRef} defaultValue={new Date('2020-02-01 12:12:12')} />
    </>
  );
}
