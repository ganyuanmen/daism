
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ping: 'ok' }, { status: 200 });
}
