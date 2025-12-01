
import { NextRequest, NextResponse } from 'next/server';
import { saveImage } from '@/lib/utils';

interface JoditUploadResponse {
  success: boolean;
  imageUrl?:string;
  error?: string;
}

// 允许的图片类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// 最大文件大小：1MB
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files[0]') as File[];
    if (!files || files.length === 0) {
      const response: JoditUploadResponse = {
        success: false,
        error: 'No files uploaded'
      };
      return NextResponse.json(response);
    }
    const file = files[0];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const response: JoditUploadResponse = {
        success: false,
        error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`
      };
      return NextResponse.json(response);
    }
    if (file.size > MAX_FILE_SIZE) {
      const response: JoditUploadResponse = {
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      };
      return NextResponse.json(response);
    }
    const imageUrl=await saveImage(file);
    if(!imageUrl) {
        const response: JoditUploadResponse = {
            success: false,
            error: `save Image fail`
          };
          return NextResponse.json(response);
         
    }

    const response: JoditUploadResponse = {
      success: true,
      imageUrl
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Jodit upload error:', error);
    const response: JoditUploadResponse = {
      success: false,
      error: 'Upload failed\n'+error.message
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
