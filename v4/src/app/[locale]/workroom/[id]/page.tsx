



import ClientId from './ClientId';
import { getTranslations } from 'next-intl/server';
import { getMyDaoDetail } from '@/lib/mysql/daism';
import { cache } from 'react';



/**
 * 个人荣誉通证
 */

interface HonorPageProps {params: Promise<{ locale: string;id:string;}>}

const getCachedDaoDetail = cache(async (id: string) => {
  return await getMyDaoDetail(id);
});

export default async function DaoDetailPage({ params }: HonorPageProps) {
    const { id } = await params;
    const daoDetail= await getCachedDaoDetail(id) ;
    return ( <ClientId daoData={daoDetail} />);
}


export async function generateMetadata({ params }: HonorPageProps) {
    const { locale,id } = await params; 
    const t = await getTranslations('Common');

    const daoDetail= await getCachedDaoDetail(id);

    return {
        title: t('smartcommonsTitle',{name:daoDetail?.dao_symbol}),
      alternates: {
        canonical: `https://daism.io/${locale}/workroom/${id}`, 
      },
    };
   }

