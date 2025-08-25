import React, { useMemo } from 'react';

type SvgImageProps = {
  svgCode: string;
  useBase64?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export const SvgImage: React.FC<SvgImageProps> = ({
  svgCode,
  useBase64 = true,
  style,
  className,
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

  const { defaultWidth, defaultHeight } = useMemo(() => {
    const widthMatch = svgCode.match(/width="([\d.]+)"/);
    const heightMatch = svgCode.match(/height="([\d.]+)"/);
    return {
      defaultWidth: widthMatch ? widthMatch[1] : undefined,
      defaultHeight: heightMatch ? heightMatch[1] : undefined,
    };
  }, [svgCode]);

  return (
    <img
    src={imgSrc || undefined} 
    // HTML 属性仅作为默认值，如果 style 提供 width/height，会覆盖
    width={defaultWidth}
    height={defaultHeight}
    style={style}
    className={className}
    alt="SVG"
  />
  );
};
