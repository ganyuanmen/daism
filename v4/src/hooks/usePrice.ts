import { useEffect, useState } from 'react';

interface GetDataType {
  price: string | number;
}

interface PriceData {
  e2t: number;
  e2u: number;
  u2t: number;
  t2u: number;
  t2t: number;
}

export default function usePrice() {
  const [data, setData] = useState<PriceData>({e2t: 0, e2u: 0, u2t: 0, t2u: 0, t2t: 0});

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch('/api/getData', {
          signal: controller.signal,
          headers: { 'x-method': 'getPrice' }
        });
        
        if (res.ok) {
          const responseData = await res.json() as GetDataType[];
          
          setData({
            e2t: parseFloat(String(responseData[0]?.price ?? 0)) || 0,
            e2u: parseFloat(String(responseData[1]?.price ?? 0)) || 0,
            u2t: parseFloat(String(responseData[2]?.price ?? 0)) || 0,
            t2u: parseFloat(String(responseData[3]?.price ?? 0)) || 0,
            t2t: parseFloat(String(responseData[4]?.price ?? 0)) || 0
          });
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Fetch error:', err);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  return data;
}