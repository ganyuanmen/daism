


import PageLayout from '../components/PageLayout'
import { useTranslations } from 'next-intl'
import DonationPage from '../components/enki3/donate'
import { getEnv } from '../lib/utils/getEnv';
import Head from 'next/head';

export default function donatePage({locale,env}) {
  let t = useTranslations('wallet')

    return (<>
      <Head>
          <title>{t('donateTitle')}</title>
      </Head>
      <PageLayout env={env}>
        <DonationPage env={env} locale={locale} />
      </PageLayout></>
    );
}

  
// export const getStaticProps  = async ({locale }) => {
  export const getServerSideProps  = async ({locale }) => {
  return {
    props: {
      messages: {
        ...require(`../messages/shared/${locale}.json`),
        ...require(`../messages/wallet/${locale}.json`),
      },
      locale
      ,env:getEnv()
    }
  }
  }

