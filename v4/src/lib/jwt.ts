
// import { jwtVerify } from 'jose';
// import { cookies } from 'next/headers';

// const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// export async function verifyAuthToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export async function getSessionFromCookie() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('auth-token')?.value;
    
//     if (!token) return null;
    
//     return await verifyAuthToken(token);
//   } catch {
//     return null;
//   }
// }