import Image from 'next/image';
import React, { useMemo } from 'react';

type SvgImageProps = {
  svgCode: string;
  useBase64?: boolean;
  style?: React.CSSProperties;
  className?: string;
  width:number;
  height:number;

};

export const SvgImage: React.FC<SvgImageProps> = ({
  svgCode,
  useBase64 = true,
  style,
  className,
  width,height
}) => {
  const imgSrc = useMemo(() => {
    if (!svgCode) return '';

    if (useBase64) {
      const utf8Bytes = new TextEncoder().encode(svgCode);
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return 'data:image/svg+xml;base64,' + btoa(binary);
    } else {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCode);
    }
  }, [svgCode, useBase64]);


  return (
  <>{
      imgSrc? <Image
      src={imgSrc} 
      width={width}
      height={height}
      style={style}
      className={className}
      alt="SVG"
        />
      :<></>
    }
  
  </>
   
  );
};
