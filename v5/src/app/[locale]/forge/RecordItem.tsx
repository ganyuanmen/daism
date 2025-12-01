// import React, { useImperativeHandle, forwardRef, useState, Ref } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslations } from 'next-intl';

interface RecordItemProps {
  title: string;
  balance:string;
}

export default function RecordItem({ title,balance }: RecordItemProps) {
  const t = useTranslations('iadd');

  return (
    <Row className="mb-2">
      <Col className="Col-auto me-auto">{title}</Col>
      <Col className="col-auto" style={{ color: '#984c0c' }}>
        {t('balanceText')}: {balance}
      </Col>
    </Row>
  );
}


