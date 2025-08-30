// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // 清除 auth token
    response.cookies.set('auth-token', '', {
      maxAge: 0,
    });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}