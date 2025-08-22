// 

import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID,getData,execute } from "../../../lib/mysql/common";
import { saveImage, findFirstURI, getTootContent } from "../../../lib/utils";
import {createNote} from '../../../lib/activity/index'
import { signAndSend } from "../../../lib/net";
import { getFollowers_send } from "../../../lib/mysql/folllow";
import { getUser } from "../../../lib/mysql/user";
import {getClientIp} from '../../../lib/utils'

import { v4 as uuidv4 } from 'uuid';


export const config = {
  api: {
    sizeLimit: '1mb',
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
  try {  
   
    const form = formidable({})
    const [fields, files] = await form.parse(req);
    let {vedioURL,typeIndex,pid,actorid,content,sctype,fileType,inbox,bid,account} = fields  //rid 修改ID
    const _path=new Date().toLocaleDateString().replaceAll('/','');
    const imgPath = saveImage(files, fileType[0],_path)
    let path = imgPath ? `https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${_path}/${imgPath}` : '';
    // if(parseInt(rid[0])===0) { //add
    let message_id = uuidv4().replaceAll('-','')?.toLowerCase();
      let rows=await getData("select manager,domain,actor_name,avatar,actor_account,actor_url,privkey from a_account where id=?",[actorid[0]])
      if(rows.length===0){
         return res.status(500).json({errMsg: "invalid ID"}); 
      }
      else {
          const sql=`INSERT INTO a_message${sctype[0]}_commont(manager,pid,message_id,actor_name,avatar,actor_account,actor_url,content,type_index,vedio_url,top_img,bid) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`
          const paras=[rows[0].manager,pid[0],message_id,rows[0].actor_name,rows[0].avatar,rows[0].actor_account,rows[0].actor_url,content[0],typeIndex[0],vedioURL[0]
          ,path,bid[0]?bid[0]:Math.floor(Date.now()/1000)]
          let lok=await execute(sql,paras);
          if(lok) { 
            let url=pid[0];
            if(!url.startsWith('http')) url= `https://${account[0].split('@')[1]}/communities/${sctype==='sc'?'enki':'enkier'}/${pid[0]}`;
            const sendbody= createNote(rows[0].actor_name,rows[0].domain,url,message_id, 
              process.env.LOCAL_DOMAIN,sctype==='sc'?'enki':'enkier',content[0]
              ,bid[0]?bid[0]:Math.floor(Date.now()/1000),typeIndex[0],vedioURL[0],path,rows[0].manager);
            if(pid[0].startsWith('http')){ //别人推送的，推回源服务器
              signAndSend(inbox[0],rows[0].actor_name,rows[0].domain,sendbody,rows[0].privkey);
            }else { //推送给各服务器
              getFollowers_send({account:account[0]}).then(async data=>{
                const localUser= await getUser('actor_account',rows[0].actor_account,'privkey,Lower(actor_account) account,actor_name,domain');
                data.forEach((element) => {
                  if(element.user_account!==rows[0].actor_account){  //不推给主发起人
                    try{
                        signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,sendbody,localUser.privkey);
                    }catch(e1){ console.error(e1)}
                  }
                });
              })

            }
            
            setTimeout(async () => {await addLink(content[0], message_id,sctype[0])}, 1);//生成链接卡片
            return  res.status(200).json(await getData(`select * from v_message${sctype[0]}_commont where message_id=?`, [message_id],true));
        }
      }
    // } else { //edit
    //   let rear = await getData(`select * from a_message${sctype[0]}_commont where id=?`, [rid[0]],true)
    //   if (!path && fileType[0]) { //不修改img
    //       path = rear['top_img']
    //   }
    //   const sql=`update a_message${sctype[0]}_commont set content=?,type_index=?,vedio_url=?,top_img=? where id=?`
    //   let lok=execute(sql,[content[0],typeIndex[0],vedioURL[0],path,rid[0]])
    //   if(lok) {
    //     setTimeout(async () => {await addLink(content[0],rid[0],sctype[0])},1);//生成链接卡片
    //      res.status(200).json({content:content[0],type_index:parseInt(typeIndex[0]),vedio_url:vedioURL[0],top_img:path});
    //   }
    //   else res.status(500).json({errMsg:'save fail'});

    // }

  } catch (err) {
      console.error(err);
      res.status(err?.httpCode || 500).json({ errMsg: err?.toString() });
      return;
  }
});



async function addLink(content, mid,sctype) {
  const furl = findFirstURI(content)
  const sql = `update a_message${sctype}_commont set content_link=? where message_id=?`
  if (furl) {
    
      let tootContent = await getTootContent(furl, process.env.LOCAL_DOMAIN)
      if (tootContent) {
          await executeID(sql, [tootContent, mid]);
      } else {
          await executeID(sql, ['', mid]);
      }
  }else {
      await executeID(sql, ['', mid]);
  }
}