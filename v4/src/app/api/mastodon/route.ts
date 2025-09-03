
import { NextRequest, NextResponse } from 'next/server';
import { getData, execute } from '@/lib/mysql/common';
import { getSession } from '@/lib/session';
import { getClientIp } from '@/lib/utils';

export async function POST(req: NextRequest) {
    const session = await getSession();
    const currentIp = getClientIp(req);
    if (!session || session.ip !== currentIp || session.userAgent !== req.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }
  try {
    // 解析 formData
    const formData = await req.formData();
    const file = formData.get('jsonFile') as File | null;

    if (!file) {
      return NextResponse.json({ errMsg: 'No file uploaded' }, { status: 400 });
    }

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = buffer.toString('utf8');
    const jsonData = JSON.parse(data);

    const rows = await getData(
      'select dao_id,domain,actor_name,avatar,actor_url,actor_inbox,actor_account from v_account where manager=?',
      [session.did]
    );

    const sql =
      'INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,actor_inbox) values(?,?,?,?,?,?,?,?,?,?,?,?)';

    for (const item of jsonData.orderedItems) {
      let contentText = item.object.content;
      if (item.object.attachment && item.object.attachment.length) {
        const myURL = new URL(item.actor);
        const targetDomain = myURL.hostname;

        for (const imgobj of item.object.attachment) {
          if (imgobj.mediaType.startsWith('image')) {
            const url = `https://${targetDomain}/system/${imgobj.url}`;
            contentText += `<hr/><img src=${url} alt='' /> `;
          }
        }
      }

      const paras = [
        item.object.id,
        session.did,
        rows[0].actor_name,
        rows[0].avatar,
        rows[0].actor_account,
        rows[0].actor_url,
        `mastodon ${item.object.published}`,
        contentText,
        0,
        0,
        '',
        rows[0].actor_inbox,
      ];

      if (paras[0]) {
        await execute(sql, paras);
      }
    }

    return NextResponse.json({ msg: 'Complete import' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ errMsg: err.message }, { status: err.httpCode || 500 });
  }
}

export async function GET() {
  return NextResponse.json({ errMsg: 'Method Not Allowed' }, { status: 405 });
}
