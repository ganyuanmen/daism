import { withIronSession } from 'next-iron-session';


export default function withSession(handler) {
  return withIronSession(handler, {
    password: 'YgyZ3GDw3LHZQKDhPmPDLRsjREVRXPr9',
    cookieName: 'DAISM_COOKIE',
    cookieOptions: {
      secure:false,
    },
  });
}
