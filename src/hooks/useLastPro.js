
import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useLastPro(daoid,did,refresh,setRefresh) {
    const [data, setData] = useState([]); 

    useEffect(() => {
            let ignore = false;
            if(refresh && did && daoid)
                client.get(`/api/getData?daoid=${daoid}&did=${did}`,'getLastPro').then(res =>{ 
                if (!ignore) 
                if (res.status===200) {
                    setData(res.data) 
                    setRefresh(false)
                }
                });
            return () => {ignore = true}
        
    }, [daoid,did,refresh,setRefresh]);

    return data;
  }

