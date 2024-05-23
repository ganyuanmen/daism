
import { useSelector,useDispatch} from 'react-redux';
import {  useRef, useState } from 'react';
import {setTipText,setMessageText} from '../../data/valueData'
import ShowErrorBar from '../../components/ShowErrorBar';
import Button from 'react-bootstrap/Button';
import Loadding from '../../components/Loadding';
import { Card, Col, Row } from 'react-bootstrap';
import DaismImg from '../../components/form/DaismImg'
import ConfirmWin from '../../components/federation/ConfirmWin';
import { UploadSvg,DeleteSvg } from '../../lib/jssvg/SvgCollection';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Wecome from '../../components/federation/Wecome'
import useSource from '../../hooks/useSource';
import { client } from '../../lib/api/client';

export default function Source() {
  
    const [refresh,setRefresh]=useState(false)
    
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    let tc = useTranslations('Common')
    let t = useTranslations('dao')
    const sourceData=useSource({loginsiwe,did:user.account,refresh})
  
    return (
      <PageLayout>
       {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
       :!loginsiwe?<Wecome />
       :sourceData.data?<SourceList t={t} tc={tc} setRefresh={setRefresh} refresh={refresh} listData={sourceData.data} user={user} />
       :sourceData.status==='failed'?<ShowErrorBar errStr={sourceData.error} />
       :<Loadding />
       }  
      </PageLayout>
    );
}

function SourceList({listData,t,tc,refresh,setRefresh,user}){
    
    const [showDelWindow,setShowDelWindow]=useState(false)
    const [sourceId,setSurceId]=useState(0)
    const imgRef=useRef()

    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

   async function delSource()
    {
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession','delSource',{id:sourceId}
        )
        if(res.status===200) {
            setRefresh(!refresh)
            setShowDelWindow(false)
        } 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
        closeTip()
    }

    async function upLogoClick()
    {
        if(!imgRef.current.getFileType())
        {
            showClipError(t('noSelectImgText'))   
            return
        }
        showTip(t('submittingText'))  
        
        const formData = new FormData();
        formData.append('image', imgRef.current.getFile());
        formData.append('fileType',imgRef.current.getFileType());
        formData.append('did',user.account);
    
        fetch(`/api/admin/addSource`, {
          method: 'POST',
          headers:{encType:'multipart/form-data'},
          body: formData
        })
      .then(async response => {
        closeTip()
        let re=await response.json()
        if(re.errMsg) { showClipError(re.errMsg); return }
        setRefresh(!refresh)
      })
      .catch(error => {
        closeTip()
        showClipError(`${tc('dataHandleErrorText')}!${error}`)
       
      });   
  
    
    }

    
    return <>
            <DaismImg  ref={imgRef} title={t('selectImgText')}  maxSize={1024*1024*2} fileTypes='svg,jpg,jpeg,png,gif,webp' />
            <Button variant='primary'  className='mb-2' onClick={upLogoClick} ><UploadSvg size={20} />{t('uploadText')}</Button>

            <Card className='daism-title mt-1' >
           <Card.Header>My source</Card.Header>
           <Card.Body>   
           {listData.map((record, idx) => (
                <Row key={idx}  className='row mb-3 p-2' style={{borderBottom:'1px solid gray'}}>
                    <Col>{record._time}</Col>
                    <Col>
                    <a href={record.url} target='_blank' alt={record.url} >{record.url}</a>
                    </Col>
                    <Col>
                    <Button onClick={()=>{
                        setSurceId(record.id)
                        setShowDelWindow(true)
                    }} size='sm' variant='danger'><DeleteSvg size={16} />  {t('delText')} </Button>
                    </Col>
                </Row>
            ))}
           </Card.Body>
           </Card>

            <ConfirmWin show={showDelWindow} setShow={setShowDelWindow} callBack={delSource} question={t('deleteSureText')}></ConfirmWin>
           </>
}


export const getStaticProps = ({ req, res,locale }) => {
  
    
   
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/dao/${locale}.json`),
          }
        }
      }
    }
