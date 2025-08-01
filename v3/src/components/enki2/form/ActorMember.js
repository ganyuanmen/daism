
import {Button,Card,Modal,Tabs,Tab,Accordion,Form } from 'react-bootstrap';
import { useSelector,useDispatch} from 'react-redux';
import { useRef, useState } from 'react';
import {setTipText,setMessageText,setActor} from '../../../data/valueData'
import DaismImg from '../../../components/form/DaismImg';
import { EditSvg,UploadSvg } from '../../../lib/jssvg/SvgCollection';
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import dynamic from 'next/dynamic';
import DaoItem from '../../../components/federation/DaoItem';
const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });
import { useFollow,useTip } from '../../../hooks/useMessageData';
import FollowItem0 from './FollowItem0';
import FollowItem1 from './FollowItem1';
import EnKiRigester from './EnKiRigester';
import { useTranslations } from 'next-intl'
import TipToMe from '../../enki3/TipToMe';
import ShowLogin from '../../enki3/ShowLogin'

/**
 * 个人帐号信息
 * @locale zh/cn 
 * @env 环境变量 
 */
export default function ActorMember({locale,env,notice}){
  const [showLogin,setShowLogin]=useState(false)
  const user = useSelector((state) => state.valueData.user)
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
  

    const [content, setContent] = useState(actor?.actor_desc?actor.actor_desc:'');
    const [show,setShow]=useState(false)
    const [register,setRegister]=useState(false)  // 显示个人注册窗口
    const daoActor = useSelector((state) => state.valueData.daoActor) 
    const imgRef=useRef(null) //头像

    const follow0=useFollow(actor,'getFollow0')
    const follow1=useFollow(actor,'getFollow1')
    const tipToMe=useTip(actor,'getTipToMe')
    const tipFrom=useTip(actor,'getTipFrom')

    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

  
    //提交事件
    const handleSubmit = async () => {
      const res = await fetch('/api/siwe/getLoginUser?t='+new Date().getTime())
      let res_data=await res.json();
      if(res_data.state!==1){
        setShowLogin(true);
          return;
      }
      showTip(t('submittingText')) 
  
      const formData = new FormData();
      formData.append('account', actor?.actor_account);
      formData.append('actorDesc', content);
      formData.append('image', imgRef.current.getFile());
      formData.append('fileType',imgRef.current.getFileType());
      formData.append('did',actor?.manager);
      
         
      fetch(`/api/admin/updateactor`, {
        method: 'POST',
        headers:{encType:'multipart/form-data'},
        body: formData
      })
      .then(async response => {
        closeTip()
        let re=await response.json()
        if(re.errMsg) { showClipError(re.errMsg); return }
        dispatch(setActor(re))
        window.sessionStorage.setItem("actor", JSON.stringify(re))
        dispatch(setMessageText(t('saveprimarysText')))
        setShow(false)
        
      })
      .catch(error => {
        closeTip()
        showClipError(`${tc('dataHandleErrorText')}!${error}`)
      
      });   
  
    };
  
    return (<><Card className='daism-title mt-2'>
    <Card.Header>{t('myAccount')}</Card.Header>
    <Card.Body>
    <div className='row mb-3 ' >
        <div className='col-auto me-auto' >
            <EnkiMember messageObj={actor} locale={locale} isLocal={true} />
        </div>
        <div className='col-auto' >
            {actor?.manager.toLowerCase()===user.account.toLowerCase() &&
            <> 
            {actor?.actor_account?.includes('@') && env.domain!=actor?.actor_account.split('@')[1] && 
            <Button onClick={()=>{setRegister(true)}} ><UploadSvg size={18}/> {t('reRegisterText')}</Button>}{'  '}
            <Button onClick={()=>{setShow(true)}} ><EditSvg size={18}/> {t('editText')}</Button>
            </>
            }
        </div>
    </div>
    <hr/>
    <div>
        <div className='mb-2' ><b>{t('persionInfomation')}:</b></div>
        <div dangerouslySetInnerHTML={{__html: actor?.actor_desc}}></div>
    </div>
    <hr/>

    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header><b>{t('daoGroupText')}:</b>{!daoActor.length && <span style={{display:'inline-block',paddingLeft:'16px'}}>{t('noSmartCommon')}</span>}</Accordion.Header>
        <Accordion.Body>
        {daoActor.map((obj)=>(<DaoItem key={obj.dao_id} t={t} record={obj} />))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
      
      {actor?.actor_account &&
        <Tabs defaultActiveKey={notice>0?"tipToMe": "follow0"} className="mb-3 mt-3" >
            <Tab eventKey="follow0" title={t('followingText',{num:follow0.data.length})}>
              <div>
                {follow0.data.map((obj)=> <FollowItem0 key={obj.id} locale={locale} isEdit={true} messageObj={obj}/>)}
              </div>
            </Tab>
            <Tab eventKey="follow1" title={t('followedText',{num:follow1.data.length})}>
              <div>
                {follow1.data.map((obj)=> <FollowItem1 key={obj.id} locale={locale} isEdit={true} messageObj={obj}/>)}
              </div>
            </Tab>
            <Tab eventKey="tipToMe" title={t('tipToMe',{num:tipToMe.data.length})}>
              <div>
                {tipToMe.data.map((obj)=> <TipToMe key={obj.id} locale={locale} env={env} messageObj={obj}/>)}
              </div>
            </Tab>
            <Tab eventKey="tipFrom" title={t('tipFrom',{num:tipFrom.data.length})}>
              <div>
                {tipFrom.data.map((obj)=> <TipToMe key={obj.id} locale={locale} env={env} messageObj={obj}/>)}
              </div>
            </Tab>
        </Tabs>
        }
    </Card.Body>
    </Card>
  


    {/* {actor?.actor_account && <EnkiView env={env} locale={locale} accountAr={accountAr} /> } */}

  
    <Modal className='daism-title' size="lg" show={show} onHide={(e) => {setShow(false)}}>
      <Modal.Header closeButton>{t('myAccount')}</Modal.Header>
    <Modal.Body>
    <div className='mb-2' style={{paddingLeft:'10px'}} > {t('nickNameText')} : <strong>{actor?.actor_account} </strong> </div>
    
    <DaismImg ref={imgRef} title={t('uploadImgText')} defaultValue={actor?.avatar} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'  />
  
    <RichTextEditor title={t('persionInfomation')} content={content} setContent={setContent}  /> 
    
    <div style={{textAlign:'center'}} >
    <Button variant='primary' onClick={handleSubmit}>{t('saveText')}</Button>
    </div>
   
    </Modal.Body>
    </Modal>
    <Modal className='daism-title' size="lg" show={register} onHide={(e) => {setRegister(false)}}>
      <Modal.Header closeButton>{t('reRegisterText')}</Modal.Header>
    <Modal.Body>
    <EnKiRigester setRegister={setRegister} env={env} />
    </Modal.Body>
    </Modal>
    <ShowLogin show={showLogin} setShow={setShowLogin} />
    </> );
  }
  
