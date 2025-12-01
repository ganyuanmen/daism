// lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  ip: string, 
  action: string, 
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1分钟
): Promise<boolean> {
  const key = `${ip}:${action}`;
  const now = Date.now();
  
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    // 新的时间窗口
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }
  
  // 增加计数
  existing.count += 1;
  rateLimitMap.set(key, existing);
  
  // 检查是否超过限制
  return existing.count > maxAttempts;
}