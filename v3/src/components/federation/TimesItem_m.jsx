import { TimeSvg } from "../../lib/jssvg/SvgCollection"
import { useTranslations } from 'next-intl'
/**
 * 嗯文时间显示
 * @currentObj 嗯文或回复的对象
 */
export default function TimesItem_m({currentObj}) {  
    const t = useTranslations('ff')

    const geneTimes=()=>{
        const currentTime=new Date(currentObj.currentTime);
        const createtime=new Date(currentObj.createtime);
        const diffInMilliseconds = currentTime.getTime() - createtime.getTime();
        const diffInSeconds = diffInMilliseconds / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;

        if(diffInMinutes <60) return `${diffInMinutes>>0}m`;
        else if(diffInHours<24) return `${diffInHours>>0}h`;
        else if(diffInDays<7) return `${diffInDays>>0}d`;
        else {
            const month = String(createtime.getMonth() + 1).padStart(2, '0'); // 月份是从 0 开始的，需要加 1 并补零
            const day = String(createtime.getDate()).padStart(2, '0'); // 天数补零
            return `${month}-${day}`
        }
    }

    return (
        <span> {geneTimes()} </span>
    );
}


