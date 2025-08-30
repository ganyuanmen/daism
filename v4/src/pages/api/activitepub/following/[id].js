import { getFollowees } from "../../../../lib/mysql/folllow";
import { createFollowees } from "../../../../lib/activity";


export default async function handler(req, res) {
    let name = req.query.id;

    if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let followers =await getFollowees({account:`${name}@${process.env.NEXT_PUBLIC_DOMAIN}`})
      let followersCollection = createFollowees(name,process.env.NEXT_PUBLIC_DOMAIN,followers)
      res.json(followersCollection);

    }
  }
  