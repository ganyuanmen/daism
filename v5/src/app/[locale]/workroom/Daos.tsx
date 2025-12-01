"use client";
import Loadding from '@/components/Loadding';
import { Card, Col, Row } from 'react-bootstrap';
import ShowErrorBar from '@/components/ShowErrorBar';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import CreateDao from '@/components/my/CreateDao';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store/store';
import { useFetch } from '@/hooks/useFetch';
import ImageWithFallback from '@/components/ImageWithFallback';

interface DaoItem {
  dao_id: string | number;
  dao_logo?: string;
  dao_name: string;
  dao_symbol: string;
  dao_time: string;
  dao_manager: string;
}

/**
 * 我的 Smart Common
 */
export default function Daos() {
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user); // 钱包用户信息

  const { data, status, error } = useFetch<DaoItem[]>(`/api/getData?did=${user.account}`,
    'getMyDaos',[]);
  // const daosData = useMyDaoData(user.account);
  


  return (
    <>
      <CreateDao   />
      {
        status==='loading'?<Loadding />
        :(status==='failed' || !data)? <ShowErrorBar errStr={error ?? ''} />
        :data.length===0? <ShowErrorBar errStr={tc('noDataText')} />
        : <DaosPage daosData={data}  />
      }
     
    </>
  );
}

/**
 * 子组件：展示 DAO 列表
 */
interface DaosPageProps {
  daosData: DaoItem[];
}

function DaosPage({ daosData }: DaosPageProps) {
  const t = useTranslations('my');
  const user = useSelector((state: RootState) => state.valueData.user); // 钱包用户信
  const locale = useLocale();

  return (
    <Card className="daism-title">
      <Card.Header>{t('daos')}</Card.Header>
      <Card.Body>
        {daosData.map((obj, idx) => (
          <Link
            key={idx}
            className="daism-a"
            href={`/${locale}/workroom/[id]`}
            as={`/${locale}/workroom/${obj.dao_id}`}
          >
            <Row
              className="mb-3 p-1"
              style={{ borderBottom: '1px solid gray' }}
            >
              <Col className="col-auto me-auto">
                <ImageWithFallback
                  alt=""
                  width={32}
                  height={32}
                  src={obj.dao_logo ? obj.dao_logo : '/logo.svg'}
                />
                {'  '}
                <b>
                  {obj.dao_name}(Valuation Token: {obj.dao_symbol})
                </b>
              </Col>
              <Col className="col-auto">
                <b>{obj.dao_time}(UTC-8)</b>
              </Col>
              <Col className="col-auto">
                <b>ID: {obj.dao_id}</b>
              </Col>
              <Col className="col-auto">
                <b>
                  {obj.dao_manager.toLowerCase() ===
                  user.account.toLowerCase()
                    ? t('managerText')
                    : t('originalText')}
                </b>
              </Col>
            </Row>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
}


