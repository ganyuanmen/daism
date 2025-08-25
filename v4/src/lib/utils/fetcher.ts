
export async function fetchJson<T = any>(
    url: string,
    options?: RequestInit
  ): Promise<T|null> {
    const res = await fetch(url, options);
  
    if (!res.ok) {
      console.error(`Fetch ${url} failed with status: ${res.status}`);
      return null;
    }
  
    const data: unknown = await res.json();
  
    // 简单类型检查，可按需扩展
    if (data === null || data === undefined) {
     console.error(`Response data is null or undefined ${url}`);
     return null;
    }
  
    return data as T;
  }
  