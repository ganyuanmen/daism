import withSession from "../../lib/session";
import formidable from 'formidable';
const fs = require('node:fs');
import {getClientIp} from '../../lib/utils'
import { getData,execute } from "../../lib/mysql/common";

export const config = {
  api: {
    sizeLimit: '10mb',
    bodyParser: false,
  },
};

export default withSession(async (req, res) => {
  if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
  const sessionUser = req.session.get('user');
  const currentIp = getClientIp(req);
  if (!sessionUser || sessionUser.ip !== currentIp || sessionUser.userAgent !== req.headers['user-agent'])
       return res.status(406).json({errMsg:'No wallet signature login'})
  // if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
  try {  
    const form = formidable({})
    const [fields, files] = await form.parse(req);
    const file = files.jsonFile[0]; 
    const data = await fs.promises.readFile(file.filepath, { encoding: 'utf8' });
    fs.unlink(file.filepath, (err) => {if (err) console.error('delete file error:', err)})
    const jsonData = JSON.parse(data);
    let rows=await getData("select dao_id,domain,actor_name,avatar,actor_url,actor_inbox,actor_account from v_account where manager=?",[sessionUser.did])
    const sql='INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,actor_inbox) values(?,?,?,?,?,?,?,?,?,?,?,?)';
    for(let i=0;i<jsonData.orderedItems.length;i++)
    {
      let item=jsonData.orderedItems[i];
      let contentText=item.object.content;
      if(item.object.attachment && item.object.attachment.length){
        const myURL = new URL(item.actor);
        const targetDomain = myURL.hostname;
        item.object.attachment.forEach( async imgobj => {
          if(imgobj.mediaType.startsWith('image')){
            const url=`https://${targetDomain}/system/${imgobj.url}`
            contentText=`${contentText}<hr/><img src=${url} alt='' /> `
          }
            
        })
      }
      let paras=[item.object.id,sessionUser.did,rows[0].actor_name,rows[0].avatar,rows[0].actor_account,rows[0].actor_url,
      `mastodon ${item.object.published}`,contentText,0,0,'',rows[0].actor_inbox];
      if(paras[0]) await execute(sql,paras)
    }

    res.status(200).json({ msg: `Complete import` }); 

  } catch (err) {
    res.status(err.httpCode || 500).json({errMsg: err.message});
    return;
  }
});


