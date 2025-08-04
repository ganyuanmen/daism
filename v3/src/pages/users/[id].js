

import withSession from '../../lib/session';
import PageLayout from '../../components/PageLayout';
import { getJsonArray } from '../../lib/mysql/common';
import { getEnv } from '../../lib/utils/getEnv';
import { getUser } from '../../lib/mysql/user';
import Head from 'next/head';
import EnkiView from '../../components/enki3/EnkiView';
import { useSelector} from 'react-redux';
import DaoInfo_div from '../../components/federation/DaoInfo_div';
import Daomember_div from '../../components/federation/Daomember_div';
import Follower_div from '../../components/federation/Follower_div';
import Domain_div from '../../components/federation/Domain_div';
import { useTranslations } from 'next-intl'

export default function MyActor({daoActor,actor,locale,env,accountAr,accountTotal,daoData,daoMember,follower}) {
 
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const tc = useTranslations('Common')
    const t = useTranslations('ff')

    return (<>
      <Head>
          <title>{tc('myAccountTitle',{name:actor?.actor_name})}</title>
      </Head>
      <PageLayout env={env}>
        {actor?.dao_id>0? <div style={{marginTop:'10px'}} >
                
                    <Domain_div record={daoData} daoActor={daoActor}  domain={env.domain} tc={tc} 
                    loginsiwe={loginsiwe} accountTotal={accountTotal} t={t}/>
                    <DaoInfo_div record={daoData} t={t} />
                    {daoData && daoMember && daoMember.length>0 &&  <Daomember_div record={daoMember} t={t} dao_manager={daoData.dao_manager}/>}
                    {follower && follower.length>0 &&  <Follower_div record={follower} t={t} locale={locale} />}

                
              </div>:<EnkiView daoActor={daoActor}  actor={actor} locale={locale} env={env} accountAr={accountAr}  isEdit={false} />
                  }
      </PageLayout></>
    );
}

export const getServerSideProps = withSession(async ({locale,query,req }) => {
  if((req.headers['accept'] 
    && req.headers['accept'].toLowerCase().startsWith('application/activity'))
    ||(req.headers['content-type'] && req.headers['content-type'].toLowerCase().startsWith('application/activity')))
  {
    return {
      redirect: {
        destination: `/api/users/${query.id}`, // 跳转的目标页面
        permanent: false, // 是否为永久重定向，true 表示 301 重定向，false 为 302 临时重定向
      },
    };
  
  }
  const env=getEnv();
  const actor=await getUser('actor_account',`${query.id}@${env.domain}`,'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc')
  if(!actor?.id)    return {notFound: true};
  const daoActor=await getJsonArray('daoactorbyid',[actor?.id]);
  const accountAr=await getJsonArray('accountAr',[env?.domain]);
  let daoData={};
  let daoMember=[];
  let follower=[];
  if(actor.dao_id>0){
    daoData=await getJsonArray("daodatabyid",[actor.dao_id],true);
    daoMember=await getJsonArray('daomember',[actor.dao_id]);
    follower=await getJsonArray('fllower',[actor.dao_id]);
  }

    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/federation/${locale}.json`),
        },
        daoActor,actor,locale,env,accountAr,daoData, accountTotal:process.env.SMART_COMMONS_COUNT,daoMember,follower
      }
    }
  }

)
