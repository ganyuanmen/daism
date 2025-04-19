import withSession from "../../../lib/session";
import { SiweMessage } from "siwe";
import { getActor } from "../../../lib/mysql/user";
import { getJsonArray } from "../../../lib/mysql/common";
// import { redis_set } from "../../../lib/redis";

export default withSession(async (req, res) => {
  if (req.method === 'POST') {
    if (!req.body.message) {res.status(422).json({ errMsg: 'Expected prepareMessage object as body.' });return;}
    const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);
    const nonce = req.session.get('nonceToken');
    if (siweMessage.nonce!==nonce) {res.status(422).json({errMsg: `Invalid nonce.`});return;}
    try {
        await siweMessage.verify({ signature });
        req.session.set('user', {did:siweMessage.address })
        await req.session.save()
        // await redis_set(siweMessage.address,process.env.LOCAL_DOMAIN,1800);
        const _actor=await getActor(siweMessage.address)
        res.status(200).json({
          daoActor:await getJsonArray('daoactor',[siweMessage.address.toLocaleLowerCase()]), //dao帐号列表
          actor:_actor,    //个人帐号
          myFollow:await getJsonArray('getFollow',[_actor?.actor_account.toLocaleLowerCase()]), //dao帐号列表
      }); 
    } catch(e) {
      res.status(500).json({errMsg: e.message })
    }

  } else {
    res.status(405).end(); // Method Not Allowed
  }
});
