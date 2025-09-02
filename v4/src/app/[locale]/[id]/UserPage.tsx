"use client";


import EnkiView from '@/components/enki3/EnkiView';
import { useSelector} from 'react-redux';
import DaoInfoDiv from '@/components/federation/DaoInfoDiv';
import DaomemberDiv from '@/components/federation/DaomemberDiv';
import FollowerDiv from '@/components/federation/FollowerDiv';
import DomainDiv from '@/components/federation/DomainDiv';
import { useTranslations } from 'next-intl'
import { RootState } from '@/store/store';
import ShowErrorBar from '@/components/ShowErrorBar';

interface ChildProps{
  daoActor:DaismDao[];
  actor:DaismActor;
  accountAr:AccountType[];
  daoData:DaismDao;
  daoMember:DaoMember[];
  follower:ActorInfo[]
}

export default function UserPage({daoActor,actor,accountAr,daoData,daoMember,follower}:ChildProps) {
 
  const loginsiwe = useSelector((state:RootState) => state.valueData.loginsiwe)
    const tc = useTranslations('Common')
    const t = useTranslations('ff')

    return (
    <>{actor?.id??0>0?
      <>
        {actor?.dao_id??0>0? 
          <div style={{marginTop:'10px'}} >
            <DomainDiv record={daoData} daoActor={daoActor}  />
            <DaoInfoDiv record={daoData}  />
            {daoData && daoMember && daoMember.length>0 &&  
              <DaomemberDiv record={daoMember} dao_manager={daoData.dao_manager}/>
            }
            {follower && follower.length>0 &&  <FollowerDiv record={follower} />}
          </div>
          :
          <EnkiView daoActor={daoActor}  actor={actor}  accountAr={accountAr} notice={0} />
        }
      </>:<ShowErrorBar errStr={tc('notRegisterEnki')} />
    }</>
    );
}
