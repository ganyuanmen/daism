

import {Card,Tab,Tabs,Accordion } from 'react-bootstrap';
import { useTranslations } from 'next-intl'
import DaoItem from '../federation/DaoItem';
import EnkiMember from '../enki2/form/EnkiMember'
import FollowItem0 from '../enki2/form/FollowItem0';
import FollowItem1 from '../enki2/form/FollowItem1';


const MyInfomation = ({daoActor,actor,follow0,follow1,locale}) => {
  let t = useTranslations('ff')

  return (
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
  );
};

export default MyInfomation;

