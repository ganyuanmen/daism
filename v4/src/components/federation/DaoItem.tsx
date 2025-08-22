import ShowAddress from '../ShowAddress';
import Link from 'next/link';
import { Card, Row, Col } from 'react-bootstrap';
import { useTranslations } from 'next-intl';

// 定义 Dao 记录类型
export interface DaoRecord {
  dao_id: string | number;
  dao_name: string;
  dao_logo?: string;
  dao_manager: string;
  actor_account: string;
  creator: string;
}

interface DaoItemProps {
  record: DaoRecord;
}

export default function DaoItem({ record }: DaoItemProps) {
  const t = useTranslations('ff');

  return (
    <Link
      className="daism-a"
      href={`/smartcommons/daoinfo/[id]`}
      as={`/smartcommons/daoinfo/${record.dao_id}`}
    >
      <Card className="mb-1">
        <Card.Body>
          <Row>
            <Col className="col-auto me-auto  d-flex align-items-center">
              <img
                alt={record.dao_name}
                width={48}
                height={48}
                style={{ borderRadius: '10px' }}
                src={
                  !record.dao_logo || record.dao_logo.length < 12
                    ? '/logo.svg'
                    : record.dao_logo
                }
              />

              <div style={{ paddingLeft: '10px' }}>
                <span className="daism-span">{t('daoNameText')}:</span>
                <span>{record.dao_name}</span>
                <br />
                <span className="daism-span">{t('daoManagerText')}:</span>
                <ShowAddress address={record.dao_manager} />
              </div>
            </Col>
            <Col className="col-auto" style={{ minWidth: '200px' }}>
              <div>
                <span className="daism-span">{t('groupAccountText')}:</span>
                <span>{record.actor_account}</span>
                <br />
                <span className="daism-span">{t('dappAddress')}:</span>
                <ShowAddress address={record.creator} />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Link>
  );
}
