import { Button } from "react-bootstrap";
import { useState } from "react";
import { BookTap } from '../../../lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "../../../hooks/useMessageData";
import { client } from "../../../lib/api/client";


export default function EnKiBookmark({isEdit,t,tc,currentObj,actor,showTip,closeTip,showClipError})
{
    const [refresh,setRefresh]=useState(false)
    const data=useGetHeartAndBook({account:actor?.actor_account,pid:currentObj?.id,refresh,table:'bookmark',sctype:currentObj?.dao_id>0?'sc':''})

    const submit=async (flag)=>{ //0 取消收藏  1 收藏
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession','handleHeartAndBook',{account:actor?.actor_account,pid:currentObj?.id,flag,table:'bookmark'
            ,sctype:currentObj?.dao_id>0?'sc':''})
        if(res.status===200) setRefresh(!refresh) 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
        closeTip()
    }
    //data.pid>0 已点赞
  
    return(
        <>
            {isEdit?
                <div>
                    {data.pid>0?
                        <Button onClick={e=>{submit(0)}}  variant="light">
                            <span style={{color:'red'}} ><BookTap size={24} /></span>  {t('bookmastText')} {data?.total}
                        </Button>
                    : <Button onClick={e=>submit(1)}  variant="light"><BookTap size={24} /> {t('bookmastText')} {data?.total} </Button>
                    }
               
                </div>
            :<div>{t('bookmastText')} {data?.total}</div>
            }
        </>
    );
}

