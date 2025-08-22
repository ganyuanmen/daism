import { NextRequest, NextResponse } from "next/server";
import { createFollow } from "@/lib/activity";
import { v4 as uuidv4 } from "uuid";
import { signAndSend, broadcast } from "@/lib/net";
import { getUser } from "@/lib/mysql/user";
import { getLocalInboxFromUrl, getLocalInboxFromAccount, getInboxFromUrl } from "@/lib/mysql/message";
import { saveFollow } from "@/lib/mysql/folllow";

interface FollowRequestBody {
  account: string; // 本地用户，关注人
  url: string;     // 被关注人 url
}

export async function POST(req: NextRequest) {
  try {
    const body: FollowRequestBody = await req.json();
    const { account, url } = body;
    if (!account || !account.includes('@') || !url) return NextResponse.json({ errMsg: "missing params" }, { status: 400 });

    const guid = uuidv4().replaceAll("-", "");
    const targetDomain = new URL(url).hostname;
    const [userName, domain] = account.split("@");

    if (targetDomain === process.env.NEXT_PUBLIC_DOMAIN) {
      // 本地关注
      const actor = await getLocalInboxFromUrl(url); //被关注者信息
      const user = await getLocalInboxFromAccount(account); //本人信息
      const re = await saveFollow({ actor, user, followId: guid });
      if (!re) return NextResponse.json({ errMsg: "fail" }, { status: 500 });
      broadcast({ type: "follow", domain, user, actor, followId: guid }); //广播到其它服务器
    } else {
      // 远程关注
      const actor = await getInboxFromUrl(url);
      const bodyData = createFollow(userName, domain, url, guid);
      const localUser = await getUser("actor_account", account, "privkey");
      await signAndSend(actor.inbox, userName, domain, bodyData, localUser.privkey);
      //这里的广播在收件箱中进行
    }

    return NextResponse.json({ msg: "ok" });
  } catch (err) {
    console.error("POST /api/activitepub/follow:", err);
    return NextResponse.json({ errMsg: "fail" }, { status: 500 });
  }
}
