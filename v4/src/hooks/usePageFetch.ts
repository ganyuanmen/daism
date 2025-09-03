'use client';
import { useEffect, useState, useCallback } from 'react';

export type FetchStatus = 'loading' | 'succeeded' | 'failed';

export interface PageDataType<T> {
  rows: T;
  total: number;
  pages: number;
}

export interface FetchResult<T> extends PageDataType<T> {
  status: FetchStatus;
  error?: string;
}

/**
 * 通用分页请求 Hook
 * @param url 请求地址
 * @param xmethod 请求头里的 x-method
 * @param deps 依赖数组，变化时自动重新请求
 * @param initialData 初始数据
 */
export function usePageFetch<T>(
  url: string,
  xmethod: string,
  deps: any[] = [],
  initialData: T | null = null
): FetchResult<T> & { refetch: () => void } {
  const [result, setResult] = useState<FetchResult<T>>({
    rows: initialData as T,
    pages: 0,
    total: 0,
    status: 'loading',
  });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(url, {
          signal,
          headers: { 'x-method': xmethod },
        });

        if (!res.ok) {
          setResult({
            rows: initialData as T,
            pages: 0,
            total: 0,
            status: 'failed',
            error: res.statusText || 'Fetch error',
          });
        } else {
          const data = (await res.json()) as PageDataType<T>;
          setResult({ ...data, status: 'succeeded' });
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setResult({
          rows: initialData as T,
          pages: 0,
          total: 0,
          status: 'failed',
          error: err.message || 'Request failed',
        });
      }
    },
    [url, xmethod, initialData]
  );

  useEffect(() => {
    if (!url || !xmethod) {
      setResult({
        rows: initialData as T,
        pages: 0,
        total: 0,
        status: 'failed',
        error: 'No account',
      });
      return;
    }

    const controller = new AbortController();
    setResult({
      rows: initialData as T,
      pages: 0,
      total: 0,
      status: 'loading',
    });
    fetchData(controller.signal);

    return () => controller.abort();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...deps]);

  return { ...result, refetch: () => fetchData() };
}
