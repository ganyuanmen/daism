
import withSession from "../../../lib/session";
import { redis_remove } from "../../../lib/redis";
export default withSession(async (req, res) => {
    let sessionUser= req.session.get('user')
    if(sessionUser && sessionUser.did) redis_remove(sessionUser.did)
    req.session.destroy();
    res.status(200).end();
  
});