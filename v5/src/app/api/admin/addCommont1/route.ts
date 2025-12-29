
import { NextRequest, NextResponse } from 'next/server';
import { getData, execute } from "@/lib/mysql/common";
import {decrypt} from '@/lib/cryp'
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {

  try {
  
    const formData = await request.formData();
   
     const typeIndex= formData.get('typeIndex') as string;
     const pid= formData.get('pid') as string;
     const content= formData.get('content') as string;
     const bid= formData.get('bid') as string;
     const did= formData.get('did') as string;
     const token= formData.get('token') as string;
     const session =decrypt(token);

      if (!session || session.did1!==did || session.userAgent !== request.headers.get('user-agent')) {
          return NextResponse.json({ errMsg: 'No wallet login'  }, { status: 500 });
      }else {
        
    const message_id = uuidv4().replaceAll('-', '').toLowerCase();


    const sql = `INSERT INTO a_messagesc_commont(manager,pid,message_id,content,type_index,bid) VALUES(?,?,?,?,?,?)`;
    const params = [
      did,
      pid,
      message_id,
      content,
      typeIndex || '0',
      bid || Math.floor(Date.now() / 1000).toString()
    ];

    const result = await execute(sql, params);

    if (result>0) {

      // 返回新创建的消息
      const newMessage = await getData(
        `select * from v_messagesc_commont where message_id=?`,
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
    
      }




  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { errMsg: err?.toString() || 'Internal server error' },
      { status: err?.httpCode || 500 }
    );
  }
  
}

