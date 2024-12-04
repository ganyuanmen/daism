

import { Button } from "react-bootstrap";
// import { client } from "../../../lib/api/client";
import { useState } from "react";
import MessageReply from "../../../../components/enki2/form/MessageReply";


export default function FootButton({env,t,tc,user,messageObj,actor,showTip,closeTip,showClipError,replyAddCallBack}) {  
    // const [showBtn,setShowBtn]=useState(true)


    // const follow=async ()=>{
    //     showTip(t('submittingText'))   
    //     let re=await  client.get(`/api/activitepub/follow?account=${actor?.actor_account}&inbox=${searObj.inbox || searObj.actor_inbox}&url=${searObj.url || searObj.actor_url }&id=${actor.id}`,'');
       
    //     if(re.status!==200  )
    //     {
    //         showClipError(re.statusText)
    //         closeTip()
    //     }else { 
    //         closeTip()
    //         setShowBtn(false)
    //     }
    // }

   
    return (<div className="d-flex justify-content-between" >
       <MessageReply t={t} tc={tc} actor={actor} total={messageObj.total} currentObj={messageObj} addReplyCallBack={replyAddCallBack} showTip={showTip} closeTip={closeTip} showClipError={showClipError} isEdit={true} />
        <button type="button" className="btn btn-light" data-bs-toggle="tooltip" data-bs-html="true" title="转嗯">  
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"  aria-hidden="true"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"></path></svg>
        </button>
        <button type="button" className="btn btn-light" data-bs-toggle="tooltip" data-bs-html="true" title="喜欢">  
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"  aria-hidden="true"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"></path></svg>
        </button>
        <button type="button" className="btn btn-light" data-bs-toggle="tooltip" data-bs-html="true" title="添加到书签">  
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"  aria-hidden="true"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"></path></svg>
        </button>
        <button type="button" className="btn btn-light" data-bs-toggle="tooltip" data-bs-html="true" title="更多">  
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"  aria-hidden="true"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"></path></svg>
        </button>
        </div>
    );
}




