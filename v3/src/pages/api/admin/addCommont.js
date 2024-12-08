// 

import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID,getData,execute } from "../../../lib/mysql/common";
import { saveImage, findFirstURI, getTootContent } from "../../../lib/utils";
const { v4: uuidv4 } = require("uuid");


export const config = {
  api: {
    sizeLimit: '1mb',
    bodyParser: false,
  },
};

export default withSession(async (req, res) => {
  if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
  const sessionUser = req.session.get('user');
  if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
  try {  
   
    const form = formidable({})
    const [fields, files] = await form.parse(req);
    let {vedioURL,typeIndex,rid,pid,actorid,content,sctype,fileType,account} = fields  //rid 修改ID
    const actorName=account[0].split('@')[0];
    const imgPath = saveImage(files, fileType[0],actorName)
    let path = imgPath ? `https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${actorName}/${imgPath}` : '';
    if(rid[0]=='0') { //add
      let message_id=uuidv4()
      let rows=await getData("select manager,actor_name,avatar,actor_account,actor_url from a_account where id=?",[actorid[0]])
      if(rows.length===0){
         return res.status(err.httpCode || 500).json({errMsg: "invalid ID"}); 
      }
      else {
          const sql=`INSERT INTO a_message${sctype[0]}_commont(manager,pid,message_id,actor_name,avatar,actor_account,actor_url,content,type_index,vedio_url,top_img) VALUES(?,?,?,?,?,?,?,?,?,?,?)`
          const paras=[rows[0].manager,pid[0],message_id.replaceAll('-',''),rows[0].actor_name,rows[0].avatar,rows[0].actor_account,rows[0].actor_url,content[0],typeIndex[0],vedioURL[0],path]
          let insertId=await executeID(sql,paras);
          if(insertId) { 
            setTimeout(async () => {await addLink(content[0], insertId,sctype[0])}, 1);//生成链接卡片
            return  res.status(200).json(await getData(`select * from v_message${sctype[0]}_commont where id=?`, [insertId],true));
        }
      }
    } else { //edit
      let rear = await getData(`select * from a_message${sctype[0]}_commont where id=?`, [rid[0]],true)
      if (!path && fileType[0]) { //不修改img
          path = rear['top_img']
      }
      const sql=`update a_message${sctype[0]}_commont set content=?,type_index=?,vedio_url=?,top_img=? where id=?`
      let lok=execute(sql,[content[0],typeIndex[0],vedioURL[0],path,rid[0]])
      if(lok) {
        setTimeout(async () => {await addLink(content[0],rid[0],sctype[0])},1);//生成链接卡片
         res.status(200).json({content:content[0],type_index:parseInt(typeIndex[0]),vedio_url:vedioURL[0],top_img:path});
      }
      else res.status(500).json({errMsg:'save fail'});

    }

  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({ errMsg: err.toString() });
      return;
  }
});



async function addLink(content, id,sctype) {
  const furl = findFirstURI(content)
  const sql = `update a_message${sctype}_commont set content_link=? where id=?`
  if (furl) {
    
      let tootContent = await getTootContent(furl, process.env.LOCAL_DOMAIN)
      if (tootContent) {
          await executeID(sql, [tootContent, id]);
      } else {
          await executeID(sql, ['', id]);
      }
  }else {
      await executeID(sql, ['', id]);
  }
}