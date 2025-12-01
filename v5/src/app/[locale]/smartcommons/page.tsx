
import { getTranslations } from 'next-intl/server';
import ClientContent from './ClientContent';
import { getData } from '@/lib/mysql/common';
import { useLocale } from 'next-intl';

/**
 * 智能公器列表
 */
export default function Home() {

   const locale: string = useLocale().toString().toLowerCase();

  return (
    <MyClientContent locale={locale}/>
  )
}

  

    async function MyClientContent({locale}:{locale:string}){
        
    const obj=await getData("SELECT * FROM a_home where id=2",[],true);

        return(
             <ClientContent locale={locale} obj={obj}/>
        );
    }

 
export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; }) {
 const { locale } = await params; 
 const t = await getTranslations('Common');

 return {
   title: t('smartTitle'),
   alternates: {
     canonical: `https://daism.io/${locale}/smartcommons`, 
   },
 };
}