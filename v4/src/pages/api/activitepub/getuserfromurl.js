import { getUser } from "../../../lib/mysql/user";
import { createWebfinger } from "../../../lib/activity";

export default async function handler(req, res) {
    let resource = req.query.resource;
    if (!resource || !resource.includes('@') || !resource.toLowerCase().startsWith('acct:')) {
      return res.status(400).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    }
    else {
      const account= resource.replace('acct:','').toLowerCase()
      // const account='gym@daism.io'
      const [userName,domain] =account.split('@');
      
      if  (domain!==process.env.NEXT_PUBLIC_DOMAIN ) {
        return res.status(400).send('Requested user is not from this domain')
      }

      let user = await getUser('actor_account',account,'id,avatar')
      if (!user.id) {
        return res.status(404).send(`No record found for ${account}.`);
      }
      else {
        let reJson=createWebfinger(userName,domain,user.id,user.avatar)
        res.status(200).json(reJson);
      }
    }
  }
  