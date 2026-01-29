import { NextRequest, NextResponse } from 'next/server';
import { getUser } from "@/lib/mysql/user";
import { createActor } from "@/lib/activity";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id: name } = params;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id:name } = await params;
  const lowerName = name.toLowerCase();

  if (!lowerName) {
    return new NextResponse('Bad request.', { status: 400 });
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  if (!domain) {
    return new NextResponse('Server configuration error', { status: 500 });
  }

  try {
    const localUser = await getUser(
      'actor_account',
      `${lowerName}@${domain}`,
      'actor_account,pubkey,avatar,dao_id,id,actor_desc,manager'
    ) ;

    if (!localUser?.actor_account) {
      return new NextResponse(`No record found for ${lowerName}.`, { status: 404 });
    }

    const acceptHeader = request.headers.get('accept')?.toLowerCase();
    const contentTypeHeader = request.headers.get('content-type')?.toLowerCase();

    const isActivityRequest = 
      acceptHeader?.startsWith('application/activity') || 
      contentTypeHeader?.startsWith('application/activity');

    if (isActivityRequest) {
      const rejson = createActor(lowerName, domain, localUser);
      
      // 修复 SVG mediaType
      if (rejson.icon?.mediaType === 'image/svg') {
        rejson.icon.mediaType = 'image/svg+xml';
      }

      return new NextResponse(JSON.stringify(rejson), {
        status: 200,
        headers: {
          'Content-Type': 'application/activity+json; charset=utf-8',
          'Accept': 'application/activity+json',
          'Connection': 'close'
        }
      });
    } else {
      const host = request.headers.get("host");

      return NextResponse.redirect(`https://${host}/${lowerName}`);

      // return NextResponse.redirect(new URL(`/${lowerName}`, request.url));
    }

  } catch (error) {
    console.error('Error in actor handler:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
