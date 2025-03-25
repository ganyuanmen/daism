import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID, getData, execute } from "../../../lib/mysql/common";
import { send } from "../../../lib/utils/send";
import { saveImage, findFirstURI, getTootContent } from "../../../lib/utils";

const { v4: uuidv4 } = require("uuid");

export const config = {
    api: {
        sizeLimit: '1mb',
        bodyParser: false,
    },
};


export default withSession(async (req, res) => {
    if (req.method.toUpperCase() !== 'POST') return res.status(405).json({ errMsg: 'Method Not Allowed' })
    const sessionUser = req.session.get('user');
    if (!sessionUser) return res.status(406).json({ errMsg: 'No wallet signature login' })
    try {

        const form = formidable({})
        const [fields, files] = await form.parse(req);
        const {vedioURL,propertyIndex,accountAt,typeIndex,id, startTime, endTime, eventUrl, eventAddress, time_event, actorid, daoid, _type, account, content, fileType, isSend, isDiscussion,textContent } = fields
        // const actorName=account[0].split('@')[0];
        const _path=new Date().toLocaleDateString().replaceAll('/','');
        const imgPath = saveImage(files, fileType[0],_path)
        let path = imgPath ? `https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${_path}/${imgPath}` : '';
        let sql = '';
        let paras;
        const sctype = daoid ? 'sc' : '';
        const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
        const tagar = content[0].match(regex)?.map(match => match.slice(1,40)) || [];
        // console.log(tagar)
        const pathtype=daoid?'enki':'enkier';

        if (id[0] == '0') { //增加
            let message_id = uuidv4().replaceAll('-','')
            if (daoid) { //enki
                const re=await getData("SELECT 1 AS c  WHERE (SELECT manager FROM a_account WHERE id=?) IN (SELECT member_address FROM t_daodetail WHERE dao_id=?)",[actorid[0],daoid[0]]);
                if(!re.length) return res.status(406).json({ errMsg: 'Non smart common members!' });
                paras = [propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0],message_id,actorid[0], daoid[0], content[0], isSend[0], isDiscussion[0], path, _type[0]]
                if (_type[0] == '1') { //活动嗯文
                    sql = 'INSERT INTO a_messagesc(property_index,type_index,vedio_url,account_at,message_id,actor_id,dao_id,content,is_send,is_discussion,top_img,_type,start_time,end_time,event_url,event_address,time_event) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                    paras = paras.concat([startTime[0], endTime[0], eventUrl[0], eventAddress[0], time_event[0]])
                }
                else {  //普通嗯文
                    sql = 'INSERT INTO a_messagesc(property_index,type_index,vedio_url,account_at,message_id,actor_id,dao_id,content,is_send,is_discussion,top_img,_type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
                }
            } else  //个人
            {
                sql = "INSERT INTO a_message(property_index,type_index,vedio_url,account_at,message_id,manager,actor_name,avatar,actor_account,actor_url,content,is_send,is_discussion,top_img,actor_inbox) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                let rows = await getData("select actor_name,avatar,actor_url,actor_inbox,manager from v_account where actor_account=?", [account[0]])
                paras = [propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0],message_id, rows[0].manager, rows[0].actor_name, rows[0].avatar, account[0], rows[0].actor_url, content[0], isSend[0], isDiscussion[0], path, rows[0].actor_inbox]
            }

            let insertId = await executeID(sql, paras);
            if (insertId) {
                // if (parseInt(isSend[0]) === 1) {
                    //account,textContent,imgpath,message_id,pathtype,contentType
                send(
                    account[0],
                    content[0],
                    textContent[0],
                    // parseInt(typeIndex[0])===0?content[0]:textContent[0],
                    path,
                    message_id,
                    pathtype,
                    'Create'
                ) 
                // }
                if(accountAt && accountAt[0]){
                    const ar=JSON.parse(accountAt[0]);
                    sql='INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,actor_inbox,link_url,content,is_send,is_discussion,top_img,receive_account,send_type,vedio_url,property_index,type_index) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                    let re=await getData(`SELECT manager,actor_name,avatar,actor_account,actor_url,actor_inbox FROM v_message${sctype} where id=?`,[insertId],true);
                    let linkUrl=`https://${process.env.LOCAL_DOMAIN}/communities/${daoid?'enki':'enkier'}/${message_id}`
                   
                    ar.forEach(async namestr=> {
                        paras=[message_id,re.manager,re.actor_name,re.avatar,re.actor_account,re.actor_url,re.actor_inbox,linkUrl,content[0],0,1,path,`${namestr}@${process.env.LOCAL_DOMAIN}`,2,vedioURL[0],propertyIndex[0],typeIndex[0]]
                        await executeID(sql, paras);
                    })
                }
                setTimeout(async () => {
                    await addLink(content[0], message_id,sctype); //生成链接卡片
                    if(tagar.length) await execute(`call in_tag(?,?,?)`,[insertId,tagar.join(','), sctype])
                },1);
                res.status(200).json({ msg: 'handle ok', id: insertId });
            } else res.status(500).json({ errMsg: 'fail' });
        } else { //修改
            let rear = await getData(`select message_id,top_img from a_message${sctype} where id=?`, [id[0]],true)
            if (!path && fileType[0]) { //不修改img
                path = rear['top_img']
            }
           
            if (daoid) {     
                if (_type[0] == '1') { //活动嗯文
                    sql = "update a_messagesc set property_index=?,type_index=?,vedio_url=?,account_at=?,_type=1,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,event_address=?,time_event=? where id=?"
                    paras= [propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0],content[0], isSend[0], isDiscussion[0], path, startTime[0], endTime[0], eventUrl[0], eventAddress[0], time_event[0], id[0]];
                } else {//普通嗯文
                    sql = "update a_messagesc set property_index=?,type_index=?,vedio_url=?,account_at=?,_type=0,content=?,is_send=?,is_discussion=?,top_img=?,start_time=NULL,end_time=NULL,event_url=NULL,event_address=NULL,time_event=-1 where id=?";
                    paras=[propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0], content[0], isSend[0], isDiscussion[0], path, id[0]];
                 }
            } else {
                sql = "update a_message set property_index=?,type_index=?,vedio_url=?,account_at=?,content=?,is_send=?,is_discussion=?,top_img=? where message_id=?";
                paras= [propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0], content[0], isSend[0], isDiscussion[0], path, rear.message_id];
             }

            let lok = await execute(sql,paras);
            if(lok) {  
                // if (parseInt(isSend[0]) === 1) {
                    //account,textContent,imgpath,message_id,pathtype,contentType
                send(
                    account[0],
                    content[0],
                    textContent[0],
                    // parseInt(typeIndex[0])===0?content[0]:textContent[0],
                    path,
                    rear.message_id,
                    pathtype,
                    'Update'
                ) 
                // }     
                setTimeout(async () => {  //生成链接卡片
                    await addLink(content[0],rear.message_id,sctype);
                    await execute(`delete from t_tagmess${sctype} where cid=?`,[id[0]])
                    if(tagar.length) await execute(`call in_tag(?,?,?)`,[id[0],tagar.join(','), sctype])
                }, 1);
                res.status(200).json(await getData(`select * from v_message${sctype} where id=?`, [id[0]],true));
            }
            else res.status(500).json({ errMsg: 'save fail' });

        }

    } catch (err) {
        console.error(err);
        res.status(err.httpCode || 500).json({ errMsg: err.toString() });
        return;
    }
});


async function addLink(content, id,sctype) {
    const furl = findFirstURI(content)
    const sql = `update a_message${sctype} set content_link=? where message_id=?`
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