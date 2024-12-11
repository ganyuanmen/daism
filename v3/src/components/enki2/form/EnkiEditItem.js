import { useState } from "react";
import { EditSvg,DeleteSvg } from "../../../lib/jssvg/SvgCollection";
import { Nav,NavDropdown } from "react-bootstrap";
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
export default function EnkiEditItem({messageObj,delCallBack,preEditCall,sctype,isEdit,type=0})
{
    const t = useTranslations('ff')
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    const handle=async (method,body)=>{
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession',method,body)
        closeTip()
        if(res.status===200) delCallBack.call() 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
      
    }

 

    const [show,setShow]=useState(false)
    const handleSelect = (eventKey) =>{ 

        switch(eventKey)
        {
            case "1":
                preEditCall.call()
            break;
            case "2":
              setShow(true)
            break;
            default:
            break;
        } 
    }
    const deldiscussions=()=>{
        handle('messageDel',{id:messageObj.id,type,sctype})
        setShow(false)
        
    }

    return(
        <> 
            <Nav onSelect={handleSelect}  style={{display:"inline-block"}} >
                <NavDropdown  title=' ......' active={false} drop={type===0?"up":'down'} >
                    <NavDropdown.Item disabled={!isEdit} eventKey="1"> <span style={{color:isEdit?'black':'gray'}}><EditSvg size={24} /> {t('editText')}...</span></NavDropdown.Item> 
                    <NavDropdown.Item disabled={!isEdit} eventKey="2"> <span style={{color:isEdit?'black':'gray'}}><DeleteSvg size={24} /> {t('deleteText')}...</span></NavDropdown.Item>     
                </NavDropdown>
            </Nav>
            <ConfirmWin show={show} setShow={setShow} callBack={deldiscussions} question={t('deleteSureText')}/>
        </>
    );
}
