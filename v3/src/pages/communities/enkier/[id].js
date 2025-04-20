
import { useTranslations } from 'next-intl'
import MessagePage from '../../../components/enki2/page/MessagePage';
import { getOne } from '../../../lib/mysql/message';
import ShowErrorBar from '../../../components/ShowErrorBar';
import Head from 'next/head';
import {useRouter} from 'next/router';
import PageLayout from '../../../components/PageLayout'
import { getEnv } from '../../../lib/utils/getEnv';
const { parse } = require('node-html-parser');
// import { useSelector } from 'react-redux';
/**
 * 个人社区 单个发文信息
 */
export default function Message({currentObj,locale,env}) {
  const router = useRouter();

  const t = useTranslations('ff');
  const tc = useTranslations('Common');
  const root = parse(currentObj.content);
  const MAX_DESCRIPTION_currentDiv = 80; // 按字节计算
  const content=root.textContent.slice(0, MAX_DESCRIPTION_currentDiv).replaceAll('<p>','').replaceAll('</p>','').replace(/\s+\S*$/, '') + '...';

  

    return (
      <>
       <Head>
       <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <title>{currentObj?.title?currentObj.title: tc('enkierTitle')}</title>
        {/* Open Graph Tags */}
        <meta content="article" property="og:type" />
        <meta content={env.domain} property="og:site_name" />
        <meta content={`${currentObj.actor_name} (${currentObj.actor_account})`} property="og:title" />
        <meta content={`https://${env.domain}${router.asPath}?time=${Date.now()}`} property="og:url" />
        <meta content={new Date().toISOString()} property="og:published_time" />
        <meta content={currentObj.actor_account} property="profile:username" />
        <meta content={content} name="description" />
        <meta content={content} property="og:description" />
        <meta content={currentObj.top_img ? currentObj.top_img : currentObj.avatar} property="og:image" />
        <meta name="fragment" content="!" />
        <link rel="canonical" href={`https://${env.domain}${router.asPath}`} />
        {/* Twitter Card Tags */}
        <meta content="summary" property="twitter:card" />
        <meta content={content} property="twitter:description" />
        <meta content={currentObj.top_img ? currentObj.top_img : currentObj.avatar} property="twitter:image" />
        <meta name="twitter:image" content={currentObj.top_img ? currentObj.top_img : currentObj.avatar}></meta>

        {/* WeChat Tags */}
        <meta name="wechat:title" content={`${currentObj.actor_name} (${currentObj.actor_account})`} />
        <meta name="wechat:description" content={content} />
        <meta name="wechat:image" content={currentObj.top_img ? currentObj.top_img : currentObj.avatar} />
      </Head>

        {/* <Head>
        <title>{tc('enkierTitle')}</title>
        <meta content="article" property="og:type"></meta>
        <meta content={`${currentObj.actor_name} (${currentObj.actor_account})`} property="og:title" />
        <meta content={`https://${env.domain}${router.asPath}`} property="og:url" />
        <meta content={new Date().toISOString()} property="og:published_time" />
        <meta content={currentObj.actor_account} property="profile:username" />
        <meta content={content} name='description' />
        <meta content={content} property="og:description" />
        <meta content="summary" property="twitter:card"/>
        <meta content={currentObj.top_img?currentObj.top_img:currentObj.avatar}  property="og:image" />
        <meta name="wechat:title" content={`${currentObj.actor_name} (${currentObj.actor_account})`}  />
        <meta name="wechat:description" content={content} />
        <meta name="wechat:image" content={currentObj.top_img?currentObj.top_img:currentObj.avatar} />

      </Head> */}
    
      <PageLayout env={env}>
        {currentObj?.id? <MessagePage path="noedit" locale={locale}  currentObj={currentObj} env={env} />
        :<ShowErrorBar errStr={t('noPostingText')} />
        }
        </PageLayout>
        </>
    );
}

export const getServerSideProps =async ({locale,query }) => {

  const currentObj=await getOne({id:query.id,sctype:''})
  if(!currentObj?.content) return { notFound: true };

  if(currentObj?.createtime) currentObj.createtime=new Date(currentObj.createtime).toJSON();
  if(currentObj?.currentTime) currentObj.currentTime=new Date(currentObj.currentTime).toJSON();
  if(currentObj?.reply_time) currentObj.reply_time=new Date(currentObj.reply_time).toJSON();


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



  