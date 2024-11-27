import { useEffect,useState } from 'react';
import {client} from '../lib/api/client'


  export function useMessage({account,currentPageNum,refresh,whereType,v}) {
    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    //account 用于从其它域名拉取数据
    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?ps=12&pi=${currentPageNum}&w=${whereType}&v=${v}&account=${account}`,'messagePageData').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [currentPageNum,refresh,whereType,v,account]);

    return data;
  }

  
export function useReply({account,replyPageNum,refresh,pid,dao_id}) {

    const [data, setData] = useState({rows:[],pages:0,total:0,status:'pending',error:''}); 

    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?ps=10&pi=${replyPageNum}&pid=${pid}&account=${account}&dao_id=${dao_id}`,'replyPageData').then(res =>{ 
            if (!ignore) 
            if (res.status===200) setData({...res.data,status:'succeeded',error:''})
            else setData({rows:[],pages:0,total:0,status:'failed',error:res.statusText})
        });
        return () => {ignore = true}
        
    }, [replyPageNum,refresh,account]);

    return data;
  }

  export  function useFollow(actor,method) {
    const [data, setData] = useState({data:[],status:'pending'}); 
    useEffect(() => {
        let ignore = false;
        if(actor?.actor_account) 
            client.get(`/api/getData?account=${actor?.actor_account}`,method).then(res =>{  
                if (!ignore) 
                if (res.status===200) setData({data:res.data,status:'succeeded'})
                else setData({data:[],status:'failed',error:res.statusText})
            });
        
        return () => {ignore = true}
        
    }, [actor]);

    return data;
  }

  export  function useEipTypes() {
    const [data, setData] = useState({data:[],status:'pending'}); 
    useEffect(() => {
        let ignore = false;
      
        client.get(`/api/getData`,'getEipTypes').then(res =>{  
            if (!ignore) 
            if (res.status===200) setData({data:res.data,status:'succeeded'})
            else setData({data:[],status:'failed',error:res.statusText})
        });
        
        return () => {ignore = true}
        
    }, []);

    return data;
  }

  //点赞或收藏
export  function useGetHeartAndBook({account,pid,refresh,table,sctype}) {
    const [data, setData] = useState({}); 
    useEffect(() => {
        let ignore = false;
        client.get(`/api/getData?account=${account}&pid=${pid}&table=${table}&sctype=${sctype}`,'getHeartAndBook').then(res =>{  
            if (!ignore) 
                if (res.status===200) setData(res.data[0])
                else console.error(res.statusText)
        });
        return () => {ignore = true}
        
    }, [refresh]);
    return data;
}

