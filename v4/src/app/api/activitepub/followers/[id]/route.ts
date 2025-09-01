
import { createFollowers } from '@/lib/activity';
import { getFollowers } from '@/lib/mysql/folllow';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {

    const { id } = params;
  
    const followers =await getFollowers({account:`${id}@${process.env.NEXT_PUBLIC_DOMAIN}`})
    const followersCollection = createFollowers(id,process.env.NEXT_PUBLIC_DOMAIN as string,followers)

  
  return NextResponse.json(followersCollection);
}

