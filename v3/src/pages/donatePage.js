

import withSession from '../lib/session';
import PageLayout from '../components/PageLayout'
//'../../../components/PageLayout';

import DonationPage from '../components/enki3/donate'
import { getEnv } from '../lib/utils/getEnv';

import Head from 'next/head';
/**
 * 指定个人帐号
 */
export default function donatePage({locale,env}) {
 

    return (<>
      <Head>
          <title>捐赠</title>
      </Head>
      <PageLayout env={env}>
      
        <DonationPage env={env} />

        </PageLayout></>
    );
}

export const getServerSideProps = withSession(async ({locale,query }) => {
 
    return {
      props: {
        messages: {
          ...require(`../messages/shared/${locale}.json`),
          ...require(`../messages/federation/${locale}.json`),
        },
        locale
        ,env:getEnv()
      }
    }
  }

)

  