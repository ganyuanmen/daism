import { useSelector,useDispatch} from 'react-redux';
import EventTitle from '../../../../components/federation/EventTitle';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import { Card,Button,Row,Col} from 'react-bootstrap';
import {setTipText,setMessageText} from '../../../../data/valueData'
import { useRouter } from 'next/navigation'
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

import EventDuscussion from '../../../../components/federation/EventDuscussion';

//不登录也可以查看
export default function MessagePage({eventsData,statInfo,records}) {

    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <PageLayout>
        {
        eventsData.id?<Message eventsData={eventsData} statInfo={statInfo} t={t} tc={tc} records={records} />
        :<>
        <Breadcrumb menu={[]} currentPage='events' />
        <ShowErrorBar errStr={t('noEventsExist')} />
        </>
        
        }
    </PageLayout>
    );
}

function Message({eventsData,statInfo,t,tc,records}) {
    const router = useRouter()
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch();
    const [childData,setChildData]=useState([])
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    // const uref=useRef()
    
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

    // const [menu,setMenu]=useState([])
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const [isVist,setIsVist]=useState(true)  //是不是游客
    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(eventsData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
  
     },[daoActor])
  
     useEffect(()=>{setChildData(records)},[records])
   
    // const openDiscussion=()=>{
    //     router.push(`/enki/events/discussion/${eventsData.id}`, { scroll: false })
    // }
 
    const menu=[
        {url:`/enki/visit/${eventsData.dao_id}`,title:eventsData.dao_name},
        {url:`/enki/events/list/${eventsData.dao_id}`,title:'events'}
    ]


    return ( 
    <>
        <Breadcrumb menu={menu} currentPage={eventsData.title}> </Breadcrumb>
        <div style={{ position:'relative', textAlign:'center'}} >
            <ShowImg path={eventsData.top_img} alt='' maxHeight="200px"  />   
        </div>

       <EventTitle eventsData={eventsData} actor={actor} showTip={showTip} statInfo={statInfo} closeTip={closeTip} 
       showClipError={showClipError}  t={t} tc={tc} />

        <Card className="mb-3" >
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: eventsData.content}}></div>
        </Card.Body>
        </Card>
     
       {/* <Button variant='light' onClick={openDiscussion} > <ChatSvg size={64} /> </Button> */}

       <div className='mt-2' >   
        {childData.length===0 && <ShowErrorBar errStr={t('noCommont')}></ShowErrorBar>} 
        {childData.length>0 && childData.map((obj,idx)=>(
                    <div key={idx} >
                        <Card className='mt-2 daism-title' >
                        <Card.Body>
                            <EventDuscussion record={obj} showTip={showTip} closeTip={closeTip} showClipError={showClipError} t={t} tc={tc}  />
                        </Card.Body>
                        </Card>
                    </div>
                ))
            }

            {loginsiwe && eventsData.is_discussion===1 &&  
                <Commont eventsData={eventsData} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} setChildData={setChildData}
                    childData={childData} t={t} tc={tc} >  
                </Commont>
            }
    </div>
      
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
        records:await getJsonArray('ecview',[query.id]),
      }
    }
  }


  