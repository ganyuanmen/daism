
// import { Button } from "bootstrap";
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiFollow from "./EnKiFollow";
import {useSelector} from 'react-redux';
import { useState,useEffect } from "react";
import { client } from "../../../lib/api/client";

/**
* 谁关注我的item   
* @messageObj  关注者信息
 * @locale zh/cn
 * @isEdit 显示关注按钮
 */
export default function FollowItem1({messageObj,locale,isEdit}) {
    
    const[data,setData]=useState(messageObj)
    const actor = useSelector((state) => state.valueData.actor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const myFollow = useSelector((state) => state.valueData.myFollow)

    const checkFollow=(obj)=>{
        const account=obj.actor_account || obj.account;
        const item=myFollow.find(accountStr=>accountStr===account);
        return !!item

    }
 
    //获取关注者当前的头像
    useEffect(()=>{
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
                    {isEdit && loginsiwe && actor?.actor_account && !checkFollow(messageObj) && <EnKiFollow searObj={messageObj} showText={true} />
                    }
                </Col>
                
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

