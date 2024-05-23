import { getUser } from "../../../lib/mysql/user";
import { createWebfinger } from "../../../lib/activity";

export default async function handler(req, res) {
    let resource = req.query.resource;
    if (!resource || !resource.includes('@') || !resource.toLowerCase().startsWith('acct:')) {
      return res.status(400).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    }
    else {
      const account= resource.replace('acct:','').toLowerCase()
      const [userName,domain] =account.split('@');
      
      if  (domain!==process.env.LOCAL_DOMAIN ) {
        return res.status(400).send('Requested user is not from this domain')
      }

      let user = await getUser('account',account,'account,dao_id,avatar')
      if (!user.account) {
        return res.status(404).send(`No record found for ${account}.`);
      }
      else {
        let reJson=createWebfinger(userName,domain,user.dao_id,user.avatar)
        res.status(200).json(reJson);
      }
    }
  }
  