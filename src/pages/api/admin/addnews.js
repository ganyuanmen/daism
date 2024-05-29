import withSession from "../../../lib/session";
import formidable from 'formidable';

import {add} from '../../../lib/mysql/news'
import { send } from "../../../lib/utils/send";
import { saveImage } from "../../../lib/utils";


export default withSession(async (req, res) => {
  if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
  const sessionUser = req.session.get('user');
  if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
  
  const form = formidable({})
  let fields
  let files
  try {  
      [fields, files] = await form.parse(req);
      let {daoid,did,title,content,fileType,contentText } = fields
      daoid=daoid[0]
      did=did[0]
      title=title[0]
      content=content[0]
      fileType=fileType[0]
      contentText=contentText[0]
      let imgPath=saveImage(files,fileType)
      let insertId= await add(imgPath,daoid,did,title,content)
      if(insertId) {
        if( process.env.IS_DEBUGGER==='1') console.info("news send --->",[daoid,imgPath,insertId,title])
        send(daoid,contentText,imgPath,'news',insertId,`《${title}》 ${contentText}`)
        res.status(200).json({msg:'handle ok',id:insertId})
      } else res.status(500).json({errMsg: 'fail'});
  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});

export const config = {
  api: {
    sizeLimit: '20mb',
    bodyParser: false
  },
};