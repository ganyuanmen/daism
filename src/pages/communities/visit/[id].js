import { useEffect, useState } from 'react';
import MainItem from '../../../components/federation/MainItem';
import { useSelector} from 'react-redux';
import ShowErrorBar from '../../../components/ShowErrorBar';
import Breadcrumb from '../../../components/Breadcrumb';
import Wecome from '../../../components/federation/Wecome';
import DaoItem from '../../../components/federation/DaoItem';
import { GroupsSvg } from '../../../lib/jssvg/SvgCollection';
import PageLayout from '../../../components/PageLayout';
import { getJsonArray } from '../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import Link from 'next/link';


export default function Home({homeData,daoData}) {
    const [isVist,setIsVist]=useState(true)  //是不是游客
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息

    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(daoData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
     },[daoActor])
   
    const showData=()=>{
        return (
            <>
                <Breadcrumb menu={[]} currentPage={daoData.dao_name} ></Breadcrumb>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}} >
                    <div></div>
                    <div className='daism-color' style={{display:'flex',alignItems:'center'}} >
                    <GroupsSvg size={72} /> <div style={{fontSize:'48px'}} >{daoData.account}</div>
                    </div>
                    {!isVist? <Link className="btn btn-primary" href={`/communities/source`} >{t('imgManagerText')}  </Link>:<div></div>}
                </div>
              
                <DaoItem  user={user} record={daoData} isVist={isVist} />
                <div className='row mt-2' >
                    <div className='col-md-6 col-sm-12' >
                    <MainItem daoid={daoData?.dao_id} path='discussions' isVist={isVist} data={homeData.discussion} t={t} ></MainItem>
                    </div>
                    <div className='col-md-6 col-sm-12' >
                    <MainItem daoid={daoData?.dao_id} path='news' isVist={isVist} data={homeData.news} t={t} ></MainItem>
                    </div>
                </div>
                <div className='row mt-2' >
                    <div className='col' >
                    <MainItem  daoid={daoData?.dao_id} path='events' isVist={isVist} data={homeData.events}  t={t}></MainItem>
                    </div>
                </div>  
            </>
            )       
    }

  return (
    <PageLayout>
    {
    // user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
    // :!loginsiwe? <Wecome />
    // :daoData && daoData.account?
     showData()
    // :<ShowErrorBar errStr={t('daoCommunityText')} />
    
    }
    </PageLayout>
  );
}

export const getServerSideProps = async ({ req, res,locale,query }) => {
   
    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        homeData:{
          discussion: await getJsonArray('dmain',[query.id]),
          news:await getJsonArray('nmain',[query.id]),
          events:await getJsonArray('emain',[query.id]),
        },
        daoData:await getJsonArray("daodata2",[query.id],true)
      }
    }
  }

    