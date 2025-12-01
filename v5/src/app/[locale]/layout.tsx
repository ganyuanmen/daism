import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {ReactNode} from 'react';
import {routing} from '@/i18n/routing';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/globals.css'
import ReduxProvider from '../../store/Providers';
import PageLayout from '@/components/PageLayout';
import InitComponent from '@/components/InitComponent';
import { LayoutProvider } from '@/contexts/LayoutContext';

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

// ⚡ 静态生成所有 locale 路由
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ⚡ viewport 单独导出
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',  // 支持 iPhone X / 全面屏
};

// ⚡ 生成多语言 SEO
export async function generateMetadata({ params }:Props) {

  const { locale } = await params; 
  
  return {

    title: locale==='en'?'Leading to PoL Civ - DAism':'奔赴以爱的证明为共识的新文明 - 道易程',
    description:
      locale === 'en'
        ? 'Leading to Proof-of-Love Civilization by Joining Blockchain & AI Together - DAism'
        : '道易程的爱的证明（Proof of Love）治理共识，将区块链与人工智能融合在一起，引领人类奔赴以爱为核心伦理的新文明。',
    keywords:
      locale === 'en'
        ? 'Proof-of-Love Civilization, Proof of Love, PoL Civ, Satoshi UTO Fund, SUF, Universal Love Engine, SufAIthon, DAism'
        : '爱的证明, Proof of Love, 爱的检验, 爱的验证, 富爱文明, 中本聪UTO基金, Satoshi UTO Fund, SUF, 全民爱的引擎, 速发赛, 道易程',
    robots: 'index, follow',
    openGraph: {
      siteName: 'daism',
      type: 'article',
    },
    alternates: {
      canonical: `https://daism.io/${locale}`, 
    },
  };
}

// ⚡ Layout 组件
export default async function LocaleLayout({children, params}: Props) {
  
  // 如果 locale 不在支持的列表，返回 404
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <ReduxProvider>
            <InitComponent />
              <LayoutProvider>
                <PageLayout>
                  {children}
                </PageLayout>
              </LayoutProvider>
            </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


// export const metadata = {
//   title: 'My App',
//   description: 'Next.js 13 App Router Example',
//   icons: {
//     icon: '/favicon.ico'
//   },
  
// };

// <meta charSet="utf-8"/>
// <link rel="dns-prefetch" href="//www.google-analytics.com" />
//     <meta httpEquiv="x-dns-prefetch-control" content="on" />
//     <meta name="robots" content="index, follow, noodp" />
//     <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
//     <title>{t('indexTitleText')}</title>
//     {locale==='en'?<meta name="keywords" lang="en" content="Proof-of-Love Civilization, Proof of Love, PoL Civ, Satoshi UTO Fund, SUF, Universal Love Engine, SufAIthon, DAism"/>
//     :<meta name="keywords" lang="zh-cmn-Hans" content="爱的证明, Proof of Love, 爱的检验, 爱的验证, 富爱文明, 中本聪UTO基金, Satoshi UTO Fund, SUF, 全民爱的引擎, 速发赛, 道易程"/>} Leading to PoL Civ
//     {locale==='en'?<meta name="description" lang="en" content="Leading to Proof-of-Love Civilization by Joining Blockchain & AI Together - DAism"/>
//     :<meta name="description" lang="zh-cmn-Hans" content="道易程的爱的证明（Proof of Love）治理共识，将区块链与人工智能融合在一起，引领人类奔赴以爱为核心伦理的新文明。"/>}

