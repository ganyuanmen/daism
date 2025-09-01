import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(request: NextRequest) {
  try {
    const _path=new Date().toISOString().slice(0, 10);
    const uploadDir = path.join(process.cwd(), 'public', process.env.IMGDIRECTORY as string, _path);

    // 创建上传目录
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 解析 FormData
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;

    if (!videoFile) {
      return NextResponse.json(
        { errMsg: 'No video file provided' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json(
        { errMsg: 'Only supports uploading video files' },
        { status: 400 }
      );
    }

    // 检查文件大小（120MB限制）
    if (videoFile.size > 120 * 1024 * 1024) {
      return NextResponse.json(
        { errMsg: 'File size exceeds 120MB limit' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExtension = videoFile.name.split('.').pop() || 'mp4';
    const fileName = `${timestamp}_${randomStr}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // 转换 File 为 Buffer 并保存
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    if (!domain) {
      return NextResponse.json(
        { errMsg: 'Server configuration error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Upload successful",
      path: `https://${domain}/uploads/${_path}/${fileName}`,
    });

  } catch (error: any) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { errMsg: error.message || 'Internal server error' },
      { status: error.httpCode || 500 }
    );
  }
}
