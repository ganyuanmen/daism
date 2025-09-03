// import { fetchJson } from '@/lib/utils/fetcher';
// import { useEffect, useState, useCallback } from 'react';

// export function useMessageFetch(fetchWhere: FetchWhere) {
//   const [data, setData] = useState<EnkiMessType[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [err, setErr] = useState<string>('');
//   const [hasMore, setHasMore] = useState(false);
//   const [pageNum, setPageNum] = useState(0);

  
//   const fetchData = useCallback(async () => {
//     setIsLoading(true);

//     if (fetchWhere.currentPageNum === 0) setData([]);

//     try {
//       const resData = await fetchJson<EnkiMessType[]>(
//         `/api/getData?pi=${fetchWhere.currentPageNum}&menutype=${
//           fetchWhere.menutype
//         }&daoid=${fetchWhere.daoid ?? ''}&actorid=${
//           fetchWhere.actorid ?? ''
//         }&w=${fetchWhere.where ?? ''}&order=${
//           fetchWhere.order ?? ''
//         }&eventnum=${fetchWhere.eventnum ?? ''}&account=${
//           fetchWhere.account ?? ''
//         }&v=${fetchWhere.v ?? ''}`,
//         { headers: { 'x-method': 'messagePageData' } }
//       );

//       if (resData) {
//         setHasMore(resData.length > 0);
//         setPageNum((pageNum) => pageNum + 1);

//         if (fetchWhere.currentPageNum === 0) setData(resData);
//         else setData((prev) => [...prev, ...resData]);

//         setErr('');
//       } else {
//         setHasMore(false);
//         setErr(
//           (resData as any)?.errMsg || 'Failed to read data from the server'
//         );
//       }
//     } catch (error: any) {
//       console.error(error);
//       setHasMore(false);
//       setErr(error?.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [fetchWhere]);

  
//   useEffect(() => {
//     if (isLoading) return; // 防止重复加载

//     if (fetchWhere.currentPageNum > -1) {
//       if (fetchWhere.eventnum === 8) fetchData();
//       else if (
//         fetchWhere.menutype === 3 &&
//         (fetchWhere.eventnum === 5 || fetchWhere.account)
//       )
//         fetchData();
//       else if (
//         fetchWhere.menutype === 1 &&
//         (fetchWhere.daoid || (fetchWhere.v ?? 0) > 0)
//       )
//         fetchData();
//       else if (fetchWhere.menutype === 2) fetchData();
//     }
//   }, [fetchWhere, fetchData, isLoading]);

//   return { data, isLoading, err, hasMore, pageNum, refetch: fetchData };
// }

import { fetchJson } from '@/lib/utils/fetcher';
import { useEffect, useState, useCallback } from 'react';

export function useMessageFetch(fetchWhere: FetchWhere) {
  const [data, setData] = useState<EnkiMessType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [pageNum, setPageNum] = useState(0); // 独立分页状态

  // fetchData 不再依赖 fetchWhere 内可变字段，接受 pageNum 参数
  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      if (page === 0) setData([]);

      try {
        const resData = await fetchJson<EnkiMessType[]>(
          `/api/getData?pi=${page}&menutype=${fetchWhere.menutype}&daoid=${fetchWhere.daoid ?? ''}&actorid=${fetchWhere.actorid ?? ''}&w=${fetchWhere.where ?? ''}&order=${fetchWhere.order ?? ''}&eventnum=${fetchWhere.eventnum ?? ''}&account=${fetchWhere.account ?? ''}&v=${fetchWhere.v ?? ''}`,
          { headers: { 'x-method': 'messagePageData' } }
        );

        if (resData) {
          setHasMore(resData.length > 0);
          if (page === 0) setData(resData);
          else setData((prev) => [...prev, ...resData]);
          setErr('');
          setPageNum((prev) => prev + 1);
        } else {
          setHasMore(false);
          setErr((resData as any)?.errMsg || 'Failed to read data from the server');
        }
      } catch (error: any) {
        console.error(error);
        setHasMore(false);
        setErr(error?.message || 'Request failed');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWhere] // 这里可以保留 fetchWhere，避免每次都触发 fetchData
  );

  // useEffect 只在 fetchWhere 变化或者 pageNum=0 时触发初始加载
  useEffect(() => {
    // 初始加载第一页
    fetchData(0);
  }, [
    fetchWhere.menutype,
    fetchWhere.daoid,
    fetchWhere.actorid,
    fetchWhere.where,
    fetchWhere.order,
    fetchWhere.eventnum,
    fetchWhere.account,
    fetchWhere.v,
    fetchData
  ]);

  // 分页加载，外部触发
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) fetchData(pageNum);
  }, [isLoading, hasMore, fetchData, pageNum]);

  return { data, isLoading, err, hasMore, pageNum, refetch: () => fetchData(0), loadMore, setData };
}
