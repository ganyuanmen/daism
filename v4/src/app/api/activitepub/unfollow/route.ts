import { NextRequest, NextResponse } from "next/server";
import { createUndo } from "@/lib/activity";
import { broadcast, getSigneActor } from "@/lib/net";
import { getData } from "@/lib/mysql/common";
import { removeFollow } from "@/lib/mysql/folllow";
import { sendSignedActivity } from "@/lib/activity/sendSignedActivity";

interface UnfollowRequestBody {
  account: string; // 本地用户，执行取消关注的人
  url: string;     // 被取消关注的用户的 url
  id: number;      // 数据库 a_follow 表中的主键 id
  inbox: string;  
}

export async function POST(req: NextRequest) {
  try {
    const body: UnfollowRequestBody = await req.json();
    const { account, url, id,inbox } = body;

    if (!account || !account.includes('@') || !url || !id) {
      return NextResponse.json({ errMsg: "missing parameters" }, { status: 400 });
    }

    // 从我关注他人的库取出 follow_id
    const result = await getData("select follow_id from a_follow where id=?", [id]);
    if (!result[0]) {
      return NextResponse.json({ errMsg: "no found follow Id" }, { status: 500 });
    }

    const followId = result[0].follow_id;
    const [userName, domain] = account.split("@");

    const localActor=await getSigneActor(account);

    // 如果被取消关注的用户不是本地
    if (!url.includes(process.env.NEXT_PUBLIC_DOMAIN as string)) {
      // const actor = await getInboxFromUrl(url);
      const bodyData = createUndo(userName, domain, url, followId);
      if(localActor){
        sendSignedActivity(inbox, bodyData,localActor )
        .catch(error => console.error('sendSignedActivity error:', error));
      }

    }

    // 删除关注记录
    const removed = await removeFollow(followId);
    if (!removed) {
      return NextResponse.json({ errMsg: "fail" }, { status: 500 });
    }

    // 广播取消关注事件
    if(localActor) {
      broadcast({type: "removeFollow",domain: process.env.NEXT_PUBLIC_DOMAIN!,
        actor: {} as ActorInfo,user: {url:localActor.publicKeyId} as ActorInfo,followId
      });
    }
   

    return NextResponse.json({ msg: "ok" });
  } catch (err) {
    console.error("POST /api/activitepub/unfollow:", err);
    return NextResponse.json({ errMsg: "fail" }, { status: 500 });
  }
}
