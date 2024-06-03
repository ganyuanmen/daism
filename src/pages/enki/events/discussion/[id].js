import { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData';
import Editor from '../../../../components/form/Editor';
import { Card,Button,Row,Col} from 'react-bootstrap';
import MessageItem from '../../../../components/federation/MessageItem';
import { ReplySvg } from '../../../../lib/jssvg/SvgCollection';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useTranslations } from 'next-intl'
import PageLayout from '../../../../components/PageLayout';
import { useRouter } from 'next/navigation'
import { getJsonArray } from '../../../../lib/mysql/common';
import Link from 'next/link';
import { client } from '../../../../lib/api/client';
import EventTitle from '../../../../components/federation/EventTitle';

//不登录也可以查看
export default function EventDiscussions({eventsData,records,statInfo}) {
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
    return (
    <PageLayout>
        {
        eventsData.id?<Message eventsData={eventsData} records={records} t={t} tc={tc} statInfo={statInfo} />
        :<>
        <Breadcrumb menu={[]} currentPage='events' />
        <ShowErrorBar errStr={t('noEventsExist')} />
        </>
        
        }
    </PageLayout>
    );

}


function Message({eventsData,records,t,tc,statInfo})
{
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch();
    const [childData,setChildData]=useState([])
    const router=useRouter()
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const [isVist,setIsVist]=useState(true)  //是不是游客
    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(eventsData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
  
     },[daoActor,eventsData])

    
    useEffect(()=>{setChildData(records)},[records])

    let MenuAttch=undefined;
    if (actor && actor.member_address.toLowerCase()===eventsData.member_address.toLowerCase() && statInfo.noAudit>0)
        MenuAttch={path:`/enki/events/join/${eventsData.id}`,title:`${t('audit')}: ${statInfo.noAudit} ${t('people')}`}


  const menu=[
    {url:`/enki/visit/${eventsData.dao_id}`,title:eventsData.dao_name},
    {url:`/enki/events/list/${eventsData.dao_id}`,title:'events'},
    {url:`/enki/events/message/${eventsData.id}`,title:eventsData.title}
    ]

    return <>
       <Breadcrumb menu={menu} currentPage='comments'></Breadcrumb>
      
       <EventTitle eventsData={eventsData} actor={actor} statInfo={statInfo} showTip={showTip} closeTip={closeTip} showClipError={showClipError} t={t} tc={tc} />
      <Card>
        <Card.Body>
        <Link href={`/enki/events/message/[id]`} as={`/enki/events/message/${eventsData.id}`} >{t('eventsContent')}...</Link>
        </Card.Body>
      </Card>
       
      
        <div className='mt-2' >   
        {childData.length===0 && <ShowErrorBar errStr={t('noCommont')}></ShowErrorBar>} 
        {childData.length>0 && childData.map((obj,idx)=>(
                    <div key={idx} >
                        <Card className='mt-2 daism-title' >
                        <Card.Body>
                            <MessageItem  record={obj} actor={actor}  path='events' replyLevel={1} showTip={showTip} closeTip={closeTip} 
                              noLink={obj.send_id && obj.send_id.startsWith('http')} 
                              isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  
                            showClipError={showClipError} t={t} tc={tc} />
                            <Row>
                                <Col className='Col-auto me-auto' >
                                    <Button size='sm' onClick={e=>{router.push(`/enki/events/reply/${obj.id}`, { scroll: false })}} variant='light'>{t('searchReply')}</Button>
                                </Col>
                                <Col className='col-auto' >
                                        <span>{t('replyText')}：{obj.reply_count}</span>
                                </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </div>
                ))
            }

            {loginsiwe && eventsData.is_discussion===1 &&  !isVist &&
                <Commont eventsData={eventsData} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} setChildData={setChildData}
                    childData={childData} t={t} tc={tc} >  
                </Commont>
            }
    </div>
    
</>
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
 
    let statInfo={amount:0,noAudit:0}
    let eventsData=await getJsonArray("eview",[query.id],true)
    if(eventsData.id) {
        let re= await getJsonArray('ejoin1',[query.id])
        if(re && re[0]) statInfo.amount=re[0].amount
        re= await getJsonArray('ejoin2',[query.id])
        if(re && re[0]) statInfo.noAudit=re[0].amount
    }


    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        eventsData,
        records:await getJsonArray('ecview',[query.id]),
        statInfo
      }
    }
  }


  