import { useRef } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData'
import DaismInputGroup from '../../../../components/form/DaismInputGroup';
import { Button,Card } from 'react-bootstrap';
import Breadcrumb from '../../../../components/Breadcrumb';
import Editor from '../../../../components/form/Editor';
import { SendSvg } from '../../../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import Wecome from '../../../../components/federation/Wecome';
import { client } from '../../../../lib/api/client';
import PageLayout from '../../../../components/PageLayout';
import { useRouter } from 'next/navigation'
import { getJsonArray } from '../../../../lib/mysql/common';

export default function NewPage({daoData}) {
  const user = useSelector((state) => state.valueData.user)
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  let tc = useTranslations('Common')
  let t = useTranslations('ff')

  return (
    <PageLayout>
     {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
     :!loginsiwe?<Wecome />
     :daoData.dao_id?<NewMain daoData={daoData} user={user} t={t} tc={tc} />
     :<ShowErrorBar  errStr={t('noDaoMemberText')} />
     }  
    </PageLayout>
  );
}

function NewMain({daoData,user,t,tc}) {
  const router = useRouter()
  const titleRef=useRef(null)
  const editorRef = useRef(null); 
  const sendRef = useRef(null); 
  
  const dispatch = useDispatch();

  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  function showClipError(str){dispatch(setMessageText(str))}

  async function submit()
  {
    let titleText=titleRef.current.getData()
    if (!titleText || titleText.length > 256) {
      titleRef.current.notValid(t('titleValidText'))
      return
    }
    let textValue=editorRef.current.getData()
    if(!textValue) {
      showClipError(t('discussionContenNoEmpty'))
      return
     }

    showTip(t('submittingText'))  
    
    
    let res=await client.post('/api/postwithsession','discussionsAdd',{
        title:titleText,
        content:textValue,
        did:user.account,
        contentText:editorRef.current.getText(),
        daoid:daoData.dao_id,
        isSend:sendRef.current.checked?1:0,
        isDiscussion:1})

    if(res.status===200)  router.push(`/info/discussions/message/${res.data}`, { scroll: false })
    else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
    closeTip()
     
      
  }

  const menu=[
      {url:`/info/visit/${daoData.dao_id}`,title:daoData.dao_name},
      {url:`/info/discussions/list/${daoData.dao_id}`,title:'discussions'}
  ]

  return (
      <>
        <Breadcrumb menu={menu} currentPage='Create' ></Breadcrumb>        
          <h1>{t('addDiscussionText')}</h1>
          <Card>
          <Card.Body>
          <DaismInputGroup title={t('titileText')}   ref={titleRef} />
          <Editor title={t('discussionContent')} ref={editorRef} /><br/>
          <div className="form-check form-switch mb-3">
              <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={true} />
              <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
          </div>
          <Button variant='primary' onClick={submit} ><SendSvg size={16} /> {t('createDiscussion')}</Button>
          </Card.Body>
          </Card>
     </>
  );
}



export const getServerSideProps = async ({ req, res,locale,query }) => {
 
    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        daoData:await getJsonArray("daodata2",[query.id],true)
      }
    }
  }
