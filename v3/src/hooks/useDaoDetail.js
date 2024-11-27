import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useDaoDetail({daoid}) {
    const [data, setData] = useState({data:[],status:'pending'}); 
    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?daoid=${daoid}`,'getMyDaoDetail').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({data:res.data,status:'succeeded'})
            else setData({data:[],status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [daoid]);

    return data;
  }
