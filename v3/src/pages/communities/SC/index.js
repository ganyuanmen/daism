import { useTranslations } from 'next-intl'
import { useState,useEffect,useRef } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import { useDispatch } from 'react-redux';
import {setTipText,setMessageText } from '../../../data/valueData'
import { encrypt } from '../../../lib/utils/windowjs';
import { getEnv,decrypt } from '../../../lib/utils/getEnv';
import { getOne } from '../../../lib/mysql/message';
// import { getJsonArray } from '../../../lib/mysql/common';
import Head from 'next/head';
import Mainself from '../../../components/enki3/Mainself';
// import CreateMess from './CreateMess';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { NavDropdown } from 'react-bootstrap';
import { TimeSvg,EventSvg,MyFollowSvg } from '../../../lib/jssvg/SvgCollection';
/**
 * 个人社区
 */
export default function sc({openObj, locale,env}) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  ///当前页
        daoid: '0',  //0 所有, 数字 单个
        actorid: 1, 
        account: '',  //所有时为空，表示从当前服务下载，单个时为公器的帐号，
        where: '', //查询条件
        menutype: 2, 
        order: 'reply_time', //排序
        eventnum: 0  //0 活动 1 非活动
     });
 
     const [daoWhere,setDaoWhere]=useState({ currentPageNum:0,where:''}); //dao 下载
     const [data, setData] = useState([]);  //公器列表
     const [isLoading, setIsLoading] = useState(false);
     const [hasMore, setHasMore] = useState(true);

    const [leftHidden,setLeftHidden]=useState(false)
    const [rightHidden,setRightHidden]=useState(false)
    const [currentObj, setCurrentObj] = useState(openObj?.id?openObj:null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(openObj?.id ? 2 : 0);
    const [followMethod,setFollowMethod]=useState('getFollow0') //默认显示我关注谁
  


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
      
      const paras={last:'lat',event:'event',follow:'myfollow',book:'book',like:'like'}

      const svgs={last:<TimeSvg size={24} />,event:<EventSvg size={24} />,follow:<MyFollowSvg size={24} />,
       book:<BookSvg size={24} />,like:<Heart size={24} />}
    
      const [navIndex,setNavIndex]=useState(paras.last) 
      const actorRef=useRef();

    
      useEffect(()=>{
        if(actor?.id) actorRef.current=actor;
        if(!openObj?.id){  //不是详情页
            if(actor?.id) myFollowHandle(true);
            else latestHandle(true);
        }
    },[actor,openObj])
   
    useEffect(() => {
        const popStateHandler=(event)=>{
            if(event?.state?.id){
                const url=event.state.id;
                if(url===paras.last) latestHandle(false);
                else if(url===paras.event) eventHandle(false);
                else if(url===paras.follow) myFollowHandle(false);
                else if(url===paras.book) myBookHandle(false);
                else if(url===paras.like) myLikeHandle(false);
                
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


    // const allHandle=(post)=>{ // 公开
    //     removeUrlParams()
    //     setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 5,account: '' });
    //     setActiveTab(0);
    //     setTopText(t('allPostText'));setNavIndex(paras.all);
    //     if(post) history.pushState({id:paras.all}, tc('enkierTitle'), `#${paras.all}`);
    // }
    
    const latestHandle=(post)=>{ // 最新
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:'',eventnum:0,daoid:0,v:0});
        setTopText(t('latestText'));setNavIndex(paras.last);
        setActiveTab(0);
        if(post) history.pushState({id:paras.last}, tc('enkiTitle'), `#${paras.last}`);
    }

    const eventHandle=()=>{ //活动
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:'',eventnum:1,daoid:0})
        setTopText(t('eventText'));setNavIndex(paras.event);
        setActiveTab(0);
        if(post) history.pushState({id:paras.event}, tc('enkiTitle'), `#${paras.event}`);
    }

    const myFollowHandle=()=>{ //我关注的社区
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:1})
        setTopText(t('followCommunity'));setNavIndex(paras.follow);
        setActiveTab(0);
        if(post) history.pushState({id:paras.follow}, tc('enkiTitle'), `#${paras.follow}`);
    }

    const myBookHandle=(post)=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:3})
        setActiveTab(0);
        setTopText(t('bookTapText'));setNavIndex(paras.book);
        if(post) history.pushState({id:paras.book}, tc('enkierTitle'), `#${paras.book}`);
    }
    const myLikeHandle=(post)=>{ //喜欢
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actorRef.current?.actor_account,eventnum:0,daoid:0,v:6})
        setActiveTab(0);
        setTopText(t('likeText'));setNavIndex(paras.like);
         if(post) history.pushState({id:paras.like}, tc('enkierTitle'), `#${paras.like}`);
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

    const delCallBack=()=>{
        if(navIndex===paras.last) latestHandle(false);
        else if(navIndex===paras.event) eventHandle(false);
        else if(navIndex===paras.follow) myFollowHandle(false);
        else if(navIndex===paras.book) myBookHandle(false);
        else if(navIndex===paras.like) myLikeHandle(false);
 
    }


    return (<>
        <Head>
        <title>{tc('enkiTitle')}</title>
        </Head>
        <PageLayout env={env}>
          
            <div ref={parentDivRef}  className='d-flex justify-content-center' style={{position:'sticky',top:'70px'}} >
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' style={{overflow:'hidden'}} >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} locale={locale} hw={64} /> : <EnkiAccount t={t} locale={locale} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    </div>
                        <ul >
                      
                      
                         {actor?.actor_account && <li><a href="#" onClick={myFollowHandle}>{t('followCommunity')}</a></li>} 
                         {Array.isArray(data) && data.map((obj, idx) => <li key={obj.dao_id} className={iaddStyle.scli}>
                             <a href="#" onClick={e=>{
                                 removeUrlParams();
                                 setFetchWhere({...fetchWhere,daoid:obj.dao_id,currentPageNum:0,where:'',eventnum:0,v:0,account:obj.actor_account});
                                 setActiveTab(0);
                                 }} >
                                 <div style={{overflow:'hidden',display:'flex',alignItems:'center'}}>
                                 <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} style={{marginRight:'10px'}} />{obj.actor_account}
                                 </div>
                             </a>
                             </li>)
                         }
                     </ul>
                   
                   
                </div>
             
                <div className='sccontent' >
                <div className='d-flex justify-content-between align-items-center' style={{margin:'0px', position:'sticky',top:'60px',padding:'10px',zIndex:256,backgroundColor:'#f4f4f4',borderTopLeftRadius:'6px',borderTopRightRadius:'6px'}} > 
                
                  <div className='selectText' style={{paddingLeft:'12px'}} >
                    {activeTab===2 ? <span className='daism-a selectText' onClick={()=>{window.history.go(-1)}} ><BackSvg size={24} />{t('esctext')} </span>
                    :<>{svgs[navIndex]} {topText}</>}
                   
                    </div>  
                  {leftHidden && <NavDropdown className='daism-a' title="..." >
                    <NavDropdown.Item ><span onClick={()=>latestHandle(true)} >{svgs.last} {t('latestText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>eventHandle(true)} >{svgs.event} {t('eventText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myFollowHandle(true)} >{svgs.follow} {t('followCommunity')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myBookHandle(true)} >{svgs.book} {t('bookTapText')}</span></NavDropdown.Item>
                    <NavDropdown.Item ><span onClick={()=>myLikeHandle(true)} >{svgs.like} {t('likeText')}</span></NavDropdown.Item>           
                    </NavDropdown> } 
                </div>
             
  
                    {activeTab === 0 ? <Mainself env={env} loginsiwe={loginsiwe} actor={actor} locale={locale}  t={t} tc={tc} 
                    setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere}
                     replyAddCallBack={allHandle}   delCallBack={delCallBack} afterEditCall={afterEditCall}  />

                    :<MessagePage  path="SC" locale={locale} t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} env={env}
                        currentObj={currentObj} delCallBack={delCallBack} setActiveTab={setActiveTab} />

                    }

                </div>
                <div ref={rightDivRef} className='scsidebar scright' >
                <ul >
                        {loginsiwe && actor?.actor_account && 
                        <NavItem svgs={svgs} navIndex={navIndex} t={t} paras={paras} latestHandle={latestHandle} eventHandle={eventHandle}
                        myFollowHandle={myFollowHandle} myBookHandle={myBookHandle} myLikeHandle={myLikeHandle} />
                        }
                    </ul>
                </div>
            </div>

        </PageLayout></>
    )
}


export const getServerSideProps = async({ locale,query }) => {
    let openObj={}; 
    const env=getEnv();
    if(query.d){
        const [id,domain]=decrypt(query.d).split(',');
        if(domain==env.domain){
            openObj=await getOne({id,sctype:'sc'})
        }
        else 
        {
            let response=await httpGet(`https://${domain}/api/getData?id=${id}&sctype=sc`,{'Content-Type': 'application/json',method:'getOne'})
            if(response?.message) openObj=response.message
        }
        
    }
    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale
            ,env,openObj
        }
    }
}



function NavItem({svgs,navIndex,t,paras,latestHandle,eventHandle,myFollowHandle,myBookHandle,myLikeHandle}){
  return (<>
         <li className={navIndex===paras.last?'scli':''}><span onClick={()=>latestHandle(true)} >{svgs.last} {t('latestText')}</span></li>
         <li className={navIndex===paras.event?'scli':''}><span onClick={()=>eventHandle(true)} >{svgs.event} {t('eventText')}</span></li>
         <li className={navIndex===paras.follow?'scli':''}><span onClick={()=>myFollowHandle(true)} >{svgs.follow} {t('followCommunity')}</span></li>
         <li className={navIndex===paras.book?'scli':''}><span onClick={()=>myBookHandle(true)} >{svgs.book} {t('bookTapText')}</span></li> 
         <li className={navIndex===paras.like?'scli':''}><span onClick={()=>myLikeHandle(true)} >{svgs.like} {t('likeText')}</span></li> 
  </>)
}

