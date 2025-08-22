
import { useState,useEffect } from 'react';
import Loadding from '../Loadding'
import ShowErrorBar from "../ShowErrorBar";
import { client } from "../../lib/api/client";
import FollowItem0 from '../enki2/form/MyFollow'
import FollowItem1 from '../enki2/form/FollowMe'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';
/**
 * 关注和被关注列表
 * @method: follow0 我关注谁，follow1 谁关注我
 * @domain 本地域名
 * @locale zh/cn
 */

export default function FollowCollection({method,locale}) { 
  
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err,setErr]=useState("");
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const t = useTranslations('ff')
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setData([]);
            try {
                const res = await client.get(`/api/getData?account=${actor?.actor_account}`,method);
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setData(res.data);
                        setErr('');
                    } else { 
                        setErr(res?.data?.errMsg || "Failed to read data from the server");
                    }
                } else 
                {
                    setErr(res?.statusText || res?.data?.errMsg );
                }

            } catch (error) {
                console.error(error);
                setErr(error?.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();

        return ()=>{setData([])}
    
    }, [actor,method]);

    const footerdiv=()=>{
        if(isLoading) return <Loadding /> 
        else if(err) return <ShowErrorBar errStr={err} />
        else if(Array.isArray(data) && data.length==0) return <div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>
      
    }
    
    return (
        <div className="mt-3" style={{width:'100%'}}>
            <div>
                {method==='getFollow0' && Array.isArray(data) && data.map((obj)=> <FollowItem0 key={obj.id} locale={locale} messageObj={obj} isEdit={true} />)}
             
                {method==='getFollow1' && Array.isArray(data) && data.map((obj)=> <FollowItem1 locale={locale} key={obj.id} messageObj={obj} isEdit={true} />)}
            </div>

            {footerdiv()}
        </div>
    );
}




