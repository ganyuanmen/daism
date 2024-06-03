import { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData';
import Editor from '../../../../components/form/Editor';
import { Card,Button,Alert} from 'react-bootstrap';
import MessageItem from '../../../../components/federation/MessageItem';
import EventTitle from '../../../../components/federation/EventTitle';
import { ReplySvg} from '../../../../lib/jssvg/SvgCollection';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useTranslations } from 'next-intl'
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';
import { client } from '../../../../lib/api/client';
import Link from 'next/link';

//不登录也可以查看
export default function EventReply({commontData,replyData,statInfo}) {


let tc = useTranslations('Common')
let t = useTranslations('ff')
return (
<PageLayout>
    {
    commontData.id?<Message commontData={commontData} replyData={replyData} t={t} tc={tc} statInfo={statInfo} />
    :<>
    <Breadcrumb menu={[]} currentPage='events' />
    <ShowErrorBar errStr={t('noEventsExist')} />
    </>
    
    }
</PageLayout>
);
}


function Message({commontData,replyData,t,tc,statInfo})
{
    const dispatch = useDispatch();
    const actor = useSelector((state) => state.valueData.actor) 
    const [childData,setChildData]=useState([])
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    useEffect(()=>{setChildData(replyData)},[replyData])

    const menu=[
        {url:`/enki/visit/${commontData.dao_id}`,title:commontData.dao_name},
        {url:`/enki/events/list/${commontData.dao_id}`,title:'events'},
        {url:`/enki/events/message/${commontData.pid}`,title:commontData.title},
        {url:`/enki/events/discussion/${commontData.pid}`,title:'comments'}
        ]


    return <>
            <div className='mt-2' >   
                <Breadcrumb menu={menu} currentPage='replies'></Breadcrumb>
             
                <EventTitle eventsData={commontData} actor={actor} showTip={showTip} statInfo={statInfo} closeTip={closeTip} 
                showClipError={showClipError} t={t} tc={tc} />

                <Card className='mb-2' >
                    <Card.Body>
                         <MessageItem  record={commontData} actor={actor}  path='events' replyLevel={1} showTip={showTip} closeTip={closeTip}
                          showClipError={showClipError}  t={t} tc={tc} />
                    </Card.Body>
                </Card>
                
                <Card>
                    <Card.Body>
                    <Link href={`/enki/events/discussion/[id]`} as={`/enki/events/discussion/${commontData.pid}`} >{t('moreCommont')}...</Link>
                    </Card.Body>
                </Card>
                


                {childData.length===0 && <ShowErrorBar errStr={t('noReply')}></ShowErrorBar>} 
                {childData.length>0 && childData.map(
                    (obj,idx)=>(
                                    <div key={idx} >
                                        <Card className='mt-2 daism-title' >
                                        <Card.Body>
                                            <MessageItem  record={obj} actor={actor} 
                                            noLink={obj.send_id && obj.send_id.startsWith('http')} 
                                            isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  
                                            path='events' replyLevel={2} 
                                            showTip={showTip} 
                                            closeTip={closeTip} 
                                            showClipError={showClipError}  t={t} tc={tc} />
                                        </Card.Body>
                                        </Card>
                                    </div>
                                )
                    )
                }

                {loginsiwe && commontData.is_discussion===1? 
                    <Commont commontData={commontData} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} setChildData={setChildData}
                         childData={childData} t={t} >  
                    </Commont>
                    :<Alert variant='info' style={{textAlign:'center',marginTop:'10px'}} > {t('replyFromWebsite')}</Alert>

                }
            </div>
          </>
}


		
function Commont({actor,commontData,showTip,closeTip,showClipError,childData,setChildData,t})
{

    const editorRef=useRef()
    
    const submit=async ()=>{
        let textValue=editorRef.current.getData()
        if(!textValue)
        {
            showClipError(t('replyContenNoEmpty'))
            return
        }
        showTip(t('submittingText'))   
        let res=await client.post('/api/postwithsession','eventAddReply',{
            pid:commontData.id,
            content:textValue,
            did:actor.member_address,
            nick:actor.member_nick,
            avatar:actor.member_icon
        })

        if(res.status===200) {
           let curData=childData.slice()
           curData.push({
                id:res.data,
                pid:commontData.id,
                member_address:actor.member_address,
                member_icon:actor.member_icon,
                member_nick:actor.member_nick,
                content:textValue,
                createtime:new Date().toLocaleString(),
                times:'0_minute'})
                
           setChildData(curData)      
        }
        else 
            showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg}`)
        closeTip()
    }

    return <>
           <div style={{backgroundColor:'white',paddingTop:'10px'}} >
                <Editor title={t('replyText')} ref={editorRef} />
            </div> 
            <Button  onClick={submit}  variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button> 
           </>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {
    
    let commontData={}
    let replyData=[]
    let _commontData=await getJsonArray('ecviewid',[query.id])
    if(_commontData.length)
    {
        commontData['is_discussion']=_commontData[0]['is_discussion'] 
        commontData['pid']=_commontData[0]['pid']
        commontData['id']=_commontData[0]['id']
        commontData['content']=_commontData[0]['content']
        commontData['times']=_commontData[0]['times']

        let _data=await getJsonArray("eview",[commontData['pid']])
        if(_data.length)
        {
            commontData['dao_id']=_data[0]['dao_id'] 
            commontData['dao_name']=_data[0]['dao_name'] 
            commontData['title']=_data[0]['title'] 
            commontData['member_address']=_data[0]['member_address'] 
     
            commontData['start_time']=_data[0]['start_time'] 
            commontData['end_time']=_data[0]['end_time'] 
            commontData['original']=_data[0]['original'] 
            commontData['address']=_data[0]['address'] 
            commontData['event_url']=_data[0]['event_url'] 
            
            

        }
        replyData= await getJsonArray('ecrview',[query.id]);
    }
 
    let statInfo={amount:0,noAudit:0}
    if(commontData.id) {
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
        commontData,
        replyData,
        statInfo
      }
    }
  }


  