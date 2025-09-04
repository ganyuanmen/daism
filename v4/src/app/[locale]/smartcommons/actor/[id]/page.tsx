


import { getTranslations } from 'next-intl/server';

import { getJsonArray } from '@/lib/mysql/common';
import { getUser } from '@/lib/mysql/user';
import EnkiView from '@/components/enki3/EnkiView';

interface HonorPageProps {
  params: Promise<{ locale: string;id:string;}>
}


export default async function MyIDActor({ params }: HonorPageProps) {
  const { id } = await params;

  const accountAr=await getJsonArray('accountAr',[process.env.NEXT_PUBLIC_DOMAIN]);
  const actor=await getUser('actor_account',id,'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc');
  if(!actor?.id)    return {notFound: true};
  const daoActor=await getJsonArray('daoactorbyid',[actor?.id])

  return (
    <EnkiView daoActor={daoActor}  actor={actor} accountAr={accountAr} notice={0} />
  )
}

 
export async function generateMetadata({ params }: HonorPageProps) {
 const { locale,id } = await params; 
 const t = await getTranslations('Common');

 return {
   title: t('myAccountTitle'),
   alternates: {
    canonical: `https://daism.io/${locale}/smartcommons/actor/${id}`, 
   },
 };
}
