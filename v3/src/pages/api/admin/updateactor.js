import withSession from "../../../lib/session";
import formidable from 'formidable';
import {updateActor,getActor} from '../../../lib/mysql/user'
import { saveImage } from "../../../lib/utils";

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
  try {
      const [fields, files] = await form.parse(req);
      let {account,actorDesc,fileType,did,id } = fields
      account=account[0]
      const actorName=account.split('@')[0];
      actorDesc=actorDesc[0]
      fileType=fileType[0]
      let selectImg=saveImage(files,fileType,actorName)
      let path =selectImg?`https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${actorName}/${selectImg}`:'';
      let lok= await updateActor({account,actorDesc,path})
      if(lok) {
        res.status(200).json(await getActor(did[0])); 
        if(path) { //修改头像 更新头像
          let sql="update a_message set avatar=? where actor_account=?";
          execute(sql,[path,account]).then(()=>{});
          
        }

      }
      else res.status(500).json({errMsg: 'fail'})

  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({ errMsg: err.toString() });
  }
});

