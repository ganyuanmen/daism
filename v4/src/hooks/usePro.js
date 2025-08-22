import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function usePro({daoId,did,refresh}) {
    const [data, setData] = useState([]); 

    useEffect(() => {
            let ignore = false;
            client.get(`/api/getData?appId=1&appType=1&daoId=${daoId}&did=${did}`,'getPro').then(res =>{ 
              if (!ignore) 
              if (res.status===200)  setData(res.data) 
            });
            return () => {ignore = true}
        
    }, [daoId,did,refresh]);

    return data;
  }

