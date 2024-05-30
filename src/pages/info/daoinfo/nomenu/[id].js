
import Rmenu from '../../../../components/Rmenu';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../../lib/mysql/common';


import DaoInfo_div from '../../../../components/federation/DaoInfo_div';
import Daomember_div from '../../../../components/federation/Daomember_div';
import Follower_div from '../../../../components/federation/Follower_div';
import Domain_div from '../../../../components/federation/Domain_div';
import { useState } from 'react';
import { useEffect } from 'react';


export default function DaoInfo({daoData,daoMember,follower,domain}) {
   
    const tc = useTranslations('Common')
    const t = useTranslations('ff')


    const [member,setMember]=useState([])
    const [follow,setFollow]=useState([])


    useEffect(()=>{ setMember(daoMember) },[daoMember])
    useEffect(()=>{ setFollow(follower) },[follower])
    

    return (
        <Rmenu>
          { daoData.dao_id?<>
            <Domain_div record={daoData} domain={domain} tc={tc}  t={t}/>
            <DaoInfo_div record={daoData} t={t} />
            {daoData && member && member.length>0 &&  <Daomember_div record={member} t={t} dao_manager={daoData.dao_manager}/>}
            {follow && follow.length>0 && <Follower_div record={follow} t={t} />}

          </>
        :<ShowErrorBar errStr={t('notDiscussionText')} />}      
        </Rmenu>
        
    );
}

export const getServerSideProps = async ({ req, res,locale,query }) => {
    
    const daoid=query.id

      return {
        props: {
          messages: {
            ...require(`../../../../messages/shared/${locale}.json`),
            ...require(`../../../../messages/federation/${locale}.json`),
          },
          domain:process.env.LOCAL_DOMAIN,
          daoData:await getJsonArray("daodata2",[daoid],true),
          daoMember:await getJsonArray('daomember',[daoid]),
          follower:await getJsonArray('fllower',[daoid])
        }
      }
    }
  
