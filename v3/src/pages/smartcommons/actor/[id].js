

import withSession from '../../../lib/session';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../lib/mysql/common';
import EnkiMember from '../../../components/enki2/form/EnkiMember'
import { getEnv } from '../../../lib/utils/getEnv';
import { getUser } from '../../../lib/mysql/user';
import Head from 'next/head';
import Mainself from '../../../components/enki3/Mainself';
import MessagePage from '../../../components/enki2/page/MessagePage';
import CreateMess from '../../../components/enki3/CreateMess';
import { useState,useRef,useEffect } from 'react';
import { Home,BookSvg,BackSvg,MyPost,ReceiveSvg } from '../../../lib/jssvg/SvgCollection';
import MyInfomation from '../../../components/enki3/MyInfomation';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import { NavDropdown } from 'react-bootstrap';
import { client } from '../../../lib/api/client';
import {getTipToMe,getTipFrom} from '../../../lib/mysql/folllow'
/**
 * 指定个人帐号 daoActor,actor,follow0,follow1,locale,env,accountAr
 */
export default function MyActor({daoActor,actor,follow0,follow1,locale,env,accountAr,tipToMe,tipFrom}) {
  const [fetchWhere, setFetchWhere] = useState({
    currentPageNum: 0,  //当前页 初始不摘取数据
    daoid: 0,  //此处不用
    actorid: actor?.id, 
    account: actor?.actor_account,
    where: '', //查询条件
    menutype: 3,
    v:9999,
    order: 'createTime', //排序
    eventnum: 2  //默认 我发布嗯文
});

const [personNum,setPersonNum]=useState(0);
const [companyNum,setCompanyNum]=useState(0);
const [receiveNum,setReceiveNum]=useState(0);

const [leftHidden,setLeftHidden]=useState(false)
const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
const [activeTab, setActiveTab] = useState(0);
const leftDivRef = useRef(null);
const parentDivRef = useRef(null);

const tc = useTranslations('Common')
const t = useTranslations('ff')
const [topText,setTopText]=useState(t('myEnkiText',{num:personNum}))

const paras={
  home:'home',  //个人信息
  mypost:'mypost',  //我的嗯文
  myreceive:'myreceive', // 我的接收
  myCompanyPost:'myCompanyPost'
}

const svgs={
  home:<Home size={24} />,
  mypost:<MyPost size={24} />,
  myreceive:<ReceiveSvg size={24} />,   
  myCompanyPost:<BookSvg size={24} />
}

const [navIndex,setNavIndex]=useState(paras.mypost) 
useEffect(()=>{
 
},[actor])


useEffect(() => {
  const fetchData = async () => {
    try {
        const res = await client.get(`/api/getData?account=${actor?.actor_account}&actorid=${actor?.id}`,'getEnkiTotal' );
        if(res?.status===200 && Array.isArray(res?.data)) {
        
                 setPersonNum(res.data[0].total);
                 setCompanyNum(res.data[1].total);
                 setReceiveNum(res.data[2].total);
            }
    } catch (error) {
        console.error(error);
    } 
};


   const resizeObserver = new ResizeObserver(() => {
    if (leftDivRef.current) {
      const style = window.getComputedStyle(leftDivRef.current);
      const display = style.getPropertyValue('display');
      setLeftHidden(display === 'none')
    }
  });

  if (parentDivRef.current) {  
    resizeObserver.observe(parentDivRef.current);
  }

  fetchData();

  return () =>{ 
      resizeObserver.disconnect();
  }
}, []);


  const homeHandle=()=>{ //个人信息
    setActiveTab(4);
    setTopText(t('accountInfoText'));
    setNavIndex(paras.home);
   }

  const myPostHandle=()=>{ //发布的嗯文
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2, menutype: 3 });
    setActiveTab(0);
    setTopText(t('myEnkiText',{num:personNum}));
    setNavIndex(paras.mypost);
   }


   const companyHadler=()=>{ //发布的公共
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 9, menutype: 2 });
    setActiveTab(0);
    setTopText(t('myCompanyEnkiText',{num:companyNum}));
    setNavIndex(paras.myCompanyPost);
   }


  const recerveHadler=()=>{ //接收
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 4, menutype: 3 });
    setActiveTab(0);
    setTopText(t('receiveEnkiText',{num:receiveNum}));
    setNavIndex(paras.myreceive);
   }

   const afterEditCall=(messageObj)=>{
    setCurrentObj(messageObj);
    setActiveTab(2);
    sessionStorage.setItem("daism-list-id",messageObj.id)
  }
  
  const callBack=()=>{  //回退处理，包括删除
   if(navIndex===paras.home) homeHandle(false);
   else if(navIndex===paras.mypost) myPostHandle(false);
    else if(navIndex===paras.myCompanyPost) companyHadler(false);
    else if(navIndex===paras.myreceive) recerveHadler(false);
  
  }

  
       
  const delcallBack=()=>{  //删除
    callBack();
    if(navIndex===paras.mypost) setPersonNum(personNum-1)
    else  if(navIndex===paras.myreceive) setReceiveNum(receiveNum-1)
      else  if(navIndex===paras.myCompanyPost) setCompanyNum(companyNum-1)

   }


    return (<>
      <Head>
          <title>{tc('myAccountTitle',{name:actor?.actor_name})}</title>
      </Head>
      <PageLayout env={env}>
      <div ref={parentDivRef}  className='d-flex justify-content-center' style={{position:'sticky',top:'70px'}} >
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' style={{overflow:'hidden'}} >
                        <EnkiMember messageObj={actor} isLocal={true} locale={locale} hw={64} /> 
                    </div>
                    <ul >
                      
                      <li className={navIndex===paras.mypost?'scli':''}><span onClick={myPostHandle} >{svgs.mypost} {t('myEnkiText',{num:personNum})}</span></li>
                      <li className={navIndex===paras.myCompanyPost?'scli':''}><span onClick={companyHadler} >{svgs.myCompanyPost} {t('myCompanyEnkiText',{num:companyNum})}</span></li>
                      <li className={navIndex===paras.myreceive?'scli':''}><span onClick={recerveHadler} >{svgs.myreceive} {t('receiveEnkiText',{num:receiveNum})}</span></li>
                      <li className={navIndex===paras.home?'scli':''}><span onClick={homeHandle} >{svgs.home} {t('accountInfoText')}</span></li>
                    </ul>
                   
                </div>
             
                <div className='sccontent' >
                <div className='d-flex justify-content-between align-items-center' style={{margin:'0px', position:'sticky',top:'60px',padding:'10px',zIndex:256,backgroundColor:'#f4f4f4',borderTopLeftRadius:'6px',borderTopRightRadius:'6px'}} > 
                
                  <div className='selectText' style={{paddingLeft:'12px'}} >
                    {activeTab===2 ? <span className='daism-a selectText' onClick={callBack} ><BackSvg size={24} />{t('esctext')} </span>
                    :<>{svgs[navIndex]} {topText}</>}
                   
                    </div>  
                  {leftHidden && <NavDropdown className='daism-a' title="..." >
                   
                    <NavDropdown.Item className={navIndex===paras.mypost?'scli':''}><span onClick={myPostHandle} >{svgs.mypost} {t('myEnkiText',{num:personNum})}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.myCompanyPost?'scli':''}><span onClick={companyHadler} >{svgs.myCompanyPost} {t('myCompanyEnkiText',{num:companyNum})}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.myreceive?'scli':''}><span onClick={recerveHadler} >{svgs.myreceive} {t('receiveEnkiText',{num:receiveNum})}</span></NavDropdown.Item>
                    <NavDropdown.Item  className={navIndex===paras.home?'scli':''}><span onClick={homeHandle} >{svgs.home} {t('accountInfoText')}</span></NavDropdown.Item>
                    </NavDropdown> } 
                </div>
           
                {activeTab === 0 ? <Mainself env={env} locale={locale} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} 
                      fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} delCallBack={delcallBack} afterEditCall={afterEditCall} 
                      tabIndex={fetchWhere.menutype===3?1:3} path={fetchWhere.menutype===3?'enkier':'enki'}
                      accountAr={accountAr} daoData={daoActor} fromPerson={true} />
  
                      :activeTab === 1 ? <CreateMess addCallBack={homeHandle}  currentObj={currentObj} 
                      afterEditCall={afterEditCall}  accountAr={accountAr}  callBack={callBack} />
  
                      :activeTab === 2 ? <MessagePage  path={fetchWhere.menutype===3?'enkier':'enki'} locale={locale} daoData={daoActor} env={env} currentObj={currentObj} 
                      delCallBack={delcallBack}  tabIndex={fetchWhere.menutype===3?1:3} setActiveTab={setActiveTab}
                      accountAr={accountAr} fromPerson={true} />
  
                      :activeTab===3 ? <EnkiCreateMessage env={env} daoData={daoActor} callBack={callBack} 
                      currentObj={currentObj} afterEditCall={afterEditCall} accountAr={accountAr} />
                      
                      :<MyInfomation daoActor={daoActor} env={env} actor={actor} follow0={follow0} follow1={follow1} locale={locale} tipToMe={tipToMe} tipFrom={tipFrom} />
                  }

                </div>
              
            </div>



        </PageLayout></>
    );
}

export const getServerSideProps = withSession(async ({locale,query }) => {
  const env=getEnv();
  const actor=await getUser('actor_account',query.id,'id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc')
  const daoActor=await getJsonArray('daoactorbyid',[actor?.id])
  const follow0=await getJsonArray('follow0',[actor?.actor_account])
  const follow1=await getJsonArray('follow1',[actor?.actor_account])

  const tipToMe=await getTipToMe({manager:actor?.manager})
  const tipFrom=await getTipFrom({manager:actor?.manager})

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
        daoActor,actor,follow0,follow1,locale,env,accountAr,tipToMe,tipFrom
      }
    }
  }

)
