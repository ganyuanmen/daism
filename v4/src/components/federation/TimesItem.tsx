import React from 'react';
import { TimeSvg } from "../../lib/jssvg/SvgCollection"
import { useTranslations } from 'next-intl'

interface TimeItemProps {
  currentObj:EnkiMessType;
}

/**
 * 嗯文时间显示组件
 * @param currentObj - 嗯文或回复的对象，包含时间信息
 */
const TimeItem: React.FC<TimeItemProps> = ({ currentObj }) => {  
  const t = useTranslations('ff');

  const geneTimes = (): string => {
    // 确保时间是 Date 对象
    const currentTime = new Date(currentObj.currentTime);
    const createtime = new Date(currentObj.createtime);
    
    // 验证日期是否有效
    if (isNaN(currentTime.getTime()) || isNaN(createtime.getTime())) {
      return t('invalidTime') || 'Invalid time';
    }

    const diffInMilliseconds = currentTime.getTime() - createtime.getTime();
    const diffInSeconds = Math.abs(diffInMilliseconds) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} ${t('minute')}`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ${t('hour')}`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} ${t('day')}`;
    } else {
      const month = String(createtime.getMonth() + 1).padStart(2, '0');
      const day = String(createtime.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    }
  };

  return (
    <span> 
      <TimeSvg size={24} /> 
      {geneTimes()} 
    </span>
  );
};

export default TimeItem;