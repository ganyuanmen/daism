import withSession from "../../../lib/session";
import formidable from 'formidable';

import {add} from '../../../lib/mysql/events'
import { send } from "../../../lib/utils/send";
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
  let fields
  let files
  try {  
      [fields, files] = await form.parse(req);
      let {daoid,did,title,content,isSend,isDiscussion,startTime,endTime,eventUrl,original,numbers,participate,address,fileType,time_event,contentText} = fields
      daoid=daoid[0]
      did=did[0]
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
      contentText=contentText[0]

      let imgPath=saveImage(files,fileType)
      let insertId= await add(daoid,did,title,content,isSend,isDiscussion,imgPath,startTime,endTime,eventUrl,original,numbers,participate,address,time_event)
      if(insertId && parseInt(isSend)===1) {
        if( process.env.IS_DEBUGGER==='1') console.info("events send --->",[daoid,imgPath,insertId,title])
        send(daoid,contentText,imgPath,'events',insertId,`《${title}》 ${contentText}`)   
        res.status(200).json({msg:'handle ok',id:insertId})
      } else res.status(500).json({errMsg: 'fail'});
  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});

