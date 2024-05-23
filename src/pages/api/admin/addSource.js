import withSession from "../../../lib/session";
import formidable from 'formidable';

import {addSource} from '../../../lib/mysql/daism'
import { saveImage } from "../../../lib/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withSession(async (req, res) => {
  if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
  const sessionUser = req.session.get('user');
  if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
  
  const form = formidable({})
  let fields
  let files
  try {  
      [fields, files] = await form.parse(req);
      let {did,fileType } = fields
      did=did[0]
      fileType=fileType[0]
      let imgPath=saveImage(files,fileType)
      let insertId= await addSource(did,`https://${process.env.LOCAL_DOMAIN}/uploads/${imgPath}`)
      if(insertId) {
        res.status(200).json({msg:'handle ok',id:insertId})
      } else res.status(500).json({errMsg: 'fail'});
  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});

