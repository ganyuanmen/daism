'use client'
import { useEffect, useState } from 'react';

export type FetchStatus = 'loading' | 'succeeded' | 'failed';

export interface FetchResult<T> {
  data: T;
  status: FetchStatus;
  error?: string;
}

/**
 * 通用异步请求 Hook
 * @param url 请求地址
 * @param deps 依赖数组，url 或参数变化时重新请求
 * @param initialData 初始数据
 */
// export function useFetch<T>(url: string,xmethod:string, deps: any[] = [], initialData: T | null = null) {
  export function useFetch<T>(
    url: string,
    xmethod: string,
    deps: any[] = [],
    initialData: T | null = null
  ): FetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({
    data: initialData as T,
    status: 'loading',
  });

  useEffect(() => {

    if (!url || !xmethod) {
        setResult({ data: initialData as T, status: 'failed', error: 'No account' });
        return;
    }

    const controller = new AbortController();
    setResult({ data: initialData as T, status: 'loading' });

    const fetchData = async () => {
        try {
          const res = await fetch(url, { signal: controller.signal,headers:{'x-method':xmethod} });
          if (!res.ok) {
            setResult({ data: initialData as T, status: 'failed', error: res.statusText || 'Fetch error' });
          } else {
            const data = await res.json() as T;
            setResult({ data, status: 'succeeded' });
          }
        } catch (err: any) {
          if (err.name === 'AbortError') return; // 请求被取消
          setResult({ data: initialData as T, status: 'failed', error: err.message || 'Request failed' });
        }
      };
      

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, ...deps,xmethod]);

  return result;
}
