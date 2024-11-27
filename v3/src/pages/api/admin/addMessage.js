import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID, getData, execute } from "../../../lib/mysql/common";
import { send } from "../../../lib/utils/send";
import { saveImage, findFirstURI, getTootContent } from "../../../lib/utils";

const { v4: uuidv4 } = require("uuid");

export const config = {
    api: {
        sizeLimit: '10mb',
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
        const { id, startTime, endTime, eventUrl, eventAddress, time_event, actorid, daoid, _type, account, title, content, fileType, isSend, isDiscussion,textContent } = fields
        const imgPath = saveImage(files, fileType[0])
        let path = imgPath ? `https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${imgPath}` : '';
        let sql = '';
        let paras;
        const sctype = daoid ? 'sc' : '';
        if (id[0] == '0') { //增加
            let message_id = uuidv4().replaceAll('-','')
            if (daoid) { //enki
                paras = [message_id,actorid[0], daoid[0], title[0], content[0], isSend[0], isDiscussion[0], path, _type[0]]
                if (_type[0] == '1') { //活动嗯文
                    sql = 'INSERT INTO a_messagesc(message_id,actor_id,dao_id,title,content,is_send,is_discussion,top_img,_type,start_time,end_time,event_url,event_address,time_event) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                    paras = paras.concat([startTime[0], endTime[0], eventUrl[0], eventAddress[0], time_event[0]])
                }
                else {  //普通嗯文
                    sql = 'INSERT INTO a_messagesc(message_id,actor_id,dao_id,title,content,is_send,is_discussion,top_img,_type) VALUES(?,?,?,?,?,?,?,?,?)';
                }
            } else  //个人
            {
                sql = "INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,actor_inbox) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
                let rows = await getData("select actor_name,avatar,actor_url,actor_inbox,manager from v_account where actor_account=?", [account[0]])
                paras = [message_id, rows[0].manager, rows[0].actor_name, rows[0].avatar, account[0], rows[0].actor_url, title[0], content[0], isSend[0], isDiscussion[0], path, rows[0].actor_inbox]
            }

            let insertId = await executeID(sql, paras);
            if (insertId) {
                if (parseInt(isSend[0]) === 1) {
                    if (process.env.IS_DEBUGGER === '1') console.info("message send --->", [account[0], path, insertId, title[0]])
                    send(account[0],textContent[0], content[0], path, message_id, `《${title[0]}》`, path, daoid ? 'enki' : 'enkier')
                }

                setTimeout(async () => {  //生成链接卡片
                    await addLink(content[0], insertId,sctype)
                }, 1);
                res.status(200).json({ msg: 'handle ok', id: insertId });
            } else res.status(500).json({ errMsg: 'fail' });
        } else { //修改
            let rear = await getData(`select * from a_message${sctype} where id=?`, [id[0]],true)
            if (!path && fileType[0]) { //不修改img
                path = rear['top_img']
            }
           
            if (daoid) {     
                if (_type[0] == '1') { //活动嗯文
                    sql = "update a_messagesc set _type=1,title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,event_address=?,time_event=? where id=?"
                    paras= [title[0], content[0], isSend[0], isDiscussion[0], path, startTime[0], endTime[0], eventUrl[0], eventAddress[0], time_event[0], id[0]];
                    rear={...rear,_type:1,start_time:startTime[0],end_time:endTime[0],event_url:eventUrl[0],event_address:eventAddress[0],time_event:time_event[0]};
                } else {//普通嗯文
                    sql = "update a_messagesc set _type=0,title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=NULL,end_time=NULL,event_url=NULL,event_address=NULL,time_event=-1 where id=?";
                    paras=[title[0], content[0], isSend[0], isDiscussion[0], path, id[0]];
                    rear={...rear,title:title[0],content:content[0],is_send:parseInt(isSend[0]),is_discussion:parseInt(isDiscussion[0]),top_img:path,_type:0};
                }
            } else {
                sql = "update a_message set title=?,content=?,is_send=?,is_discussion=?,top_img=? where id=?";
                paras= [title[0], content[0], isSend[0], isDiscussion[0], path, id[0]];
                rear={...rear,title:title[0],content:content[0],is_send:parseInt(isSend[0]),is_discussion:parseInt(isDiscussion[0]),top_img:path};
            }

            let lok = await execute(sql,paras);
            if(lok) res.status(200).json(rear);
            else res.status(500).json({ errMsg: 'save fail' });

        }

    } catch (err) {
        console.error(err);
        res.status(err.httpCode || 500).json({ errMsg: err });
        return;
    }
});


async function addLink(content, insertId,sctype) {
    const furl = findFirstURI(content)
    if (furl) {
        let tootContent = await getTootContent(furl, process.env.LOCAL_DOMAIN)
        if (tootContent) {
            let sql = `update a_message${sctype} set content=? where id=?`
            await executeID(sql, [`${content} \n\n${tootContent}`, insertId]);

        }
    }
}