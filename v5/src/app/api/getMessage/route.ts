import { NextResponse } from 'next/server';
import { messagePageData } from "@/lib/mysql/message";

////pi,menutype,daoid,w,actorid:嗯文人ID,account,order,eventnum
// menutype 1 我的社区，2 公区社区 3 个人社区
//eventnum 社区: 0 非活动，1活动, 个人：1:首页 2:我的嗯文 3:我的收藏 4:我的接收嗯文 
// v: 1 我关注的社区
// export async function messagePageData({pi,menutype,daoid,w,actorid,account,order,eventnum,v})
// app/api/message/route.ts



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const menutype = searchParams.get('menutype') || '';
  const account = searchParams.get('account') || '';
  const pi = searchParams.get('pi') || '';
  const daoid = searchParams.get('daoid') || '';
  const eventnum = searchParams.get('eventnum') || '';

  if (!account) {
    return NextResponse.json({ errMsg: 'Bad request.' }, { status: 400 });
  }

  const re = await messagePageData({
    pi,
    menutype,
    daoid,
    w: '',
    actorid: 0,
    account,
    order: 'id',
    eventnum,
    v: ''
  });

  return NextResponse.json(re);
}
