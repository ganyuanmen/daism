
import { useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import ShowErrorBar from '../../../components/ShowErrorBar';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../lib/mysql/common';
import PageLayout from '../../../components/PageLayout';
import DaoInfo_div from '../../../components/federation/DaoInfo_div';
import Daomember_div from '../../../components/federation/Daomember_div';
import Follower_div from '../../../components/federation/Follower_div';
import Domain_div from '../../../components/federation/Domain_div';


export default function DaoInfo({daoData,daoMember,follower,domain}) {
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const user = useSelector((state) => state.valueData.user)

    const [member,setMember]=useState([])
    const [follow,setFollow]=useState([])

    useEffect(()=>{ setMember(daoMember) },[daoMember])
    useEffect(()=>{ setFollow(follower) },[follower])
    

    return (
        <PageLayout>
            
                  { daoData.dao_id?<>
                    <Domain_div record={daoData} loginsiwe={loginsiwe} user={user} domain={domain} tc={tc}  t={t}/>
                    <DaoInfo_div record={daoData} t={t} />
                    {daoData && member && member.length>0 &&  <Daomember_div record={member} t={t} dao_manager={daoData.dao_manager}/>}
                    {follow && follow.length>0 &&  <Follower_div record={follow} t={t} />}

                  </>
                :<ShowErrorBar errStr={t('notDiscussionText')} />}   

            
         
        </PageLayout>
    );
}

export const getServerSideProps = async ({ req, res,locale,query }) => {
    
    const daoid=query.id

      return {
        props: {
          messages: {
            ...require(`../../../messages/shared/${locale}.json`),
            ...require(`../../../messages/federation/${locale}.json`),
          },
          domain:process.env.LOCAL_DOMAIN,
          daoData:await getJsonArray("daodata2",[daoid],true),
          daoMember:await getJsonArray('daomember',[daoid]),
          follower:await getJsonArray('fllower',[daoid])
        }
      }
    }
  
