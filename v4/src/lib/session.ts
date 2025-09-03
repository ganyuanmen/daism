// lib/auth/session.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { z } from 'zod';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// 使用 Zod schema 定义 session 结构
const SessionSchema = z.object({
  did: z.string().min(1, 'DID is required'),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
});

export type SessionPayload = z.infer<typeof SessionSchema>;

// 创建 session token
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

// 验证 session token - 使用 Zod
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // 使用 Zod 验证 payload 结构
    const validationResult = SessionSchema.safeParse(payload);
    
    if (validationResult.success) {
      return validationResult.data;
    }
    
    console.error('Invalid session token payload:', validationResult.error);
    return null;
  } catch (error) {
    console.error('Session token verification failed:', error);
    return null;
  }
}

// 从 cookie 获取 session
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const session = await verifySessionToken(token);
    
    // 检查过期时间
    if (session && session.exp && session.exp < Date.now() / 1000) {
      console.log('Session token expired');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}