
import { getMynft } from '../../lib/mysql/daism';
import Head from 'next/head';
import { useTranslations } from 'next-intl'
import PageLayout from '../../components/PageLayout'
import { getEnv } from '../../lib/utils/getEnv';
import dynamic from 'next/dynamic';
const Nftlist = dynamic(() => import('../../components/enki3/Nftlist'), { ssr: false });

/**
 * 个人荣誉通证
 */

export default function honor({currentObj,locale,env}) {

    const t = useTranslations('nft')
    const tc = useTranslations('Common')

    return ( <>
        <Head>
        <title>{tc('tokensTitle')}</title>
        </Head>

      <PageLayout env={env}>
      <Nftlist mynftData={currentObj} t={t} />
      </PageLayout>
      </>         
    )
}

export const getServerSideProps =async ({locale,query }) => {

  const currentObj=await getMynft({did:query.id})
  
    return {
      props: {
        messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/nft/${locale}.json`),
        },
        currentObj,locale
        ,env:getEnv()
      }
    }
  }



  