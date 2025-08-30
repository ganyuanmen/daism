import { getFollowers } from "../../../../lib/mysql/folllow";
import { createFollowers } from "../../../../lib/activity";


export default async function handler(req, res) {
    let name = req.query.id;

    if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let followers =await getFollowers({account:`${name}@${process.env.NEXT_PUBLIC_DOMAIN}`})
      let followersCollection = createFollowers(name,process.env.NEXT_PUBLIC_DOMAIN,followers)
      res.json(followersCollection);
    }
  }
  