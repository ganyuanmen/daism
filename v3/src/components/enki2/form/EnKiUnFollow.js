import { Button } from "react-bootstrap";
import { client } from "../../../lib/api/client";
import { useState } from "react";

export default function EnKiUnFollow({t,searObj,actor,showTip,closeTip,showClipError}) {  
    const [showBtn,setShowBtn]=useState(true)

    const unfollow=async ()=>{
        showTip(t('submittingText'))   
        let re=await  client.get(`/api/activitepub/unfollow?account=${actor?.actor_account}&inbox=${searObj.inbox}&url=${searObj.url || searObj.actor_url}&id=${searObj.id}`,'');
       
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
        { showBtn?<Button onClick={unfollow} > {t('cancelRegister')}</Button>:<div>{t('alreadysubmitText')}...</div>}
    </>
    );
}




