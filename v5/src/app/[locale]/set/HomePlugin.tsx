"use client";

import { type HomeDataType } from './page';
import HomeImg from './HomeImg';
import { useTranslations } from 'next-intl';
import HomeText from './HomeText';


interface PropsType{
    obj:HomeDataType
}

export default function HomePlugin({obj}:PropsType) {

    const t = useTranslations('set');
    const tc = useTranslations('Common');



  return (
    <div>
        <div className="mt-2 mb-2" style={{display:'flex',alignItems:'center',gap:'20px',justifyContent:'space-between',width:'100%'}} >
        <HomeImg field='svg_big_zh' title={t('bigzhText')} srcimg={obj.svg_big_zh} t={t} tc={tc} />
        <HomeImg field='svg_big_en' title={t('bigenText')} srcimg={obj.svg_big_en} t={t} tc={tc} />
        <HomeImg field='svg_sm_zh' title={t('smzhText')} srcimg={obj.svg_sm_zh} t={t} tc={tc} />
        <HomeImg field='svg_sm_en' title={t('smenText')} srcimg={obj.svg_sm_en} t={t} tc={tc} />
        </div>
       
      
        <div className='mt-5 mb-5' style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px'}} >
            <HomeText text={obj.var_zh} local='zh' t={t} tc={tc} />
            <HomeText text={obj.var_en} local='en' t={t} tc={tc} />
        </div>
  
    </div>
    );
}
