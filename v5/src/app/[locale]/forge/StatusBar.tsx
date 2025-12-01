// import React from "react";
import { Row, Col, Alert, Spinner, Accordion, Form } from "react-bootstrap";

export interface StatusBarState {
  // err: string;  
  gas: string; //gas 费用
  price: string; //单价
  minValue: string; // 估值最小
  exValue: string; // 估值实际得
  ratio: string; //比率 1eth=323.22221 token
  slippage:number; //滑点值

}

interface StatusBarProps {
  status: StatusBarState;
  setStatus:(v:StatusBarState)=>void;
  inputError:string;
}


export default function StatusBar({ status,setStatus,inputError}:StatusBarProps) {

  function checkSelect(event: React.MouseEvent<HTMLInputElement>, ratio: number) {
    (event.target as HTMLInputElement).checked = true;
    setStatus({...status,slippage:ratio})

    const v = parseFloat(status.exValue) * (1 - ratio / 100);
    setStatus({ ...status, minValue: v.toFixed(6) });
  }

  return (
    <>
      {status.ratio === 'loading' ?  
        <Spinner animation="border" size="sm" variant="primary" />
      : <Accordion style={{ boxShadow: 'none !important' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header style={{margin:0,padding:0}} >{status.ratio}</Accordion.Header>
              <Accordion.Body>
                {status.gas && <Row>
                  <Col className='Col-auto me-auto'>Network fees</Col>
                  <Col className='col-auto'> ~{status.gas} ETH</Col>
                </Row>}
                {status.price && <Row>
                  <Col className='Col-auto me-auto'>Price Impact</Col>
                  <Col className='col-auto'>{status.price}</Col>
                </Row>}
                {status.minValue && <>
                  <Row>
                    <Col className='Col-auto me-auto'>Minimum output</Col>
                    <Col className='col-auto'>{status.minValue}</Col>
                  </Row>
                  <div style={{ borderRadius: '10px', backgroundColor: '#F5F6FC', padding: '6px', textAlign: 'right' }}>
                    <span> Max slippage: {'     '}</span>
                    <Form.Check inline label="0.3%" onClick={e => checkSelect(e, 0.3)} defaultChecked={status.slippage === 0.3} name='group1' type='radio' id='r1' />
                    <Form.Check inline label="0.5%" onClick={e => checkSelect(e, 0.5)} defaultChecked={status.slippage=== 0.5} name='group1' type='radio' id='r2' />
                    <Form.Check inline label="0.7%" onClick={e => checkSelect(e, 0.7)} defaultChecked={status.slippage === 0.7} name='group1' type='radio' id='r3' />
                    <Form.Check inline label="1.0%" onClick={e => checkSelect(e, 1.0)} defaultChecked={status.slippage === 1.0} name='group1' type='radio' id='r4' />
                    <Form.Check inline label="2.0%" onClick={e => checkSelect(e, 2.0)} defaultChecked={status.slippage === 2.0} name='group1' type='radio' id='r5' />
                  </div>
                </>}
                {status.exValue && <Row>
                  <Col className='Col-auto me-auto'>Expected output</Col>
                  <Col className='col-auto'>{status.exValue}</Col>
                </Row>}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>  

      }
      <br/>
      {/* notshow 不是错误，只是单纯的不显示 */}
      {inputError && <Alert variant='danger' style={{ textAlign: 'center' }}>{inputError}</Alert>}
    </>
  );
}

