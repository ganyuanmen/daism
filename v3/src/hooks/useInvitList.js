import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useInvitList({loginsiwe,did,refresh}) {
    const [data, setData] = useState({data:[],status:'pending'}); 
    useEffect(() => {
        let ignore = false;
        if(loginsiwe)
            client.get(`/api/getwithsession?did=${did}`,'getInviteDao').then(res =>{ 
                if (!ignore) 
                if (res.status===200) setData({data:res.data,status:'succeeded'})
                else setData({data:[],status:'failed',error:res.statusText})
            });
        return () => {ignore = true}
        
    }, [loginsiwe, did,refresh]);

    return data;
  }
