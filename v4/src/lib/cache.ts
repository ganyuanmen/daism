import { getInboxFromUrl, getLocalInboxFromUrl } from "./mysql/message";

// lib/cache.ts
const actorCache = new Map<string, { actor: ActorInfo; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 35; // 35分钟

export async function getCachedActor(actorUrl: string): Promise<ActorInfo | null> {
  const now = Date.now();
  const cached = actorCache.get(actorUrl);
  
  // 检查缓存是否有效
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.actor;
  }
  
  try {
    let  actor=await getLocalInboxFromUrl(actorUrl); //先找本地
    if(!actor.inbox) actor = await getInboxFromUrl(actorUrl); //远程找
    actorCache.set(actorUrl, { actor, timestamp: now });
    return actor;
  } catch (error) {
    console.error("Error fetching actor:", error);
    return null;
  }
}

// 清理过期的缓存项
export function cleanupCache(): void {
  const now = Date.now();
  for (const [key, value] of actorCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      actorCache.delete(key);
    }
  }
}

// 定时清理（可选）
setInterval(cleanupCache, 1000 * 60 * 10); // 每10分钟清理一次