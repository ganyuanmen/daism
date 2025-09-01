

import { getTranslations } from "next-intl/server";

// 页面主体
export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  
export async function generateMetadata({ params }: { params: Promise<{ locale: string}>; 
}) {
 const { locale } = await params; 
 const t = await getTranslations('wallet');

 return {
   title: t('donateTitle'),
   alternates: {
     canonical: `https://daism.io/${locale}/donation`, 
   },
 };
}