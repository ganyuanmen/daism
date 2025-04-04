
import { client } from "../../../lib/api/client";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {setTipText,setMessageText,setMyFollow} from '../../../data/valueData';
import { useTranslations } from 'next-intl'
import {Follow} from '../../../lib/jssvg/SvgCollection'
import { Button } from "react-bootstrap";

/**
 * @searObj 被关注的对象信息
 * @showText 按钮显示文字还是图标，图标是在嗯文标题中使用
 */
export default function EnKiFollow({searObj,showText=false}) {  
    const account=searObj.account || searObj.actor_account
    const [showBtn,setShowBtn]=useState(true)
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const myFollow = useSelector((state) => state.valueData.myFollow)
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')

    const followHandle=async ()=>{
        showTip(t('submittingText'))   
        let re=await  client.get(`/api/activitepub/follow?account=${actor?.actor_account}&inbox=${searObj.inbox || searObj.actor_inbox}&url=${searObj.url || searObj.actor_url }&id=${actor?.id}`,'');
        if(re.status!==200  )
        {
            showClipError(re.statusText);
            closeTip();
        }else { 
            closeTip()
            setShowBtn(false)
            window.sessionStorage.setItem("myFollow", JSON.stringify([...myFollow, {actor_account:account}]))
            dispatch(setMyFollow([...myFollow, {actor_account:account}]))
            
        }
    }
      
    return <> {showText?
        <>{showBtn?<Button onClick={followHandle} > {t('follow')}</Button>:<div>{t('alreadysubmitText')}...</div>}</>:
        <>{showBtn && <button className="daism-ff"  onClick={followHandle} title={t('follow')}><Follow size={24}/></button>}</>
        }    
    </>
    
}




