
import {Card } from 'react-bootstrap';
import { useSelector} from 'react-redux';
import MemberItem from '../../../components/federation/MemberItem';
import { User1Svg } from '../../../lib/jssvg/SvgCollection';
import withSession from '../../../lib/session';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import ShowImg from '../../../components/ShowImg';
import { getJsonArray } from '../../../lib/mysql/common';

export default function MyActor({daoActor,actor}) {
    
    const user = useSelector((state) => state.valueData.user)
    let t = useTranslations('ff')
  
    return (
      <PageLayout>
        <Card className='daism-title mt-2'>
        <Card.Header>{t('myAccount')}</Card.Header>
        <Card.Body>
        <div className='mb-3' >
            <MemberItem  record={actor} noLink={true}  />      
        </div>
        <hr/>
        <div>
            <div className='mb-2' ><b>{t('persionInfomation')}:</b></div>
            <div dangerouslySetInnerHTML={{__html: actor.member_desc}}></div>
        </div>
        <hr/>
        <div className='mb-2' ><b>{t('daoGroupText')}:</b></div>
        {
          daoActor.map((obj)=>(
              <div className='daism-a' key={obj.dao_id} >
              <div className='row mb-2 p-1' style={{borderBottom:'1px solid gray'}}  key={obj.dao_id}>
                <div className='col' >
                    <img src={obj.dao_logo?obj.dao_logo:'/logo.svg'} alt=''  width={32} height={32} style={{borderRadius:'50%'}} />
                    <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.dao_name}</span>
                </div>
                <div className='col' >
                  {obj.avatar?<ShowImg path={obj.avatar} alt='' width="32px" height="32px" borderRadius='50%' />
                    :<User1Svg size={32} />
                  }
                    <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.account}</span>
                </div>

                <div className='col' >
                    {obj.dao_manager.toLowerCase()===user.account.toLowerCase()?<span>{t('daoManagerText')}</span>
                    :parseInt(obj.member_type)===1?<span>{t('originMember')}</span>
                    :<span>{t('invitMember')}</span>
                    }
                </div> 
              </div>
              </div>
          ))
        }
        </Card.Body>
        </Card>
      </PageLayout>
    );
}

export const getServerSideProps = withSession(async ({ req, res,locale,query }) => {
  const _actor=await getJsonArray('actor',[query.id])
  const daoActor=await getJsonArray('daoactor',[query.id])
  const actor=_actor.length?_actor[0]:{member_address:query.id,member_icon:'',member_nick:'',member_desc:''}  

    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        daoActor,
        actor
      }
    }
  }

)

  