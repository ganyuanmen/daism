import { NextRequest, NextResponse } from "next/server";
import { getFollowers } from "@/lib/mysql/folllow";
import { createFollowers } from "@/lib/activity";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;

  if (!id) {
    return NextResponse.json({ errMsg: "Bad request." }, { status: 400 });
  }

  try {
    const followers = await getFollowers({
      account: `${id}@${process.env.NEXT_PUBLIC_DOMAIN}`,
    });

    const followersCollection = createFollowers(
      id,
      process.env.NEXT_PUBLIC_DOMAIN as string,
      followers
    );

    return NextResponse.json(followersCollection, { status: 200 });
  } catch (error: any) {
    console.error("followers API error:", error);
    return NextResponse.json(
      { errMsg: "Internal server error." },
      { status: 500 }
    );
  }
}
