import { useState,useRef } from 'react';
import { useSelector} from 'react-redux';
import MessageItem from './MessageItem';
import { Modal,Button,Row,Col, Card} from 'react-bootstrap';
import { useEffect } from 'react';
import {client} from '../../lib/api/client'
import Loadding from '../Loadding';
import { Up,Down,ReplySvg } from '../../lib/jssvg/SvgCollection';
import Editor from '../form/Editor';
import MemberItem from './MemberItem';
import EditItem from './EditItem';
import TimesItem from './TimesItem';
import ShowErrorBar from '../ShowErrorBar';

export default function EventDuscussion({record,showTip,closeTip,showClipError,t,tc}){
    const [showWin,setShowWin]=useState(false) //回复窗口显示

    const [replyData,setReplyData]=useState([]) //数据集合
    const [show,setShow]=useState(false)  // 是否显示
    const [status,setStatus]=useState('')
    const [total,setTotal]=useState(0) //总回复数
    const [errors,setErrors]=useState('') //
    const [isFirst,setIsFirst]=useState(true)  //是否首次打开
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页

    const editorRef=useRef()
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const actor = useSelector((state) => state.valueData.actor) 
    
   function findRecord(_id){
        let lok=false
        for(let i=0;i<replyData.length;i++)
        {
            if(replyData[i].id===_id){
                lok=true;
                break;
            }
        }
        return lok
    }

    function geneAr(_ar)
    {
        let reAr=[]
        _ar.forEach(e=>{
            if(!findRecord(e.id)) reAr.push(e)
        })

        return replyData.concat(reAr)
    }

    useEffect(()=>{
        let ignore = false;
        if(show && record.reply_count>0 && isFirst)  //首次下载
        {
            setStatus('loadding')
            client.get(`/api/getData?ps=10&pi=${currentPageNum}&pid=${record.id}`,'ecrviewPageData').then(res =>{ 
                setIsFirst(false)
                if (!ignore) {
                    if (res.status===200) {
                        setTotal(()=>total+res.data.total)
                        setCurrentPageNum(()=>currentPageNum+1)
                        setStatus("succeeded")
                        setErrors('')
                        setReplyData(geneAr(res.data.rows))
                    }
                    else { 
                        setStatus("failed")
                        setErrors(res.statusText)
                    }
                }
            });
        }
        return () => {ignore = true}
       },[show,isFirst])

    function get_data(){
        console.log("total",total)
        setStatus('loadding')
        client.get(`/api/getData?ps=10&pi=${currentPageNum}&pid=${record.id}`,'ecrviewPageData').then(res =>{ 
                if (res.status===200) {
                    setCurrentPageNum(()=>currentPageNum+1)
                    setStatus("succeeded")
                    setErrors('')
                    setReplyData(geneAr(res.data.rows))
                }
                else { 
                    setStatus("failed")
                    setErrors(res.statusText)
                }
            
        });
    }

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
        if(total>0) setTotal(()=>total+1)  
        setShow(true)
         
    }
    else 
        showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg}`)
    closeTip()
}

   
    return (
        <>
        <Card className='mb-3'>
        <Card.Header>
        <div className='row'  >
                <div className='col-auto me-auto' >
                    <MemberItem  record={record} isrealyImg={record.send_id && record.send_id.startsWith('http')} noLink={record.send_id && record.send_id.startsWith('http')} ></MemberItem>
                </div>
                <div className='col-auto d-flex align-items-center '>
                {actor && (actor?.member_address?.toLowerCase()===record?.member_address?.toLowerCase() ) && 
                    <EditItem  message={record} showTip={showTip} closeTip={closeTip} 
                    showClipError={showClipError} replyLevel={1} path='events'  t={t} tc={tc} ></EditItem>
                }
                <TimesItem times={record.times} t={t} ></TimesItem>
                </div>
            </div>
        </Card.Header>
            <Card.Body>
           
           
            <div style={{paddingTop:'16px',paddingLeft:'4px'}} dangerouslySetInnerHTML={{__html: record.content}}></div>
            </Card.Body>
          {(record.reply_count>0 || loginsiwe) && <Card.Footer>
            <Row>
                    <Col className='Col-auto me-auto' >
                    {record.reply_count>0 && <Button size='sm' onClick={e=>setShow(!show)}  variant='light'>{t('replyText')}:{record.reply_count} {show?<Up size={16} />:<Down size={16} /> }</Button>}
                    </Col>
                    <Col className='col-auto' >
                      {loginsiwe &&  <Button size='sm' onClick={e=>{setShowWin(true)}}  variant='light'>{t('replyText')}</Button>}
                    </Col>
            </Row>
           
               { show && <div className='mt-3'  style={{paddingLeft:"60px"}} >
              
                    {replyData.length>0 && replyData.map(
                        (obj,idx)=>(
                                    
                                <MessageItem  key={obj.id} record={obj} actor={actor} 
                                noLink={obj.send_id && obj.send_id.startsWith('http')} 
                                isrealyImg={obj.send_id && obj.send_id.startsWith('http')}  
                                path='events' replyLevel={2} 
                                showTip={showTip} 
                                closeTip={closeTip} 
                                showClipError={showClipError}  t={t} tc={tc} />
                                        
                            )
                        )
                    }
                    {replyData.length<total && <div><Button size='sm' onClick={get_data}  variant='light'>fetch more ...</Button></div>}
                    {status==='loadding'?<Loadding />:
                    status==='failed' && <ShowErrorBar errStr={errors} />
                    }
             
                </div>
                }
            </Card.Footer>}
            </Card>

            {/* <MessageItem  record={record} actor={actor}  path='events' replyLevel={1} showTip={showTip} closeTip={closeTip} 
                              noLink={record.send_id && record.send_id.startsWith('http')} 
                              isrealyImg={record.send_id && record.send_id.startsWith('http')}  
                            showClipError={showClipError} t={t} tc={tc} /> */}
      
           

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
