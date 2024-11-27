import { TimeSvg } from "../../lib/jssvg/SvgCollection"
export default function TimesItem({t,times}) {  
    const getTimes=(times)=> {
        if(!times) return ''
        let _index=times.indexOf('_')
        if(_index>0)
        {
            let key=times.substring(_index+1,times.length)
            if(t(key)) return `${times.substring(0,_index)}${t(key)}`
        }
        return ''
    }
    return (
        <span> <TimeSvg size={24} /> {times==='0_minute'?t('lessThen'):getTimes(times)}          
        </span>
    );
}


