import { getTranslations } from 'next-intl/server'
import ClientContent from './ClientContent';
import { getJsonArray } from '@/lib/mysql/common';

export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; }) {
  const { locale } = await params; 
  const t = await getTranslations('Common');


  return {
    title: t('scTitle'),
    description: t('scTitle'),
    openGraph: {
      type: 'article',
      siteName: process.env.NEXT_PUBLIC_DOMAIN,
      title: t('scTitle'),
      description: t('scTitle'),
      url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/SC`,
      publishedTime: new Date().toISOString(),
      images: [`https://${process.env.NEXT_PUBLIC_DOMAIN}/logo.svg`],
    },
    twitter: {
      card: 'summary',
      images: [`https://${process.env.NEXT_PUBLIC_DOMAIN}/logo.svg`],
      description: t('scTitle'),
    },
  };

}

// 页面主体
export default async function EnkiSCPage() {
    const accountAr=await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN])
    return (
        <ClientContent accountAr={accountAr} />
      )
}
