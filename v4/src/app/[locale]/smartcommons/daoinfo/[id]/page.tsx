


import  ClientDaoinfoPage from './ClientDaoinfoPage'
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { getJsonArray } from '@/lib/mysql/common';

const getDaoData = cache(async (id: string) => {
  return await getJsonArray("daodatabyid",[id],true) as DaismDao;
});

interface HonorPageProps {
    params: Promise<{ locale: string;id:string;}>
  }

export default async function DaoInfoPage({ params }: HonorPageProps) {
    const { id } = await params;
    const daoData=await getDaoData(id);
    if(!daoData?.dao_id)   return {notFound: true};
    const daoMember=await getJsonArray('daomember',[id]) as DaoMember[];
    const follower=await getJsonArray('fllower',[id]) as ActorInfo[]
   
    return (<ClientDaoinfoPage daoData={daoData} daoMember={daoMember} follower={follower} />);
}


 
export async function generateMetadata({ params }: HonorPageProps) {
    const { locale,id } = await params; 
    const t = await getTranslations('Common');
    const daoData=await getDaoData(id);
   
    return {
      title:t('smartcommonsTitle',{name:daoData.dao_symbol}),
      alternates: {
        canonical: `https://daism.io/${locale}/smartcommons/daoinfo/${id}`, 
      },
    };
   }