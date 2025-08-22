import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function usePrice() {
    const [data, setData] = useState({e2t:0,e2u:0,u2t:0,t2u:0,t2t:0}); 
    
    useEffect( () => {
            let ignore = false;
            client.get('/api/getData','getPrice').then(res =>{ 
                
                if (!ignore) 
                if (res.status===200 && res.data.length) setData({e2t:res.data[0].price,e2u:res.data[1].price,u2t:res.data[2].price,t2u:res.data[3].price,t2t:res.data[4].price})  
            });

            return () => {ignore = true}
        
    }, []);

    return data;
  }

