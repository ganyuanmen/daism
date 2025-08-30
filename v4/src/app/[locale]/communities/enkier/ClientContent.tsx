"use client";
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useRef, JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EnkiMember from '@/components/enki2/form/EnkiMember';
import EnkiAccount from '@/components/enki2/form/EnkiAccount';
import Loginsign from '@/components/Loginsign';
import {RootState,AppDispatch,setErrText,setMessageText} from '@/store/store';
import SearchInput from '@/components/enki2/form/SearchInput';
import ShowErrorBar from '@/components/ShowErrorBar';
import EnKiFollow from '@/components/enki2/form/EnKiFollow';
import EnKiUnFollow from '@/components/enki2/form/EnKiUnFollow';
import FollowCollection from '@/components/enki3/FollowCollection';
import Mainself from '@/components/enki3/Mainself';
import CreateMess from '@/components/enki3/CreateMess';
import MessagePage from '@/components/enki2/page/MessagePage';
import { NavDropdown } from 'react-bootstrap';

import {Home,BookSvg,SomeOne,Heart,BackSvg,PublicMess,EditSvg,Follow,MyPost,ReceiveSvg} from '@/lib/jssvg/SvgCollection';

interface ClientContentProps {
  accountAr: AccountType[];
}

type ParaKey ='home'| 'mypost'| 'myreceive'| 'book'| 'like'| 'all'| 'create'| 'follow0'| 'follow1'| 'at'| 'filter';
enum Paras {
    home='home',
    mypost='mypost',
    myreceive='myreceive',
    book='book',
    like='like',
    all='all',
    create='create',
    follow0='follow0',
    follow1='follow1',
    at='at',
    filter='filter'
  }

/**
 * 个人社区
 * @locale zh/cn
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 */ 
export default function ClientContent({accountAr}:ClientContentProps) {
    const [fetchWhere, setFetchWhere] = useState<FetchWhere>({
        currentPageNum: -1,
        daoid: 0,
        actorid: 0,
        account: '',
        where: '',
        menutype: 3,
        v: 0,
        order: 'reply_time',
        eventnum: 5,
      });
    
      const [leftHidden, setLeftHidden] = useState(false);
      const [rightHidden, setRightHidden] = useState(false);
      const [currentObj, setCurrentObj] = useState<EnkiMessType | null>(null);
      const [activeTab, setActiveTab] = useState(0);
      const [followMethod, setFollowMethod] = useState<'getFollow0' | 'getFollow1'>('getFollow0');
      const [searObj, setSearObj] = useState<ActorInfo|null>(null);
      const [findErr, setFindErr] = useState(false);
    
      const actor = useSelector((state: RootState) => state.valueData.actor);
      const loginsiwe = useSelector(
        (state: RootState) => state.valueData.loginsiwe
      );
    
      const leftDivRef = useRef<HTMLDivElement | null>(null);
      const rightDivRef = useRef<HTMLDivElement | null>(null);
      const parentDivRef = useRef<HTMLDivElement | null>(null);
      const actorRef = useRef<DaismActor|null>(null);
    
      const dispatch = useDispatch<AppDispatch>();
    
      function showClipError(str: string) {
        dispatch(setErrText(str));
      }
    
      const tc = useTranslations('Common');
      const t = useTranslations('ff');
      const [topText, setTopText] = useState(t('allPostText'));
      const locale = useLocale();
   
    function removeUrlParams() {
        setCurrentObj(null);
            window.history.replaceState({}, '', `/${locale}/communities/enkier`);
      }
     
    
      

      const svgs: Record<string, JSX.Element | string> = {
        home: <Home size={24} />,
        mypost: <MyPost size={24} />,
        myreceive: <ReceiveSvg size={24} />,
        book: <BookSvg size={24} />,
        like: <Heart size={24} />,
        all: <PublicMess size={24} />,
        create: <EditSvg size={24} />,
        follow0: <Follow size={24} />,
        follow1: <Follow size={24} />,
        at: <SomeOne size={24} />,
        filter: '',
      };
    
      const [navIndex, setNavIndex] = useState<ParaKey>(Paras.all);

      useEffect(() => {
        if (actor?.id) actorRef.current = actor;
        if (window.sessionStorage.getItem('loginsiwe') === '1') {
          setTimeout(() => {
            homeHandle();
          }, 200);
        } else {
          allHandle();
        }
      }, [actor]);
    
      useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
          if (leftDivRef.current) {
            const style = window.getComputedStyle(leftDivRef.current);
            const display = style.getPropertyValue('display');
            setLeftHidden(display === 'none');
          }
          if (rightDivRef.current) {
            const style = window.getComputedStyle(rightDivRef.current);
            const display = style.getPropertyValue('display');
            setRightHidden(display === 'none');
          }
        });
    
        if (parentDivRef.current) {
          resizeObserver.observe(parentDivRef.current);
        }
    
        return () => {
          resizeObserver.disconnect();
        };
      }, []);
    

    const allHandle=()=>{ // 公开
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 5,account: '',where:'' });
        setActiveTab(0);
        setTopText(t('allPostText'));setNavIndex(Paras.all);
        
    }

    const homeHandle=()=>{ //首页
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 1,account: actorRef.current?.actor_account?actorRef.current.actor_account:'' });
        setActiveTab(0);
        setTopText(t('scHomeText'));setNavIndex(Paras.home);
        
      
    }
    const filterTag=(tag:string)=>{ //过滤标签
        removeUrlParams() 
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 8,where:tag,account: actorRef.current?.actor_account?actorRef.current.actor_account:'' });
        setActiveTab(0);
        setTopText(`# ${tag}`);setNavIndex(Paras.filter);
        
      
    }

    const createHandle=()=>{ //创建发文
        removeUrlParams()
        if(!actorRef.current) return;
        const [,localdomain]=actorRef.current.actor_account.split('@');
        if(process.env.NEXT_PUBLIC_DOMAIN!==localdomain) return showClipError(t('loginDomainText',{domain:localdomain}));
        setCurrentObj(null);
        setActiveTab(1);
        setTopText(t('createPostText'));
        setNavIndex(Paras.create);
        sessionStorage.removeItem('daism-list-id');
        
       
    }

    const myPostHandle=()=>{ //我的发文
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 2,account: actorRef.current?.actor_account??'' })
        setActiveTab(0);
        setTopText(t('myPostText'));setNavIndex(Paras.mypost);
        
    }
 
    const myReceiveHandle=()=>{ //接收到的发文
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 4,account: actorRef.current?.actor_account??'' })
        setActiveTab(0);
        setTopText(t('myReceiveText'));setNavIndex(Paras.myreceive);
        
    }

    const followManHandle0=()=>{ //我关注谁
        removeUrlParams()
        setFollowMethod('getFollow0');
        setActiveTab(3);
        setTopText(t('followManText0'));setNavIndex(Paras.follow0);
        
    }

    const followManHandle1=()=>{ //谁关注我
        removeUrlParams()
        setFollowMethod("getFollow1");
        setActiveTab(3);
        setTopText(t('followManText1'));setNavIndex(Paras.follow1);
        
    }

    const myBookHandle=()=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 3,actorid:actorRef.current?.id??0,account: actorRef.current?.actor_account??'' })
        setActiveTab(0);
        setTopText(t('bookTapText'));setNavIndex(Paras.book);
        
    }
    const myLikeHandle=()=>{ //喜欢
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 6,actorid:actorRef.current?.id??0,account: actorRef.current?.actor_account??'' })
        setActiveTab(0);
        setTopText(t('likeText'));setNavIndex(Paras.like);
        
    }
    
    const myAtHandle=()=>{ //私下提及
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0,where:'', eventnum: 7,actorid:actorRef.current?.id??0,account: actorRef.current?.actor_account??'' })
        setActiveTab(0);
        setTopText(t('atSomeOne'));setNavIndex(Paras.at);
        
    }

    const getID=(messageObj:EnkiMessType)=>{
      
            if(messageObj?.receive_account){
                return `/${locale}/communities/enkier/${messageObj.id}`
            }
            else {
                 return `/${locale}/communities/enkier/${messageObj.message_id}`
            }
      
      }
    
    const afterEditCall=(messageObj:EnkiMessType)=>{
        setCurrentObj(messageObj);
        setActiveTab(2);
        sessionStorage.setItem("daism-list-id",String(messageObj?.id));
        if(!messageObj?.httpNetWork) //本地的
            window.history.replaceState({}, '', getID(messageObj));
      }


      const refreshPage = () => {
        if (navIndex === Paras.home) homeHandle();
        else if (navIndex === Paras.mypost) myPostHandle();
        else if (navIndex === Paras.myreceive) myReceiveHandle();
        else if (navIndex === Paras.book) myBookHandle();
        else if (navIndex === Paras.like) myLikeHandle();
        else if (navIndex === Paras.follow0) followManHandle0();
        else if (navIndex === Paras.follow1) followManHandle1();
        else if (navIndex === Paras.at) myAtHandle();
        else if (navIndex === Paras.all) allHandle();
        else {
          if (actorRef.current?.id) homeHandle();
          else allHandle();
        }
      };
   

    return (<>
          
            <div ref={parentDivRef}  className='d-flex justify-content-center'>
                <div  ref={leftDivRef} className='scsidebar scleft' >
                    <div className='mb-3' style={{overflow:'hidden'}} >
                        {actor?.actor_account ? <EnkiMember url={actor.actor_url} account={actor.actor_account} avatar={actor.avatar} hw={64} /> : 
                        <EnkiAccount/>}
                        {!loginsiwe && <Loginsign />}
                    </div>
                    <ul >
                        <li className={navIndex===Paras.all?'scli':''} ><span onClick={()=>allHandle()} >{svgs.all} {t('allPostText')}</span></li>
                        
                        {loginsiwe && actor?.actor_account && <>
                        
                            <li className={navIndex===Paras.create?'scli':''}><span onClick={()=>createHandle()} >{svgs.create} {t('createPostText')}</span></li>
                            {rightHidden &&  <NavItem svgs={svgs} navIndex={navIndex} t={t}  homeHandle={homeHandle} myPostHandle={myPostHandle}
                                        myReceiveHandle={myReceiveHandle} myAtHandle={myAtHandle} myBookHandle={myBookHandle}
                                        myLikeHandle={myLikeHandle} />}
                            <li className={navIndex===Paras.follow0?'scli':''}><span onClick={()=>followManHandle0()} >{svgs.follow0} {t('followManText0')}</span></li>
                            <li className={navIndex===Paras.follow1?'scli':''}><span onClick={()=>followManHandle1()} >{svgs.follow1} {t('followManText1')}</span></li>
                          
                        </>}
                    </ul>
                    {loginsiwe && actor?.actor_account?.includes('@') && process.env.NEXT_PUBLIC_DOMAIN===actor?.actor_account.split('@')[1] && <div>
                    <SearchInput setSearObj={setSearObj} setFindErr={setFindErr} />
                    {searObj && <div className='mt-3' >
                        <EnkiMember  url={searObj.url} account={searObj.account} avatar={searObj.avatar} isLocal={!!searObj.manager} />
                        <div className='mb-3 mt-3'>
                        {(searObj?.id && searObj.id>0)?<EnKiUnFollow searObj={searObj}  />
                        :<EnKiFollow url={searObj.url} account={searObj.account} showText={true} />
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
                    {activeTab===2 ? <span className='daism-a selectText' onClick={refreshPage} ><BackSvg size={24} />{t('esctext')} </span>
                    :<>{svgs[navIndex]} {topText}</>}
                   
                    </div>  
                  {leftHidden && <NavDropdown className='daism-a' title="..." >
                    <NavDropdown.Item  className={navIndex===Paras.all?'scli':''}><span onClick={()=>allHandle()} >{svgs.all} {t('allPostText')}</span></NavDropdown.Item>
                    {loginsiwe && actor?.actor_account && <>
                    <NavDropdown.Item className={navIndex===Paras.create?'scli':''}><span onClick={()=>createHandle()} >{svgs.create} {t('createPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.home?'scli':''}><span onClick={()=>homeHandle()} >{svgs.home} {t('scHomeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.mypost?'scli':''}><span onClick={()=>myPostHandle()} >{svgs.mypost} {t('myPostText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.myreceive?'scli':''}><span onClick={()=>myReceiveHandle()} >{svgs.myreceive} {t('myReceiveText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.at?'scli':''}><span onClick={()=>myAtHandle()} >{svgs.at} {t('atSomeOne')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.book?'scli':''}><span onClick={()=>myBookHandle()} >{svgs.book} {t('bookTapText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.like?'scli':''}><span onClick={()=>myLikeHandle()} >{svgs.like} {t('likeText')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.follow0?'scli':''}><span onClick={()=>followManHandle0()} >{svgs.follow0} {t('followManText0')}</span></NavDropdown.Item>
                    <NavDropdown.Item className={navIndex===Paras.follow1?'scli':''}><span onClick={()=>followManHandle1()} >{svgs.follow1} {t('followManText1')}</span></NavDropdown.Item>
                    </>}
                    </NavDropdown> } 
                </div>
           
                    {activeTab === 0 ? <Mainself  setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} 
                    fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} filterTag={filterTag}  tabIndex={1}
                    refreshPage={refreshPage} afterEditCall={afterEditCall}   path='enkier' />

                    :activeTab === 1 ? <CreateMess addCallBack={homeHandle} accountAr={accountAr} currentObj={currentObj} 
                    afterEditCall={afterEditCall} refreshPage={refreshPage} />

                    :(activeTab === 2 && currentObj) ? <MessagePage  path="enkier"  enkiMessObj={currentObj} tabIndex={1}
                    refreshPage={refreshPage} setActiveTab={setActiveTab}  filterTag={filterTag} />

                    :activeTab===3 && <FollowCollection locale={locale}  method={followMethod}/>}

                </div>
                <div ref={rightDivRef} className='scsidebar scright' >
                <ul >
                        {loginsiwe && actor?.actor_account && 
                        <NavItem svgs={svgs} navIndex={navIndex} t={t}  homeHandle={homeHandle} 
                        myPostHandle={myPostHandle} myReceiveHandle={myReceiveHandle} myAtHandle={myAtHandle} 
                        myBookHandle={myBookHandle} myLikeHandle={myLikeHandle} />
                        }
                    </ul>
                </div>
            </div>

        </>
    )
}

// 导航组件增加类型
interface NavItemProps {
    svgs: Record<string, JSX.Element | string>;
    navIndex: string;
    t: ReturnType<typeof useTranslations>;
    homeHandle: () => void;
    myPostHandle: () => void;
    myReceiveHandle: () => void;
    myAtHandle: () => void;
    myBookHandle: () => void;
    myLikeHandle: () => void;
  }
  
  function NavItem({
    svgs,
    navIndex,
    t,
    homeHandle,
    myPostHandle,
    myReceiveHandle,
    myAtHandle,
    myBookHandle,
    myLikeHandle,
  }: NavItemProps) {
    return (
      <>
        <li className={navIndex === Paras.home ? 'scli' : ''}>
          <span onClick={() => homeHandle()}>{svgs.home} {t('scHomeText')}</span>
        </li>
        <li className={navIndex === Paras.mypost ? 'scli' : ''}>
          <span onClick={() => myPostHandle()}>{svgs.mypost} {t('myPostText')}</span>
        </li>
        <li className={navIndex === Paras.myreceive ? 'scli' : ''}>
          <span onClick={() => myReceiveHandle()}>{svgs.myreceive} {t('myReceiveText')}</span>
        </li>
        <li className={navIndex === Paras.at ? 'scli' : ''}>
          <span onClick={() => myAtHandle()}>{svgs.at} {t('atSomeOne')}</span>
        </li>
        <li className={navIndex === Paras.book ? 'scli' : ''}>
          <span onClick={() => myBookHandle()}>{svgs.book} {t('bookTapText')}</span>
        </li>
        <li className={navIndex === Paras.like ? 'scli' : ''}>
          <span onClick={() => myLikeHandle()}>{svgs.like} {t('likeText')}</span>
        </li>
      </>
    );
  }

