import React from 'react';
import { Card } from "react-bootstrap";
import ShowAddress from '../ShowAddress';
import { useTranslations } from "next-intl";
import ImageWithFallback from '../ImageWithFallback';


interface DaoInfoDivProps {
  record: DaismDao;
}

const DaoInfoDiv: React.FC<DaoInfoDivProps> = ({ record }) => {  
  const t = useTranslations('ff');
  
  // 处理logo URL，如果不存在或太短则使用默认logo
  const logoUrl = !record.dao_logo || record.dao_logo.length < 12 
    ? '/logo.svg' 
    : record.dao_logo;

  return (
    <Card className='mb-2 daism-title'>
      <Card.Header>Smart Commons {t('infoText')}</Card.Header>
      <Card.Body>
        <div className='row mb-3'>
          <div className='col-auto me-auto d-flex align-items-center'>
            <ImageWithFallback 
              alt={record.dao_name} 
              width={48} 
              height={48} 
              src={logoUrl}
              fallback='/logo.svg'
              // onError={(e) => {
              //   // 图片加载失败时使用默认logo
              //   const target = e.target as HTMLImageElement;
              //   target.src = '/logo.svg';
              // }}
            />
            <div style={{ paddingLeft: '10px' }}>
              <div>{record.dao_name}</div>
              <div>{record.dao_symbol}</div>
            </div>
          </div>
          <div className='col-auto'>
            <div>{t('daoManagerText')}:</div>
            <ShowAddress address={record.dao_manager} />
          </div>
        </div>
        <hr/>
        <div>
          {/* 注意：使用dangerouslySetInnerHTML需要确保内容安全 */}
          <div dangerouslySetInnerHTML={{ __html: record.dao_desc }} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default DaoInfoDiv;