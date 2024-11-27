import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'

export default function useProDetail({daoId,delegator,createTime}) {
    const [data, setData] = useState([]); 

    useEffect(() => {
            let ignore = false;
            client.get(`/api/getData?daoId=${daoId}&delegator=${delegator}&createTime=${createTime}`,'getDaoVote').then(res =>{ 
              if (!ignore) 
              if (res.status===200)  setData(res.data) 
            });
            return () => {ignore = true}
        
    }, [daoId,delegator,createTime]);

    return data;
  }

