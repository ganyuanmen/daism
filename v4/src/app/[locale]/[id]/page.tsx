


import UserPage from './UserPage';
import { getTranslations } from 'next-intl/server';
import {getJsonArray } from '@/lib/mysql/common';
import { getUser } from '@/lib/mysql/user';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { cache } from 'react';

interface HonorPageProps {params: Promise<{ locale: string;id:string;}>}

const getActor = cache(async (id:string):Promise<DaismActor> => {
 return await getUser(
    'actor_account',`${id}@${process.env.NEXT_PUBLIC_DOMAIN}`,
    'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc'
  ) as DaismActor;
  });

export default async function UserIDPage({ params }: HonorPageProps) {
    const { id } = await params;
    const headersList =await headers();
    const acceptHeader = headersList.get('Accept')?.toLowerCase();
    const contentTypeHeader = headersList.get('content-type')?.toLowerCase();
    
    // 检查 ActivityPub 请求
    if (acceptHeader?.startsWith('application/activity') || 
        contentTypeHeader?.startsWith('application/activity')) {
        redirect(`/api/users/${id}`);
    }
  
    const {daoActor,actor,accountAr,daoData,daoMember,follower}=await getPageData(id);
    return ( <UserPage daoActor={daoActor} actor={actor} daoData={daoData} daoMember={daoMember} follower={follower} 
      accountAr={accountAr} />);
}


export async function generateMetadata({ params }: HonorPageProps) {
    const {id } = await params; 
    const t = await getTranslations('Common');
  
    const actor:DaismActor = await getActor(id);
   
    return {title:t('myAccountTitle',{name:actor.actor_name??''})};
}
    
  
async function getPageData(id: string) {
    
    const actor:DaismActor = await getActor(id);
    let daoActor=[] as DaismDao[];
    let accountAr=[] as AccountType[];
    let daoData = {} as DaismDao;
    let daoMember = [] as DaoMember[];
    let follower = [] as ActorInfo[];
    if (!actor?.id) {
      return {daoActor,actor,accountAr,daoData,daoMember,follower}
    }

    daoActor = await getJsonArray('daoactorbyid', [actor.id]) as DaismDao[];
    accountAr= await getJsonArray('accountAr', [process.env.NEXT_PUBLIC_DOMAIN]) as AccountType[];

    if (actor.dao_id??0 > 0) {
      daoData = await getJsonArray("daodatabyid", [actor.dao_id], true) as DaismDao;
      daoMember = await getJsonArray('daomember', [actor.dao_id]) as DaoMember[];
      follower = await getJsonArray('fllower', [actor.dao_id]) as ActorInfo[];
    }
  
    return { 
      daoActor, 
      actor, 
      accountAr, 
      daoData, 
      daoMember, 
      follower 
    };
  }
      
      