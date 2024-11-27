import { useState } from "react";
import { EditSvg,DeleteSvg } from "../../../lib/jssvg/SvgCollection";
import { Nav,NavDropdown } from "react-bootstrap";
import ConfirmWin from "../../federation/ConfirmWin";
import { client } from "../../../lib/api/client";
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';

//type 默认是 嗯文 1-> 是回复 preEditCall 修改前操作  delCallBack 删除后回调  
export default function EnkiEditItem({tc,t,messageObj,delCallBack,preEditCall,sctype,type=0})
{
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

        // if(messageObj.actor_account && messageObj.actor_account.includes('@')){
        //     const [name,domain]=messageObj.actor_account.split('@');
        //     if(domain!==daoAddress['domain']) 
        //         return showClipError(t('noHandleText',{domain}))

        // }

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
                <NavDropdown  title=' ......' active={false} drop="down" >
                    <NavDropdown.Item eventKey="1"> <EditSvg size={24} /> {t('editText')}...</NavDropdown.Item> 
                    <NavDropdown.Item  eventKey="2"> <DeleteSvg size={24} /> {t('deleteText')}...</NavDropdown.Item>     
                </NavDropdown>
            </Nav>
            <ConfirmWin show={show} setShow={setShow} callBack={deldiscussions} question={t('deleteSureText')}/>
        </>
    );
}