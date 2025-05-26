import React from 'react';

/**
 * 显示视频
 * @vedioUrl 视频地址
 */
const ShowVedio = ({ vedioUrl }) => {
  // const extension = vedioUrl.split('.').pop(); 
  return (
    <video style={{width:'100%'}} controls><source src={vedioUrl} type='video/mp4' /></video>
  );
};

export default React.memo(ShowVedio);