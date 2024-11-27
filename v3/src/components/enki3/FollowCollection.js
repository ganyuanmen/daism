
import { useState,useEffect } from 'react';
import Loadding from '../Loadding'
import ShowErrorBar from "../ShowErrorBar";
import { client } from "../../lib/api/client";
import FollowItem0 from '../../components/enki2/form/FollowItem0'
import FollowItem1 from '../../components/enki2/form/FollowItem1'

/**
 * 关注和被关注列表
 * method: follow0 我关注谁，follow1 谁关注我
 */

export default function FollowCollection({t,method,account,domain,locale}) { 
  
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err,setErr]=useState("");
   
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setData([]);
            try {
                const res = await client.get(`/api/getData?account=${account}`,method);
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
    
    }, [account,method]);

    const footerdiv=()=>{
        if(isLoading) return <Loadding /> 
        else if(err) return <ShowErrorBar errStr={err} />
        else if(Array.isArray(data) && data.length==0) return <div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>
      
    }
    
    return (
        <div className="mt-3" style={{width:'100%'}}>
            <div>
                {method==='getFollow0' && Array.isArray(data) && data.map((obj)=> <FollowItem0 locale={locale} domain={domain} key={obj.id} messageObj={obj} t={t} />)}
             
                {method==='getFollow1' && Array.isArray(data) && data.map((obj)=> <FollowItem1 locale={locale} domain={domain} key={obj.id} messageObj={obj} t={t} />)}
            </div>

            {footerdiv()}
        </div>
    );
}




