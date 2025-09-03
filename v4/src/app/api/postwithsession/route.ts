// app/api/postwithsession/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addEipType } from "@/lib/mysql/daism";
import { messageDel, setTopMessage, handleHeartAndBook, setAnnounce, updateNotice } from '@/lib/mysql/message';
import { broadcast } from "@/lib/net";
import { getSession } from '@/lib/session';
import { getClientIp } from '@/lib/utils';

// 定义方法类型
interface ApiMethods {
  [key: string]: (body: any) => Promise<any>;
}

const methods: ApiMethods = {
  messageDel, // 删除
  addEipType, // 增加eip 类型
  handleHeartAndBook, // 点赞、取消点赞
  setTopMessage, // 取置顶
  setAnnounce, // 转发
  updateNotice, // 更新为已读
};

// 定义请求体类型（根据实际需求调整）
interface RequestBody {
  _type?: string;
  _desc?: string;
  // 添加其他可能的字段
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    const currentIp = getClientIp(request);
    if (!session || session.ip !== currentIp || session.userAgent !== request.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }
  try {
    // 获取 method 头部
    const method = request.headers.get('x-method');
    
    if (!method) {
      return NextResponse.json(
        { errMsg: 'Method header is required' },
        { status: 400 }
      );
    }

    // 检查方法是否存在
    if (!methods[method]) {
      return NextResponse.json(
        { errMsg: `Method '${method}' not found` },
        { status: 404 }
      );
    }

    // 解析请求体
    const body: RequestBody = await request.json();


    // 执行对应的方法
    const result = await methods[method](body);
    
    if(result && method==='addEipType')  //广播类型
    {
      broadcast({type:'addType',domain:process.env.LOCAL_DOMAIN as string,
        actor:{name:body._type,desc:body._desc} as ActorInfo,user:{} as ActorInfo,followId:'0'})  //广播信息
    } 

    return NextResponse.json({ state: result });

  } catch (error: any) {
    console.error('error for POST /api/postwithsession:', error);
    
    return NextResponse.json(
      { errMsg: 'fail: ' + error.toString() },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json({ errMsg: 'Method Not Allowed' }, { status: 405 });
}
