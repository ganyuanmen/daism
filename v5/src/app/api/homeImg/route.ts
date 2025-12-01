
import { NextRequest, NextResponse } from 'next/server';
import {  execute } from "@/lib/mysql/common";
import { saveImage } from "@/lib/utils";
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    const session = await getSession();
    // const currentIp = getClientIp(request);
    if (!session ||  session.userAgent !== request.headers.get('user-agent')) {
        return NextResponse.json({ errMsg: 'No wallet signature login'  }, { status: 500 });
    }
   
    if(session.did.toLowerCase()!==process.env.NEXT_PUBLIC_SITEMANAGER?.toLowerCase() && session.did.toLowerCase()!==process.env.NEXT_PUBLIC_ADMI_ACTOR?.toLowerCase()){
      return NextResponse.json({ errMsg: 'unauthorized'  }, { status: 500 });
    }

  try {
  
    const formData = await request.formData();
    
    const field= formData.get('field') as string;
    const file = formData.get("file") as File; //首页图片
     
    let lok=0;

    const _path:string=await saveImage(file) as string;
    lok= await execute(`UPDATE a_home SET ${field}=? WHERE id=1`, [_path]);
 
    if(lok===0) {
      throw new Error("fail update")
    }
   
      return NextResponse.json({ok:true});
   

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { errMsg: err?.toString() || 'Internal server error' },
      { status: err?.httpCode || 500 }
    );
  }
}
