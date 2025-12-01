import React from 'react';

interface ShowVideoProps {
  videoUrl: string;
}

/**
 * 显示视频组件
 * @param videoUrl 视频地址
 */
const ShowVideo: React.FC<ShowVideoProps> = ({ videoUrl }) => {
  return (
    <video style={{ width: '100%' }} controls>
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support video playback.
   </video>
  );
};

export default React.memo(ShowVideo);