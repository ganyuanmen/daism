import { useState, useEffect } from 'react';
import Loadding from '../Loadding';
import ShowErrorBar from "../ShowErrorBar";
import MyFollow from '../enki2/form/MyFollow';
import FollowMe from '../enki2/form/FollowMe';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store/store';
import { fetchJson } from '@/lib/utils/fetcher';


// 定义组件 props 类型
interface FollowCollectionProps {
  method: 'getFollow0' | 'getFollow1';
}

/**
 * 关注和被关注列表
 * @method: follow0 我关注谁，follow1 谁关注我
 */
export default function FollowCollection({ method }: FollowCollectionProps) {
  const [data, setData] = useState<ActorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const actor = useSelector((state: RootState) => state.valueData.actor);  // siwe登录信息
  const t = useTranslations('ff');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setData([]);
      try {
        const resData = await fetchJson<ActorInfo[]>(
          `/api/getData?account=${actor?.actor_account}`,
          { headers: { 'x-method': method } }
        );
        
        if (resData) {
          setData(resData);
        } else {
          setErr("Failed to read data from the server");
        }
      } catch (error: any) {
        console.error(error);
        setErr(error?.message || "Failed to read data from the server");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    return () => {
      setData([]);
    };
  }, [actor, method]);

  const footerdiv = () => {
    if (isLoading) return <Loadding />;
    else if (err) return <ShowErrorBar errStr={err} />;
    else if (Array.isArray(data) && data.length === 0) return <div style={{ textAlign: 'center' }}>---{t('emprtyData')}---</div>;
    
    return null;
  };
  
  return (
    <div className="mt-3" style={{ width: '100%' }}>
      <div>
        {method === 'getFollow0' && Array.isArray(data) && data.map((obj) => 
          <MyFollow key={obj.id} followObj={obj} isEdit={true} />
        )}
        
        {method === 'getFollow1' && Array.isArray(data) && data.map((obj) => 
          <FollowMe key={obj.id} followObj={obj} isEdit={true} />
        )}
      </div>

      {footerdiv()}
    </div>
  );
}