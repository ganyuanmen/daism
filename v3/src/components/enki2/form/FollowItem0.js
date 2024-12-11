
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiUnFollow from './EnKiUnFollow'
import {useSelector} from 'react-redux';
import { useEffect, useState } from "react";
import { client } from "../../../lib/api/client";

/**
 * 我关注谁的item
 * @messageObj 关注信息对象
 * @domain 本地域名
 * @locale zh/cn
 * @isEdit 是否显示 取关按钮
 */
export default function FollowItem0({messageObj,locale,isEdit}) {
    
    const[data,setData]=useState(messageObj)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

    useEffect(()=>{
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
                {isEdit && loginsiwe && <Col>
                    <EnKiUnFollow searObj={messageObj} />
                </Col>
                }
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

