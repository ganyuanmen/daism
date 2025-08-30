import withSession from "../../../lib/session";
import formidable from 'formidable';
import {updateActor,getActor} from '../../../lib/mysql/user'
import { saveImage } from "../../../lib/utils";
import {getClientIp} from '../../../lib/utils'

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
  const form = formidable({})
  try {
      const [fields, files] = await form.parse(req);
      let {account,actorDesc,fileType,did } = fields
      account=account[0]
      // const actorName=account.split('@')[0];
      const _path=new Date().toLocaleDateString().replaceAll('/','');
      actorDesc=actorDesc[0]
      fileType=fileType[0]
      let selectImg=saveImage(files,fileType,_path)
      let path =selectImg?`https://${process.env.NEXT_PUBLIC_DOMAIN}/${process.env.IMGDIRECTORY}/${_path}/${selectImg}`:'';
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

