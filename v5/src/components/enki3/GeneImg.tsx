import { useState } from 'react';
import { User1Svg } from '@/lib/jssvg/SvgCollection';
import Image from 'next/image';

interface GeneImgProps {
  avatar: string;
  hw?: number; //头像宽高
}

export default function GeneImg({ avatar, hw = 64 }: GeneImgProps) {
  const [imgError, setImgError] = useState(false);

  if (!avatar || imgError) {
    // 图片不存在或加载失败，显示占位图
    return <User1Svg size={hw} />;
  }

  return (
    <Image
      src={avatar}
      alt="avatar"
      width={hw}
      height={hw}
      style={{ borderRadius: '10px' }}
      onError={() => setImgError(true)} // 加载失败时切换到占位图
    />
  );
}
