import { useState,useRef } from 'react';
import { useSelector} from 'react-redux';
import MessageItem from './MessageItem';
import { Modal,Button,Row,Col} from 'react-bootstrap';
import { useEffect } from 'react';
import {client} from '../../lib/api/client'
import Loadding from '../Loadding';
import { Up,Down,ReplySvg } from '../../lib/jssvg/SvgCollection';
import Editor from '../form/Editor';

export default function EventDuscussion({record,showTip,closeTip,showClipError,t,tc}){

    const [replyData,setReplyData]=useState([])
    const [show,setShow]=useState(false)
    const [showWin,setShowWin]=useState(false)
    const [pending,setPending]=useState(false)
    const editorRef=useRef()
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const actor = useSelector((state) => state.valueData.actor) 

   useEffect(()=>{
    let ignore = false;
    if(show && record.reply_count>0)
    {
        setPending(true)
        client.get(`/api/getData?id=${record.id}`,'getReplyList').then(res =>{ 
            setPending(false)
            if (!ignore) 
            if (res.status===200) setReplyData(res.data)
           
        });
    }
    return () => {ignore = true}
   },[show,setReplyData,record.reply_count])


   const submit=async ()=>{

    let textValue=editorRef.current.getData()
    if(!textValue)
    {
        showClipError(t('replyContenNoEmpty'))
        return
    }
    setShowWin(false)
    showTip(t('submittingText'))   
    let res=await client.post('/api/postwithsession','eventAddReply',{
        pid:record.id,
        content:textValue,
        did:actor.member_address,
        nick:actor.member_nick,
        avatar:actor.member_icon
    })

    if(res.status===200) {
        record.reply_count++
       let curData=replyData.slice()
       curData.push({
            id:res.data,
            pid:record.id,
            member_address:actor.member_address,
            member_icon:actor.member_icon,
            member_nick:actor.member_nick,
            content:textValue,
            createtime:new Date().toLocaleString(),
            times:'0_minute'})
            
        setReplyData(curData)      
    }
    else 
        showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg}`)
    closeTip()
}

   
    return (
        <>
            <MessageItem  record={record} actor={actor}  path='events' replyLevel={1} showTip={showTip} closeTip={closeTip} 
                              noLink={record.send_id && record.send_id.startsWith('http')} 
                              isrealyImg={record.send_id && record.send_id.startsWith('http')}  
                            showClipError={showClipError} t={t} tc={tc} />
      
            <Row>
                    <Col className='Col-auto me-auto' >
                    {record.reply_count>0 && <Button size='sm' onClick={e=>setShow(!show)}  variant='light'>{t('replyText')}:{record.reply_count} {show?<Up size={16} />:<Down size={16} /> }</Button>}
                    </Col>
                    <Col className='col-auto' >
                      {loginsiwe &&  <Button size='sm' onClick={e=>{setShowWin(true)}}  variant='light'>{t('replyText')}</Button>}
                    </Col>
            </Row>
           
               { show && <div className='mt-3'  style={{paddingLeft:"20px"}} >
                {pending?<Loadding />:
                
                <>
                    {replyData.length>0 && replyData.map(
                        (obj,idx)=>(
                                    
                                <MessageItem  key={idx} record={obj} actor={actor} 
                                noLink={obj.send_id && obj.send_id.startsWith('http')} 
                                isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  
                                path='events' replyLevel={2} 
                                showTip={showTip} 
                                closeTip={closeTip} 
                                showClipError={showClipError}  t={t} tc={tc} />
                                        
                            )
                        )
                    }
                </>}
                </div>
                }

             <Modal  className='daism-title' show={showWin} onHide={(e) => {setShowWin(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                <div style={{backgroundColor:'white',paddingTop:'10px'}} >
                 <Editor title={t('replyText')} ref={editorRef}></Editor> 
                </div> 
                    <Button  onClick={submit}  variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button> 
                </Modal.Body>
            </Modal>
        </>
    )
}
