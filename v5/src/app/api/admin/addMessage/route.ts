import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { execute, getData } from "@/lib/mysql/common";
import { sendfollow } from "@/lib/utils/sendfollow";
 import { saveImage, findFirstURI, getTootContent } from "@/lib/utils";
import { getSession } from "@/lib/session";


export async function POST(req: NextRequest) {
    const session = await getSession();
    // const currentIp = getClientIp(req);
    if (!session ||  session.userAgent !== req.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }
    
  const formData = await req.formData();
//   const actorName = formData.get("actorName") as string;//昵称
  const account = formData.get("account") as string;//帐号
//   const avatar = formData.get("avatar") as string;//头像
  const title = formData.get("title") as string;// 标题
  const content = formData.get("content") as string;//内容
  const vedioURL = formData.get("vedioURL") as string;// 视频
  const propertyIndex = formData.get("propertyIndex") as string;// 1 公开 2关注者 3@
  const accountAt = formData.get("accountAt") as string;//@ 帐号集
  const typeIndex = formData.get("typeIndex") as string;// 0短文  1长文
  const messageId = formData.get("messageId") as string;// 嗯文messageId， 修改特有
  const startTime = formData.get("startTime") as string;// 活动开始时间
  const endTime = formData.get("endTime") as string;//活动结束时间
  const eventUrl = formData.get("eventUrl") as string;// 活动URL
  const eventAddress = formData.get("eventAddress") as string;//活动地址
  const time_event =Number(formData.get("time_event") as string);//活动重复时间，-1 不重复，
  const actorid =Number(formData.get("actorid") as string);//帐号ID
  const daoid =Number(formData.get("daoid") as string);//公器ID
  const _type =Number(formData.get("_type") as string);//1活动嗯文 0非
  const isSend = formData.get("isSend") as string; // 允许推送，默认都允许
  const isDiscussion = formData.get("isDiscussion") as string; //允许评论
  const textContent = formData.get("textContent") as string; //推送的信息
  const file = formData.get("file") as File; //首页图片

   let _path:string=await saveImage(file) as string;
  
   let sql = '';
   let paras;
   const sctype = daoid>0 ? 'sc' : '';
   const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
   const tagar = content.match(regex)?.map(match => match.slice(1,40)) || [];
   const pathtype=daoid>0?'enki':'enkier';

   
   if (!messageId) { //增加
    if (daoid>0 && actorid>0){  //检测是否为公器成员
        const re=await getData("SELECT 1 AS c  WHERE (SELECT manager FROM a_account WHERE id=?) IN (SELECT member_address FROM t_daodetail WHERE dao_id=?)"
            ,[actorid,daoid]);
        if(!re.length)  return NextResponse.json({ errMsg: 'Non smart common members!'  }, { status: 500 });
    }

    const message_id = uuidv4().replaceAll('-','')?.toLowerCase();
    let insert_type=2; //2默认是个人嗯文, 0 普通公器是哪个嗯文，1 活动嗯文
    if(daoid>0) insert_type=_type;
    const linkUrl=`https://${process.env.NEXT_PUBLIC_DOMAIN}/communities/${daoid>0?'enki':'enkier'}/${message_id}`
    sql = "call in_message(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    paras = [insert_type,title, propertyIndex,typeIndex,vedioURL,accountAt,message_id,account,
        content, isSend, isDiscussion, _path,linkUrl,
        actorid,daoid,_type,
        startTime?startTime:'', 
        endTime?endTime:'', 
        eventUrl?eventUrl:'', 
        eventAddress?eventAddress:'', 
        time_event
    ];
    const lok = await execute(sql, paras);

    if (lok) {
        setTimeout(async () => {
            await addLink(content, message_id,sctype,'insert'); //生成链接卡片
            if(tagar.length) execute(`INSERT IGNORE INTO a_tag(pid, tag_name) SELECT ?,jt.item FROM JSON_TABLE(?,'$[*]' COLUMNS (item VARCHAR(100) PATH '$')) AS jt;`,[message_id, JSON.stringify(tagar)]);
            sendfollow(
                account,
                content,
                textContent,
                _path,
                message_id,
                pathtype,
                vedioURL,
                'Create'
            ); 
        },1);
        return NextResponse.json({ ok: true, msg: 'handle ok' });
       
    } else  return NextResponse.json({ errMsg: 'fail'  }, { status: 500 });
} else { //修改
    let rear 
    if(sctype==='sc')
    rear= await getData(`select account_at,actor_name,actor_account,avatar,manager,top_img from v_messagesc where message_id=?`, [messageId],true)
    else 
    rear= await getData(`select account_at,actor_name,actor_account,avatar,manager,top_img from a_message where message_id=?`, [messageId],true)

    if (!_path) { //不修改img
        _path = rear['top_img'] as string;
    }
   
    if (daoid) {     
        if (_type === 1) { //活动嗯文
            sql = "update a_messagesc set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,_type=1,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,event_address=?,time_event=? where message_id=?"
            paras= [title, propertyIndex,typeIndex,vedioURL,accountAt,content, isSend, isDiscussion, _path, startTime, endTime, eventUrl, eventAddress, time_event, messageId];
        } else {//普通嗯文
            sql = "update a_messagesc set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,_type=0,content=?,is_send=?,is_discussion=?,top_img=?,start_time=NULL,end_time=NULL,event_url=NULL,event_address=NULL,time_event=-1 where message_id=?";
            paras=[title, propertyIndex,typeIndex,vedioURL,accountAt, content, isSend, isDiscussion, _path, messageId];
         }
    } else {
        sql = "update a_message set title=?, property_index=?,type_index=?,vedio_url=?,account_at=?,content=?,is_send=?,is_discussion=?,top_img=? where message_id=?";
        paras= [title, propertyIndex,typeIndex,vedioURL,accountAt, content, isSend, isDiscussion, _path, messageId];
       
    }

    const lok = await execute(sql,paras);
    if(lok) {  
        setTimeout(async () => {  //生成链接卡片
            if(rear.account_at!==accountAt){
                if(rear.account_at){
                    execute("delete from a_sendmessage where message_id=? and send_type=2",[messageId])
                }
                if(accountAt){
                    sql=`INSERT INTO a_sendmessage(message_id, send_type, receive_account)
                      SELECT '${messageId}',2,CONCAT(jt.item,'@',SUBSTRING_INDEX('${rear.actor_account}', '@', -1)) FROM JSON_TABLE('${accountAt}','$[*]' COLUMNS (item VARCHAR(100) PATH '$')) AS jt
                      ON DUPLICATE KEY UPDATE
                      send_type = VALUES(send_type)`;
                        execute(sql,[])
                }
            }

            addLink(content,messageId,sctype,'update');
            if(tagar.length)
                execute("delete from a_tag where pid=?",[messageId]).then(()=>{
                    execute(`INSERT IGNORE INTO a_tag(pid, tag_name) SELECT ?,jt.item FROM JSON_TABLE(?,'$[*]' COLUMNS (item VARCHAR(100) PATH '$')) AS jt;`,[messageId, JSON.stringify(tagar)]);
                })
             
            sendfollow(
                account,
                content,
                textContent,
                _path,
                messageId,
                pathtype,
                vedioURL,
                'Update'
            ) 

        }, 1);
        const data=await getData(`select * from v_message${sctype} where message_id=?`, [messageId],true)

       return NextResponse.json(data);
       
    }
    else return NextResponse.json({ errMsg: 'fail'  }, { status: 500 });

}



//   return NextResponse.json({ ok: true });
}

async function addLink(content:string, id:string,sctype:string,flag:string) {

  const furl = findFirstURI(content)
  const sql = `update a_message${sctype} set content_link=? where message_id=?`
  if (furl) {

      const tootContent = await getTootContent(furl, process.env.NEXT_PUBLIC_DOMAIN as string)
      
      if (tootContent) {
        execute(sql, [tootContent, id]);
      } else 
      {
        if(flag==='update')   execute(sql, ['', id]);
      }
  }else { //没有了，表示取消
      if(flag==='update')   execute(sql, ['', id]);
  }
}

