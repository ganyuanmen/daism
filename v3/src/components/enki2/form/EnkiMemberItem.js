import TimesItem from "../../federation/TimesItem";
import EnkiMember from "./EnkiMember"
import EnkiEditItem from "./EnkiEditItem"
import EnKiFollow from "./EnKiFollow";
import { useState,useEffect } from "react";
import { client } from "../../../lib/api/client";

import dynamic from 'next/dynamic';
const EnkiMessageMember = dynamic(() => import('../../enki3/EnkiMessageMember'), { ssr: false });

//isEdit 是否可修改的
export default function EnkiMemberItem({locale,t,actor,messageObj,domain,delCallBack,preEditCall,showTip,closeTip,showClipError,isEdit}) {
    const [isFollow,setIsFollow]=useState(true) //默认已关注
    

    useEffect(() => {
        let ignore = false; //getFollow, //获某一关注 {actorAccount,userAccount} userAccount 关注  actorAccount
        if(actor?.actor_account && actor.actor_account.includes('@'))
        client.get(`/api/getData?actorAccount=${messageObj?.actor_account}&userAccount=${actor?.actor_account}`,'getFollow').then(res =>{  
          
            if (!ignore) 
                if (res.status===200) {  //用户不在注册地登录的，设为已注册，不需要显示关注的按钮
                    setIsFollow(!!res.data.id || domain!=actor.actor_account.split('@')[1]);
                }
                else console.error(res.statusText)
        });
        return () => {ignore = true}
        
    }, [actor]);

  
 

    return (
        <div className="d-flex justify-content-between align-items-center">
            {(messageObj?.dao_id==0 &&messageObj?.send_type==0 && messageObj?.manager)?<EnkiMessageMember t={t} messageObj={messageObj} locale={locale} />
            :<EnkiMember locale={locale} messageObj={messageObj} isLocal={messageObj?.actor_id>0} /> }
            
            {actor?.actor_account && !isFollow && messageObj?.actor_account!==actor?.actor_account && 
            <EnKiFollow t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} /> }
            
            <div>
                {isEdit && <EnkiEditItem messageObj={messageObj}  t={t} delCallBack={delCallBack} preEditCall={preEditCall} sctype={messageObj?.dao_id>0?'sc':''} /> } 
                <TimesItem times={messageObj?.times} t={t} />
            </div>
        </div>
    );
}

// checkDomain(messageObj?.actor_account,messageObj?.dao_id) &&