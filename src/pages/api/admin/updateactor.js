import withSession from "../../../lib/session";
import formidable from 'formidable';
import {updateActor,getActor} from '../../../lib/mysql/user'
import { saveImage,delOldImage } from "../../../lib/utils";

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
    
      let {actorName,actorDesc,did,fileType } = fields
      actorName=actorName[0]
      actorDesc=actorDesc[0]
      did=did[0]
      fileType=fileType[0]
      if (!actorName || !did) return res.status(404).json({errMsg:'Bad request. Please make sure "actorName" is a property in the POST body.'});
      // actorName=actorName.toLowerCase();

      let selectImg=saveImage(files,fileType)
      let old=getActor(did)
      let lok= await updateActor({actorName,actorDesc,selectImg,did,fileType})
      if(lok)
      {
        if(old.member_icon)
        {
            let type =old.member_icon.split('/').splice(-1); 
            delOldImage(type[0]); //删除已保存的文件
        }
        res.status(200).json(await getActor(did)); 

      }else 
      res.status(500).json({errMsg: 'fail'})

  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
  }
});

