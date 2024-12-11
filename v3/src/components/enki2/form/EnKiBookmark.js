import { useState } from "react";
import { BookTap } from '../../../lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "../../../hooks/useMessageData";
import { client } from "../../../lib/api/client";
import { useSelector, useDispatch } from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useTranslations } from 'next-intl'
import { Button } from "react-bootstrap";

/**
 * 收藏嗯文
 * @currentObj 嗯文对象
 * @isEdit 允许修改
 */
export default function EnKiBookmark({isEdit,currentObj})
{
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')
    const tc = useTranslations('Common')

    const [refresh,setRefresh]=useState(false)
    const data=useGetHeartAndBook({account:actor?.actor_account,pid:currentObj?.id,refresh,table:'bookmark'
        ,sctype:currentObj?.dao_id>0?'sc':''})

    const submit=async (flag)=>{ //0 取消收藏  1 收藏
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession','handleHeartAndBook',{account:actor?.actor_account,pid:currentObj?.id
            ,flag,table:'bookmark'
            ,sctype:currentObj?.dao_id>0?'sc':''})
        if(res.status===200) setRefresh(!refresh) 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
        closeTip()
    }
    //data.pid>0 已点赞
  
    return(
        
         <Button size="sm" variant="light" disabled={!isEdit} onClick={() => {submit(data?.pid>0?0:1);}}
          title={t('bookmastText')}>  
                {data?.pid>0?<span style={{color:'red'}} ><BookTap size={18} /></span>:<BookTap size={18} />}
                {data?.total}
            </Button>
    );
}
