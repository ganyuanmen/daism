import { useEffect, useState } from "react";
import { EditSvg,DeleteSvg,Pin,AnnounceSvg } from "../../../lib/jssvg/SvgCollection";
import { Nav,NavDropdown,Button } from "react-bootstrap";
import ConfirmWin from "../../federation/ConfirmWin";
import { client } from "../../../lib/api/client";
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useTranslations } from 'next-intl'

/**
 * 修改菜单（嗯文或回复）
 * @messageObj 修改对象，
 * @delCallBack 删除后回调
 * @preEditCall 修改前回调
 * @sctype sc 社区嗯文， '' 个人社交
 * @isEdit 允许修改或删除
 * @type 0 对象是嗯文， 1 对象是回复
 */
//type 默认是 0嗯文 1-> 是回复 preEditCall 修改前操作  delCallBack 删除后回调  
export default function EnkiEditItem({messageObj,env, actor, delCallBack,preEditCall,sctype,isEdit,type=0})
{
    
    const t = useTranslations('ff')
    const tc=useTranslations('Common')
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const [isAn,setIsAn]=useState(false)
   const isAnnoce=()=>{
    if(!actor?.actor_account || !actor?.actor_account?.includes('@')) return false;
    if(messageObj.actor_account===actor?.actor_account ) return false;
    if(messageObj.send_type===8 && messageObj.receive_account===actor?.actor_account) return false;
    if(env?.domain!==actor?.actor_account.split('@')[1]) return false;

    return true;
 
   }

    useEffect(()=>{
        let _isAn=isAnnoce();
        if(_isAn){
            const fetchData = async () => {
                try {
                    const res = await client.get(`/api/getData?id=${messageObj.id}&sctype=${sctype}&account=${actor?.actor_account}`,'getAnnoce');
                    if(res.status===200)
                        if(Array.isArray(res.data) && res.data.length===0) setIsAn(true); 
                    
                } catch (error) {
                    console.error(error);
                } 
            };

            fetchData();
        } else setIsAn(false);

    },[messageObj,sctype]) 

    

    const handle=async (method,body)=>{
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession',method,body)
        closeTip()
        if(res.status===200) delCallBack.call() 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
      
    }
    const handlePin=async (flag,id)=>{
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession',"setTopMessage",{sctype,flag,id})
        closeTip()
        if(res.status===200) delCallBack.call() 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
      
    }
 
    const handleAnnounce=async ()=>{
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession',"setAnnounce",
            {
                account:actor?.actor_account,
                toUrl:messageObj.actor_url,
                id:messageObj.message_id,
                recordId:messageObj.id,
                content:messageObj.content,
                topImg:messageObj.top_img,
                contentLink:messageObj.content_link,
                vedioUrl:messageObj.vedio_url,
                pathtype:messageObj.dao_id>0?'enki':'enkier'
            }
           
        );
        closeTip()
        if(res.status===200) delCallBack?.call() 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
      
    }


    const [show,setShow]=useState(false)
    const isDelete=isEdit || actor.actor_account===messageObj.receive_account;
    const handleSelect = (eventKey) =>{ 

        switch(eventKey)
        {
            case "1":
                preEditCall.call()
            break;
            case "2":
              setShow(true)
            break;
            case "3":
                handlePin(messageObj.is_top?0:1,messageObj.id);
            case "4":
                handleAnnounce();
            default:
            break;
        } 
    }
    const deldiscussions=()=>{
        handle('messageDel',{id:messageObj.id,type,sctype})
        setShow(false)
        
    }

    return(
        <> {type===0?
            <Nav onSelect={handleSelect}  style={{display:"inline-block"}} >
                <NavDropdown  title=' ......' active={false} drop={type===0?"up":'down'} >
                    <NavDropdown.Item disabled={!isEdit} eventKey="1"> <span style={{color:isEdit?'black':'gray'}}><EditSvg size={24} /> {t('editText')}...</span></NavDropdown.Item> 
                    <NavDropdown.Item disabled={!isDelete} eventKey="2"> <span style={{color:isDelete?'black':'gray'}}><DeleteSvg size={24} /> {t('deleteText')}...</span></NavDropdown.Item> 
                   { isAn && <NavDropdown.Item eventKey="4"> <span><AnnounceSvg size={24} /> {t('amouseText')}...</span></NavDropdown.Item>  }       
                   {messageObj.dao_id>0 && <NavDropdown.Item disabled={!isEdit} eventKey="3"> <span style={{color:isEdit?'black':'gray'}}><Pin size={24} /> {messageObj.is_top?t('dropTopText'):t('setTopText')}...</span></NavDropdown.Item>}     
                
                </NavDropdown>
            </Nav>
            : <>{isEdit && <button  style={{border:0}} onClick={()=>{setShow(true)}}  > <DeleteSvg   size={16} /></button> }</>
            }
            <ConfirmWin show={show} setShow={setShow} callBack={deldiscussions} question={t('deleteSureText')}/>
        </>
    );
}
