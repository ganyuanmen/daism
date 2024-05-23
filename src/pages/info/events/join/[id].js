import { useState,useRef } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../../data/valueData'
import ShowErrorBar from '../../../../components/ShowErrorBar';
import { Card,Button,Modal,Form } from 'react-bootstrap';
import MemberItem from '../../../../components/federation/MemberItem';
import ConfirmWin from '../../../../components/federation/ConfirmWin';
import { Member,YesSvg,NoSvg } from '../../../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';
import { client } from '../../../../lib/api/client';
import Wecome from '../../../../components/federation/Wecome';

export default function JoinPage({jionData,pid}) {
  
  const user = useSelector((state) => state.valueData.user)
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  let tc = useTranslations('Common')
  let t = useTranslations('ff')

  return (
    <PageLayout>
     {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
     :!loginsiwe?<Wecome />
     :<JionMain jionData={jionData} t={t} tc={tc} user={user} pid={pid} />
     }  
    </PageLayout>
  );
}


function JionMain({jionData,user,t,tc,pid}) {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.valueData.actor)

  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  function showClipError(str){dispatch(setMessageText(str))}
  
  async function handle(method,body)
  {
    showTip(t('submittingText')) 
    let res=await client.post('/api/postwithsession',method,body)
    if(res.status===200) window.location.reload()
    else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg}`)
    closeTip()
  }
 // 3拒绝2匿名0待审批1审批通过
  const verifyJion=(e)=>handle('updateVerify',{id:e.target.getAttribute('join-id'),flag:1})
  const rejectJion=(e)=>handle('updateVerify',{id:e.target.getAttribute('join-id'),flag:3})
  
  return (
      <> <br/>
         <ApplyItem handle={handle} showClipError={showClipError} jionData={jionData} user={user} actor={actor} pid={pid} t={t} />
          {!jionData.length && <ShowErrorBar errStr={t('noPersionAdd')} />}
          {jionData.map((obj,idx)=>(
               <Card className='mt-2' key={idx}>
               <Card.Body>
                  <div className="row" >
                      <div className="col" >
                          <MemberItem record={obj} />
                      </div>
                      <div className="col" >
                          {obj.content}
                      </div>
                      <div className="col">
                          <div>{obj.flag===2?t('anonymousValid'):obj.flag===1?t('approvedText'):obj.flag===0?t('pendingApproval'):t('refusedText')}</div>
                          {obj.member_address.toLowerCase()===user.account.toLowerCase() && obj.manager.toLowerCase()!==user.account.toLowerCase() && <ExitItem id={obj.id} handle={handle} t={t}  ></ExitItem>}
                          {obj.manager.toLowerCase()===user.account.toLowerCase() && <>
                              {obj.flag===0?<>
                                              <Button variant="primary" size="sm" join-id={obj.id} onClick={verifyJion}><YesSvg size={16} /> {t('approveText')}</Button>
                                              <Button variant="warning" size="sm" join-id={obj.id} onClick={rejectJion}><NoSvg size={16}/> {t('refuseText')}</Button>
                                             </>
                              :(obj.flag===1 || obj.flag===2)?<Button variant="warning" size="sm" join-id={obj.id} onClick={rejectJion}><NoSvg size={16}/> {t('refuseText')}</Button>
                              :obj.flag===3 &&  <Button variant="primary" size="sm" join-id={obj.id} onClick={verifyJion}><YesSvg size={16} /> {t('approveText')}</Button>
                              }
                          </> 
                          }
                      </div>
                  </div>
               </Card.Body>
               </Card>
          ))}
      
         
     </>
  );
}

function ApplyItem({handle,showClipError,jionData,user,actor,pid,t})
{
  const [showWin,setShowWin]=useState(false)
  
  const contentRef=useRef()

  const applyClick=()=>{
    let findObj=jionData.find((obj)=>{return obj.member_address.toLowerCase()===user.account.toLowerCase()})
    if(findObj) showClipError(t('alreadyAndNoInvit'))
    else setShowWin(true)
  }

  const submit=()=>handle('addJoin',{pid,content:contentRef.current.value,did:user.account})

  return <>
       <Button onClick={applyClick} ><Member size={20}/> {t('invitText')}</Button>
      <Modal className='mt-1' size="lg" show={showWin} onHide={(e) => {setShowWin(false);}}>
        <Modal.Title>
          <MemberItem  record={actor} noLink={true} />
          </Modal.Title>
        <Modal.Body>
          <Form.Group className="mb-3">
          <Form.Label>{t('invitContend')}:</Form.Label>
          <Form.Control ref={contentRef} as="textarea" rows={3} />
          </Form.Group>
          <div style={{textAlign:'center'}} >
          <Button variant="primary" onClick={submit} >{t('sureText')}</Button>
          </div>
        </Modal.Body>
      </Modal>
  </>
}

function ExitItem({id,t,handle})
{
  const [show,setShow]=useState(false)
  const delJion=()=>handle('delJoin',{id})
  return <>
        <Button variant="primary" size="sm" join-id={id} onClick={e=>setShow(true)}>{t('exitText')}</Button>
        <ConfirmWin  show={show} setShow={setShow} question={t('exitSureText')} callBack={delJion} />
  </>
}



export const getServerSideProps = async ({ req, res,locale,query }) => {

  return {
    props: {
      messages: {
        ...require(`../../../../messages/shared/${locale}.json`),
        ...require(`../../../../messages/federation/${locale}.json`)
      },
      jionData:await getJsonArray('ejoin',[query.id]),
      pid:query.id
    }
  }
}

