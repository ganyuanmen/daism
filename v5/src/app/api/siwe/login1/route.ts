// app/api/auth/siwe-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/utils';
import { rateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import {encrypt} from '@/lib/cryp'

function getRandom4Code() {
  return crypto.randomInt(0, 10000)
    .toString()
    .padStart(4, '0');
}

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
   

    const { did1 } = body;
    const code=getRandom4Code();


    const token = encrypt({
      did1,
      ip: clientIp,
      code,
      userAgent: req.headers.get('user-agent')
    })
    

    
    // 设置 cookie 并返回响应
    const response = NextResponse.json({
     token

    });

    // response.cookies.set('auth-token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 10 * 60 ,
    // });

  

    return response;

  } catch (error: any) {
    console.error('SIWE login error:', error);
    return NextResponse.json(
      { errMsg: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}