import { NextRequest, NextResponse } from 'next/server';
import { updateActor, getActor } from '@/lib/mysql/user';
// import { saveImageFromBuffer } from "@/lib/utils"; // 需要修改 saveImage 函数
import { execute } from '@/lib/mysql/common';
import { saveImage } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const imgDirectory = process.env.IMGDIRECTORY;
    
    if (!domain || !imgDirectory) {
      return NextResponse.json(
        { errMsg: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 解析 FormData
    const formData = await request.formData();
    
    const account = formData.get('account') as string;
    const actorDesc = formData.get('actorDesc') as string;
    const did = formData.get('did') as string;
    const file = formData.get('file') as File ;
    
    
    if (!did || !account) {
        return NextResponse.json(
          { errMsg: 'Actor ID or Account is required' },
          { status: 400 }
        );
      }

    const imagePath = await saveImage(file);

    // 更新用户信息
    const updateSuccess = await updateActor({ 
      account, 
      actorDesc: actorDesc || '', 
      path: imagePath 
    });
    
    if (!updateSuccess) {
      return NextResponse.json(
        { errMsg: 'Update failed' },
        { status: 500 }
      );
    }

    // 更新消息头像（异步）
    if (imagePath) {
      const sql = "UPDATE a_message SET avatar = ? WHERE actor_account = ?";
      execute(sql, [imagePath, account]).catch(error => {
        console.error('Failed to update message avatar:', error);
      });
    }


    const actorData = await getActor(did);
    return NextResponse.json(actorData);

  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { errMsg: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
