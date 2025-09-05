'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';

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

// 全局缓存池
const cache = new Map<string, PageDataType<any>>();

/**
 * 通用分页请求 Hook（带缓存）
 */
export function usePageFetch<T>(
  url: string,
  xmethod: string,
  deps: any[] = [],
  initialData: T | null = null
): FetchResult<T> & { refetch: () => void; clearCache: () => void } {
  const [result, setResult] = useState<FetchResult<T>>({
    rows: initialData as T,
    pages: 0,
    total: 0,
    status: 'loading',
  });

  const cacheKey = `${url}::${xmethod}`;

  const fetchData = useCallback(
    async (signal?: AbortSignal, useCache = true) => {
      if (useCache && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)! as PageDataType<T>;
        setResult({ ...cached, status: 'succeeded' });
        return;
      }

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
          cache.set(cacheKey, data);
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
    [url, xmethod, initialData, cacheKey]
  );

  // ✅ 用 useMemo 把外部 deps 合并成一个 key
  const depKey = useMemo(() => JSON.stringify(deps), [deps]);

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
  }, [fetchData, url, xmethod, initialData, depKey]); 
  // ✅ 依赖数组是字面量，不会再警告

  return {
    ...result,
    refetch: () => fetchData(undefined, false),
    clearCache: () => cache.delete(cacheKey),
  };
}
