import { useSelector} from 'react-redux';
import Wecome from '../../components/federation/Wecome';
import ShowErrorBar from '../../components/ShowErrorBar';
import Link from 'next/link'
import { Card } from 'react-bootstrap';
import { useRouter } from "next/router";
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import DaoItem from '../../components/federation/DaoItem'


export default function MyDao() {  
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const { locale } = useRouter()
    function checkVist(daoId)
    {

     if(daoActor && daoActor.length) {
       let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(daoId)})
       if(_daoData) 
         return false
       else 
         return true
     }
     return true;
     
    }


    const getDaoList=data=>{
        return <Card className='daism-title mt-2'>
                <Card.Header>{t('daoGroupText')}</Card.Header>
                <Card.Body>
                    { data.map(obj=>
                    <Link key={obj.dao_id} className='daism-a' 
                    href={obj.domain?`/${locale}/info/visit/[id]`:`/${locale}/info/daoinfo/[id]`} 
                    as={obj.domain?`/${locale}/info/visit/${obj.dao_id}`:`/${locale}/info/daoinfo/${obj.dao_id}`}>
                        <DaoItem record={obj} user={user} isVist={checkVist(obj.dao_id)}  noLink={true} />
                    </Link>
                    )
                    }
                </Card.Body>
                </Card>       
    }
    
    return (
        <PageLayout>
        {
        user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
        :daoActor?(daoActor.length?getDaoList(daoActor)
            :<ShowErrorBar errStr={t('noDaoMemberText')} />)
        :<Wecome />
        }
        </PageLayout>
    );
}



export const getStaticProps = ({ req, res,locale }) => {
   
    
 
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/federation/${locale}.json`),
          }
        }
      }
    }
  