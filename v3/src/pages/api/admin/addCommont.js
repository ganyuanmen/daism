// 

import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID,getData,execute } from "../../../lib/mysql/common";
const { v4: uuidv4 } = require("uuid");


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
  try {  
   
    const form = formidable({})
    const [fields] = await form.parse(req);
    let {rid,pid,actorid,content,sctype} = fields  //rid 修改ID

    if(rid[0]=='0') { //add
      let message_id=uuidv4()
      let rows=await getData("select manager,actor_name,avatar,actor_account,actor_url from a_account where id=?",[actorid[0]])
      if(rows.length===0){
          res.status(err.httpCode || 500).json({errMsg: "invalid ID"}); 
      }
      else {
          const sql=`INSERT INTO a_message${sctype[0]}_commont(manager,pid,message_id,actor_name,avatar,actor_account,actor_url,content) VALUES(?,?,?,?,?,?,?,?)`
          const paras=[rows[0].manager,pid[0],message_id.replaceAll('-',''),rows[0].actor_name,rows[0].avatar,rows[0].actor_account,rows[0].actor_url,content[0]]
          let insertId=await executeID(sql,paras);
          res.status(200).json({msg:'handle ok',id:insertId});
      }
    } else { //edit
      const sql=`update a_message${sctype[0]}_commont set content=? where id=?`
      let lok=execute(sql,[content[0],rid[0]])
      if(lok) res.status(200).json({});
      else res.status(500).json({errMsg:'save fail'});

    }

  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});

