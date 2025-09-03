import { NextRequest, NextResponse } from "next/server";
import { getFollowees } from "@/lib/mysql/folllow";
import { createFollowees } from "@/lib/activity";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ errMsg: "Bad request." }, { status: 400 });
  }

  try {
    const followees = await getFollowees({
      account: `${id}@${process.env.LOCAL_DOMAIN}`,
    });

    const followeesCollection = createFollowees(
      id,
      process.env.LOCAL_DOMAIN as string,
      followees
    );

    return NextResponse.json(followeesCollection);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errMsg: "Internal server error" },
      { status: 500 }
    );
  }
}
