
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/mysql/daism'; // 根据你的项目路径调整

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const newAccount = searchParams.get('newAccount') || '';
  const oldAccount = searchParams.get('oldAccount') || '';

  if (!newAccount && !oldAccount) {
    return NextResponse.json({ errMsg: 'Bad request.' }, { status: 400 });
  }

  const re = await getUser({ newAccount, oldAccount });
  return NextResponse.json(re);
}
