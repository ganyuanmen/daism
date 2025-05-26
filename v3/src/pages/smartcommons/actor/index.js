
import {Alert} from 'react-bootstrap';
import { useSelector} from 'react-redux';
import ShowErrorBar from '../../../components/ShowErrorBar';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Wecome from '../../../components/federation/Wecome'
import EnKiRigester from '../../../components/enki2/form/EnKiRigester';
import { getEnv } from '../../../lib/utils/getEnv';
import Head from 'next/head';
import { getJsonArray } from '../../../lib/mysql/common';
import EnkiView from '../../../components/enki3/EnkiView';
/**
 * 登录后个人信息
 * @env 环境变量
 * @locale zh/cn
 */
export default function MyActor({env,locale,accountAr}) {
    const user = useSelector((state) => state.valueData.user)
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const daoActor = useSelector((state) => state.valueData.daoActor) 
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
  
    return (<>
      <Head>
          <title>{tc('myAccounttTitle')}</title>
      </Head>
      <PageLayout env={env}>
        <div style={{marginTop:'10px'}} >
            {user?.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
            :!loginsiwe?<Wecome />
            :<ActorInfo t={t} env={env} locale={locale} actor={actor}  daoActor ={daoActor} accountAr={accountAr} />
            }  
        </div>
      </PageLayout></>
    );
}

function ActorInfo({t,env,locale,actor,daoActor,accountAr })
{
  return  <> 
      {(actor?.actor_account)? <EnkiView daoActor={daoActor}  actor={actor} locale={locale} env={env} accountAr={accountAr} />
        :<div>    {/* 未注册帐号  */}
          <Alert>{t('noregisterText')} </Alert>
          <EnKiRigester  env={env} />
        </div>
      }
      </>
}




  export const getServerSideProps = async ( { locale }) => {
    const env=getEnv();
    const accountAr=await getJsonArray('accountAr',[env?.domain])
  
    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        }
        ,env,accountAr,locale
      }
    }

  }



  