import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import { usePathname,useSearchParams } from 'next/navigation';

export default function LocaleSwitcher({flag}:{flag:boolean}) {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'zh' : 'en';
  const pathWiLocale = `${usePathname() || ''}/`; // 当前路径，例如 /en/about
  const pathname = pathWiLocale.replace(`/${locale}/`, `/${otherLocale}/`) ;
  const searchParams = useSearchParams();
  const query: Record<string, string> = {};

  searchParams?.forEach((value, key) => {
    query[key] = value;
  });
   const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
   const path=`${pathname}${restoredURL.length>1?restoredURL:''}`

   const _link=<Link  href={path}  prefetch={false} onClick={()=>{ sessionStorage.setItem('langSwitch', '1');}} >{t('switchLocale')}</Link>

  return (
  <>
    {flag?<div className={flag?'wlanguage':''}>{_link} </div>:_link }
  </>
    
  );
}
