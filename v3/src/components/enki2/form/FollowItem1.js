
// import { Button } from "bootstrap";
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiFollow from "./EnKiFollow";
import {useSelector, useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useState,useEffect } from "react";
import { client } from "../../../lib/api/client";

/**
 * 谁关注我的item  
 */
export default function FollowItem1({messageObj,t,domain,locale,isFrom}) {
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    const[data,setData]=useState(messageObj)
    const [isFollow,setIsFollow]=useState(true); //是否已关注

    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    // const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

    useEffect(()=>{
        let ignore = false; 
        if(actor?.actor_account && actor?.actor_account.includes('@')){
            client.get(`/api/getData?actorAccount=${messageObj.account}&userAccount=${actor?.actor_account}`,'getFollow').then(res =>{ 
                if (!ignore) 
                    if (res.status===200) setIsFollow(!!res.data.id || domain!=actor.actor_account.split('@')[1])
                    else console.error(res.statusText)
            });
        }else{
            setIsFollow(true) //没登录，没注册，不允许关注
        }

        return () => {ignore = true}
    },[actor])

    useEffect(()=>{
        // 
        let ignore = false;
        client.get(`/api/getData?url=${messageObj.url}`,'getUserFromUrl').then(res =>{ 

            if (!ignore) 
                if (res.status===200) 
                    if(res?.data?.avatar)
                    {
                        if(res.data.avatar!==messageObj.avatar) 
                          setData({...messageObj,avatar:res.data.avatar})
                    }
          });
        return () => {ignore = true}
    },[messageObj])
 

    return (
        
            <Row className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember messageObj={data} isLocal={false} hw={32} locale={locale} /></Col>
                <Col>
                    {!isFrom && actor?.actor_account && !isFollow && <EnKiFollow  t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                    }
                </Col>
                
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

