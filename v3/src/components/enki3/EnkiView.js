import { useState,useEffect,useRef } from "react"
import Mainself from  './Mainself'
import CreateMess from './CreateMess'
import MessagePage from '../enki2/page/MessagePage'
import EnkiCreateMessage from "../enki2/page/EnkiCreateMessage"
import { useTranslations } from 'next-intl'
import ActorMember from "../enki2/form/ActorMember";
import EnkiMember from "../enki2/form/EnkiMember";
import { client } from "../../lib/api/client"
import {NavDropdown} from "react-bootstrap";
import { Home,BookSvg,BackSvg,MyPost,ReceiveSvg } from '../../lib/jssvg/SvgCollection';
import MyInfomation from '../../components/enki3/MyInfomation';

//isEdit  是否允许修改 关注和取消关注
//notice 直接显示 打赏信息
export default function EnkiView({actor,locale,env,daoActor,accountAr,notice,isEdit}) {
    const [fetchWhere, setFetchWhere] = useState({
      currentPageNum: 0,  //当前页 初始不摘取数据
      daoid: 0,  //此处不用
      actorid: actor?.id, 
      account: actor?.actor_account,
      where: '', //查询条件
      menutype: 3,
      v:9999,  //有置顶功能
       order: 'createTime', //排序
      eventnum: (isEdit?2:9)  //默认 我发布嗯文
  });
  
  const [personNum,setPersonNum]=useState(0);
  const [companyNum,setCompanyNum]=useState(0);
  const [receiveNum,setReceiveNum]=useState(0);
  
  const [leftHidden,setLeftHidden]=useState(false)
  const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
  const [activeTab, setActiveTab] = useState(notice>0?9:0);
  const leftDivRef = useRef(null);
  const parentDivRef = useRef(null);
  
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
  
  const [navIndex,setNavIndex]=useState(notice>0?paras.home: paras.mypost) ;

  useEffect(()=>{
    const fetchData = async () => {
        try {
            const res = await client.get(`/api/getData?account=${actor?.actor_account}&actorid=${actor?.id}&t=${isEdit?'':'1'}`,'getEnkiTotal' );
            if(res?.status===200 && Array.isArray(res?.data) && res?.data.length) {            
                     setPersonNum(res.data[0].total);
                     setCompanyNum(res.data[1].total);
                     setReceiveNum(res.data[2].total);
                }
        } catch (error) {
            console.error(error);
        } 
    };

    fetchData();
  },[actor])
  

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (leftDivRef?.current) {
        const style = window.getComputedStyle(leftDivRef?.current);
        const display = style.getPropertyValue('display');
        setLeftHidden(display === 'none')
      }
    });
   
  
    if (parentDivRef?.current) {  
      resizeObserver.observe(parentDivRef?.current);
    }
  
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
      if(isEdit){
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2, menutype: 3 });
      }
      else {
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 9, menutype: 3 });
      }
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
    
    const callBack=()=>{  //
     if(navIndex===paras.home) homeHandle(false);
     else if(navIndex===paras.mypost) myPostHandle(false);
      else if(navIndex===paras.myreceive) recerveHadler(false);
      else if(navIndex===paras.myCompanyPost) companyHadler(false);
    }
  
       
    const delcallBack=()=>{  //删除
      callBack();
      if(navIndex===paras.mypost) setPersonNum(personNum-1)
      else  if(navIndex===paras.myreceive) setReceiveNum(receiveNum-1)
        else  if(navIndex===paras.myCompanyPost) setCompanyNum(companyNum-1)

     }
   
      return (
    
        <div ref={parentDivRef}  className='d-flex justify-content-center' >
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
                  <div className='d-flex justify-content-between align-items-center secconddiv'> 
                  
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
                        : <>
                        {isEdit?<ActorMember locale={locale} env={env} notice={notice} isEdit={isEdit}  />:
                        <MyInfomation daoActor={daoActor} env={env} actor={actor} locale={locale}  />
                        }
                        </>
                    }
  
                  </div>
                
              </div>
  
      );
  }
  