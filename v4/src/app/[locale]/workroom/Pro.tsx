"use client";
import { useState } from 'react';
import ProsPage from './ProsPage';
import ProHistory from './ProHistory';
import { Form } from 'react-bootstrap';
import { useTranslations } from 'next-intl';

interface User {
  account: string;
  // 其他用户字段可以补充
}

interface ProposalProps {
  user: User;
  tc: ReturnType<typeof useTranslations>;
}

/**
 * 我的提案
 */
export default function Proposal({ user, tc }: ProposalProps) {
  const [st, setSt] = useState<number>(0); // 0 未完成 ，1 已完成 2 过期
  const t = useTranslations<'dao'>('dao');

  return (
    <>
      <Form>
        <Form.Check
          inline
          label={t('noCompletetext')}
          name="group1"
          type="radio"
          checked={st === 0}
          onChange={e => e.target.checked && setSt(0)}
          id="inline-0"
        />
        <Form.Check
          inline
          label={t('completeText')}
          name="group1"
          type="radio"
          checked={st === 1}
          onChange={e => e.target.checked && setSt(1)}
          id="inline-1"
        />
        <Form.Check
          inline
          label={t('nocompleteText')}
          name="group1"
          type="radio"
          checked={st === 2}
          onChange={e => e.target.checked && setSt(2)}
          id="inline-2"
        />
        <Form.Check
          inline
          label={t('expireText')}
          name="group1"
          type="radio"
          checked={st === 3}
          onChange={e => e.target.checked && setSt(3)}
          id="inline-3"
        />
      </Form>

      {st > 0 && <ProHistory st={st} />}
      {st === 0 && <ProsPage  />}
    </>
  );
}
