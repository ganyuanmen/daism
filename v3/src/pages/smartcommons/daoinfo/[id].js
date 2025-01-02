
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
import { getEnv } from '../../../lib/utils/getEnv';
import Head from 'next/head';
/**
 * dao 信息 
 */
export default function DaoInfo({daoData,daoMember,follower,accountTotal,env,locale}) {
    const daoActor=useSelector((state) => state.valueData.daoActor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const [member,setMember]=useState([])
    const [follow,setFollow]=useState([])


    useEffect(()=>{ setMember(daoMember) },[daoMember])
    useEffect(()=>{ setFollow(follower) },[follower])
    

    return (<>
      <Head>
          <title>{tc('smartcommonsTitle',{name:daoData?.dao_symbol})}</title>
      </Head>
        <PageLayout env={env}>
            <div style={{marginTop:'10px'}} >
                  { daoData.dao_id?<>
                    <Domain_div record={daoData} daoActor={daoActor}  domain={env.domain} tc={tc} loginsiwe={loginsiwe} accountTotal={accountTotal} t={t}/>
                    <DaoInfo_div record={daoData} t={t} />
                    {daoData && member && member.length>0 &&  <Daomember_div record={member} t={t} dao_manager={daoData.dao_manager}/>}
                    {follow && follow.length>0 &&  <Follower_div record={follow} t={t} locale={locale} />}

                  </>
                :<ShowErrorBar errStr={tc('noDataText')} />}   
              </div>
        </PageLayout></>
    );
}

export const getServerSideProps = async ({ locale,query }) => {
    
    const daoid=query.id

      return {
        props: {
          messages: {
            ...require(`../../../messages/shared/${locale}.json`),
            ...require(`../../../messages/federation/${locale}.json`),
          }
          ,env:getEnv(),
          daoData:await getJsonArray("daodatabyid",[daoid],true),
          daoMember:await getJsonArray('daomember',[daoid]),
          follower:await getJsonArray('fllower',[daoid]),
          accountTotal:process.env.SMART_COMMONS_COUNT,locale
        }
      }
    }
  
