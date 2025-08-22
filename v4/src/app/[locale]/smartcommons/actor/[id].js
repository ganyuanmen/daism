

import withSession from '../../../lib/session';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../lib/mysql/common';
// import EnkiMember from '../../../components/enki2/form/EnkiMember'
import { getEnv } from '../../../lib/utils/getEnv';
import { getUser } from '../../../lib/mysql/user';
import Head from 'next/head';
// import Mainself from '../../../components/enki3/Mainself';
// import MessagePage from '../../../components/enki2/page/MessagePage';
// import CreateMess from '../../../components/enki3/CreateMess';
// import { useState,useRef,useEffect } from 'react';
// import { Home,BookSvg,BackSvg,MyPost,ReceiveSvg } from '../../../lib/jssvg/SvgCollection';
// import MyInfomation from '../../../components/enki3/MyInfomation';
// import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
// import { NavDropdown } from 'react-bootstrap';
// import { client } from '../../../lib/api/client';
// import {getTipToMe,getTipFrom} from '../../../lib/mysql/folllow'
import EnkiView from '../../../components/enki3/EnkiView';
/**
 * 指定个人帐号 daoActor,actor,follow0,follow1,locale,env,accountAr
 */
export default function MyActor({daoActor,actor,locale,env,accountAr}) {
 

  const tc = useTranslations('Common')
    return (<>
      <Head>
          <title>{tc('myAccountTitle',{name:actor?.actor_name})}</title>
      </Head>
      <PageLayout env={env}>
      <EnkiView daoActor={daoActor}  actor={actor} locale={locale} env={env} accountAr={accountAr}  isEdit={false} />


        </PageLayout></>
    );
}

export const getServerSideProps = withSession(async ({locale,query }) => {
  const env=getEnv();
  const actor=await getUser('actor_account',query.id,'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc');
  if(!actor?.id)    return {notFound: true};
    //daoActor,actor,locale,env,accountAr
  const daoActor=await getJsonArray('daoactorbyid',[actor?.id])
  // const follow0=await getJsonArray('follow0',[actor?.actor_account])
  // const follow1=await getJsonArray('follow1',[actor?.actor_account])

  // const tipToMe=await getTipToMe({manager:actor?.manager})
  // const tipFrom=await getTipFrom({manager:actor?.manager})

  // const personNum=await getData("select count(*) as total from v_message where lower(actor_account)=? and send_type=0",[query?.id?.toLowerCase()],true);
  // const companyNum=await getData("select count(*) as total from a_messagesc where actor_id=?",[actor?.id],true);
  // const receiveNum=await getData("select count(*) as total from v_message where lower(receive_account)=?",[query?.id?.toLowerCase()],true);
  const accountAr=await getJsonArray('accountAr',[env?.domain])

    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        daoActor,actor,locale,env,accountAr
      }
    }
  }

)
