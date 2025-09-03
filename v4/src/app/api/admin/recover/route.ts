import { broadcast } from "@/lib/net";
import { execute } from "@/lib/mysql/common";
import { httpGet } from "@/lib/net";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actorName, domain, oldAccount, sctype, daoid } = body;
    
    if (!actorName || !domain || !oldAccount) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const newAccount = `${actorName}@${domain}`;
    const [, oldDomain] = oldAccount.split('@');

    // 执行存储过程
    let sql = "call recover_follow(?,?)";
    let paras = [newAccount, oldAccount];
    await execute(sql, paras);

    // 广播信息
    broadcast({
      type: 'recover',
      domain,
      user: { account: newAccount,url:`https://${domain}/api/activitepub/users/${actorName}` } as ActorInfo,
      actor: { account: oldAccount } as ActorInfo,
      followId: '0'
    });

    // 获取用户信息
    let avatar = `https://${domain}/user.svg`;
    let actor_desc = '';
    
    try {
      const re1:any = await httpGet(
        `https://${oldDomain}/api/getUserMwssage?newAccount=${newAccount}&oldAccount=${oldAccount}`,
        { 'content-type': 'application/activity+json' }
      );
      
      if (re1 && re1.code === 200) {
        avatar = re1.message.avatar;
        actor_desc = re1.message.actor_desc;
      }
    } catch (error) {
      console.error('Error fetching user message:', error);
    }

    // 更新账户信息
    sql = "update a_account set avatar=?, actor_desc=? where actor_account=? or actor_account=?";
    paras = [avatar, actor_desc, oldAccount, newAccount];
    await execute(sql, paras);

    // 分页获取消息数据
    let pi = 0;
    while (true) {
      try {
        const re:any = await httpGet(
          `https://${oldDomain}/api/getMessage?account=${oldAccount}&pi=${pi}&menutype=${sctype ? 2 : 3}&daoid=${daoid}&eventnum=${sctype ? 0 : 2}`,
          { 'content-type': 'application/activity+json' }
        );
        
        if (re.code === 200) {
          await insertData(re.message, actorName, domain, avatar, sctype);
          if (re.message.length < 12) break;
        } else {
          break;
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        break;
      }
      pi++;
    }

    return NextResponse.json({ msg: 'ok' });
    
  } catch (error) {
    console.error('Error in recover follow:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function insertData(data: any[], actor_name: string, domain: string, avatar: string, sctype: string) {
  try {
    for (const e of data) {
      let sql: string;
      let paras: any[];
      
      if (sctype) {
        sql = "INSERT INTO a_messagesc(actor_id, dao_id, title, content, is_send, is_discussion, top_img, start_time, end_time, event_url, event_address, time_event, _type, reply_time, createtime, message_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        paras = [
          e.actor_id, e.dao_id, e.title, e.content, e.is_send, e.is_discussion, e.top_img, e.start_time,
          e.end_time, e.event_url, e.event_address, e.time_event, e._type, e.reply_time, e.createtime, e.message_id
        ];
      } else {
        sql = "INSERT INTO a_message(message_id, manager, actor_name, avatar, actor_account, actor_url, actor_inbox, link_url, title, content, is_send, is_discussion, top_img, receive_account, send_type, createtime, reply_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        paras = [
          e.message_id,
          e.manager,
          actor_name,
          avatar,
          `${actor_name}@${domain}`,
          `https://${domain}/api/activitepub/users/${actor_name}`,
          `https://${domain}/api/activitepub/inbox/${actor_name}`,
          e.link_url || '',
          e.title,
          e.content,
          e.is_send,
          e.is_discussion,
          e.top_img || '',
          e.receive_account || '',
          e.send_type,
          e.createtime,
          e.reply_time
        ];
      }
      
      await execute(sql, paras);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}