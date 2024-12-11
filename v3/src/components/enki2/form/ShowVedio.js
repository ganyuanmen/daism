import React from 'react';

/**
 * 显示视频
 * @vedioUrl 视频地址
 */
const ShowVedio = ({ vedioUrl }) => {

  const boxRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (boxRef.current) {
        const width = boxRef.current.offsetWidth;
        boxRef.current.style.height = `${width * 2/3}px`;
      }
    };

    handleResize(); // 初始化时计算一次
    window.addEventListener('resize', handleResize); // 窗口大小改变时重新计算

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
        <iframe ref={boxRef} className='daism-iframebox'
          src={vedioUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
          // title={title}
        ></iframe>

    
  );
};

export default React.memo(ShowVedio);