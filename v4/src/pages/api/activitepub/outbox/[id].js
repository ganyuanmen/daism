
export default async function handler(req, res) {
    let name = req.query.id;

    if (!name) {return res.status(400).send('Bad request.');}
    else {
      let outboxCollection = {
        "type":"OrderedCollection",
        "totalItems":0,
        "id":`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/activitepub/outbox/${name}`,
        "first": {
          "type":"OrderedCollectionPage",
          "totalItems":0,
          "partOf":`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/activitepub/outbox/${name}`,
          "orderedItems": [],
          "id":`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/activitepub/outbox/${name}?page=1`
        },
        "@context":["https://www.w3.org/ns/activitystreams"]
      };

      res.status(200).json(outboxCollection);
        
    }
  }
  