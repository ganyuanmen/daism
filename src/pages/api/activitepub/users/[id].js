
import { getUser } from "../../../../lib/mysql/user";
import { createActor } from "../../../../lib/activity";



export default async function handler(req, res) {

    let name = req.query.id;
    if (!name) return res.status(400).send('Bad request.')
    
    let localUser = await getUser('account',`${name}@${process.env.LOCAL_DOMAIN}`,'account,pubkey,avatar,dao_id,actor_desc,dao_id')
    if (!localUser['account']) return res.status(404).send(`No record found for ${name}.`)
    
    if(req.headers['accept'] && req.headers['accept'].toLowerCase().startsWith('application/activity'))
    {

        let rejson=createActor(name,process.env.LOCAL_DOMAIN,localUser)
        if(rejson.icon.mediaType==='image/svg') rejson.icon.mediaType='image/svg+xml'
        res.setHeader("connection", "close").setHeader('content-type', 'application/activity+json; charset=utf-8').status(200).send(JSON.stringify(rejson));
    }
    else
    { 
        res.redirect(`/communities/daoinfo/nomenu/${localUser['dao_id']}`)
    }

  }
  