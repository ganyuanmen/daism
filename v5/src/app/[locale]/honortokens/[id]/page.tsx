


// const Nftlist = dynamic(() => import('../Nftlist'), { ssr: false });
import Nftlist from '../Nftlist';
import { getTranslations } from 'next-intl/server';
import { getMynft } from '@/lib/mysql/daism';


/**
 * 个人荣誉通证
 */

// interface HonorPageProps {
//     params: Promise<{ locale: string;id:string;}>
// }

export default async function HonorPage({ params }: any) {
    const { id } =  params;
    const NFTData= await getMynft({did:id}) ;
   
    return (<Nftlist mynftData={NFTData} />);
}


 
export async function generateMetadata({ params }: any) {
    const { locale,id } =  params; 
    const t = await getTranslations('Common');
   
    return {
      title: t('tokensTitle'),
      alternates: {
        canonical: `https://daism.io/${locale}/honortokens/${id}`, 
      },
    };
   }