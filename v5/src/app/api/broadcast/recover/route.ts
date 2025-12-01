import { NextRequest, NextResponse } from 'next/server';
import { getCachedActor } from '@/lib/cache';
import { verifySignature } from '@/lib/activity/activityHandler';
import { execute } from '@/lib/mysql/common';

interface BroadcastBody {
  actor: ActorInfo;
  user:ActorInfo;  //发送用户，对方用私钥加密，这里用公钥解密 
}

export async function POST(request: NextRequest) {
  try {
    let postbody: BroadcastBody;
    
    try {
      const bodyText = await request.text();
      postbody = bodyText ? JSON.parse(bodyText) : {};
    } catch (error) {
      console.error("Broadcast JSON parse error:", error);
      return NextResponse.json(
        { errMsg: 'broadcast recover Invalid JSON format' },
        { status: 400 }
      );
    }

    if (typeof postbody !== 'object' || !postbody.actor || !postbody.actor.account || !postbody.user || !postbody.user.url) {
      return NextResponse.json(
        { errMsg: 'broadcast recover broadcast body json error' },
        { status: 400 }
      );
    }
    //获取用户，主要取对应发送的公钥。
    const actor = await getCachedActor(postbody.user.url);
    if (!actor?.pubkey || !actor.account) {
      return NextResponse.json({ errMsg: 'actor not found' }, { status: 404 });
    }

    if (!await verifySignature(request, actor, `/api/broadcast/recover`)) {
      return NextResponse.json({ error: 'broadcast recover Invalid signature' }, { status: 401 });
    }

    console.info("broadcast recover Signature verified successfully!");
  
       
    if (postbody.user?.account) {
        const sql = "CALL recover_follow(?, ?)";
        const paras = [postbody.user.account, postbody.actor.account ];
        await execute(sql, paras);
      }
     

    return NextResponse.json({ msg: 'ok' });

  } catch (error) {
    console.error("broadcast recover Broadcast handler error:", error);
    return NextResponse.json(
      { errMsg: 'broadcast recover Internal server error' },
      { status: 500 }
    );
  }
}
