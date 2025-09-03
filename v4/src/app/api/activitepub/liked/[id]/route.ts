import { NextRequest, NextResponse } from 'next/server';
import { createLiked } from "@/lib/activity";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id:name } = await params;

  if (!name) {
    return NextResponse.json(
      { errMsg: 'Bad request.' },
      { status: 400 }
    );
  }

  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN ;
    if (!domain) {
      return NextResponse.json(
        { errMsg: 'Server configuration error' },
        { status: 500 }
      );
    }

    const followersCollection = createLiked(name, domain, []);
    return NextResponse.json(followersCollection);

  } catch (error) {
    console.error('Error in liked handler:', error);
    return NextResponse.json(
      { errMsg: 'Internal server error' },
      { status: 500 }
    );
  }
}
