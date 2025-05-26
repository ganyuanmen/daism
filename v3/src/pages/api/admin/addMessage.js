import withSession from "../../../lib/session";
import formidable from 'formidable';
import { getData, execute } from "../../../lib/mysql/common";
import { sendfollow } from "../../../lib/utils/sendfollow";
import { saveImage, findFirstURI, getTootContent,saveHTML } from "../../../lib/utils";

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
        const {avatar, actorName,title, vedioURL,propertyIndex,accountAt,typeIndex,messageId, startTime, endTime, eventUrl, eventAddress, time_event, actorid, daoid, _type, account, content, fileType, isSend, isDiscussion,textContent } = fields
        // const actorName=account[0].split('@')[0];
        const _path=new Date().toLocaleDateString().replaceAll('/','');
        const imgPath = saveImage(files, fileType[0],_path)
        let path = imgPath ? `https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${_path}/${imgPath}` : '';
        let sql = '';
        let paras;
        const sctype = daoid ? 'sc' : '';
        const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
        const tagar = content[0].match(regex)?.map(match => match.slice(1,40)) || [];

        const pathtype=daoid?'enki':'enkier';

        if (!messageId) { //增加
            if (daoid && actorid){  //检测是否为公器成员
                const re=await getData("SELECT 1 AS c  WHERE (SELECT manager FROM a_account WHERE id=?) IN (SELECT member_address FROM t_daodetail WHERE dao_id=?)"
                    ,[actorid[0],daoid[0]]);
                if(!re.length) return res.status(406).json({ errMsg: 'Non smart common members!' });
            }

            let message_id = uuidv4().replaceAll('-','')?.toLowerCase();
            let insert_type=2; //默认是个人嗯文
            if(_type) insert_type=parseInt(_type[0]);
            let linkUrl=`https://${process.env.LOCAL_DOMAIN}/communities/${daoid?'enki':'enkier'}/${message_id}`
            sql = "call in_message(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            paras = [insert_type,title[0], propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0],message_id,account[0],
                content[0], isSend[0], isDiscussion[0], path,linkUrl,
                actorid?actorid[0]:0,
                daoid?daoid[0]:0,
                _type?_type[0]:0,
                startTime?startTime[0]:'', 
                endTime?endTime[0]:'', 
                eventUrl?eventUrl[0]:'', 
                eventAddress?eventAddress[0]:'', 
                time_event?time_event[0]:0
            ];
            let lok = await execute(sql, paras);
            if (lok) {
                setTimeout(async () => {
                    await addLink(content[0], message_id,sctype,'insert'); //生成链接卡片

                    if(tagar.length) execute(`call in_tag(?,?)`,[message_id, JSON.stringify(tagar)]);

                    // if(title && title[0]) saveHTML(actorName[0],content[0],title[0],message_id,textContent[0]
                    //     ,path?path:avatar[0],account[0],sessionUser.did,avatar[0]);
                    sendfollow(
                        account[0],
                        content[0],
                        textContent[0],
                        path,
                        message_id,
                        pathtype,
                        vedioURL[0],
                        'Create'
                    ); 
                },1);
                res.status(200).json({ msg: 'handle ok'});
            } else res.status(500).json({ errMsg: 'fail' });
        } else { //修改
            let rear 
            if(sctype==='sc')
            rear= await getData(`select account_at,actor_name,actor_account,avatar,manager,top_img from v_messagesc where message_id=?`, [messageId[0]],true)
            else 
            rear= await getData(`select account_at,actor_name,actor_account,avatar,manager,top_img from a_message where message_id=?`, [messageId[0]],true)

            if (!path && fileType[0]) { //不修改img
                path = rear['top_img']
            }
           
            if (daoid) {     
                if (parseInt(_type[0]) === 1) { //活动嗯文
                    sql = "update a_messagesc set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,_type=1,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,event_address=?,time_event=? where message_id=?"
                    paras= [title[0], propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0],content[0], isSend[0], isDiscussion[0], path, startTime[0], endTime[0], eventUrl[0], eventAddress[0], time_event[0], messageId[0]];
                } else {//普通嗯文
                    sql = "update a_messagesc set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,_type=0,content=?,is_send=?,is_discussion=?,top_img=?,start_time=NULL,end_time=NULL,event_url=NULL,event_address=NULL,time_event=-1 where message_id=?";
                    paras=[title[0], propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0], content[0], isSend[0], isDiscussion[0], path, messageId[0]];
                 }
            } else {
                sql = "update a_message set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,content=?,is_send=?,is_discussion=?,top_img=? where message_id=?";
                paras= [title[0], propertyIndex[0],typeIndex[0],vedioURL[0],accountAt[0], content[0], isSend[0], isDiscussion[0], path, messageId[0]];
               
            }

            let lok = await execute(sql,paras);
            if(lok) {  
                setTimeout(async () => {  //生成链接卡片
                    // if(title && title[0]) saveHTML(rear.actor_name,content[0],title[0], messageId[0],textContent[0],path?path:rear?.avatar,
                    //     rear?.actor_account,rear?.manager,rear?.avatar);
                    if(rear.account_at!==accountAt[0]){
                        if(rear.account_at){
                            execute("delete from a_sendmessage where message_id=? and send_type=2",[messageId[0]])
                        }
                        if(accountAt[0]){
                            sql=`INSERT INTO a_sendmessage(message_id, send_type, receive_account)
	                            SELECT '${messageId[0]}',2,CONCAT(jt.item,'@',SUBSTRING_INDEX('${rear.actor_account}', '@', -1)) FROM JSON_TABLE('${accountAt[0]}','$[*]' COLUMNS (item VARCHAR(100) PATH '$')) AS jt
	                            ON DUPLICATE KEY UPDATE
	                            send_type = VALUES(send_type)`;
                                execute(sql,[])
                        }
                    }

                    addLink(content[0],messageId[0],sctype,'update');
                    if(tagar.length)
                        execute("delete from a_tag where pid=?",[messageId[0]]).then(()=>{
                            execute(`call in_tag(?,?)`,[messageId[0], JSON.stringify(tagar)]);
                        })
                     
                    sendfollow(
                        account[0],
                        content[0],
                        textContent[0],
                        path,
                        messageId[0],
                        pathtype,
                        vedioURL[0],
                        'Update'
                    ) 

                }, 1);
                res.status(200).json(await getData(`select * from v_message${sctype} where message_id=?`, [messageId[0]],true));
            }
            else res.status(500).json({ errMsg: 'save fail' });

        }

    } catch (err) {
        console.error(err);
        res.status(err.httpCode || 500).json({ errMsg: err.toString() });
        return;
    }
});


async function addLink(content, id,sctype,flag) {
    const furl = findFirstURI(content)
    const sql = `update a_message${sctype} set content_link=? where message_id=?`
    if (furl) {
      
        let tootContent = await getTootContent(furl, process.env.LOCAL_DOMAIN)
        if (tootContent) {
             execute(sql, [tootContent, id]);
        } 
        // else {
        //      execute(sql, ['', id]);
        // }
    }else {
        if(flag==='update')   execute(sql, ['', id]);
    }
}
