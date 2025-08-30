
import { NextResponse } from 'next/server';
import { generateNonce } from 'siwe';
// import { cookies } from 'next/headers';

export async function GET() {
  try {
    const nonce = generateNonce();
    // const cookieStore = await cookies();

    const response = NextResponse.json({ nonce });
    
    // 设置 nonce cookie
    response.cookies.set('nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5分钟有效期
    });

    return response;

  } catch (error: any) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}