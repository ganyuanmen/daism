



import ClientId from './ClientId';
import { getTranslations } from 'next-intl/server';
import { getMyDaoDetail } from '@/lib/mysql/daism';
import { getData } from '@/lib/mysql/common';



/**
 * 个人荣誉通证
 */

interface HonorPageProps {
    // params: {
    //   locale: string;
    //   id: string;
    // };
    params: Promise<{ locale: string;id:string;}>
  }

export default async function DaoDetailPage({ params }: HonorPageProps) {
    const { id } = await params;
    const daoDetail= await getMyDaoDetail(id) ;
   
    return ( <ClientId daoData={daoDetail} />);
}


 
export async function generateMetadata({ params }: HonorPageProps) {
    const { locale,id } = await params; 
    const t = await getTranslations('Common');

    const dao= await getData('select dao_symbol from t_dao where dao_id=?',[id],true) ;

    return {
        title: t('smartcommonsTitle',{name:dao?.dao_symbol}),
      alternates: {
        canonical: `https://daism.io/${locale}/workroom/${id}`, 
      },
    };
   }

