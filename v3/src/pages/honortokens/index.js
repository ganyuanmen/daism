
import { useSelector } from 'react-redux';
import ShowErrorBar from '../../components/ShowErrorBar';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Mynft from '../../components/nft/mynft'
import { getEnv } from '../../lib/utils/getEnv';
import Head from 'next/head';
/**
 * 荣誉通证
 */
export default function NFT({env,locale}) {
    
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包用户信息


    return (  <>
      <Head>
          <title>{tc('tokensTitle')}</title>
      </Head>
  
        <PageLayout env={env}>
          <div style={{marginTop:'20px'}} >
            {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
            :<Mynft  />
            }  
        </div>
        </PageLayout>
        </>
    );
}



export const getStaticProps = ({locale }) => {  
  // export const getServerSideProps = ({locale }) => {  
    
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/nft/${locale}.json`),
        //   ...require(`../../messages/federation/${locale}.json`),
        },locale
        ,env:getEnv()
      }
    }
  }

    
