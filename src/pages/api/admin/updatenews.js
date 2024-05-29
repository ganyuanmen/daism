import withSession from "../../../lib/session";
import formidable from 'formidable';
import { saveImage,delOldImage } from "../../../lib/utils";
import {update,getOne} from '../../../lib/mysql/news'

export const config = {
  api: {
    sizeLimit: '10mb',
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
      let {id,title,content,fileType } = fields
      id=id[0]
      title=title[0]
      content=content[0]
      fileType=fileType[0]
      let imgPath=saveImage(files,fileType)
      let old=await getOne(id)
      let lok= await update(title,imgPath,content,id,fileType)
      if(lok) {
        if(old[0].top_img) delOldImage(old[0].top_img)
        res.status(200).json({msg:'handle ok',id})
      } else res.status(500).json({errMsg: 'fail'});
  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});
