
import { getTranslations } from 'next-intl/server';
import ClientContentWorkHome from './ClientContent';

/**
 * 工作室
 */
export default function MyDao() {
 
  return (
    <ClientContentWorkHome />
  )
}


 
export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; 
}) {
 const { locale } = await params; 
 const t = await getTranslations('Common');

 return {
   title: t('workTitle'),
   alternates: {
     canonical: `https://daism.io/${locale}/workroom`, 
   },
 };
}