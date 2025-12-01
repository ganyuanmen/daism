'use client'
import { useSelector} from 'react-redux';
import Wecome from '@/components/federation/Wecome';
import ShowErrorBar from '@/components/ShowErrorBar';
import { Card } from 'react-bootstrap';
import { useTranslations } from 'next-intl'
import DaoItem from '@/components/federation/DaoItem'
import CreateDao from '@/components/my/CreateDao';
import {type RootState} from '@/store/store'

/**
 * 菜单中，我的智能公器
 */

export default function MyDao() {  
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const user = useSelector((state:RootState) => state.valueData.user) //钱包登录用户信息
    const daoActor = useSelector((state:RootState) => state.valueData.daoActor) as DaismDao[];  //dao社交帐号列表
    const loginsiwe = useSelector((state:RootState) => state.valueData.loginsiwe)
    const setRefresh=()=>{}

    const getDaoList=(data: DaismDao[])=>{
        return <>
              <CreateDao setRefresh={setRefresh} />
              <Card className='daism-title mt-2'>
                <Card.Header>{t('daoGroupText')}</Card.Header>
                <Card.Body>
                    { data.map(obj=><DaoItem record={obj} key={obj.dao_id} />)}
                </Card.Body>
                </Card>   
            </>    
    }
    
    return (
          <div style={{marginTop:'20px'}} >
            {
              user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
              :<>
                {loginsiwe?<>
                  {(daoActor && daoActor.length)?getDaoList(daoActor):<ShowErrorBar errStr={t('noDaoMemberText')} />}
                  </>:<Wecome />
                }
              </>
            }
          </div>
    );
}


