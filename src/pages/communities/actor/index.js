
import {Button,Card,Modal } from 'react-bootstrap';
import { useSelector,useDispatch} from 'react-redux';
import { useRef, useState } from 'react';
import {setTipText,setMessageText,setActor} from '../../../data/valueData'
import ShowErrorBar from '../../../components/ShowErrorBar';
import Editor from '../../../components/form/Editor';
import MemberItem from '../../../components/federation/MemberItem';
import Link from 'next/link';
import DaismImg from '../../../components/form/DaismImg';
import DaismInputGroup from '../../../components/form/DaismInputGroup';
import { User1Svg,EditSvg } from '../../../lib/jssvg/SvgCollection';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Wecome from '../../../components/federation/Wecome'
import ShowImg from '../../../components/ShowImg';

export default function MyActor() {
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    let tc = useTranslations('Common')
    let t = useTranslations('ff')
  
    return (
      <PageLayout>
       {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
       :!loginsiwe?<Wecome />
       :<ActorInfo t={t} tc={tc} user={user} />
       }  
      </PageLayout>
    );
}

function ActorInfo({t,tc,user})
{
    const [show,setShow]=useState(false)
    const daoActor = useSelector((state) => state.valueData.daoActor) 
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch(); 
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

    const nickRef=useRef()
    const descRef=useRef(null) //个人描述
    const imgRef=useRef(null) //头像

    //提交事件
    const handleSubmit = async () => {
      let actorName=nickRef.current.getData();
      if (!actorName || actorName.length > 128) {
          nickRef.current.notValid(t('nickValid'))
          return
      }
      showTip(t('submittingText')) 

      const formData = new FormData();
      formData.append('actorName', actorName);
      formData.append('actorDesc', descRef.current.getData());
      formData.append('image', imgRef.current.getFile());
      formData.append('fileType',imgRef.current.getFileType());
      formData.append('did',actor.member_address);
         
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

    return  <> 
            <Card className='daism-title mt-2'>
            <Card.Header>{t('myAccount')}</Card.Header>
            <Card.Body>
            <div className='row mb-3 ' >
                <div className='col-auto me-auto' >
                    <MemberItem  record={actor} noLink={true}  />
                </div>
                <div className='col-auto' >
                    {actor && actor.member_address.toLowerCase()===user.account.toLowerCase() && <Button onClick={()=>{setShow(true)}} ><EditSvg size={18}/> {t('editText')}</Button>}
                </div>
            </div>
            <hr/>
            <div>
                <div className='mb-2' ><b>{t('persionInfomation')}:</b></div>
                <div dangerouslySetInnerHTML={{__html: actor.member_desc}}></div>
            </div>
            <hr/>
            <div className='mb-2' ><b>{t('daoGroupText')}:</b> {!daoActor.length && <span style={{display:'inline-block',paddingLeft:'16px'}}>{t('noSmartCommon')}</span>} </div>
            {
              daoActor.map((obj)=>(
                  <Link className='daism-a' key={obj.dao_id} href={`/communities/daoinfo/[id]`} as={`/communities/daoinfo/${obj.dao_id}`} >
                  <div className='row mb-2 p-1' style={{borderBottom:'1px solid gray'}}  key={obj.dao_id}>
                    <div className='col' >
                        <img src={obj.dao_logo?obj.dao_logo:'/logo.svg'} alt=''  width={32} height={32} style={{borderRadius:'50%'}} />
                        <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.dao_name}</span>
                    </div>
                    <div className='col' >
                      {obj.avatar?<ShowImg path={obj.avatar} alt='' width="32px" height="32px" borderRadius='50%' />
                        :<User1Svg size={32} />
                      }
                        
                        <span style={{display:'inline-block',paddingLeft:'6px'}} >{obj.account}</span>
                    </div>

                    <div className='col' >
                        {obj.dao_manager.toLowerCase()===user.account.toLowerCase()?<span>{t('daoManagerText')}</span>
                        :parseInt(obj.member_type)===1?<span>{t('originMember')}</span>
                        :<span>{t('invitMember')}</span>
                        }
                    </div> 
                  </div>
                  </Link>
              ))
            }
            </Card.Body>
            </Card>

          
            <Modal className='daism-title' size="lg" show={show} onHide={(e) => {setShow(false)}}>
              <Modal.Header closeButton>{t('myAccount')}</Modal.Header>
            <Modal.Body>
           
            <DaismInputGroup ref={nickRef} title={t('nickNameText')} defaultValue={actor?.member_nick} ></DaismInputGroup>
            <DaismImg ref={imgRef} title={t('uploadImgText')} isApi={true} defaultValue={actor?.member_icon} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'  />
            <Editor ref={descRef} title={t('persionInfomation')} defaultValue={actor?.member_desc} ></Editor>
            <div style={{textAlign:'center'}} >
            <Button variant='primary' onClick={handleSubmit}>{t('saveText')}</Button>
            </div>
           
            </Modal.Body>
            </Modal>
            
            </>
}



export const getServerSideProps = ({ req, res,locale }) => {

    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        }
      }
    }
  }



  