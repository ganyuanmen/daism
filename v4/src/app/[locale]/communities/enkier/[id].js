
import { useTranslations } from 'next-intl'
import MessagePage from '../../../components/enki2/page/MessagePage';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { getJsonArray } from '../../../lib/mysql/common';
import {useRouter} from 'next/router';
import PageLayout from '../../../components/PageLayout'
import { getEnv } from '../../../lib/utils/getEnv';
import { getData } from '../../../lib/mysql/common';
import { useState } from 'react';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import CreateMess from '../../../components/enki3/CreateMess';
import ShowErrorBar from '../../../components/ShowErrorBar';
import { client } from '../../../lib/api/client';
const { parse } = require('node-html-parser');
// import { useSelector } from 'react-redux';
/**
 * 个人社区 单个发文信息
 */



export default function Message({openObj,locale,env,accountAr}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(2);
  const [currentObj,setCurrentObj]=useState(openObj)
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录
  const t = useTranslations('ff');
  const tc = useTranslations('Common');
  let content='';
  if(openObj?.content){
  const root = parse(openObj.content);
  const MAX_DESCRIPTION_currentDiv = 160; // 按字节计算
  content=root.textContent.slice(0, MAX_DESCRIPTION_currentDiv).replaceAll('<p>','').replaceAll('</p>','').replace(/\s+\S*$/, '') + '...';
  }
  const callBack=()=>{
    setActiveTab(2)
  }

  const afterEditCall=(obj)=>{
    setCurrentObj(obj);
    setActiveTab(2)
  }

  const delCallBack=async (flag,fun)=>{
  
    if(flag==='del'){
      setActiveTab(2);
      setCurrentObj({});
    }
    else {
      const res = await client.get(`/api/getData?id=${currentObj.id}&sctype=`,'getOne');
      if(res.status===200) setCurrentObj(res.data); 
      if(typeof fun ==='function') fun.call(this)
        
    }
  }


    return (
      <>
       <Head>
       <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <title>{openObj?.title?openObj.title: tc('enkierTitle')}</title>
       
        {/* Open Graph Tags */}
        <meta content="article" property="og:type" />
        <meta content={env.domain} property="og:site_name" />
        {openObj?.message_id &&<>
            {openObj?.title?<meta content={`${openObj.title}`} property="og:title" />
            :<meta content={`${openObj.actor_name} (${openObj.actor_account})`} property="og:title" />}

            <meta content={openObj.top_img ? openObj.top_img : openObj.avatar} property="og:image" />
            <meta content={openObj.top_img ? openObj.top_img : openObj.avatar} property="twitter:image" />
            <meta content={openObj.top_img ? openObj.top_img : openObj.avatar} name="twitter:image" />

            {openObj?.title?<meta content={`${openObj.title}`}name="wechat:title" />
            :<meta content={`${openObj.actor_name} (${openObj.actor_account})`} name="wechat:title" />}

            <meta name="wechat:image" content={openObj.top_img ? openObj.top_img : openObj.avatar} />
            <meta content={openObj.actor_account} property="profile:username" />

        </>

        }
        
        <meta content={`https://${env.domain}${router.asPath}?time=${Date.now()}`} property="og:url" />
        <meta content={new Date().toISOString()} property="og:published_time" />
        <meta content={content} name="description" />
        <meta content={content} property="og:description" />
        <meta name="fragment" content="!" />
        <link rel="canonical" href={`https://${env.domain}${router.asPath}`} />
        {/* Twitter Card Tags */}
        <meta content="summary" property="twitter:card" />
        <meta content={content} property="twitter:description" />
        {/* WeChat Tags */}
        <meta name="wechat:description" content={content} />
        
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
      <div className='mb-3 mt-3 d-flex flex-row align-items-center '  >
                        <EnkiAccount locale={locale} isShow={false} />
                        {!loginsiwe && <Loginsign />}
        </div>
         {/* <EnkiMess locale={locale}  currentObj={currentObj} env={env} honor={honor} /> */}
        {currentObj?.message_id?<>
          {activeTab === 2 ?<MessagePage  path="enkier" locale={locale} env={env} currentObj={currentObj} 
                    delCallBack={delCallBack} setActiveTab={setActiveTab} accountAr={accountAr}  tabIndex={3}  />
            :<CreateMess accountAr={accountAr} currentObj={currentObj} afterEditCall={afterEditCall} callBack={callBack} />
            }
            </>
            :<ShowErrorBar errStr={t('noPostingText')} />   
        }
        </PageLayout>
        </>
    );
}

export const getServerSideProps =async ({locale,query,res }) => {
//   res.setHeader('Cache-Control', 'public, s-maxage=10');
  let openObj;
  if(/^[0-9]+$/.test(query.id)){
    openObj=await getData('select * from v_message where id=?',[query.id],true);
  }else {
   openObj=await getData('select * from vv_message where message_id=?',[query.id],true);
  }
  if(openObj?.createtime) openObj.createtime=new Date(openObj.createtime).toJSON();
  if(openObj?.currentTime) openObj.currentTime=new Date(openObj.currentTime).toJSON();
  if(openObj?.reply_time) openObj.reply_time=new Date(openObj.reply_time).toJSON();
  const env=getEnv();
  const accountAr=await getJsonArray('accountAr',[env?.domain])

    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        openObj,locale,accountAr
        ,env
      }
    }
  }



  // <script type="application/ld+json">
  // {
  //   "@context": "https://schema.org",
  //   "@type": "Article",
  //   "headline": "如何优化HTML文件",
  //   "datePublished": "2023-10-01",
  //   "author": { "@type": "Person", "name": "John Doe" }
  // }
  // </script>