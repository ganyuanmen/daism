import withSession from "../../../lib/session";
import formidable from 'formidable';
import { saveImage,delOldImage } from "../../../lib/utils";
import {update,getOne} from '../../../lib/mysql/events'


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
      let {id,title,content,isSend,isDiscussion,startTime,endTime,eventUrl,original,numbers,participate,address,fileType,time_event} = fields
      id=id[0]
      title=title[0]
      content=content[0]
      fileType=fileType[0]
      isSend=isSend[0]
      isDiscussion=isDiscussion[0]
      startTime=startTime[0]
      endTime=endTime[0]
      eventUrl=eventUrl[0]
      original=original[0]
      numbers=numbers[0]
      participate=participate[0]
      address=address[0]
      time_event=time_event[0]

      let imgPath=saveImage(files,fileType)
      let old=await getOne(id)
      let lok= await update(id,title,content,isSend,isDiscussion,imgPath,startTime,endTime,eventUrl,original,numbers,participate,address,fileType,time_event)
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

