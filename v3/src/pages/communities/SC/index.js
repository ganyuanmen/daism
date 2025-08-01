import { useTranslations } from 'next-intl'
import { useState,useEffect,useRef } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import { getEnv } from '../../../lib/utils/getEnv';
import Head from 'next/head';
import { getData, getJsonArray } from '../../../lib/mysql/common';
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import Loadding from '../../../components/Loadding';
import { client } from '../../../lib/api/client';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import Mainself from '../../../components/enki3/Mainself';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { NavDropdown,Button } from 'react-bootstrap';
import {BackSvg,TimeSvg,EventSvg,SomeOne  } from '../../../lib/jssvg/SvgCollection';

/**
 * 我的社区
 */ 
export default function sc({env,locale,accountAr,openObj }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
        daoid:openObj?.dao_id?openObj.dao_id:'',  
        actorid: 0, account: '', 
        where: '', //查询条件
        menutype: 2,
        v:0, 
        order: 'createtime', //排序
        eventnum: 0  //0 活动 1 非活动
     });
 
    const [leftHidden,setLeftHidden]=useState(false)
    const [rightHidden,setRightHidden]=useState(false)
    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [daoWhere,setDaoWhere]=useState({ currentPageNum:0,where:''}); //dao 下载
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const leftDivRef = useRef(null);
    const rightDivRef = useRef(null);
    const parentDivRef = useRef(null);
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    // const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表

    const [daoData, setDaoData] = useState([]) //社区列表
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    
    const svgs=[{svg:<TimeSvg size={24} />,text:'latestText'},{svg:<EventSvg size={24} />,text:'eventText'}];
    const [navObj,setNavObj]=useState(svgs[0])

    function removeUrlParams() {
        setCurrentObj(null);
        // if(window.location.href.includes('?d=')) {
            // const url = new URL(window.location.href);
            // url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', `${locale==='en'?'':'/zh'}/communities/SC`);
        // }
      }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${daoWhere.currentPageNum}&w=${daoWhere.where}`, 'daoPageData');
                setHasMore(res.data.length >= 10);
                if (daoWhere.currentPageNum === 0) setDaoData(res.data);
                else setDaoData([...daoData, ...res.data]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData(); 
    }, [daoWhere]);

    useEffect(() => {
     
        const resizeObserver = new ResizeObserver(() => {
          if (leftDivRef.current) {
            const style = window.getComputedStyle(leftDivRef.current);
            const display = style.getPropertyValue('display');
            setLeftHidden(display === 'none')
          }
          if (rightDivRef.current) {
            const style = window.getComputedStyle(rightDivRef.current);
            const display = style.getPropertyValue('display');
            setRightHidden(display === 'none')
          }
        });
    
        if (parentDivRef.current) {  
          resizeObserver.observe(parentDivRef.current);
        }
        // window.addEventListener('popstate', popStateHandler);
      
        return () =>{ 
            resizeObserver.disconnect();
            // window.removeEventListener('popstate', popStateHandler);
        }
      }, []);

      useEffect(()=>{
        if(openObj?.dao_id) setNavObj(openObj)
      },[openObj])
      
      const filterTag=(tag)=>{ //过滤标签
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,daoid:0, order: 'reply_time', account: '', eventnum: 8, where: tag })
        setActiveTab(0);
        setNavObj({isFilter:true,text:`# ${tag}`});
      
    }

    const latestHandle=()=>{ //最新
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,daoid:0, order: 'reply_time', account: '', eventnum: 0, where: '' })
        setActiveTab(0);
        setNavObj(svgs[0]);
    }

    const eventHandle=()=>{ //活动
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, daoid:0,order: 'createtime', account: '',eventnum: 1, where: '' })
        setActiveTab(0);
        setNavObj(svgs[1]);
    }

   
    const daoSelectHandle=(obj)=>{ //选择dao后
        
        setFetchWhere({ ...fetchWhere, currentPageNum:0,order:'createtime',eventnum:0,where:'',v:0,daoid:obj.dao_id,account:obj.actor_account});
        setActiveTab(0);
        setNavObj(obj);
        window.history.replaceState({}, '', `${locale==='en'?'':'/zh'}/communities/SC?d=${obj.actor_account}`);
        
    }

    const callBack=()=>{  //回退处理，包括删除
        if(navObj?.text==='latestText') latestHandle();
        else if(navObj?.text==='eventText') eventHandle();
        else daoSelectHandle(navObj);  //dao选择
        
    }
      
    const afterEditCall=(messageObj)=>{
        setCurrentObj(messageObj);
        setActiveTab(2);
        sessionStorage.setItem("daism-list-id",messageObj.id);
        if(messageObj.actor_account.split('@')[1]===env.domain)
            window.history.replaceState({}, '', `${locale==='en'?'':'/zh'}/communities/enki/${messageObj.message_id}`);
    }


    return (<>
        <Head>
            <title>{tc('scTitle')}</title>
            <meta content="article" property="og:type"></meta>
            <meta content={env.domain} property="og:site_name"></meta>
            <meta content={tc('scTitle')} property="og:title" />
            <meta content={`https://${env.domain}/${locale}/communities/SC`} property="og:url" />
            <meta content={new Date().toISOString()} property="og:published_time" />
            {/* <meta content={currentObj.actor_account} property="profile:username" /> */}
            <meta content={tc('scTitle')} name='description' />
            <meta content={tc('scTitle')} property="og:description" />
            <meta content="summary" property="twitter:card"/>
            <meta content={`https://${env.domain}/logo.svg`}  property="og:image" />
        </Head>
        <PageLayout env={env}>
          
            <div ref={parentDivRef}  className='d-flex justify-content-center'>
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' style={{overflow:'hidden'}} >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} locale={locale} hw={64} /> : 
                        <EnkiAccount locale={locale} />}
                        {!loginsiwe && <Loginsign />}
                    </div>
                    <ul >
                        {rightHidden &&  <NavItem svgs={svgs} navObj={navObj} t={t} latestHandle={latestHandle} 
                        eventHandle={eventHandle} />}
                        {daoData.map((obj) =><li key={obj.dao_id} className={navObj?.dao_id===obj.dao_id?'scli':''}>
                            <span style={{display:'inline-block',whiteSpace:'nowrap'}}  onClick={()=>daoSelectHandle(obj)} >
                                <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} />{' '}
                                {obj.actor_account}</span>
                            </li>)}
                        
                    </ul>
                    <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                        {isLoading?<Loadding />
                            : hasMore && <Button  onClick={()=>setDaoWhere({ ...daoWhere, currentPageNum: daoWhere.currentPageNum + 1 })}  variant='light'>fetch more ...</Button>
                        }
                    </div>
                   
                   
                </div>
              
                    <div className='sccontent' >
                    {Array.isArray(daoData) && daoData.length > 0 && <>
                        <div className='d-flex justify-content-between align-items-center secconddiv'> 
                            <div className='selectText' style={{paddingLeft:'12px'}} >
                                {activeTab===2 ? <span className='daism-a selectText' onClick={callBack} ><BackSvg size={24} /> {t('esctext')} </span>
                                :<>{navObj.isFilter?'': navObj?.svg?navObj.svg:<img src={navObj.avatar} alt={navObj.actor_account} height={24} width={24}/>} 
                                {' '} {navObj.isFilter?navObj.text: navObj?.text?t(navObj.text):navObj.actor_account}</>}
                            
                            </div>  
                            
                            {leftHidden && <NavDropdown title="..." >
                                <NavDropdown.Item className={navObj?.text==='latestText'?'scli':''}><span onClick={()=>latestHandle(true)} >{svgs[0].svg} {t('latestText')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='eventText'?'scli':''}><span onClick={()=>eventHandle(true)} >{svgs[1].svg} {t('eventText')}</span></NavDropdown.Item>
                                {daoData.map((obj,idx) =><NavDropdown.Item key={`${obj.dao_id}_${idx}`} className={navObj?.dao_id===obj.dao_id?'scli':''}>
                            <span style={{display:'inline-block',whiteSpace:'nowrap'}}  onClick={()=>daoSelectHandle(obj)} >
                                <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} />{' '}
                                {obj.actor_account}</span>
                            </NavDropdown.Item>)}
                                </NavDropdown> } 
                        </div>
                     
                        {activeTab === 0 ? <Mainself env={env} locale={locale} setCurrentObj={setCurrentObj} 
                        setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} tabIndex={1}
                        delCallBack={callBack} afterEditCall={afterEditCall}  path='SC' daoData={daoActor}
                        filterTag={filterTag} />
                        
                        :activeTab === 1 ? <EnkiCreateMessage env={env} daoData={daoActor} callBack={callBack}
                         currentObj={currentObj} afterEditCall={afterEditCall} accountAr={accountAr}/>
                     
                        :activeTab === 2 && <MessagePage  path="SC" locale={locale} env={env} currentObj={currentObj}  tabIndex={1}
                        delCallBack={callBack} setActiveTab={setActiveTab} daoData={daoActor} filterTag={filterTag} />
}
                        </>}
                    </div>
                    <div ref={rightDivRef} className='scsidebar scright' >
                    {Array.isArray(daoData) && daoData.length > 0 &&  <ul >
                        <NavItem svgs={svgs} navObj={navObj} t={t} latestHandle={latestHandle} eventHandle={eventHandle} />
                    </ul>
                    }
                    </div>
            </div>

        </PageLayout></>
    )
}

export const getServerSideProps = async ({ locale,query }) => {
    let openObj={}; 
    const env=getEnv();
    const accountAr=await getJsonArray('accountAr',[env?.domain])
    if(query.d){
        openObj=await getData("SELECT dao_id,actor_account,avatar FROM a_account WHERE LOWER(actor_account)=?",[query.d.toLowerCase()],true)
        if(!openObj) openObj={};
    }
    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale,env,accountAr,openObj
        }
    }
}

function NavItem({svgs,navObj,t,latestHandle,eventHandle}){
    return (<>
           <li className={navObj?.text==='latestText'?'scli':''}><span onClick={()=>latestHandle()} >{svgs[0].svg} {t('latestText')}</span></li>
           <li className={navObj?.text==='eventText'?'scli':''}><span onClick={()=>eventHandle()} >{svgs[1].svg} {t('eventText')}</span></li>
    </>)
  }
  