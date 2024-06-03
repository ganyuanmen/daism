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
import withSession from '../../../../lib/session';
import { getJsonArray } from '../../../../lib/mysql/common';
import PageLayout from '../../../../components/PageLayout';
import { useRouter } from 'next/navigation'
import DaismImg from '../../../../components/form/DaismImg'


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
  const titleRef=useRef(null)
  const editorRef = useRef(null); 
  const imgstrRef = useRef(null); 
  const dispatch = useDispatch();
  const router = useRouter()

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
    if(!textValue)
    {
        showClipError(t('newsContenNoEmpty'))
        return
    }
    showTip(t('submittingText'))  
    
    const formData = new FormData();
    formData.append('title', titleText);
    formData.append('content', textValue);
    formData.append('daoid',daoData.dao_id);
    formData.append('image', imgstrRef.current.getFile());
    formData.append('fileType',imgstrRef.current.getFileType());
    formData.append('did',user.account);
    formData.append('contentText',editorRef.current.getText());

    fetch(`/api/admin/addnews`, {
      method: 'POST',
      headers:{encType:'multipart/form-data'},
      body: formData
    })
  .then(async response => {
    closeTip()
    let re=await response.json()
    if(re.errMsg) { showClipError(re.errMsg); return }
    router.push(`/enki/news/message/${re.id}`, { scroll: false }) 
  })
  .catch(error => {
    closeTip()
    showClipError(`${tc('dataHandleErrorText')}!${error}`)
   
  });   
  
 
}
   
  const menu=[
    {url:`/enki/visit/${daoData.dao_id}`,title:daoData.dao_name},
    {url:`/enki/news/list/${daoData.dao_id}`,title:'news'}
]

  return (
      <>
          <Breadcrumb menu={menu} currentPage='Create' ></Breadcrumb>        
          <h1>{t('createNews')}</h1>
          <Card>
          <Card.Body>
          <DaismImg title={t('selectTopImg')} ref={imgstrRef}  maxSize={1024*1024*5} fileTypes='svg,jpg,jpeg,png,gif,webp'></DaismImg>
          <DaismInputGroup title={t('titileText')} ref={titleRef} ></DaismInputGroup> 
          <Editor title={t('newsContent')} ref={editorRef} ></Editor><br/>
          <Button variant='primary' onClick={submit} ><SendSvg size={16} /> {t('createNews')}</Button>
          </Card.Body>
          </Card>
     </>
  );
}




export const getServerSideProps = withSession(async ({ req, res,locale,query }) => {
  
    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        daoData:await getJsonArray('daodata2',[query.id],true)
      }
    }
  }

)

  
