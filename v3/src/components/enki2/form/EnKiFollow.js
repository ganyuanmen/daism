import { Button } from "react-bootstrap";
import { client } from "../../../lib/api/client";
import { useState } from "react";


export default function EnKiFollow({t,searObj,actor,showTip,closeTip,showClipError}) {  
    const [showBtn,setShowBtn]=useState(true)


    const follow=async ()=>{
        showTip(t('submittingText'))   
        let re=await  client.get(`/api/activitepub/follow?account=${actor?.actor_account}&inbox=${searObj.inbox || searObj.actor_inbox}&url=${searObj.url || searObj.actor_url }&id=${actor.id}`,'');
       
        if(re.status!==200  )
        {
            showClipError(re.statusText)
            closeTip()
        }else { 
            closeTip()
            setShowBtn(false)
        }
    }

  
    return (<>
       { showBtn?<Button onClick={follow} >{t('follow')}</Button>:<div>{t('alreadysubmitText')}...</div>  }
       </>
    );
}




