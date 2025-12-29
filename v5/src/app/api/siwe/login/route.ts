// app/api/auth/siwe-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { getActor } from '@/lib/mysql/user';
import { getJsonArray } from '@/lib/mysql/common';
import { getClientIp } from '@/lib/utils';
import { rateLimit } from '@/lib/rate-limit';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
    // 速率限制检查
    if (clientIp) {
      const isRateLimited = await rateLimit(clientIp, 'login', 5); // 5次/分钟
      if (isRateLimited) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
    }
  try {
    const body = await req.json();
    if (!body.message) {
      return NextResponse.json(
        { errMsg: 'Expected prepareMessage object as body.' },
        { status: 422 }
      );
    }

    const { message, signature } = body;
    const siweMessage = new SiweMessage(message);

    // 使用 await 获取 cookies
    const cookieStore = await cookies();
    const nonce = cookieStore.get('nonce')?.value;
    
    if (siweMessage.nonce !== nonce) {
      return NextResponse.json(
        { errMsg: 'Invalid nonce.' },
        { status: 422 }
      );
    }

    // // 验证签名
    // const verificationResult = await siweMessage.verify({ signature });
    // if (!verificationResult.success) {
    //   return NextResponse.json(
    //     { errMsg: 'Signature verification failed.' },
    //     { status: 401 }
    //   );
    // }

    // 创建 JWT token
    const token = await new SignJWT({
      did: siweMessage.address,
      ip: clientIp,
      userAgent: req.headers.get('user-agent')
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    // 获取用户数据
    const _actor = await getActor(siweMessage.address);
    const daoActor = await getJsonArray('daoactor', [siweMessage.address.toLowerCase()]);
    const myFollow = _actor ? await getJsonArray('getFollow', [_actor.actor_account.toLowerCase()]) : [];

    // 设置 cookie 并返回响应
    const response = NextResponse.json({
      daoActor,
      actor: _actor,
      myFollow
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 清除 nonce cookie
    response.cookies.set('nonce', '', {
      maxAge: 0,
    });

    return response;

  } catch (error: any) {
    console.error('SIWE login error:', error);
    return NextResponse.json(
      { errMsg: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}