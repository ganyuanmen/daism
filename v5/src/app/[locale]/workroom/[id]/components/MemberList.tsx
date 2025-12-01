import { type DaoRecord } from '@/lib/mysql/daism';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { DeleteSvg, EditSvg, SendSvg } from '@/lib/jssvg/SvgCollection';
import DaismInputGroup, { type DaismInputGroupHandle } from '@/components/form/DaismInputGroup';
import ShowAddress from '@/components/ShowAddress';
import ConfirmWin from '@/components/federation/ConfirmWin';

interface PropsType {
  daoData: DaoRecord;
  ismember: boolean; // 是否为dao成员
  upPro: (_address: string, _vote: number, _desc: string, proposalType: number) => void;
}

export default function MemberList({ daoData, ismember, upPro }: PropsType) {
  const t = useTranslations('dao');
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);

  const modifyVoteRef = useRef<DaismInputGroupHandle>(null);
  const modifyAccountRef = useRef<HTMLDivElement>(null);
  const delMemberRef = useRef<string | null>(null);

  // 修改成员奖励权
  const modify = () => {
    const value = modifyVoteRef.current?.getData();
    const _vote = Number(value);

    if (isNaN(_vote) || _vote < 1) {
      modifyVoteRef.current?.notValid(t('voteErr'));
      return;
    }

    setShow(false);
    if (modifyAccountRef.current) {
      upPro(modifyAccountRef.current.innerHTML, _vote, '', 9);
    }
  };

  // 删除成员
  const delMember = () => {
    setShowDel(false);
    if (delMemberRef.current) {
      upPro(delMemberRef.current, 0, '', 9);
    }
  };

  // 更新dao 成员信息
  const update = (obj: { member_address: string; member_votes: number }) => {
    if (modifyAccountRef.current) {
      modifyAccountRef.current.innerHTML = obj.member_address;
    }
    modifyVoteRef.current?.mySetValue(String(obj.member_votes));
  };

  return (
    <>
      {daoData?.child?.map((obj, idx) => (
        <Row key={idx} className="mb-3 p-1" style={{ borderBottom: '1px solid gray' }}>
          <Col>
            <ShowAddress address={obj.member_address} />
          </Col>
          <Col>
            {t('memberVoteText')}: {obj.member_votes}
          </Col>
          <Col>
            <b style={{ display: 'inline-block', width: '90px' }}>
              {daoData.dao_manager.toLowerCase() === obj.member_address.toLowerCase()
                ? t('managerText')
                : Number(obj?.member_type) === 1
                ? t('originMember')
                : t('invitMember')}
            </b>{' '}
            {Number(obj.member_type) === 1 && ismember && (
              <>
                <Button
                  onClick={() => {
                    setShow(true);
                    update(obj);
                  }}
                  size="sm"
                  variant="primary"
                >
                  <EditSvg size={16} /> {t('updateText')}
                </Button>{' '}
                {daoData.dao_manager.toLowerCase() !== obj.member_address.toLowerCase() && (
                  <Button
                    onClick={() => {
                      setShowDel(true);
                      delMemberRef.current = obj.member_address;
                    }}
                    size="sm"
                    variant="danger"
                  >
                    <DeleteSvg size={16} /> {t('delText')}
                  </Button>
                )}
              </>
            )}
          </Col>
        </Row>
      ))}

      <Modal className="daism-title" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ paddingLeft: '10px' }}>{t('memberAddress')}:</div>
          <div style={{ paddingLeft: '10px', marginBottom: '10px' }} ref={modifyAccountRef}></div>
          <DaismInputGroup title={t('memberVoteText')} ref={modifyVoteRef} defaultValue={10} />
          <div style={{ textAlign: 'center' }}>
            <Button onClick={modify} variant="primary">
              <SendSvg size={16} /> {t('confirm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmWin show={showDel} setShow={setShowDel} question={t('delConfirmText')} callBack={delMember} />
    </>
  );
}
