 import { generateNonce } from "siwe"
import withSession  from "../../../lib/session";

export default withSession(async (req, res) => {
    let token = generateNonce()
    req.session.set('nonceToken',  token )
    await req.session.save()
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(token)
  
})

// pages/api/login.ts

// import { withIronSessionApiRoute } from "iron-session/next";

// export default withIronSessionApiRoute(
//   async function loginRoute(req, res) {
//     let token = generateNonce()
//     req.session.nonceToken =token

//     await req.session.save();
//     res.setHeader('Content-Type', 'text/plain')
//     res.status(200).send(token)
//   },
//   {
//     cookieName: "myapp_cookiename",
//     password: "complex_password_at_least_32_characters_long",
//     // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
//     cookieOptions: {
//       secure: false
//     }
//   }
// );
