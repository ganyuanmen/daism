import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

//st 1 已完成 2 过期
export default function useProData({currentPageNum, did,st}) {
    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?ps=5&pi=${currentPageNum}&did=${did}&st=${st}&t=${new Date().getTime()}`,'getProsData').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [currentPageNum, did,st]);

    return data;
  }
