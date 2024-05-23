 import { useState } from 'react';
import Loadding from '../../components/Loadding';
import { useSelector} from 'react-redux';
import ProsPage from '../../components/pro/ProsPage';
import ShowErrorBar from '../../components/ShowErrorBar';
import { useTranslations } from 'next-intl'
import PageLayout from '../../components/PageLayout';
import useMyPro from '../../hooks/useMyPro';


/**
 * 我的提案
 */
export default function Proposal() {
    const [refresh,setRefresh]=useState(true)
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const prosData = useMyPro({did:user.account,refresh,setRefresh})
    const tc = useTranslations('Common')


    return ( <PageLayout>
            {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
            :prosData.data.length?<ProsPage  prosData={prosData} setRefresh={setRefresh} />
            :prosData.status==='failed'?<ShowErrorBar errStr={prosData.error} />
            :prosData.status==='succeeded'? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }  
        </PageLayout>
    );
}


export const getStaticProps =  ({ req, res,locale }) => {
    
  
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/dao/${locale}.json`),
          }
        }
      }
    }
  

  
    
