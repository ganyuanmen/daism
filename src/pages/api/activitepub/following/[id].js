import { getFollowees } from "../../../../lib/mysql/folllow";
import { createFollowees } from "../../../../lib/activity";


export default async function handler(req, res) {
    let name = req.query.id;

    if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let followers =await getFollowees(`${name}@${process.env.LOCAL_DOMAIN}`)
      let followersCollection = createFollowees(name,process.env.LOCAL_DOMAIN,followers)
      res.json(followersCollection);

    }
  }
  