import { useTranslations } from 'next-intl'
import { useState,useEffect,useRef } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import { useDispatch } from 'react-redux';
import {setMessageText } from '../../../data/valueData'
import SearchInput from '../../../components/enki2/form/SearchInput'
import ShowErrorBar from '../../../components/ShowErrorBar';
import EnKiFollow from '../../../components/enki2/form/EnKiFollow';
import EnKiUnFollow from '../../../components/enki2/form/EnKiUnFollow'
import FollowCollection from '../../../components/enki3/FollowCollection';
import { getEnv, } from '../../../lib/utils/getEnv';
// import { encrypt } from '../../../lib/utils/windowjs';
// import { getOne } from '../../../lib/mysql/message';
import { getJsonArray } from '../../../lib/mysql/common';
// import { httpGet } from '../../../lib/net';
import Head from 'next/head';
import Mainself from '../../../components/enki3/Mainself';
import CreateMess from '../../../components/enki3/CreateMess';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { NavDropdown } from 'react-bootstrap';
import { Home,BookSvg,SomeOne,Heart,BackSvg,PublicMess,EditSvg,Follow,MyPost,ReceiveSvg } from '../../../lib/jssvg/SvgCollection';


/**
 * 个人社区
 * @env 环境变量
 * @locale zh/cn
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 */ 
export default function enkier({env,locale,accountAr }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: -1,  //当前页 初始不摘取数据
        daoid: 0,  //此处不用
        actorid: 0, account: '',
        where: '', //查询条件
        menutype: 3,
        v:0,
        order: 'reply_time', //排序
        eventnum: 5  //默认 全站
    });
 
    const [leftHidden,setLeftHidden]=useState(false)
    const [rightHidden,setRightHidden]=useState(false)
    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);
    const [followMethod,setFollowMethod]=useState('getFollow0') //默认显示我关注谁
    const [searObj,setSearObj]=useState(null) //查找到帐号的对象
    const [findErr,setFindErr]=useState(false) //搜索帐号没找到
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录
    const leftDivRef = useRef(null);
    const rightDivRef = useRef(null);
    const parentDivRef = useRef(null);
    const dispatch = useDispatch();
    function showClipError(str) { dispatch(setMessageText(str)) }
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const [topText,setTopText]=useState(t('allPostText'))
   
    function removeUrlParams() {
        setCurrentObj(null);
       // if(window.location.href.includes('?d=')) {
         //   const url = new URL(window.location.href);
         //   url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', `${locale==='en'?'':'/zh'}/communities/enkier`);
       // }
      }
      
      const paras={
        home:'home',
        mypost:'mypost',
        myreceive:'myreceive',
        book:'book',
        like:'like',
        all:'all',
        create:'create',
        follow0:'follow0',
        follow1:'follow1',
        at:'at',
        filter:'filter'
      }

      const svgs={
        home:<Home size={24} />,
        mypost:<MyPost size={24} />,
        myreceive:<ReceiveSvg size={24} />,   
        book:<BookSvg size={24} />,
        like:<Heart size={24} />,
        all:<PublicMess size={24} />,
        create:<EditSvg size={24} />,
        follow0:<Follow size={24} />,
        follow1:<Follow size={24} />,
        at:<SomeOne size={24} />,
        filter:''
      }
    
      const [navIndex,setNavIndex]=useState(paras.all) 
      const actorRef=useRef();

    
      useEffect(()=>{
        if(actor?.id) actorRef.current=actor;
        if(window.sessionStorage.getItem("loginsiwe")==='1'){
            setTimeout(() => {
            homeHandle();
            }, 200); 
        }else 
        {
            allHandle();
        }
          
        
    },[actor])
   
    useEffect(() => {
        // const popStateHandler=(event)=>{
        //     if(event?.state?.id){
        //         const url=event.state.id;
        //         if(url===paras.home) homeHandle(false);
        //         else if(url===paras.mypost) myPostHandle(false);
        //         else if(url===paras.myreceive) myReceiveHandle(false);
        //         else if(url===paras.book) myBookHandle(false);
        //         else if(url===paras.like) myLikeHandle(false);
        //         else if(url===paras.follow0) followManHandle0(false);
        //         else if(url===paras.follow1) followManHandle1(false);
        //         else if(url===paras.at)  myAtHandle(false);
        //         else if(url===paras.all) allHandle(false); 
                
        //     }
        // }
     
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

    const allHandle=()=>{ // 公开
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 5,account: '',where:'' });
        setActiveTab(0);
        setTopText(t('allPostText'));setNavIndex(paras.all);
        // if(post) history.pushState({id:paras.all}, tc('enkierTitle'), `#${paras.all}`);
    }

    const homeHandle=()=>{ //首页
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 1,account: actorRef.current?.actor_account?actorRef.current.actor_account:'' });
        setActiveTab(0);
        setTopText(t('scHomeText'));setNavIndex(paras.home);
        // if(post) history.pushState({id:paras.home}, tc('enkierTitle'), `#${paras.home}`);
      
    }
    const filterTag=(tag)=>{ //过滤标签
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 8,where:tag,account: actorRef.current?.actor_account?actorRef.current.actor_account:'' });
        setActiveTab(0);
        setTopText(`# ${tag}`);setNavIndex(paras.filter);
        // if(post) history.pushState({id:paras.home}, tc('enkierTitle'), `#${paras.home}`);
      
    }

    const createHandle=()=>{ //创建发文
        removeUrlParams()
        const [name,localdomain]=actorRef.current.actor_account.split('@');
        if(env.domain!==localdomain) return showClipError(t('loginDomainText',{domain:localdomain}));
        setCurrentObj(null);
        setActiveTab(1);
        setTopText(t('createPostText'));
        setNavIndex(paras.create);
        sessionStorage.removeItem('daism-list-id');
        // if(post) history.pushState({id:paras.create}, tc('enkierTitle'), `#${paras.create}`);
       
    }

    const myPostHandle=()=>{ //我的发文
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 2,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('myPostText'));setNavIndex(paras.mypost);
        // if(post) history.pushState({id:paras.mypost}, tc('enkierTitle'), `#${paras.mypost}`);
    }
 
    const myReceiveHandle=()=>{ //接收到的发文
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 4,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('myReceiveText'));setNavIndex(paras.myreceive);
        // if(post) history.pushState({id:paras.myreceive}, tc('enkierTitle'), `#${paras.myreceive}`);
    }

    const followManHandle0=()=>{ //我关注谁
        removeUrlParams()
        setFollowMethod('getFollow0');
        setActiveTab(3);
        setTopText(t('followManText0'));setNavIndex(paras.follow0);
        // if(post) history.pushState({id:paras.follow0}, tc('enkierTitle'), `#${paras.follow0}`);
    }

    const followManHandle1=()=>{ //谁关注我
        removeUrlParams()
        setFollowMethod("getFollow1");
        setActiveTab(3);
        setTopText(t('followManText1'));setNavIndex(paras.follow1);
        // if(post) history.pushState({id:paras.follow1}, tc('enkierTitle'), `#${paras.follow1}`);
    }

    const myBookHandle=()=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 3,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('bookTapText'));setNavIndex(paras.book);
        // if(post) history.pushState({id:paras.book}, tc('enkierTitle'), `#${paras.book}`);
    }
    const myLikeHandle=()=>{ //喜欢
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 6,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('likeText'));setNavIndex(paras.like);
        //  if(post) history.pushState({id:paras.like}, tc('enkierTitle'), `#${paras.like}`);
    }
    
    const myAtHandle=()=>{ //私下提及
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 7,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('atSomeOne'));setNavIndex(paras.at);
        // if(post) history.pushState({id:paras.at}, tc('enkierTitle'), `#${paras.at}`);
    }

    const getID=(messageObj)=>{
      
            if(messageObj?.receive_account){
                return `${locale==='en'?'':'/zh'}/communities/enkier/${messageObj.id}`
            }
            else {
                 return `${locale==='en'?'':'/zh'}/communities/enkier/${messageObj.message_id}`
            }
      
      }
    
    const afterEditCall=(messageObj)=>{
        setCurrentObj(messageObj);
        setActiveTab(2);
        sessionStorage.setItem("daism-list-id",messageObj.id);
        if(!messageObj?.httpNetWork) //本地的
            window.history.replaceState({}, '', getID(messageObj));
       // history.pushState({ id: messageObj?.id }, `id:${messageObj?.id}`, `?d=${encrypt(`${messageObj.id},${getDomain(messageObj)}`,env)}`);
      }


    const callBack=()=>{  //回退处理，包括删除
        if(navIndex===paras.home) homeHandle(false);
        else if(navIndex===paras.mypost) myPostHandle(false);
        else if(navIndex===paras.myreceive) myReceiveHandle(false);
        else if(navIndex===paras.book) myBookHandle(false);
        else if(navIndex===paras.like) myLikeHandle(false);
        else if(navIndex===paras.follow0) followManHandle0(false);
        else if(navIndex===paras.follow1) followManHandle1(false);
        else if(navIndex===paras.at)  myAtHandle(false);
        else if(navIndex===paras.all) allHandle(false); 
        else {
            if(actorRef.current?.id) homeHandle(false);
            else allHandle(false); 
        }
    }

   

    return (<>
        <Head>
            <title>{tc('enkierTitle')}</title>
            <meta content="article" property="og:type"></meta>
            <meta content={env.domain} property="og:site_name"></meta>
            <meta content={tc('enkierTitle')} property="og:title" />
            <meta content={`https://${env.domain}/${locale}/communities/enkier`} property="og:url" />
            <meta content={new Date().toISOString()} property="og:published_time" />
            {/* <meta content={currentObj.actor_account} property="profile:username" /> */}
            <meta content={tc('enkierTitle')} name='description' />
            <meta content={tc('enkierTitle')} property="og:description" />
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
                        <li className={navIndex===paras.all?'scli':''} ><span onClick={()=>allHandle(true)} >{svgs.all} {t('allPostText')}</span></li>
                        
                        {loginsiwe && actor?.actor_account && <>
                        
                            <li className={navIndex===paras.create?'scli':''}><span onClick={()=>createHandle(true)} >{svgs.create} {t('createPostText')}</span></li>
                            {rightHidden &&  <NavItem svgs={svgs} navIndex={navIndex} t={t} paras={paras} homeHandle={homeHandle} myPostHandle={myPostHandle}
                                        myReceiveHandle={myReceiveHandle} myAtHandle={myAtHandle} myBookHandle={myBookHandle}
                                        myLikeHandle={myLikeHandle} />}
                            <li className={navIndex===paras.follow0?'scli':''}><span onClick={()=>followManHandle0(true)} >{svgs.follow0} {t('followManText0')}</span></li>
                            <li className={navIndex===paras.follow1?'scli':''}><span onClick={()=>followManHandle1(true)} >{svgs.follow1} {t('followManText1')}</span></li>
                          
                        </>}
                    </ul>
                    {loginsiwe && actor?.actor_account?.includes('@') && env.domain===actor?.actor_account.split('@')[1] && <div>
                    <SearchInput setSearObj={setSearObj} setFindErr={setFindErr} />
                    {searObj && <div className='mt-3' >
                        <EnkiMember messageObj={searObj} isLocal={!!searObj.manager} locale={locale} />
                        <div className='mb-3 mt-3'>
                        {searObj.id>0?<EnKiUnFollow searObj={searObj}  />
                        :<EnKiFollow searObj={searObj} showText={true} />
                        }
                        </div>
                    </div>
                    }
                    {findErr && <ShowErrorBar errStr={t('noFindText')} />}
                    </div>
                    }
                   
                </div>
             
                <div className='sccontent' >
                <div className='d-flex justify-content-between align-items-center secconddiv'  > 
                
                  <div className='selectText' style={{paddingLeft:'12px'}} >
                    {activeTab===2 ? <span className='daism-a selectText' onClick={callBack} ><BackSvg size={24} />{t('esctext')} </span>
                    :<>{svgs[navIndex]} {topText}</>}
                   
                    </div>  
                  {leftHidden && <NavDropdown className='daism-a' title="..." >
                    <NavDropdown.Item  className={navIndex===paras.all?'scli':''}><span onClick={()=>allHandle(true)} >{svgs.all} {t('allPostText')}</span></NavDropdown.Item>
                    {loginsiwe && actor?.actor_account && <>
                    <NavDropdown.Item className={navIndex===paras.create?'scli':''}><span onClick={()=>createHandle(true)} >{svgs.create} {t('createPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.home?'scli':''}><span onClick={()=>homeHandle(true)} >{svgs.home} {t('scHomeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.mypost?'scli':''}><span onClick={()=>myPostHandle(true)} >{svgs.mypost} {t('myPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.myreceive?'scli':''}><span onClick={()=>myReceiveHandle(true)} >{svgs.myreceive} {t('myReceiveText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.at?'scli':''}><span onClick={()=>myAtHandle(true)} >{svgs.at} {t('atSomeOne')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.book?'scli':''}><span onClick={()=>myBookHandle(true)} >{svgs.book} {t('bookTapText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.like?'scli':''}><span onClick={()=>myLikeHandle(true)} >{svgs.like} {t('likeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.follow0?'scli':''}><span onClick={()=>followManHandle0(true)} >{svgs.follow0} {t('followManText0')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===paras.follow1?'scli':''}><span onClick={()=>followManHandle1(true)} >{svgs.follow1} {t('followManText1')}</span></NavDropdown.Item>
                    </>}
                    </NavDropdown> } 
                </div>
           
                    {activeTab === 0 ? <Mainself env={env} locale={locale} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} 
                    fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} filterTag={filterTag}  tabIndex={1}
                    delCallBack={callBack} afterEditCall={afterEditCall} accountAr={accountAr} path='enkier' />

                    :activeTab === 1 ? <CreateMess addCallBack={homeHandle} accountAr={accountAr} currentObj={currentObj} 
                    afterEditCall={afterEditCall} callBack={callBack} />

                    :activeTab === 2 ? <MessagePage  path="enkier" locale={locale} env={env} currentObj={currentObj} tabIndex={1}
                    delCallBack={callBack} setActiveTab={setActiveTab} accountAr={accountAr} filterTag={filterTag} />

                    :activeTab===3 && <FollowCollection locale={locale}  method={followMethod}/>}

                </div>
                <div ref={rightDivRef} className='scsidebar scright' >
                <ul >
                        {loginsiwe && actor?.actor_account && 
                        <NavItem svgs={svgs} navIndex={navIndex} t={t} paras={paras} homeHandle={homeHandle} 
                        myPostHandle={myPostHandle} myReceiveHandle={myReceiveHandle} myAtHandle={myAtHandle} 
                        myBookHandle={myBookHandle} myLikeHandle={myLikeHandle} />
                        }
                    </ul>
                </div>
            </div>

        </PageLayout></>
    )
}


export const getServerSideProps = async ({ locale }) => {
  
    const env=getEnv();
    const accountAr=await getJsonArray('accountAr',[env?.domain])
  

    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale
            ,env,accountAr
        }
    }
}


function NavItem({svgs,navIndex,t,paras,homeHandle,myPostHandle,myReceiveHandle,myAtHandle,myBookHandle,myLikeHandle}){
  return (<>
        <li className={navIndex===paras.home?'scli':''}><span onClick={()=>homeHandle(true)} >{svgs.home} {t('scHomeText')}</span></li>
        <li className={navIndex===paras.mypost?'scli':''}><span onClick={()=>myPostHandle(true)} >{svgs.mypost} {t('myPostText')}</span></li>
        <li className={navIndex===paras.myreceive?'scli':''}><span onClick={()=>myReceiveHandle(true)} >{svgs.myreceive} {t('myReceiveText')}</span></li>
        <li className={navIndex===paras.at?'scli':''}><span onClick={()=>myAtHandle(true)} >{svgs.at} {t('atSomeOne')}</span></li>
        <li className={navIndex===paras.book?'scli':''}><span onClick={()=>myBookHandle(true)} >{svgs.book} {t('bookTapText')}</span></li> 
        <li className={navIndex===paras.like?'scli':''}><span onClick={()=>myLikeHandle(true)} >{svgs.like} {t('likeText')}</span></li> 
  </>)
}

