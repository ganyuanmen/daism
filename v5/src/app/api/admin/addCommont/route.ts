
import { NextRequest, NextResponse } from 'next/server';
import { getData, execute } from "@/lib/mysql/common";
import { saveImage, findFirstURI, getTootContent } from "@/lib/utils";
import { createNote } from '@/lib/activity/index';
import { getFollowers_send } from "@/lib/mysql/folllow";
import { v4 as uuidv4 } from 'uuid';

import { getSession } from '@/lib/session';
import { sendSignedActivity } from '@/lib/activity/sendSignedActivity';
import { getSigneActor } from '@/lib/net';


export async function POST(request: NextRequest) {
    const session = await getSession();
    // const currentIp = getClientIp(request);
    if (!session ||  session.userAgent !== request.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }

  try {
  
    const formData = await request.formData();
    
     const vedioURL= formData.get('vedioURL') as string;
     const typeIndex= formData.get('typeIndex') as string;
     const pid= formData.get('pid') as string;
     const actorid=Number(formData.get('actorid') as string);
     const content= formData.get('content') as string;
     const sctype= formData.get('sctype') as string;
     const inbox=formData.get('inbox') as string;
     const bid= formData.get('bid') as string;
     const account= formData.get('account') as string;
     const file = formData.get("file") as File; //首页图片

      

    // 验证必需字段
    if (!(actorid>0) || !content ) {
      return NextResponse.json(
        { errMsg: 'Missing required fields: actorid, content' },
        { status: 400 }
      );
    }

    const _path:string=await saveImage(file) as string;
    const message_id = uuidv4().replaceAll('-', '').toLowerCase();

    // 查询账户信息
    const rows = await getData("select manager,domain,actor_name,avatar,actor_account,actor_url,privkey from a_account where id=?",[actorid]);
    if (rows.length === 0) {
      return NextResponse.json(
        { errMsg: "invalid ID" },
        { status: 500 }
      );
    }

    const accountInfo = rows[0];

    // 插入数据库
    const sql = `INSERT INTO a_message${sctype}_commont(manager,pid,message_id,actor_name,avatar,actor_account,actor_url,content,type_index,vedio_url,top_img,bid) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = [
      accountInfo.manager,
      pid || '',
      message_id,
      accountInfo.actor_name,
      accountInfo.avatar,
      accountInfo.actor_account,
      accountInfo.actor_url,
      content,
      typeIndex || '0',
      vedioURL || '',
      _path,
      bid || Math.floor(Date.now() / 1000).toString()
    ];

    const result = await execute(sql, params);

    if (result>0) {
      let url = pid || '';
      if (url && !url.startsWith('http')) { //没有URI 的 配置上URI
        const domain = account?.split('@')[1] || '';
        url = `https://${domain}/communities/${sctype === 'sc' ? 'enki' : 'enkier'}/${pid}`;
      }

      // 创建活动流消息
      const sendbody = createNote(
        accountInfo.actor_name,
        accountInfo.domain,
        url,
        message_id,
        process.env.NEXT_PUBLIC_DOMAIN || '',
        sctype === 'sc' ? 'enki' : 'enkier',
        content,
        bid || Math.floor(Date.now() / 1000).toString(),
        typeIndex || '0',
        vedioURL || '',
        _path,
        accountInfo.manager
      );

      // 发送消息
      if (pid?.startsWith('http')) {
        // 推回源服务器
        if (inbox) {
          const localActor=await getSigneActor(accountInfo.actor_account);
          if(localActor) {
            sendSignedActivity(inbox,sendbody,localActor);
          }
        }
      } else {
        // 推送给各服务器
        if (account) {
          getFollowers_send({ account}).then(async (data) => {
           
            data.forEach(async (element: any) => {
              if (element.user_account !== accountInfo.actor_account) {
                try {
                  const localActor=await getSigneActor(accountInfo.actor_account);
                  if(localActor) {
                    sendSignedActivity(element.user_inbox,sendbody,localActor);
                  }
                } catch (e1) {
                  console.error('Send error:', e1);
                }
              }
            });
          });
        }
      }

      // 异步生成链接卡片
      setTimeout(async () => {
        await addLink(content!, message_id, sctype);
      }, 1);

      // 返回新创建的消息
      const newMessage = await getData(
        `select * from v_message${sctype}_commont where message_id=?`,
        [message_id],
        true
      );

      return NextResponse.json(newMessage);
    } else {
      return NextResponse.json(
        { errMsg: 'save fail' },
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { errMsg: err?.toString() || 'Internal server error' },
      { status: err?.httpCode || 500 }
    );
  }
}

// 辅助函数 - 添加链接
async function addLink(content: string, mid: string, sctype: string) {
  const furl = findFirstURI(content);
  const sql = `update a_message${sctype}_commont set content_link=? where message_id=?`;
  
  if (furl) {
    const tootContent = await getTootContent(furl, process.env.NEXT_PUBLIC_DOMAIN || '');
    if (tootContent) {
      await execute(sql, [tootContent, mid]);
    } else {
      await execute(sql, ['', mid]);
    }
  } else {
    await execute(sql, ['', mid]);
  }
}
