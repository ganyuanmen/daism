"use client";
import { useEffect, useState } from "react";

export type HonorItem = { tokensvg: string };

// 模块级缓存
const honorCache = new Map<string, Promise<HonorItem[]>>();

export function useHonorData(manager?: string, daoId?: number) {
  const [honor, setHonor] = useState<HonorItem[]>([]);

  useEffect(() => {
    if (!manager || daoId !== 0) return;

    let aborted = false;

    const fetchHonor = async () => {
      try {
        if (!honorCache.has(manager)) {
          // 首次请求，存一个 promise 进去
          const promise = fetch(`/api/getData?did=${manager}`, {
            headers: { "x-method": "getMynft" },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Network error");
              return res.json();
            })
            .then((data) => {
              if (!Array.isArray(data)) return [];
              return data.map((item: any) => ({ tokensvg: item.tokensvg }));
            });

          honorCache.set(manager, promise);
        }

        const result = await honorCache.get(manager)!;
        if (!aborted) setHonor(result);
      } catch (err) {
        console.error("fetch honor failed", err);
        honorCache.delete(manager); // 下次还能重试
      }
    };

    fetchHonor();

    return () => {
      aborted = true;
    };
  }, [manager, daoId]);

  return honor;
}
