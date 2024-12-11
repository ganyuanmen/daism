import { Button } from "react-bootstrap";
import { client } from "../../../lib/api/client";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {setTipText,setMessageText, setMyFollow} from '../../../data/valueData';
import { useTranslations } from 'next-intl'
/**
 * 取关按钮
 * @searObj 关注者信息 
 */
export default function EnKiUnFollow({searObj}) {  
    const account=searObj.account || searObj.actor_account
    const [showBtn,setShowBtn]=useState(true)
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')
    const myFollow = useSelector((state) => state.valueData.myFollow)

    const unfollow=async ()=>{
        showTip(t('submittingText'))   
        let re=await  client.get(`/api/activitepub/unfollow?account=${actor?.actor_account}&inbox=${searObj.inbox}&url=${searObj.url || searObj.actor_url}&id=${searObj.id}`,'');
       
        if(re.status===200  )
        {
            closeTip()
            setShowBtn(false)
            let indexToRemove = myFollow.indexOf(account);
            if (indexToRemove !== -1) {
                const newMyFollow = [...myFollow.slice(0, indexToRemove), ...myFollow.slice(indexToRemove + 1)];
                dispatch(setMyFollow(newMyFollow));
            }
        }else { 
            showClipError(re.statusText)
            closeTip()
        }
    }

    return (<>
        { showBtn?<Button onClick={unfollow} > {t('cancelRegister')}</Button>:<div>{t('alreadysubmitText')}...</div>}
    </>
    );
}




