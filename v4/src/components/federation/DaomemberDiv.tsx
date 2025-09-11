import React from 'react';
import { Card } from "react-bootstrap";
import ShowAddress from '../ShowAddress';
import { User1Svg } from "../../lib/jssvg/SvgCollection";
import { useTranslations } from "next-intl";
import ImageWithFallback from '../ImageWithFallback';



interface DaoMemberDivProps {
  record: DaoMember[];
  dao_manager: string;
}

// 成员列表
const DaoMemberDiv: React.FC<DaoMemberDivProps> = ({ record, dao_manager }) => {  
  const t = useTranslations('ff');

  // 比较地址是否相等（不区分大小写）
  const isDaoManager = (address: string): boolean => {
    return dao_manager.toLowerCase() === address.toLowerCase();
  };

  return (
    <Card className='mb-2 daism-title'>
      <Card.Header>{t('daoMember')}</Card.Header>
      <Card.Body>
        {record.map((obj, idx) => (
          <div 
            className='row mb-2 p-1' 
            style={{ borderBottom: '1px solid gray' }}  
            key={idx}
          >
            <div className='col'>
              <ShowAddress address={obj.member_address} />
            </div>
            <div className='col'>
              {obj.actor_url && (
                <a 
                  href={obj.actor_url}  
                  className="daism-a"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {obj.avatar ? (
                    <ImageWithFallback 
                      src={obj.avatar} 
                      fallback='/user.svg'
                      alt={obj.actor_account || ''} 
                      style={{
                        width: "32px", 
                        height: "32px", 
                        borderRadius: '10px'
                      }}
                      onError={(e) => {
                        // 图片加载失败时的处理
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User1Svg size={32} />
                  )}
                  <span style={{ display: 'inline-block', paddingLeft: '6px' }}>
                    {obj.actor_account}
                  </span>
                </a>
              )}
            </div>
            <div className='col'>
              {isDaoManager(obj.member_address) ? (
                <span>{t('daoManagerText')}</span>
              ) : (
                <span>{t('originMember')}</span>
              )}
            </div> 
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default DaoMemberDiv;