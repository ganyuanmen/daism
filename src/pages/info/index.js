import { useSelector} from 'react-redux';
import Wecome from '../../components/federation/Wecome';
import ShowErrorBar from '../../components/ShowErrorBar';
import Link from 'next/link'
import { useRouter } from "next/router";
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import DaoItem from '../../components/federation/DaoItem'
import { getJsonArray } from '../../lib/mysql/common';
import { useState } from 'react';
import iaddStyle from '../../styles/iadd.module.css'


export default function Federation({infoData}) {  
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const { locale } = useRouter()
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const [curData,setCurData]=useState(infoData)

    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
 
 
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

    return (
        <PageLayout>
        {
          user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
          :!loginsiwe? <Wecome />
          :<>
           <div style={{backgroundColor:'white',width:'100%',padding:'10px'}} >
              <TopSearch infoData={infoData} setCurData={setCurData}  />
            </div>
            {curData.map(obj=>(
                      <Link key={obj.dao_id} className='daism-a' href={`/${locale}/info/visit/[id]`} as={`/${locale}/info/visit/${obj.dao_id}`}>
                          <DaoItem record={obj} user={user} isVist={checkVist(obj.dao_id)}  noLink={true} />
                      </Link>
                      ))
            }
            </>
        }
        </PageLayout>
    );
}


function TopSearch({infoData,setCurData})
{ 
    
    
    return <div className="d-flex mb-2" style={{paddingLeft:'16px',paddingRight:'6px'}}  >
                <img alt="" width={20} height={20} className={iaddStyle.iadd_find_img} src="/find.svg" />
                <input  autoComplete="off" className={`form-control form-control-lg ${iaddStyle.iadd_find_input}`} 
                placeholder='Search name smart common' onChange={
                    e=>{
                        let v=e.currentTarget.value.toLowerCase().trim()
                        if(!v) setCurData(infoData)
                        else {
                            let _curData =infoData.filter(o=>o.account.toLowerCase().includes(v))
                            setCurData(_curData)
                        }
                    }
                }  />
           </div>
}


export const getServerSideProps = async ({ req, res,locale }) => {
    
    let infoData=await getJsonArray('infomain',[])
 
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/federation/${locale}.json`),
          },infoData
        }
      }
    }

  
    