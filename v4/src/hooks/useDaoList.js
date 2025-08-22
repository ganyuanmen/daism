import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useDaoList({currentPageNum, orderField, searchText, orderType}) {
    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?ps=10&pi=${currentPageNum}&orderField=${orderField}&orderType=${orderType}&searchText=${searchText}`,'getDaosData').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [currentPageNum, orderField, searchText, orderType]);

    return data;
  }
