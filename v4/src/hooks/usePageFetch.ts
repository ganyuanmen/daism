'use client'
import { useEffect, useState } from 'react';

 type FetchStatus = 'loading' | 'succeeded' | 'failed';

export interface PageDataType<T>{
    rows: T; total: number; pages: number
}

export interface FetchResult<T> extends PageDataType<T> {
    status: FetchStatus;
    error?: string;
}

/**
 * 通用异步请求 Hook
 * @param url 请求地址
 * @param deps 依赖数组，url 或参数变化时重新请求
 * @param initialData 初始数据
 */
export function usePageFetch<T>(url: string,xmethod:string, deps: any[] = [], initialData: T | null = null) {
  const [result, setResult] = useState<FetchResult<T>>({
    rows: initialData as T,
    pages:0,
    total:0,
    status: 'loading',
  });

  useEffect(() => {

    if (!url || !xmethod) {
        setResult({ rows: initialData as T, status: 'failed', error: 'No account', pages:0,total:0 });
        return;
    }

    const controller = new AbortController();
    setResult({ rows: initialData as T, status: 'loading', pages:0,total:0, });

    const fetchData = async () => {
        try {
          const res = await fetch(url, { signal: controller.signal,headers:{'x-method':xmethod} });
          if (!res.ok) {
            setResult({ rows: initialData as T, status: 'failed', error: res.statusText || 'Fetch error', pages:0,total:0 });
          } else {
            const data = await res.json() as  PageDataType<T>;
            setResult({ ...data, status: 'succeeded', });
          }
        } catch (err: any) {
          if (err.name === 'AbortError') return; // 请求被取消
          setResult({ rows: initialData as T, status: 'failed', error: err.message || 'Request failed',pages:0,total:0 });
        }
      };
      

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, ...deps,xmethod]);

  return result;
}
