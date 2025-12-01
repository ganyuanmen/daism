import { useRef, useEffect, ReactNode } from "react";

type Props = {
  children: ReactNode;
};


export default function AutoShrinkScale({ children }:Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (!wrapper || !text) return;

    const resize = () => {
      text.style.transform = "scale(1)";
      text.style.transformOrigin = "left center";

      const wrapWidth = wrapper.clientWidth;
      const textWidth = text.scrollWidth;

      if (textWidth <= wrapWidth) {
        text.style.transform = "scale(1)";
        return;
      }

      const scale = wrapWidth / textWidth;
      text.style.transform = `scale(${scale})`;
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    ro.observe(text);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div ref={textRef} style={{ display: "inline-block" }}>
        {children}
      </div>
    </div>
  );
}
