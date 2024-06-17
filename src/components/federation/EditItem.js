import { Nav, NavDropdown} from "react-bootstrap"
import { useState } from "react"
import ConfirmWin from "./ConfirmWin"
import { EditSvg,DeleteSvg,YesSvg,NoSvg,UserAddSvg } from "../../lib/jssvg/SvgCollection"
import { client } from "../../lib/api/client"
import { useRouter } from 'next/navigation'

export default function EditItem({message,showTip,closeTip,showClipError,path,replyLevel,attach,t,tc})  //replyLevel回复级别
{
    const router = useRouter()
    const [show,setShow]=useState(false)
 

    async function handle(method,body)
    {
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession',method,body)
        if(res.status===200) window.location.reload()
        // else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg}`)
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
        closeTip()
    }

    const deldiscussions=()=>{
        handle(`${path}Del`,{id:message.id,replyLevel})
        setShow(false)
    }
    const handleSelect = (eventKey) =>{ 
        switch(eventKey)
        {
            case "1":
              router.push(`/communities/${path}/update/${message.id}`, { scroll: false })
            break;
            case "2":
              setShow(true)
            break;
            case '3':
                handle('editDiscussion',{id:message.id,flag:message['is_discussion']===1?'0':'1'})
            break; 
            case '4':
                handle('editReply',{id:message.id,flag:message['is_discussion']===1?'0':'1'})
            break;
            case '5':
                navigate(attach.path, { state:message,replace: true})
            break;
            default:
            break;
        } 
    }
       

    return <> <Nav onSelect={handleSelect}  style={{display:"inline-block"}} >
            <NavDropdown  title=' ......' active={false} drop="down" >
               {/* 回复不修改 */}
               {replyLevel===0 && <NavDropdown.Item eventKey="1"> <EditSvg size={24} /> {t('editText')}...</NavDropdown.Item> }  
                <NavDropdown.Item  eventKey="2"> <DeleteSvg size={24} /> {t('deleteText')}...</NavDropdown.Item>     
                {replyLevel===0 && path==='events' && <NavDropdown.Item eventKey="3"> {message['is_discussion']===1?<span><NoSvg size={24} /> {t('noDiscussionText')}</span>:<span><YesSvg size={24} /> {t('backDiscussion')}</span>}...</NavDropdown.Item> }  
                {replyLevel===1 && path==='events' && <NavDropdown.Item eventKey="4">{message['is_discussion']===1?<span><NoSvg size={24} /> {t('noReplyText')}</span>:<span> <YesSvg size={24} /> {t('backReply')}</span>}...</NavDropdown.Item> }  
                {attach && <NavDropdown.Item eventKey="5"><UserAddSvg size={24} /> {attach.title}</NavDropdown.Item> }
            </NavDropdown>
            </Nav>
            <ConfirmWin show={show} setShow={setShow} callBack={deldiscussions} question={t('deleteSureText')}></ConfirmWin>
            </>
}
