"use client";

import { type HomeDataType } from './page';
import { useTranslations } from 'next-intl';
import SmarcommonText from './SmarcommonText';


interface PropsType{
    obj:HomeDataType
}

export default function SmarcommonPlugin({obj}:PropsType) {

    const t = useTranslations('set');
    const tc = useTranslations('Common');


  return (
    <div>
        <div className='mt-5 mb-5' style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px'}} >
            <SmarcommonText text={obj.var_zh} local='zh' t={t} tc={tc} />
            <SmarcommonText text={obj.var_en} local='en' t={t} tc={tc} />
        </div>
    </div>
    );
}
