import { useTranslations } from 'next-intl'
import { useState,useEffect,useRef } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import ShowErrorBar from '../../../components/ShowErrorBar';
import { getEnv,decrypt } from '../../../lib/utils/getEnv';
import { encrypt } from '../../../lib/utils/windowjs';
import { getOne } from '../../../lib/mysql/message';
import { getJsonArray } from '../../../lib/mysql/common';
import Head from 'next/head';
import { httpGet } from '../../../lib/net';
import Mainself from '../../../components/enki3/Mainself';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { NavDropdown } from 'react-bootstrap';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import { BookSvg,Heart,BackSvg,EditSvg,TimeSvg,EventSvg,MyFollowSvg,SomeOne  } from '../../../lib/jssvg/SvgCollection';

/**
 * 我的社区
 */ 
export default function enki({openObj,env,locale,accountAr }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: -1,  //当前页
        daoid: '',  //所有'1,2,..', 单个'1' 方便sql in(${daoid})
        actorid: 0, account: '', 
        where: '', //查询条件
        menutype: 1,
        v:0, 
        order: 'reply_time', //排序
        eventnum: 0  //0 活动 1 非活动
     });
 
    const [leftHidden,setLeftHidden]=useState(false)
    const [rightHidden,setRightHidden]=useState(false)
    const [currentObj, setCurrentObj] = useState(openObj?.id?openObj:null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(openObj?.id ? 2 : 0);
    
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    // const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录
    const leftDivRef = useRef(null);
    const rightDivRef = useRef(null);
    const parentDivRef = useRef(null);
  
    const [daoData, setDaoData] = useState([]) //所属个人的社区列表
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表

    function removeUrlParams() {
        setCurrentObj(null);
        if(window.location.href.includes('?d=')) {
            const url = new URL(window.location.href);
            url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', url.href);
        }
      }
     const svgs=[
        {svg:<TimeSvg size={24} />,text:'latestText'},
        {svg:<EventSvg size={24} />,text:'eventText'},
        {svg:<MyFollowSvg size={24}/>,text:'followCommunity'},
        {svg:<BookSvg size={24}/>,text:'bookTapText'},
        {svg:<Heart size={24}/>,text:'likeText'},
        {svg:<EditSvg size={24}/>,text:'publishText'},
        {svg:<SomeOne size={24}/>,text:'filterText'}
    ]

   
      const [navObj,setNavObj]=useState(svgs[0]) 
      const actorRef=useRef();

       
      useEffect(()=>{
        if(actor?.id) actorRef.current=actor;
       
    },[actor])

      //生成我管理的公器ID 集合
      useEffect(() => { if (Array.isArray(daoActor) && daoActor.length ) setDaoData(daoActor.filter(obj => obj.actor_account)) }, [daoActor])

    useEffect(() => {
        latestHandle()
        // if (daoData.length > 0) {
        //     setFetchWhere({...fetchWhere,daoid: daoData.map((item) => { return item.dao_id }).join(',')});
        // }
    }, [daoData])
   
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

    const filterTag=(tag)=>{ //过滤标签
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time',v:'0', account: '', eventnum: 8, where: tag, daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
        setNavObj(svgs[6]);
      
    }

    const latestHandle=()=>{ //最新
        removeUrlParams();
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time',v:'0', account: '', eventnum: 0, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
        setNavObj(svgs[0]);
    }

    const eventHandle=()=>{ //活动
        removeUrlParams();
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'id', account: '',v:'0', eventnum: 1, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
        setNavObj(svgs[1]);
    }

    const createHandle=()=>{ //创建发文
        removeUrlParams()
        setCurrentObj(null);
        setActiveTab(1);
        setNavObj(svgs[5]);
        sessionStorage.removeItem('daism-list-id');
       
    }

    const myFollowHandle=()=>{ //我关注的社区
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:1,where: ''})
        setNavObj(svgs[2]);
        setActiveTab(0);
    }

    const myBookHandle=()=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:3,where: ''})
        setActiveTab(0);
        setNavObj(svgs[3]);
    }
    const myLikeHandle=()=>{ //喜欢
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:6,where: ''})
        setActiveTab(0);
        setNavObj(svgs[4]);
    }

    const daoSelectHandle=(obj)=>{ //选择dao后
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,where: '',order:'id',eventnum:0,where:'',v:0,daoid:obj.dao_id,account:obj.actor_account});
        setActiveTab(0);
        setNavObj(obj);
    }

    const getDomain=(messageObj)=>{
        let _account=(messageObj.send_type==0?messageObj.actor_account:messageObj.receive_account);
        return _account.split('@')[1];
      }
    
    const afterEditCall=(messageObj)=>{
        setCurrentObj(messageObj);
        setActiveTab(2);
        sessionStorage.setItem("daism-list-id",messageObj.id)
        history.pushState({ id: messageObj?.id }, `id:${messageObj?.id}`, `?d=${encrypt(`${messageObj.id},${getDomain(messageObj)}`,env)}`);
      }

    const callBack=()=>{  //回退处理，包括删除
        if(navObj?.text==='latestText') latestHandle();
        else if(navObj?.text==='eventText') eventHandle();
        else if(navObj?.text==='followCommunity') myFollowHandle();
        else if(navObj?.text==='bookTapText') myBookHandle();
        else if(navObj?.text==='likeText') myLikeHandle();
        else daoSelectHandle(navObj);  //dao选择
        
    }

    return (<>
        <Head>
            <title>{tc('enkiTitle')}</title>
            <meta content="article" property="og:type"></meta>
            <meta content={env.domain} property="og:site_name"></meta>
            <meta content={tc('enkiTitle')} property="og:title" />
            <meta content={`https://${env.domain}/${locale}/communities/enki`} property="og:url" />
            <meta content={new Date().toISOString()} property="og:published_time" />
            {/* <meta content={currentObj.actor_account} property="profile:username" /> */}
            <meta content={tc('enkiTitle')} name='description' />
            <meta content={tc('enkiTitle')} property="og:description" />
            <meta content="summary" property="twitter:card"/>
            <meta content={`https://${env.domain}/logo.svg`}  property="og:image" />
        </Head>
        <PageLayout env={env}>
          
            <div ref={parentDivRef}  className='d-flex justify-content-center' style={{position:'sticky',top:'70px'}} >
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' style={{overflow:'hidden'}} >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} locale={locale} hw={64} /> 
                        :<EnkiAccount locale={locale} />
                        }
                        {!loginsiwe && <Loginsign />}
                    </div>
                    {Array.isArray(daoData) && daoData.length > 0 ?
                    <ul >
                        {loginsiwe && actor?.actor_account && <>
                            <li className={navObj?.text==='publishText'?'scli':''}><span onClick={()=>createHandle(true)} >{svgs[5].svg} {t('publishText')}</span></li>
                            {rightHidden &&  <NavItem svgs={svgs} navObj={navObj} t={t} latestHandle={latestHandle} 
                            eventHandle={eventHandle} myFollowHandle={myFollowHandle} myBookHandle={myBookHandle} 
                            myLikeHandle={myLikeHandle} 
                            />}
                            {daoData.map((obj) =><li key={obj.dao_id} className={navObj?.dao_symbol===obj.dao_symbol?'scli':''}>
                                <span style={{display:'inline-block',whiteSpace:'nowrap'}}  onClick={()=>daoSelectHandle(obj)} >
                                    <img src={obj.dao_logo} alt={obj.actor_account} height={24} width={24} />{' '}
                                  {obj.actor_account}</span>
                                </li>)}
                        </>}
                    </ul>
                     : loginsiwe && <ShowErrorBar errStr={t('noRegisterText')} />
                    }
                   
                   
                </div>
              
                    <div className='sccontent' >
                    {Array.isArray(daoData) && daoData.length > 0 && <>
                        <div className='d-flex justify-content-between align-items-center' style={{margin:'0px', position:'sticky',top:'60px',padding:'10px',zIndex:256,backgroundColor:'#f4f4f4',borderTopLeftRadius:'6px',borderTopRightRadius:'6px'}} > 
                            <div className='selectText' style={{paddingLeft:'12px'}} >
                                {activeTab===2 ? <span className='daism-a selectText' onClick={callBack} > <BackSvg size={24} />{t('esctext')} </span>
                                :<>{navObj?.svg?navObj.svg:<img src={navObj.dao_logo} alt={navObj.actor_account} height={24} width={24}/>} {' '}
                                 {navObj?.text?t(navObj.text):navObj.actor_account}</>}
                            
                            </div>  
                            
                            {leftHidden && <NavDropdown className='daism-a' title="..." >
                                {loginsiwe && actor?.actor_account ? <>
                                <NavDropdown.Item className={navObj?.text==='publishText'?'scli':''}><span onClick={()=>createHandle(true)} >{svgs[5].svg} {t('publishText')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='latestText'?'scli':''}><span onClick={()=>latestHandle(true)} >{svgs[0].svg} {t('latestText')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='eventText'?'scli':''}><span onClick={()=>eventHandle(true)} >{svgs[1].svg} {t('eventText')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='followCommunity'?'scli':''}><span onClick={()=>myFollowHandle(true)} >{svgs[2].svg} {t('followCommunity')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='bookTapText'?'scli':''}><span onClick={()=>myBookHandle(true)} >{svgs[3].svg} {t('bookTapText')}</span></NavDropdown.Item>
                                <NavDropdown.Item className={navObj?.text==='likeText'?'scli':''}><span onClick={()=>myLikeHandle(true)} >{svgs[4].svg} {t('likeText')}</span></NavDropdown.Item>
                               
                                {daoData.map((obj) =><NavDropdown.Item key={obj.dao_id} className={navObj?.dao_symbol===obj.dao_symbol?'scli':''}>
                                <span style={{display:'inline-block',whiteSpace:'nowrap'}}  onClick={()=>daoSelectHandle(obj)} >
                                    <img src={obj.dao_logo} alt={obj.actor_account} height={24} width={24} />{' '}
                                  {obj.actor_account}</span>
                                </NavDropdown.Item>)}
                               </>
                               :<NavDropdown.Item ><ShowErrorBar errStr={t('noRegisterText')} /></NavDropdown.Item>
                               }
                                </NavDropdown> } 
                        </div>

                        {activeTab === 0 ? <Mainself env={env} locale={locale} setCurrentObj={setCurrentObj} 
                        setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} filterTag={filterTag}
                        delCallBack={callBack} afterEditCall={afterEditCall} accountAr={accountAr} 
                        path='enki' daoData={daoData}  />

                        :activeTab === 1 ? <EnkiCreateMessage env={env} daoData={daoData} callBack={callBack}
                         addCallBack={latestHandle} currentObj={currentObj} afterEditCall={afterEditCall} 
                         accountAr={accountAr} />
                         
                        :activeTab === 2 && <MessagePage  path="enki" locale={locale} env={env} currentObj={currentObj} 
                        delCallBack={callBack} setActiveTab={setActiveTab} accountAr={accountAr} daoData={daoData}
                        filterTag={filterTag} />
}
                        </>}
                    </div>
                    <div ref={rightDivRef} className='scsidebar scright' >
                    {Array.isArray(daoData) && daoData.length > 0 &&  <ul >
                            {loginsiwe && actor?.actor_account && 
                            <NavItem svgs={svgs} navObj={navObj} t={t} latestHandle={latestHandle} 
                            eventHandle={eventHandle} myFollowHandle={myFollowHandle} myBookHandle={myBookHandle} 
                            myLikeHandle={myLikeHandle} 
                            />
                            }
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
        const [id,domain]=decrypt(query.d).split(',');
        if(domain==env.domain){
            openObj=await getOne({id,sctype:''})
        }
        else 
        {
            let response=await httpGet(`https://${domain}/api/getData?id=${id}&sctype=`,{'Content-Type': 'application/json',method:'getOne'})
            if(response?.message) openObj=response.message
        }
    }
    if(openObj?.createtime) openObj.createtime=new Date(openObj.createtime).toJSON();
    if(openObj?.currentTime) openObj.currentTime=new Date(openObj.currentTime).toJSON();
    if(openObj?.reply_time) openObj.reply_time=new Date(openObj.reply_time).toJSON();

    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale
            ,env,openObj,accountAr
        }
    }
}


function NavItem({svgs,navObj,t,latestHandle,eventHandle,myFollowHandle,myBookHandle,myLikeHandle}){
    return (<>
           <li className={navObj?.text==='latestText'?'scli':''}><span onClick={()=>latestHandle()} >{svgs[0].svg} {t('latestText')}</span></li>
           <li className={navObj?.text==='eventText'?'scli':''}><span onClick={()=>eventHandle()} >{svgs[1].svg} {t('eventText')}</span></li>
           <li className={navObj?.text==='followCommunity'?'scli':''}><span onClick={()=>myFollowHandle()} >{svgs[2].svg} {t('followCommunity')}</span></li>
           <li className={navObj?.text==='bookTapText'?'scli':''}><span onClick={()=>myBookHandle()} >{svgs[3].svg} {t('bookTapText')}</span></li> 
           <li className={navObj?.text==='likeText'?'scli':''}><span onClick={()=>myLikeHandle()} >{svgs[4].svg} {t('likeText')}</span></li> 
    </>)
  }
  