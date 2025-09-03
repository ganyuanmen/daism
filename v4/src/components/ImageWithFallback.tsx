import Image from 'next/image';
import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  fallback?: string;
  alt: string;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  fallback = '/user.svg', 
  style,
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 重置为传入的src或fallback
    setImgSrc(src || fallback);
    
    // 如果src不存在或者是空字符串，直接使用fallback
    if (!src) {
      setImgSrc(fallback);
      return;
    }

    // 检查图片是否可加载
    const img =  new window.Image();
    img.onload = () => {
      setImgSrc(src);
    };
    img.onerror = () => {
      setImgSrc(fallback);
    };
    img.src = src;

    // 清理函数
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallback;
    setImgSrc(fallback);
  };

  return (
    <Image
      ref={imgRef}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      src={imgSrc}
      style={{ borderRadius: '10px', ...style }}
      onError={handleError}
      {...props}
    />
  );
}
