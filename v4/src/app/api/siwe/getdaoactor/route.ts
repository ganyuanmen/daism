

import { getJsonArray } from "@/lib/mysql/common";
import { getSession } from "@/lib/session";
import { getClientIp } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const session = await getSession();
    const currentIp = getClientIp(request);
    if (!session || session.ip !== currentIp || session.userAgent !== request.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }
    return NextResponse.json({
        daoActor:await getJsonArray('daoactor',[session.did]), //dao帐号列表
        actor:await getJsonArray('actor',[session.did],true)  //个人帐号
    });


  
  
}