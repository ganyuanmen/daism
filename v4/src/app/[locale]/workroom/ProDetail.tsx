import { useState } from 'react';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import { EventsSvg } from "@/lib/jssvg/SvgCollection"
import {type ProItem } from './ProHistory'
import { daism_getTime } from '@/lib/utils/windowjs';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/hooks/useFetch';
import Image from 'next/image';

interface ProDetailProps {
  obj: ProItem;
}


interface MemberType {
  member_address: string;
  member_votes: number;
  rights: number;
  antirights: number;
}

export default function ProDetail({ obj }: ProDetailProps) {
  const t = useTranslations("my");
  const cssType: React.CSSProperties = { display: 'inline-block', padding: '4px' }
  const [show, setShow] = useState(false)

  // const daoMember= useProDetail(obj.dao_id,obj.delegator,obj?.createTime??0)
  const { data} = useFetch<MemberType[]>(`/api/getData?daoId=${obj.dao_id}&delegator=${obj.delegator}&createTime=${obj?.createTime??0}`,
    'getDaoVote',[]);

 

  return (
    <>
      <Button
        size="sm"
        variant="primary"
        onClick={() => setShow(true)}
      >
        <EventsSvg size={16} /> {t('detail')}
      </Button>

      <Modal className='daism-title' size="lg" show={show} onHide={() => setShow(false)} >
        <Modal.Header closeButton />
        <Modal.Body>
          <Row className='mb-3 p-1' style={{ borderBottom: '1px solid gray' }} >
            <Col>
              <Image height={32} width={32} alt='' src={obj.dao_logo ?? '/logo.svg'} />{'  '}
              <b>{obj.dao_name}({obj.dao_symbol})</b>
            </Col>
          </Row>

          <Row className='mb-3 p-1' style={{ borderBottom: '1px solid gray' }} >
            <Col>{obj.daodesc}</Col>
          </Row>

          <Row className='mb-3 p-1' style={{ borderBottom: '1px solid gray' }} >
            <Col>
              <span style={cssType}>{t('proText')}</span>:
              <b style={cssType}>{t('proNameText').split(',')[obj.pro_type]}</b>
            </Col>
            <Col>
              <span style={cssType}>{t('totalText')}</span>:
              <b> {obj.total_vote} </b>
              ({t('rights')}:<b>{obj.rights}</b> {t('antirights')}:<b>{obj.antirights}</b>)
            </Col>
          </Row>

          <Row className='mb-3 p-1' style={{ borderBottom: '1px solid gray' }} >
            <Col>
              <span style={cssType}>{t('lifetime')}</span>:
              <b>{obj.lifetime > 0 ? daism_getTime(obj.lifetime, t) : t('alreadydays')}</b>
            </Col>
            <Col>
              <span style={cssType}>{t('strategy')}</span>:<b>{obj.strategy}</b>%
            </Col>
          </Row>

          {data &&  data.map((m, idx) => (
            <Row key={idx} className='mb-3 p-1' style={{ borderBottom: '1px solid gray' }} >
              <Col className='Col-auto me-auto'>{m.member_address}{'--->'}{m.member_votes}</Col>
              <Col className='col-auto'>
                {t('rights')}:<b>{m.rights > m.member_votes ? m.member_votes : m.rights}</b>{' '}
                {t('antirights')}:<b>{m.antirights > m.member_votes ? m.member_votes : m.antirights}</b>
              </Col>
            </Row>
          ))}

          <br />
          <h4>{t('proContent')}：</h4>
          <Logs obj={obj} t={t} />
        </Modal.Body>
      </Modal>
    </>
  )
}

interface LogsProps {
  obj: ProItem;
  t: ReturnType<typeof useTranslations>;
}

function Logs({ obj, t }: LogsProps) {
  function svgToBase(svgCode: string) {
    const utf8Bytes = new window.TextEncoder().encode(svgCode);
    return 'data:image/svg+xml;base64,' +
      window.btoa(String.fromCharCode.apply(null, utf8Bytes as unknown as number[]));
  }

  switch (obj.pro_type) {
    case 0: return <div>{t('delMember')} :{obj.account}</div>
    case 1: return <Image width={32} height={32} src={svgToBase(obj.imgstr ?? '')} alt='' />
    case 2: return <div>{obj.dao_desc}</div>
    case 3: return <div>{t('newManagerText')} :{obj.account}</div>
    case 4: return <div>{t('typeName')} :{obj.dao_desc}</div>
    case 5: return (
      <>
        <div>{t('memberAdd')} : {obj.account}</div>
        <div>{t('memberVoteText')} : {obj.dividendRights}</div>
      </>
    )
    case 6: return (
      <>
        <div>{t('memberEdit')} : {obj.account}</div>
        <div>{t('memberVoteText')} : {obj.dividendRights}</div>
      </>
    )
    case 7: return (
      <div>{t('changeStrategyText')}({t('strategy')}) :
        {Math.floor((obj.dividendRights ?? 0) / 65535 * 100)} %
      </div>
    )
    default: return null
  }
}

