import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "./EnkiMember"
import EnkiEditItem from "./EnkiEditItem"
import ShowVedio from "./ShowVedio";
import EnKiFollow from "./EnKiFollow";
import { useState,useEffect } from "react";
import { useSelector } from 'react-redux';
import { ReplySvg } from "../../../lib/jssvg/SvgCollection";



/**
 * 回复Item
 * @locale zh/cn
 * @isEdit  允许修改
 * @replyObj 回复内容
 * @delCallBack 删除回复后回调
 * @preEditCall 修改回复前调用
 * @sctype sc:社区嗯文 空：个人嗯文
 * @reply_index 回复列表中的序号
 */
export default function ReplyItem({locale,isEdit,replyObj,delCallBack,preEditCall,sctype,reply_index,domain,pleft}) {
    const [isFollow,setIsFollow]=useState(true) //默认已关注
    const myFollow = useSelector((state) => state.valueData.myFollow)
    const actor = useSelector((state) => state.valueData.actor)
 const editCallBack=(bid)=>{
    preEditCall.call(this,replyObj,reply_index,bid)
 }

 const callBack=()=>{
    delCallBack.call(this,reply_index)
 }
 useEffect(() => {
    let item = myFollow.find(obj => obj.actor_account?.toLowerCase() === replyObj?.actor_account?.toLowerCase());
    //本人不能关注本人，设为已关注 用户不在注册地登录的，设为已注册，不需要显示关注的按钮
    if(item || actor?.actor_account===replyObj.actor_account || domain!=actor?.actor_account?.split('@')[1]) 
        setIsFollow(true); else setIsFollow(false);
}, [myFollow]);  


    // const createtime=new Date(replyObj.createtime);

    // const month = String(createtime.getMonth() + 1).padStart(2, '0'); // 月份是从 0 开始的，需要加 1 并补零
    // const day = String(createtime.getDate()).padStart(2, '0'); // 天数补零
    


    return (
        <div style={{borderBottom:'1px solid #D2D2D2',width:'100%',paddingLeft:`${pleft}px`}}>
           <div style={{width:'100%',paddingLeft:"10px"}} className="d-inline-flex justify-content-between align-items-center"   >
               <div style={{width:'50%'}} > <EnkiMember messageObj={replyObj} isLocal={false} hw={32} locale={locale} /></div>
               {isEdit && <div><button onClick={e=>editCallBack(replyObj.bid)} className="daism-ff"> <ReplySvg size={24} /></button></div>}
                {!isFollow && <div><EnKiFollow searObj={replyObj} /> </div>}
                
                <div  style={{paddingRight:'10px'}}  >
                    <EnkiEditItem isEdit={isEdit  && actor?.actor_account===replyObj.actor_account} actor={actor} messageObj={replyObj} delCallBack={callBack} 
                    preEditCall={editCallBack} type={1} sctype={sctype} />
                    <TimesItem_m currentObj={replyObj} /> 
                  
                </div>
            </div> 
            <div className="daism-reply-item" style={{paddingBottom:'10px'}} >
                <div style={{minHeight:'40px'}} dangerouslySetInnerHTML={{__html: replyObj.content}}></div>
                {replyObj?.content_link && <div dangerouslySetInnerHTML={{__html: replyObj.content_link}}></div>}
                {replyObj?.top_img && <img  className="mt-2 mb-2" alt="" src={replyObj.top_img} style={{maxWidth:'100%'}} />
                }
                {replyObj?.vedio_url && <ShowVedio vedioUrl={replyObj.vedio_url} /> 
                }
            </div> 
        </div> 
    );
}


