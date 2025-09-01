import { NextRequest, NextResponse } from 'next/server';

import { getCachedActor } from '@/lib/cache';
import { verifySignature } from '@/lib/activity/activityHandler';
import { addEipType } from '@/lib/mysql/daism';

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
        { errMsg: 'broadcast addType Invalid JSON format' },
        { status: 400 }
      );
    }

    if (typeof postbody !== 'object' || !postbody.actor ||!postbody.actor.name || !postbody.user || !postbody.user.url) {
      return NextResponse.json(
        { errMsg: 'broadcast addType broadcast body json error' },
        { status: 400 }
      );
    }
    //获取用户，主要取对应发送的公钥。
    const actor = await getCachedActor(postbody.user.url);
    if (!actor?.pubkey || !actor.account) {
      return NextResponse.json({ errMsg: 'actor not found' }, { status: 404 });
    }

    if (!await verifySignature(request, actor, `/api/broadcast/addType`)) {
      return NextResponse.json({ error: 'broadcast addType Invalid signature' }, { status: 401 });
    }

    console.info("broadcast addType Signature verified successfully!");
  


        await addEipType({_type: postbody.actor.name, _desc: postbody.actor.desc || ''
        });
      
    
     

    return NextResponse.json({ msg: 'ok' });

  } catch (error) {
    console.error("broadcast addType Broadcast handler error:", error);
    return NextResponse.json(
      { errMsg: 'broadcast addType Internal server error' },
      { status: 500 }
    );
  }
}
