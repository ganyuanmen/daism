
import { getTranslations } from 'next-intl/server';
import ClientContent from './ClientContent';

/**
 * 智能公器列表
 */
export default function Home() {
 
  return (
    <ClientContent/>
  )
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