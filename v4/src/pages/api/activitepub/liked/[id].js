
import { createLiked } from "../../../../lib/activity";


export default async function handler(req, res) {
    let name = req.query.id;

    if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let followersCollection = createLiked(name,process.env.LOCAL_DOMAIN,[])
      res.json(followersCollection);

    }
  }
  