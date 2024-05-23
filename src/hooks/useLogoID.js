import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useLogoID(daoid,loadding,setLoadding) {
    const [data, setData] = useState([]); 

    useEffect(() => {
            let ignore = false;
            if(loadding)
                client.get(`/api/getData?daoid=${daoid}`,'getAddLogo').then(res =>{ 
                if (!ignore) 
                if (res.status===200) {
                    setData(res.data) 
                    setLoadding(false)
                }
                });
            return () => {ignore = true}
        
    }, [daoid,loadding,setLoadding]);

    return data;
  }

