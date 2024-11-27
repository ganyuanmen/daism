import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useInfoList({currentPageNum, daoid,method,pages}) {
    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    useEffect(() => {
        let ignore = false;
        if(daoid)
        client.get(`/api/getData?ps=${pages}&pi=${currentPageNum}&daoid=${daoid}`,method).then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [currentPageNum, daoid]);

    return data;
  }
