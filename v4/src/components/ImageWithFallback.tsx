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
  fallback = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100"><rect width="150" height="100" fill="#ccc"/><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#000">No Image</text></svg>`, 
  style,
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const imgRef = useRef<HTMLImageElement>(null);
  const[realWidth,setRealWidth]=useState(0);
  const[realHeigh,setRealHeight]=useState(0);

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
      setRealHeight(img.height);
      setRealWidth(img.width)
      // resolve({ width: , height:  });
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
      width={width?Number(width):realWidth>0?realWidth:30}
      height={height?Number(height):realHeigh>0?realHeigh:30}
      src={imgSrc}
      style={{ borderRadius: '10px', ...style }}
      onError={handleError}
      {...props}
    />
  );
}
