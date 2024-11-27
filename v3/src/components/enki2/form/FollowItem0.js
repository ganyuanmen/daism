
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiUnFollow from './EnKiUnFollow'
import {useSelector, useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useEffect, useState } from "react";
import { client } from "../../../lib/api/client";

/**
 * 我关注谁的item
 */
export default function FollowItem0({messageObj,t,domain,locale,isFrom}) {
    const [isFollow,setIsFollow]=useState(true); //默认已关注，不显示按钮
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    const[data,setData]=useState(messageObj)

    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

    useEffect(()=>{
        if(actor?.actor_account && actor?.actor_account.includes('@')){
            setIsFollow(domain!=actor.actor_account.split('@')[1]); //不是注册在登录，设置已关注
        }

    },[actor])

    useEffect(()=>{
        // 
        let ignore = false;
        client.get(`/api/getData?url=${messageObj.url}`,'getUserFromUrl').then(res =>{ 

            if (!ignore) 
                if (res.status===200) 
                    if(res?.data?.avatar)
                    {
                      if(res.data.avatar!==messageObj.avatar)  {
                        setData({...messageObj,avatar:res.data.avatar});
                        }
                    }
          });
        return () => {ignore = true}
    },[messageObj])
 
    return (
        
            <Row className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember messageObj={data} isLocal={false} hw={32} locale={locale} /></Col>
                {!isFrom && loginsiwe && !isFollow && <Col>
                    <EnKiUnFollow t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                </Col>
                }
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

