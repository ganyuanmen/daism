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
import PageLayout from '../../../../components/PageLayout';
import { useRouter } from 'next/navigation'
import DaismImg from '../../../../components/form/DaismImg'
import { getJsonArray } from '../../../../lib/mysql/common';

export default function NewPage({newsData}) {
  const user = useSelector((state) => state.valueData.user)
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  let tc = useTranslations('Common')
  let t = useTranslations('ff')

  return (
    <PageLayout>
     {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
     :!loginsiwe?<Wecome />
     :newsData.id?<NewMain newsData={newsData} t={t} tc={tc} />
     :<ShowErrorBar errStr={t('noNewsExist')} />
     }  
    </PageLayout>
  );
}

function NewMain({newsData,tc,t}) {
  const router = useRouter()
  const titleRef=useRef(null)
  const editorRef = useRef(null); 
  const imgstrRef = useRef(null); 
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
    if(!textValue)
    {
        showClipError(t('newsContenNoEmpty'))
        return
    }

    const formData = new FormData();
    formData.append('id', newsData.id);
    formData.append('content', textValue);
    formData.append('title',titleText);
    formData.append('image', imgstrRef.current.getFile());
    formData.append('fileType',imgstrRef.current.getFileType());

    showTip(t('submittingText'))  
    
    fetch(`/api/admin/updatenews`, {
      method: 'POST',
      headers:{encType:'multipart/form-data'},
      body: formData
    })
    .then(async response => {
      closeTip()
      let re=await response.json()
      if(re.errMsg) { showClipError(re.errMsg); return }
      router.push(`/communities/news/message/${newsData.id}`, { scroll: false }) 
    })
    .catch(error => {
      closeTip()
      showClipError(`${tc('dataHandleErrorText')}!${error}`)
    });   
  
  }

  const menu=[
      {url:`/communities/visit/${newsData.dao_id}`,title:newsData.dao_name},
      {url:`/communities/news/list/${newsData.dao_id}`,title:'news'}
  ]

  return (
      <>
          <Breadcrumb menu={menu} currentPage='Update' ></Breadcrumb>        
          <h1>{t('editNewsText')}</h1>
          <Card>
          <Card.Body>
          <DaismImg title={t('selectTopImg')} ref={imgstrRef}  defaultValue={newsData?.top_img} isApi={true} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'></DaismImg>
          <DaismInputGroup title={t('titileText')} ref={titleRef} defaultValue={newsData.title} ></DaismInputGroup> 
          <Editor title={t('newsContent')} ref={editorRef} defaultValue={newsData.content}  ></Editor><br/>
          <Button variant='primary' onClick={submit} ><SendSvg size={16} /> {t('saveText')}</Button>
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
        newsData:await getJsonArray('nview',[query.id],true)
      }
    }
  }



  