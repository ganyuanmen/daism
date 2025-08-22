import { withIronSession } from 'next-iron-session';


export default function withSession(handler) {
  return withIronSession(handler, {
    password: 'YgyZ3GDw3LHZQKDhPmPDLRsjREVRXPr9',
    cookieName: 'DAISM_COOKIE',
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: 'lax',
      // maxAge: 15, // 2 小时
      maxAge: 60 * 60 * 2, // 2 小时
     // maxAge: 60 * 60 * 24, // 1天有效
    },
  });
}
