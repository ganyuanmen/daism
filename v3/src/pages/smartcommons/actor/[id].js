
import {Card,Tab,Tabs,Accordion } from 'react-bootstrap';
import withSession from '../../../lib/session';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import DaoItem from '../../../components/federation/DaoItem';
import { getJsonArray } from '../../../lib/mysql/common';
import EnkiMember from '../../../components/enki2/form/EnkiMember'
import FollowItem0 from '../../../components/enki2/form/FollowItem0';
import FollowItem1 from '../../../components/enki2/form/FollowItem1';
import { getEnv } from '../../../lib/utils/getEnv';
import { getUser } from '../../../lib/mysql/user';
import Head from 'next/head';
/**
 * 指定个人帐号
 */
export default function MyActor({daoActor,actor,follow0,follow1,locale,env}) {
  let t = useTranslations('ff')
  let tc = useTranslations('Common')

    return (<>
      <Head>
          <title>{tc('myAccountTitle',{name:actor?.actor_name})}</title>
      </Head>
      <PageLayout env={env}>
        <Card className='daism-title mt-3'>
        <Card.Header>{t('myAccount')}</Card.Header>
        <Card.Body>
            <div className='d-flex justify-content-between align-items-center' >
              <EnkiMember messageObj={actor} isLocal={true} locale={locale} />
              {actor?.dao_id>0?t('groupAccount'):t('selfAccount')}
            </div>
            <hr/>
            <div>
                <div className='mb-2' ><b>{t('persionInfomation')}:</b></div>
                <div dangerouslySetInnerHTML={{__html: actor?.actor_desc}}></div>
            </div>
            <hr/>
            {actor?.dao_id===0 &&
              <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header><b>{t('daoGroupText')}:</b></Accordion.Header>
                <Accordion.Body>
               {daoActor.map((obj)=>(<DaoItem key={obj.dao_id} t={t} record={obj} />))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            }
         
         
            <Tabs defaultActiveKey="follow0" className="mb-3 mt-3" >
            <Tab eventKey="follow0" title={t('followingText',{num:follow0.length})}>
              <div>
                {follow0.map((obj)=> <FollowItem0 key={obj.id} locale={locale}  messageObj={obj} isEdit={false} />)}
              </div>
            </Tab>
            <Tab eventKey="follow1" title={t('followedText',{num:follow1.length})}>
              <div>
                {follow1.map((obj)=> <FollowItem1 locale={locale} key={obj.id}  messageObj={obj} isEdit={false} />)}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
        </Card>
        </PageLayout></>
    );
}

export const getServerSideProps = withSession(async ({locale,query }) => {
  const actor=await getUser('actor_account',query.id,'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc')
  const daoActor=await getJsonArray('daoactorbyid',[actor?.id])
  const follow0=await getJsonArray('follow0',[actor?.actor_account])
  const follow1=await getJsonArray('follow1',[actor?.actor_account])
  
    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        daoActor,actor,follow0,follow1,locale
        ,env:getEnv()
      }
    }
  }

)

  