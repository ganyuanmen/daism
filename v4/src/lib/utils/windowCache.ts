export function setCache(key: string, value: any, ttlSeconds = 60) {
    if (!window.__MY_CACHE__) window.__MY_CACHE__ = {};
    const expire = Date.now() + ttlSeconds * 1000;
    window.__MY_CACHE__[key] = { value, expire };
  }
  
 export function getCache(key: string) {
    if (!window.__MY_CACHE__) return null;
    const cached = window.__MY_CACHE__[key];
    if (!cached) return null;
    if (cached.expire < Date.now()) {
      delete window.__MY_CACHE__[key];
      return null;
    }
    return cached.value;
  }
  