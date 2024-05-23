import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useTemplate({currentPageNum}) {
    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?ps=10&pi=${currentPageNum}`,'getTemplate').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [currentPageNum]);

    return data;
  }



