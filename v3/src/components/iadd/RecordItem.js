
import React, {useImperativeHandle,useRef, forwardRef } from "react";
import { Row,Col } from "react-bootstrap";
import { useTranslations } from 'next-intl'

const RecordItem = forwardRef(({title}, ref) => {
    const spanRef=useRef()
    const t = useTranslations('iadd')
    const setBalance = (str) => {spanRef.current.innerHTML=str};
    const getBalance=()=>{return spanRef.current.innerHTML}

    useImperativeHandle(ref, () => ({
        setBalance: setBalance,
        getBalance:getBalance
    }));

    return <Row className="mb-2" > 
                <Col className='Col-auto me-auto' >{title} </Col> 
                <Col className="col-auto" style={{ color: '#984c0c'}}  >
                    {t('balanceText')}:{'  '}<span ref={spanRef} >0</span> 
                </Col>
            </Row>
});

export default RecordItem;

