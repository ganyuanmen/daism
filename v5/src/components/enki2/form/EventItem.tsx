import { Row, Col } from "react-bootstrap";
import { LocationSvg, DateSvg, WebsitSvg } from '../../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl';


// 定义组件 props 类型
interface EventItemProps {
  currentObj: EnkiMessType;
}

export default function EventItem({ currentObj }: EventItemProps) {
  const t = useTranslations('ff');
  
  // 格式化日期时间显示（如果需要）
  const formatDateTime = (datetime: Date | undefined): string => {
    if (!datetime) return '';
    
    const dateObj = new Date(datetime);
    
    // 确保日期有效
    if (isNaN(dateObj.getTime())) return '';
  
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  return (
    <Row className="mt-2">
      <Col className="col-auto me-auto">
        <div className="d-flex align-items-center mb-2">
          <DateSvg size={24}  />
          <div>
            <strong>{t('fromText')}:</strong> {formatDateTime(currentObj.start_time)} (UTC+8)
          </div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <DateSvg size={24}  />
          <div>
            <strong>{t('toText')}:</strong> {formatDateTime(currentObj.end_time)} (UTC+8)
          </div>
        </div>
      </Col>
      
      <Col className="col-auto">
        <div className="d-flex align-items-center mb-2">
          <LocationSvg size={24}  />
          <div>
            <strong>{t('addressText')}:</strong> {currentObj.event_address}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <WebsitSvg size={24}  />
          <div>
            <strong>{t('urlText')}:</strong> 
            {currentObj.event_url ? (
              <a 
                href={currentObj.event_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ms-1"
              >
                {currentObj.event_url}
              </a>
            ) : (
              <span className="ms-1">-</span>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}