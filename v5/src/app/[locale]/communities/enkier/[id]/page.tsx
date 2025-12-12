


import ClientIDPage from './ClientIDPage';
import { getTranslations } from 'next-intl/server';
import parse from 'node-html-parser';
import { cache } from 'react';
import { getData, getJsonArray } from '@/lib/mysql/common';

// interface HonorPageProps {params: Promise<{ locale: string;id:string;}>}

const getOpenObj = cache(async (id: string) => {

  if(/^[0-9]+$/.test(id)){
    return await getData('select * from v_message where id=?',[id],true);
  }else {
   return await getData('select * from vv_message where message_id=?',[id],true);
  }
  
});

const getAccount = cache(async () => {
  return await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN]);
  });

export default async function EnkierIDPage({ params }: any) {
    const { id } =  params;
    const openObj=await getOpenObj(id);
    const accountAr=await getAccount();
    return ( <ClientIDPage openObj={openObj?.message_id?openObj:null} accountAr={accountAr} />);
}


export async function generateMetadata({ params }: any) {
    const {locale, id } =  params; 
    const openObj=await getOpenObj(id);
    const t = await getTranslations('Common');

    let content='';
    
    if(openObj?.content){
        const root = parse(openObj.content);
        const MAX_DESCRIPTION_currentDiv = 160; // 按字节计算
        content=root.textContent.slice(0, MAX_DESCRIPTION_currentDiv).replaceAll('<p>','').replaceAll('</p>','').replace(/\s+\S*$/, '') + '...';
    }
    return {
        title: openObj?.title ?? t('enkierTitle'),
        description: content,
        openGraph: {
          type: "article",
          siteName: process.env.NEXT_PUBLIC_DOMAIN,
          title:
            openObj?.title ??
            `${openObj.actor_name} (${openObj.actor_account})`,
          description: content,
          images: [openObj?.top_img ?? openObj.avatar],
          url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enkier/${id}`,
        },
        twitter: {
          card: "summary",
          title:
            openObj?.title ??
            `${openObj.actor_name} (${openObj.actor_account})`,
          description: content,
          images: [openObj?.top_img ?? openObj.avatar],
        },
        alternates: {
            canonical: `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enkier/${id}`,
        },
        other: {
          "wechat:title":
            openObj?.title ??
            `${openObj.actor_name} (${openObj.actor_account})`,
          "wechat:image": openObj?.top_img ?? openObj.avatar,
          "wechat:description": content,
          "profile:username": openObj.actor_account,
          "fragment": "!",
        },
      };
    }
    
  