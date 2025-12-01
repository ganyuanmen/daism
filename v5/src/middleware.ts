import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifySessionToken } from './lib/auth/session';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const authToken = request.cookies.get('auth-token')?.value;

//   // 保护路由
//   const isProtectedRoute = pathname.startsWith('/dashboard') || 
//                           pathname.startsWith('/profile');

//   if (isProtectedRoute && authToken) {
//     const payload = await verifySessionToken(authToken);
    
//     if (!payload) {
//       // Token 无效或过期
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('redirect', pathname);
      
//       // 清除无效的 token
//       const response = NextResponse.redirect(loginUrl);
//       response.cookies.delete('auth-token');
//       return response;
//     }
    
//     // 检查 token 是否即将过期（可选）
//     if (payload.exp && payload.exp - Date.now() / 1000 < 3600) {

//     }
//   }

//   return NextResponse.next();
// }