import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useMyApps({did,refresh}) {
    const [data, setData] = useState({data:[],status:'pending'}); 
    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?did=${did}`,'getMyApps').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({data:res.data,status:'succeeded'})
            else setData({data:[],status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [did,refresh]);

    return data;
  }
