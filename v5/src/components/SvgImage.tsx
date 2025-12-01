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
    const code=svgCode ||`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100"><rect width="150" height="100" fill="#ccc"/><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#000">No Image</text></svg>`;

    if (useBase64) {
      const utf8Bytes = new TextEncoder().encode(code);
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return 'data:image/svg+xml;base64,' + btoa(binary);
    } else {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(code);
    }
  }, [svgCode, useBase64]);


  return (
  <>{
      <Image
      src={imgSrc} 
      width={width}
      height={height}
      style={style}
      className={className}
      alt="SVG"
        />
     
    }
  
  </>
   
  );
};
