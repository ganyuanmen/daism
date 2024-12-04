import { Button } from "react-bootstrap";
import { useState } from "react";
import { Heart } from '../../../lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "../../../hooks/useMessageData";
import { client } from "../../../lib/api/client";

//点赞按钮 isd 是否允许
export default function EnKiHeart({t,tc,currentObj,actor,showTip,closeTip,showClipError,isEdit})
{
    const [refresh,setRefresh]=useState(false)
    const data=useGetHeartAndBook({account:actor?.actor_account,pid:currentObj?.id,refresh,table:'heart',sctype:currentObj?.dao_id>0?'sc':''})

    const submit=async (flag)=>{ //0 取消点赞  1 点赞
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession','handleHeartAndBook',{account:actor?.actor_account,pid:currentObj?.id,flag,table:'heart'
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
                            <span style={{color:'red'}} ><Heart size={18} /></span>  {t('likeText')} {data?.total}
                        </Button>
                    : <Button onClick={e=>submit(1)}  variant="light"><Heart size={18} /> {t('likeText')} {data?.total} </Button>
                    }
               
                </div>
            :<div>{t('likeText')} {data?.total}</div>
            }
        </>
    );
}

