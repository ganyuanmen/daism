"use client";
import { useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import ShowErrorBar from '@/components/ShowErrorBar';
import {useTranslations } from 'next-intl'
import DaoInfoDiv from '@/components/federation/DaoInfoDiv';
import DaomemberDiv from '@/components/federation/DaomemberDiv';
import FollowerDiv from '@/components/federation/FollowerDiv';
import DomainDiv from '@/components/federation/DomainDiv';
import { type RootState } from '@/store/store';

export default function ClientDaoinfoPage({daoData,daoMember,follower}
    :{daoData:DaismDao,daoMember:DaoMember[],follower:ActorInfo[]}) {

    const daoActor=useSelector((state:RootState) => state.valueData.daoActor) as DaismDao[];

    const tc = useTranslations('Common')
    const [member,setMember]=useState<DaoMember[]>([])
    const [follow,setFollow]=useState<ActorInfo[]>([])


    useEffect(()=>{ setMember(daoMember) },[daoMember])
    useEffect(()=>{ setFollow(follower) },[follower])
    

    return (<>
     
            <div style={{marginTop:'10px'}} >
                  { daoData.dao_id?<>
                    <DomainDiv record={daoData} daoActor={daoActor}  />
                    <DaoInfoDiv record={daoData} />
                    {daoData && member && member.length>0 &&  
                    <DaomemberDiv record={member} dao_manager={daoData.dao_manager}/>}
                    {follow && follow.length>0 &&  <FollowerDiv record={follow} />}

                  </>
                :<ShowErrorBar errStr={tc('noDataText')} />}   
              </div>
        </>
    );
}
