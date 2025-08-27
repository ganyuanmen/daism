


import ClientEnki from './ClientEnki';
import { getTranslations } from 'next-intl/server';
import parse from 'node-html-parser';
import { cache } from 'react';
import { getData, getJsonArray } from '@/lib/mysql/common';

interface HonorPageProps {params: Promise<{ locale: string;id:string;}>}

const getOpenObj = cache(async (id: string) => {
    const openObj=await getData('select * from v_messagesc where message_id=?',[id],true);
    
  if(openObj?.createtime) openObj.createtime=new Date(openObj.createtime).toJSON();
  if(openObj?.currentTime) openObj.currentTime=new Date(openObj.currentTime).toJSON();
  if(openObj?.reply_time) openObj.reply_time=new Date(openObj.reply_time).toJSON();
  if(openObj?.start_time) openObj.start_time=new Date(openObj.start_time).toJSON();
  if(openObj?.end_time) openObj.end_time=new Date(openObj.end_time).toJSON();

  return openObj;
  
});

const getAccount = cache(async () => {
  return await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN]);
  });

export default async function EnkiIDPage({ params }: HonorPageProps) {
    const { id } = await params;
    const openObj=await getOpenObj(id);
    const accountAr=await getAccount();
    return ( <ClientEnki openObj={openObj?.message_id?openObj:null} accountAr={accountAr} />);
}


export async function generateMetadata({ params }: HonorPageProps) {
    const {locale, id } = await params; 
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
          url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enki/${id}`,
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
            canonical: `https://${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/communities/enki/${id}`,
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
    
  