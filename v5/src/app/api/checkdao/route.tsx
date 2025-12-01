
import { NextResponse } from 'next/server';
import { getJsonArray } from '@/lib/mysql/common'; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const daoName = searchParams.get('daoName') || '';
  const daoSymbol = searchParams.get('daoSymbol') || '';
  const creator = searchParams.get('creator') || '';

  const re = await getJsonArray(
    'checkdao',
    [daoName, daoSymbol, creator],
    true
  );

  return NextResponse.json(re, { status: 200 });
}
