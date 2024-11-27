
import {Alert} from 'react-bootstrap';
import { useSelector} from 'react-redux';
import ShowErrorBar from '../../../components/ShowErrorBar';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Wecome from '../../../components/federation/Wecome'
import EnKiRigester from '../../../components/enki2/form/EnKiRigester';
import { getEnv } from '../../../lib/utils/getEnv';
import ActorMember from '../../../components/enki2/form/ActorMember';
import Head from 'next/head';
/**
 * 登录后个人信息
 */
export default function MyActor({env,accountTotal,locale}) {
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
  
    return (<>
      <Head>
          <title>{tc('myAccounttTitle')}</title>
      </Head>
      <PageLayout env={env}>
        <div style={{marginTop:'10px'}} >
            {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
            :!loginsiwe?<Wecome />
            :<ActorInfo t={t} tc={tc} user={user} domain={env.domain} accountTotal={accountTotal} locale={locale} />
            }  
        </div>
      </PageLayout></>
    );
}

function ActorInfo({t,tc,user,domain,accountTotal,locale})
{
  const actor = useSelector((state) => state.valueData.actor) 
  return  <> 
      {(actor?.actor_account)?<ActorMember locale={locale} actor={actor} t={t} tc={tc} user={user} domain={domain} accountTotal={accountTotal}  />
        :<div>    {/* 未注册帐号  */}
          <Alert>{t('noregisterText')} </Alert>
          <EnKiRigester t={t} domain={domain} user={user} accountTotal={accountTotal} />
        </div>
      }
      </>
}


export const getServerSideProps = ({ locale }) => {

    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        }
        ,env:getEnv()
        ,accountTotal:process.env.SMART_COMMONS_COUNT,locale
      }
    }

  }



  