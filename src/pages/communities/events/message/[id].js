import { useSelector,useDispatch} from 'react-redux';
import EventTitle from '../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import { Card,Button} from 'react-bootstrap';
import {setTipText,setMessageText} from '../../../../data/valueData'
// import { useRouter } from 'next/navigation'
import Breadcrumb from '../../../../components/Breadcrumb';
// import { ChatSvg } from '../../../../lib/jssvg/SvgCollection';
import { ReplySvg } from '../../../../lib/jssvg/SvgCollection';
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';
import { useTranslations } from 'next-intl'
import Editor from '../../../../components/form/Editor';
import { useState,useEffect,useRef } from 'react';
import ShowImg from '../../../../components/ShowImg';
import { client } from '../../../../lib/api/client';
import Loginsign from '../../../../components/Loginsign';
import EventDuscussion from '../../../../components/federation/EventDuscussion';
import Loadding from '../../../../components/Loadding';
import PageItem from '../../../../components/PageItem';
import useDiscusionList from "../../../../hooks/useDiscusionList"

//不登录也可以查看
export default function MessagePage({eventsData,statInfo}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <PageLayout>
        {
        eventsData?.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} />
        :<>
        <Breadcrumb menu={[]} currentPage='events' />
        <ShowErrorBar errStr={t('noEventsExist')} />
        </>
        
        }
    </PageLayout>
    );
}

function Message({eventsData,statInfo,t,tc}) {
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch();
    const [childData,setChildData]=useState([])
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const pageData=useDiscusionList({currentPageNum,pid:eventsData.id,pages:10,method:'ecviewPageData'})
    
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
    // const [childData,setChildData]=useState([])
    // const [menu,setMenu]=useState([])
    // const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    // const [isVist,setIsVist]=useState(true)  //是不是游客
    // useEffect(()=>{
    //   if(daoActor && daoActor.length) {
    //   let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(eventsData.dao_id)})
    //   if(_daoData) setIsVist(false) ; else setIsVist(true);
    //   }
    //   else setIsVist(true);
  
    //  },[daoActor])
  
    useEffect(()=>{ if(pageData && pageData.rows) setChildData(pageData.rows) },[pageData])
   
    // const openDiscussion=()=>{
    //     router.push(`/communities/events/discussion/${eventsData.id}`, { scroll: false })
    // }
 
    const menu=[
        {url:`/communities/visit/${eventsData.dao_id}`,title:eventsData.dao_name},
        {url:`/communities/events/list/${eventsData.dao_id}`,title:'events'}
    ]


    return ( 
    <>
        <Breadcrumb menu={menu} currentPage={eventsData.title}> </Breadcrumb>
        <div style={{ position:'relative', textAlign:'center'}} >
            <ShowImg path={eventsData.top_img} alt='' maxHeight="200px"  />   
        </div>
        <h1>{eventsData.title}</h1>
        <Card className="mb-3" >
            <Card.Header>
            <EventTitle eventsData={eventsData} actor={actor} loginsiwe={loginsiwe} showTip={showTip} statInfo={statInfo} closeTip={closeTip} 
       showClipError={showClipError}  t={t} tc={tc} />
            </Card.Header>
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: eventsData.content}}></div>
        </Card.Body>
        </Card>
     
        {childData.length?
                  <>
                    {childData.map((obj,idx) => (
                            <EventDuscussion key={idx} record={obj} showTip={showTip} closeTip={closeTip} showClipError={showClipError} t={t} tc={tc}  />
                    ))
                    }
                    <PageItem records={pageData.total} pages={pageData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={pageData.status} />
                  </>
                  :pageData.status==='failed'?<ShowErrorBar errStr={pageData.error} />
                  :pageData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
                  :<Loadding />
        }


      
    {eventsData.is_discussion===1 && <> {
                loginsiwe?<Commont eventsData={eventsData} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} setChildData={setChildData}
                    childData={childData} t={t} tc={tc} >  
                </Commont>:
                <Loginsign user={user} tc={tc} />
                }
                </>
            }
    </>
    );
}

		
function Commont({actor,eventsData,showTip,closeTip,showClipError,childData,setChildData,t,tc})
{

    const editorRef=useRef()
    
    const submit=async ()=>{
        let textValue=editorRef.current.getData()
        if(!textValue)
        {
            showClipError(t('commontContenNoEmpty'))
            return
        }
        showTip(t('submittingText'))   
        let res=await client.post('/api/postwithsession','eventAddComment',{
            pid:eventsData.id,
            content:textValue,
            contentText:editorRef.current.getText(),
            nick:actor.member_nick,
            avatar:actor.member_icon,
            did:actor.member_address
        })

        if(res.status===200 && !res.data.errMsg) {
           // window.location.reload()
           let curData=childData.slice()
           curData.push({
                id:res.data,
                pid:eventsData.id,
                is_discussion:eventsData.is_discussion,
                member_address:actor.member_address,
                member_icon:actor.member_icon,
                member_nick:actor.member_nick,
                content:textValue,
                createtime:new Date().toLocaleString(),
                times:'0_minute'})
           setChildData(curData)      
        }
        else 
            showClipError(`${tc('dataHandleErrorText')}!${res.data.errMsg?res.data.errMsg:res.statusText}`)
            
        closeTip()
    }

    return <>
            <div style={{backgroundColor:'white',paddingTop:'10px'}} >
                 <Editor title={t('IamDiscussion')} ref={editorRef}></Editor> 
            </div> 
            <Button  onClick={submit}  variant="primary"> <ReplySvg size={16} /> {t('sendDiscussionText')}</Button> 
           </>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {

    let eventsData=await getJsonArray('eview',[query.id],true)
    let statInfo={amount:0,noAudit:0}
    if(eventsData.id) {
        let re= await getJsonArray('ejoin1',[query.id]);
        if(re && re[0]) statInfo.amount=re[0].amount
        re= await getJsonArray('ejoin2',[query.id]);
        if(re && re[0]) statInfo.noAudit=re[0].amount
    }

    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        statInfo,
        // records:await getJsonArray('ecview',[query.id]),
      }
    }
  }


  