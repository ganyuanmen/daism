


// const Nftlist = dynamic(() => import('../Nftlist'), { ssr: false });
import Nftlist from '../Nftlist';
import { getTranslations } from 'next-intl/server';
import { getMynft } from '@/lib/mysql/daism';


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

export default async function Honor({ params }: HonorPageProps) {
    const { id } = await params;
    const NFTData= await getMynft({did:id}) ;
   
    return ( <>
     

      <Nftlist mynftData={NFTData} />

      </>         
    )
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