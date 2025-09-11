"use client";
import Loadding from '@/components/Loadding';
import { Card, Col, Row } from 'react-bootstrap';
import ShowErrorBar from '@/components/ShowErrorBar';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store/store';
import { useFetch } from '@/hooks/useFetch';
import ImageWithFallback from '@/components/ImageWithFallback';

/**
 * 我的 Token 页面
 */
export default function Tokens() {
  const tc = useTranslations<'Common'>('Common');
  const user = useSelector((state: RootState) => state.valueData.user); // 钱包用户信息

  // const tokensData = useMyTokens(user.account);
  const { data, status, error } = useFetch<DaismToken[]>(`/api/getData?did=${user.account}`,
    'getMyTokens',[]);

// export function useMyTokens(account: string) {
//   return useFetch<DaismToken[]>(`/api/getData?did=${account}` ,'getMyTokens');
// }


  return (
    <>
      {
        status==='loading'?<Loadding />
        :(status==='failed' || !data)? <ShowErrorBar errStr={error ?? ''} />
        :data.length===0? <ShowErrorBar errStr={tc('noDataText')} />
        : <TokensPage tokensData={data}  />
      }

     
    </>
  );
}

/**
 * 子组件：展示 token 列表
 */
interface TokensPageProps {
  tokensData: DaismToken[];
}

function TokensPage({ tokensData }: TokensPageProps) {
  const t = useTranslations<'my'>('my');
  const locale = useLocale();

  return (
    <Card className="daism-title mt-2">
      <Card.Header>{t('myTokenText')}</Card.Header>
      <Card.Body>
        {tokensData.map((obj, idx) => (
          <Row
            key={idx}
            className="mb-3 p-1"
            style={{ borderBottom: '1px solid gray' }}
          >
            <Col>
              <Link
                className="daism-a"
                href={`/${locale}/workroom/[id]`}
                as={`/${locale}/workroom/${obj.dao_id}`}
              >
                <ImageWithFallback
                  height={32}
                  width={32}
                  alt=""
                  src={obj.dao_logo ? obj.dao_logo : '/logo.svg'}
                />{' '}
                <b>{obj.dao_symbol}</b>
              </Link>
            </Col>
            <Col>
              {t('tokenText')}:<b>{obj.token_cost}</b>
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
}



  