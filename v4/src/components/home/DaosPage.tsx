
import Link from 'next/link'
import ShowAddress from "../ShowAddress";
import { Card, Row, Col } from "react-bootstrap";
import TopSearch from "./TopSearch";
import { useLocale, useTranslations } from 'next-intl'
// import {type PageDataType} from '@/hooks/usePageFetch'
import Image from "next/image";

export interface DaoRecord {
  dao_id: number;
  dao_name: string;
  dao_symbol: string;
  dao_manager: string;
  creator: string;
  dao_logo?: string;
  dao_desc: string;
  block_num: number | string;
  utoken_cost: number | string;
  dao_ranking: number | string;
}

interface DaosPageProps {
  daosData: DaoRecord[];
  orderType: boolean;
  postStatus: string;
  orderIndex: number;
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>;
  setOrderType: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderField: React.Dispatch<React.SetStateAction<string>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setOrderIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function DaosPage({
  daosData,
  setCurrentPageNum,
  orderType,
  setOrderType,
  setOrderField,
  setSearchText,
  postStatus,
  orderIndex,
  setOrderIndex
}: DaosPageProps) {
  const t = useTranslations('dao')
  const locale: string = useLocale();

  return (
    <>
      <TopSearch
        orderType={orderType}
        orderIndex={orderIndex}
        setOrderIndex={setOrderIndex}
        setOrderType={setOrderType}
        setOrderField={setOrderField}
        setCurrentPageNum={setCurrentPageNum}
        setSearchText={setSearchText}
        postStatus={postStatus}
      />

      {daosData.map((record, idx) =>
        <Card key={idx} className="mb-2 daism-title ">
          <Card.Header className="daism-title" >
            <h4>{record.dao_name}(Valuation Token: {record.dao_symbol})</h4>
          </Card.Header>
          <Card.Body >
            <Row className="mb-2" >
              <Col className="Col-auto me-auto">
                {t('managerText')}:{' '}<ShowAddress address={record.dao_manager} />
              </Col>
              <Col className="col-auto">
                {t('execText')}:{' '}<ShowAddress address={record.creator} />
              </Col>
            </Row>

            <Row className="mb-3" >
              <Col className='col-auto d-flex align-items-center'>
                <Link
                  className='daism-a'
                  href={`/${locale}/workroom/[id]`}
                  as={`/${locale}/workroom/${record.dao_id}`}
                >
                  <Image
                    alt=""
                    width={64}
                    height={64}
                    src={!record.dao_logo || record.dao_logo.length < 12 ? '/logo.svg' : record.dao_logo}
                  />
                </Link>
              </Col>

              <Col className='Col-auto me-auto'>
                <div style={{display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:3,overflow:'hidden',paddingRight:0}} >{record.dao_desc}</div>
              </Col>
            </Row>

            <Row style={{ fontSize: '0.8rem' }}>
              <Col style={{ textAlign: 'left' }} className='col-auto'>
                {t('createTimeText')}： {record.block_num}
              </Col>
              <Col style={{ textAlign: 'center' }} className='Col-auto me-auto'>
                {t('coinPriceText')}： {record.utoken_cost} jeedd
              </Col>
              <Col style={{ textAlign: 'right' }} className='col-auto'>
                {t('rankingText')}： {record.dao_ranking}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

    
    </>
  )
}
