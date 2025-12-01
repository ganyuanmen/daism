

import { getTranslations } from 'next-intl/server';
import ClientActor from './ClientActor';
import { getJsonArray } from '@/lib/mysql/common';

/**
 * 智能公器列表
 */
export default async function MyActor() {

  const accountAr=await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN]);

  return (
    <ClientActor accountAr={accountAr}  />
  )
}

 
export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; 
}) {
 const { locale } = await params; 
 const t = await getTranslations('Common');

 return {
   title: t('myAccounttTitle'),
   alternates: {
    canonical: `https://daism.io/${locale}/smartcommons/actor`, 
   },
 };
}
