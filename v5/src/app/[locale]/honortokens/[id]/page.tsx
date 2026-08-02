



import Nftlist from '../Nftlist';
import { getTranslations } from 'next-intl/server';
import { getMynft } from '@/lib/mysql/daism';
import { type NftObjType } from '@/lib/mysql/daism';
import { notFound } from 'next/navigation';


/**
 * 个人荣誉通证
 */

interface HonorPageProps {
    params: Promise<{ locale: string;id:string;}>
}

export default async function HonorPage({ params }: HonorPageProps) {
    const { id } =await  params;
    const NFTData:NftObjType[]= await getMynft({did:id}) ;
    if (!NFTData || NFTData.length === 0) {
      notFound();
    }
   
    return (<Nftlist mynftData={NFTData} />);
}


 
export async function generateMetadata({ params }: HonorPageProps) {
    const { locale,id } = await params; 
    const t = await getTranslations('Common');
   
    return {
      title: t('tokensTitle'),
      alternates: {
        canonical: `https://daism.io/${locale}/honortokens/${id}`, 
      },
    };
   }