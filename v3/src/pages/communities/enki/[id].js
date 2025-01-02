
import { useTranslations } from 'next-intl'
import MessagePage from '../../../components/enki2/page/MessagePage';
import { getOne } from '../../../lib/mysql/message';
import ShowErrorBar from '../../../components/ShowErrorBar';
import Head from 'next/head';
import {useRouter} from 'next/router';
import PageLayout from '../../../components/PageLayout'
import { getEnv } from '../../../lib/utils/getEnv';
// import { useSelector } from 'react-redux';
const { parse } = require('node-html-parser');
/**
 * 社区 单个发文信息
 */
export default function Message({currentObj,locale,env}) {
  const router = useRouter();

  const t = useTranslations('ff');
  const tc = useTranslations('Common');
  const root = parse(currentObj.content);
  const content=root.textContent.slice(0, 150);
  
    return (
      <>
        <Head>
        <title>{tc('enkiTitle')}</title>
        <meta content="article" property="og:type"></meta>
        <meta content={env.domain} property="og:site_name"></meta>
        <meta content={`${currentObj.actor_name} (${currentObj.actor_account})`} property="og:title" />
        <meta content={`https://${env.domain}${router.asPath}`} property="og:url" />
        <meta content={new Date().toISOString()} property="og:published_time" />
        <meta content={currentObj.actor_account} property="profile:username" />
        <meta content={content} name='description' />
        <meta content={content} property="og:description" />
        <meta content="summary" property="twitter:card"/>
        <meta content={currentObj.top_img?currentObj.top_img:currentObj.avatar}  property="og:image" />
      </Head>
    
      <PageLayout  env={env} >
        {currentObj?.id? <MessagePage path="noedit" locale={locale} currentObj={currentObj} env={env} />
        :<ShowErrorBar errStr={t('noPostingText')} />
        }
        </PageLayout>
        </>
    );
}

export const getServerSideProps =async ({locale,query }) => {

  const currentObj=await getOne({id:query.id,sctype:'sc'})
  
  if(currentObj?.createtime) currentObj.createtime=new Date(currentObj.createtime).toJSON();
  if(currentObj?.currentTime) currentObj.currentTime=new Date(currentObj.currentTime).toJSON();
  if(currentObj?.reply_time) currentObj.reply_time=new Date(currentObj.reply_time).toJSON();
  if(currentObj?.start_time) currentObj.start_time=new Date(currentObj.start_time).toJSON();
  if(currentObj?.end_time) currentObj.end_time=new Date(currentObj.end_time).toJSON();
    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        currentObj,locale
        ,env:getEnv()
      }
    }
  }



  