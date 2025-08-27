import { getTranslations } from 'next-intl/server'
import EnkiClientContent from './EnkiClientContent';
import { getJsonArray } from '@/lib/mysql/common';

export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; }) {
  const { locale } = await params; 
  const t = await getTranslations('Common');
  const title = t('enkierTitle')
  const url = `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enki`

  return {
    title,
    description: title,
    openGraph: {
      type: 'article',
      siteName: process.env.NEXT_PUBLIC_DOMAIN,
      title,
      url,
      publishedTime: new Date().toISOString(),
      description: title,
      images: [`https://${process.env.NEXT_PUBLIC_DOMAIN}/logo.svg`],
    },
    twitter: {
      card: 'summary',
    },
  }
}


// 页面主体
export default async function EnkiPage() {
    const accountAr=await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN])
    return (
        <EnkiClientContent accountAr={accountAr} />
      )
}
