
import { getUser } from "../../../../lib/mysql/user";
import { createActor } from "../../../../lib/activity";



export default async function handler(req, res) {

    let name = req.query.id.toLowerCase();
    if (!name) return res.status(400).send('Bad request.')
    
    let localUser = await getUser('actor_account',`${name}@${process.env.NEXT_PUBLIC_DOMAIN}`,'actor_account,pubkey,avatar,dao_id,id,actor_desc,manager')
    if (!localUser['actor_account']) return res.status(404).send(`No record found for ${name}.`)

    if((req.headers['accept'] && req.headers['accept'].toLowerCase().startsWith('application/activity'))||(req.headers['content-type'] && req.headers['content-type'].toLowerCase().startsWith('application/activity')))
    {

        let rejson=createActor(name,process.env.NEXT_PUBLIC_DOMAIN,localUser)
        if(rejson.icon.mediaType==='image/svg') rejson.icon.mediaType='image/svg+xml'
        res.setHeader("connection", "close").setHeader('content-type', 'application/activity+json; charset=utf-8').status(200).send(JSON.stringify(rejson));
    }
    else
    { 
        res.redirect(`/${name}`); 
        // if(localUser.dao_id>0)
        //     res.redirect(`/smartcommons/daoinfo/${localUser['dao_id']}`);
        // else 
        //     res.redirect(`/smartcommons/actor/${encodeURIComponent(localUser['actor_account'])}`);

    }

  }
  