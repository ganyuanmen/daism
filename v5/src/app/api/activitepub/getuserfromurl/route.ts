import { NextRequest, NextResponse } from 'next/server';
import { getUser } from "@/lib/mysql/user";
import { createWebfinger } from "@/lib/activity";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  if (!resource || !resource.includes('@') || !resource.toLowerCase().startsWith('acct:')) {
    return new NextResponse(
      'Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.',
      { status: 400 }
    );
  }

  const account = resource.replace('acct:', '').toLowerCase();
  const [userName, domain] = account.split('@');
  
  if (domain !== process.env.NEXT_PUBLIC_DOMAIN) {
    return new NextResponse(
      'Requested user is not from this domain',
      { status: 400 }
    );
  }

  try {
    const user = await getUser('actor_account', account, 'id,avatar');
    
    if (!user?.id) {
      return new NextResponse(
        `No record found for ${account}.`,
        { status: 404 }
      );
    }

    const reJson = createWebfinger(userName, domain, user.id, user.avatar);
    return NextResponse.json(reJson);

  } catch (error) {
    console.error('Error in webfinger handler:', error);
    return new NextResponse(
      'Internal server error',
      { status: 500 }
    );
  }
}
