
import Mynft from './mynft'
import { getTranslations } from 'next-intl/server';
/**
 * 荣誉通证
 */
export default function NFT() {
    return (  
          <div style={{marginTop:'20px'}} >
            <Mynft  />
        </div>
    );
}


 
export async function generateMetadata({ params }: { params: Promise<{ locale: string}>;}) {
 const { locale } = await params; 
 const t = await getTranslations('Common');

 return {
   title: t('tokensTitle'),
   alternates: {
     canonical: `https://daism.io/${locale}/honortokens`, 
   },
 };
}