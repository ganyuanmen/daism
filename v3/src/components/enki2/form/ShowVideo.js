import React from 'react';


const ShowVideo = ({ videoUrl,title='' }) => {

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

      <div className='daism-video-container'  >
        <iframe ref={boxRef} className='daism-iframebox'
          src={videoUrl}
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen
          title={title}
        ></iframe>
      </div>
    
  );
};

export default React.memo(ShowVideo);