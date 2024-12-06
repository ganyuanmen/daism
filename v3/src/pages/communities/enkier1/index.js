import { useTranslations } from 'next-intl'
import { useState,useEffect,useRef } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import { useDispatch } from 'react-redux';
import {setTipText,setMessageText } from '../../../data/valueData'
import SearchInput from '../../../components/enki2/form/SearchInput'
import ShowErrorBar from '../../../components/ShowErrorBar';
import EnKiFollow from '../../../components/enki2/form/EnKiFollow';
import EnKiUnFollow from '../../../components/enki2/form/EnKiUnFollow'
import FollowCollection from '../../../components/enki3/FollowCollection';
import { getEnv,decrypt } from '../../../lib/utils/getEnv';
import { getOne } from '../../../lib/mysql/message';
import { getJsonArray } from '../../../lib/mysql/common';
import Head from 'next/head';
import Mainself from './Mainself';
import CreateMess from './CreateMess';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { NavDropdown } from 'react-bootstrap';
import { Home,BookSvg,SomeOne,Heart,BackSvg,PublicMess,EditSvg,Follow,MyPost,ReceiveSvg } from '../../../lib/jssvg/SvgCollection';
/**
 * 个人社区
 */
export default function me({openObj,env,locale,accountAr }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
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
    const [currentObj, setCurrentObj] = useState(openObj?.id?openObj:null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(openObj?.id ? 2 : 0);
    const [followMethod,setFollowMethod]=useState('getFollow0') //默认显示我关注谁
    const [searObj,setSearObj]=useState(null) //查找到帐号的对象
    const [findErr,setFindErr]=useState(false) //搜索帐号没找到
    // const [big,setBig]=useState(true) //左边缩进按钮控制, 默认左边大

    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录
    const leftDivRef = useRef(null);
    const rightDivRef = useRef(null);
    const parentDivRef = useRef(null);
  

    const dispatch = useDispatch();
    function showTip(str) { dispatch(setTipText(str)) }
    function closeTip() { dispatch(setTipText('')) }
    function showClipError(str) { dispatch(setMessageText(str)) }
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const [topText,setTopText]=useState(t('allPostText'))
   
    function removeUrlParams() {
        setCurrentObj(null);
        if(window.location.href.includes('?d=')) {
            const url = new URL(window.location.href);
            url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', url.href);
        }
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
        at:'at'
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
        at:<SomeOne size={24} />
      

      }
    
      const [navIndex,setNavIndex]=useState(paras.all) 
      const actorRef=useRef();

    
      useEffect(()=>{
        if(actor?.id) actorRef.current=actor;
        if(!openObj?.id){  //不是详情页
            if(actor?.id) homeHandle(true);
            else allHandle(true);
        }
    },[actor,openObj])
   
    useEffect(() => {
        const popStateHandler=(event)=>{
            // console.log(event)
            if(event?.state?.id){
                const url=event.state.id;
                // console.log(url)
                if(url===paras.home) homeHandle(false);
                else if(url===paras.mypost) myPostHandle(false);
                else if(url===paras.myreceive) myReceiveHandle(false);
                else if(url===paras.book) myBookHandle(false);
                else if(url===paras.like) myLikeHandle(false);
                else if(url===paras.follow0) followManHandle0(false);
                else if(url===paras.follow1) followManHandle1(false);
                else if(url===paras.at)  myAtHandle(false);
                else if(url===paras.all) allHandle(false); 
                
            }
        }
     
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
        window.addEventListener('popstate', popStateHandler);
      
        return () =>{ 
            resizeObserver.disconnect();
            window.removeEventListener('popstate', popStateHandler);
        }
      }, []);

    // useEffect(()=>{ //登录后跳到主页
    //     if(activeTab==0 && actor?.actor_account)
    //     {
    //         setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 1,account: actor.actor_account }) 
    //     }
    // },[activeTab,actor])

    const allHandle=(post)=>{ // 公开
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 5,account: '' });
        setActiveTab(0);
        setTopText(t('allPostText'));setNavIndex(paras.all);
        if(post) history.pushState({id:paras.all}, tc('enkierTitle'), `#${paras.all}`);
    }

    const homeHandle=(post)=>{ //首页
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 1,account: actorRef.current?.actor_account?actorRef.current.actor_account:'' });
        setActiveTab(0);
        setTopText(t('scHomeText'));setNavIndex(paras.home);
        if(post) history.pushState({id:paras.home}, tc('enkierTitle'), `#${paras.home}`);
      
    }

    const createHandle=(post)=>{ //创建发文
        removeUrlParams()
        const [name,localdomain]=actorRef.current.actor_account.split('@');
        if(env.domain!==localdomain) return showClipError(t('loginDomainText',{domain:localdomain}));
        setCurrentObj(null);
        setActiveTab(1);
        setTopText(t('createPostText'));setNavIndex(paras.create);
        if(post) history.pushState({id:paras.create}, tc('enkierTitle'), `#${paras.create}`);
       
    }

    const myPostHandle=(post)=>{ //我的发文
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('myPostText'));setNavIndex(paras.mypost);
        if(post) history.pushState({id:paras.mypost}, tc('enkierTitle'), `#${paras.mypost}`);
    }
 
    const myReceiveHandle=(post)=>{ //接收到的发文
            removeUrlParams()
            setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 4,account: actorRef.current?.actor_account })
            setActiveTab(0);
            setTopText(t('myReceiveText'));setNavIndex(paras.myreceive);
            if(post) history.pushState({id:paras.myreceive}, tc('enkierTitle'), `#${paras.myreceive}`);
    }

    const followManHandle0=(post)=>{ //我关注谁
        removeUrlParams()
        setFollowMethod('getFollow0');
        setActiveTab(3);
        setTopText(t('followManText0'));setNavIndex(paras.follow0);
        if(post) history.pushState({id:paras.follow0}, tc('enkierTitle'), `#${paras.follow0}`);
    }

    const followManHandle1=(post)=>{ //谁关注我
        removeUrlParams()
        setFollowMethod("getFollow1");
        setActiveTab(3);
        setTopText(t('followManText1'));setNavIndex(paras.follow1);
        if(post) history.pushState({id:paras.follow1}, tc('enkierTitle'), `#${paras.follow1}`);
    }

    const myBookHandle=(post)=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 3,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('bookTapText'));setNavIndex(paras.book);
        if(post) history.pushState({id:paras.book}, tc('enkierTitle'), `#${paras.book}`);
    }
    const myLikeHandle=(post)=>{ //喜欢
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 6,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('likeText'));setNavIndex(paras.like);
         if(post) history.pushState({id:paras.like}, tc('enkierTitle'), `#${paras.like}`);
    }
    
    const myAtHandle=(post)=>{ //私下提及
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 7,actorid:actorRef.current?.id,account: actorRef.current?.actor_account })
        setActiveTab(0);
        setTopText(t('atSomeOne'));setNavIndex(paras.at);
        if(post) history.pushState({id:paras.at}, tc('enkierTitle'), `#${paras.at}`);
    }
    //首页刷新数据 直接跳到我的发文
    // const refreshCallBack = () => { setFetchWhere({ ...fetchWhere, currentPageNum: 0,eventnum:2 }); setActiveTab(0); } 
    // const preEditCall = () => { setActiveTab(1); } //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调

    return (<>
        <Head>
            <title>{tc('enkierTitle')}</title>
        </Head>
        <PageLayout env={env}>
          
            <div ref={parentDivRef}  className='d-flex justify-content-center' style={{position:'sticky',top:'70px'}} >
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} locale={locale} hw={64} /> : <EnkiAccount t={t} locale={locale} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
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
                    {loginsiwe && actor?.actor_account?.includes('@') && env.domain===actor.actor_account.split('@')[1] && <div>
                    <SearchInput setSearObj={setSearObj} setFindErr={setFindErr} actor={actor} t={t} />
                    {searObj && <div className='mt-3' >
                        <EnkiMember messageObj={searObj} isLocal={!!searObj.manager} locale={locale} />
                        <div className='mb-3 mt-3'>
                        {searObj.id>0?<EnKiUnFollow t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                        :<EnKiFollow  t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                        }
                        </div>
                    </div>
                    }
                    {findErr && <ShowErrorBar errStr={t('noFindText')} />}
                    </div>
                    }
                   
                </div>
             
                <div className='sccontent' >
                <div className='d-flex justify-content-between align-items-center' style={{margin:'0px', position:'sticky',top:'60px',padding:'10px',zIndex:256,backgroundColor:'#f4f4f4',borderTopLeftRadius:'6px',borderTopRightRadius:'6px'}} > 
                
                  <div className='selectText' style={{paddingLeft:'12px'}} >
                    {activeTab===2 ? <span className='daism-a selectText' onClick={()=>{window.history.go(-1)}} ><BackSvg size={24} />{t('esctext')} </span>
                    :<>{svgs[navIndex]} {topText}</>}
                   
                    </div>  
                  {leftHidden && <NavDropdown className='daism-a' title="..." >
                    <NavDropdown.Item ><span onClick={()=>allHandle(true)} >{svgs.all} {t('allPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>createHandle(true)} >{svgs.create} {t('createPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>homeHandle(true)} >{svgs.home} {t('scHomeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myPostHandle(true)} >{svgs.mypost} {t('myPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myReceiveHandle(true)} >{svgs.myreceive} {t('myReceiveText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myAtHandle(true)} >{svgs.at} {t('atSomeOne')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myBookHandle(true)} >{svgs.book} {t('bookTapText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myLikeHandle(true)} >{svgs.like} {t('likeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>followManHandle0(true)} >{svgs.follow0} {t('followManText0')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>followManHandle1(true)} >{svgs.follow1} {t('followManText1')}</span></NavDropdown.Item>
            
                    </NavDropdown> } 
                </div>
                
                
  
                    {activeTab === 0 ? <Mainself env={env} loginsiwe={loginsiwe} actor={actor} locale={locale}  t={t} tc={tc} 
                    setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere}
                     replyAddCallBack={allHandle}  delCallBack={allHandle}  />

                    :activeTab === 1 ? <CreateMess t={t} tc={tc} actor={actor} addCallBack={allHandle} fetchWhere={fetchWhere} accountAr={accountAr}
                        currentObj={currentObj} afterEditCall={afterEditCall} setActiveTab={setActiveTab} setFetchWhere={setFetchWhere} />

                    :activeTab === 2 ? <MessagePage  path="enkier" locale={locale} t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} env={env}
                        currentObj={currentObj} delCallBack={allHandle} setActiveTab={setActiveTab} />

                    :activeTab===3 && <FollowCollection locale={locale} t={t} account={actor?.actor_account} method={followMethod} domain={env.domain} />}

                </div>
                <div ref={rightDivRef} className='scsidebar scright' >
                <ul >
                        {loginsiwe && actor?.actor_account && 
                        <NavItem svgs={svgs} navIndex={navIndex} t={t} paras={paras} homeHandle={homeHandle} myPostHandle={myPostHandle}
                        myReceiveHandle={myReceiveHandle} myAtHandle={myAtHandle} myBookHandle={myBookHandle}
                        myLikeHandle={myLikeHandle} />
                        }
                    </ul>
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
        const [id,sctype,domain]=decrypt(query.d).split(',');
        if(domain==env.domain){
            openObj=await getOne({id,sctype})
        }
        else 
        {
            let response=await httpGet(`https://${domain}/api/getData?id=${id}&sctype=${sctype}`,{'Content-Type': 'application/json',method:'getOne'})
            if(response?.message) openObj=response.message
        }
    }
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


   
    // useEffect(()=>{
    //     const getHeight = () => {
    //         const totalHeight = document.documentElement.scrollHeight;
    //         console.log("Total document height:", totalHeight);
    //       };
        
    //       getHeight(); // Get heig
    //       const moveMouseTo=(x, y)=>{
    //         const event = new MouseEvent('mousemove', {
    //           view: window,
    //           bubbles: true,
    //           cancelable: true,
    //           clientX: x,
    //           clientY: y,
    //         });
    //         document.dispatchEvent(event);
    //       }

      
    //     const x = parseInt(sessionStorage.getItem('mouseX'));
    //     const y = parseInt(sessionStorage.getItem('mouseY'));
    //     console.log("999",x,y)
    //     if (!isNaN(x) && !isNaN(y)) {
    //         moveMouseTo(x,y)
        //   // 模拟 mousemove 事件以近似定位。由于页面布局变化，并非完美。
        //   const mouseEvent = new MouseEvent('mousemove', {
        //     clientX: x,
        //     clientY: y,
        //     bubbles: true,
        //     cancelable: true,
        //   });
        //   document.dispatchEvent(mouseEvent);
        //   sessionStorage.removeItem('mouseX');
        //   sessionStorage.removeItem('mouseY');
    //     }
              
  
    // },[])