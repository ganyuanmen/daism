
import React, {useImperativeHandle,useState, forwardRef } from "react";
import { Row,Col,Alert,Spinner,Accordion,Form } from "react-bootstrap";

const StatusBar = forwardRef(({ratioRef}, ref) => {
    
   
    const [state, setStatus] = useState({err:'',gas:'',price:'',minValue:'',exValue:'',ratio:''}); //比率

    useImperativeHandle(ref, () => ({
        setStatus: setStatus,
        state:state
    }));

    function checkSelect(event,ratio)
    {
        event.target.checked=true
        ratioRef.current=ratio
        let v=parseFloat(state.exValue)*(1-ratioRef.current/100)
        setStatus({...state,minValue:(v).toFixed(6)})
    }
    return <>
        {state.ratio==='loading'?  <Spinner animation="border" size="sm" variant="primary" />: <>
            <Accordion style={{boxShadow:'none !important'}} >
                <Accordion.Item eventKey="0">
                    <Accordion.Header >{state.ratio}</Accordion.Header>
                    <Accordion.Body>
                       {state.gas && <Row>
                            <Col className='Col-auto me-auto' >Network fees</Col>
                            <Col  className='col-auto'> ~{state.gas} ETH</Col>
                        </Row>}
                    {state.price && <Row>
                            <Col className='Col-auto me-auto' >Price Impact</Col>
                            <Col  className='col-auto'>{state.price}</Col>
                        </Row>}
                    {state.minValue && <>  <Row>
                            <Col className='Col-auto me-auto' >Minimum output</Col>
                            <Col  className='col-auto'>{state.minValue}</Col>
                        </Row>
                        <div style={{borderRadius:'10px',backgroundColor:'#F5F6FC',padding:'6px',textAlign:'right'}} >
                           <span > Max slippage: {'     '}</span>
                            <Form.Check inline label="0.3%" onClick={e=>checkSelect(e,0.3)} defaultChecked={ratioRef.current===0.3} name='group1' type='radio' id='r1' />
                            <Form.Check inline label="0.5%" onClick={e=>checkSelect(e,0.5)} defaultChecked={ratioRef.current===0.5} name='group1' type='radio' id='r2' />
                            <Form.Check inline label="0.7%" onClick={e=>checkSelect(e,0.7)} defaultChecked={ratioRef.current===0.7} name='group1' type='radio' id='r3' />
                            <Form.Check inline label="1.0%" onClick={e=>checkSelect(e,1.0)} defaultChecked={ratioRef.current===1.0} name='group1' type='radio' id='r4' />
                            <Form.Check inline label="2.0%" onClick={e=>checkSelect(e,2.0)} defaultChecked={ratioRef.current===2.0} name='group1' type='radio' id='r5' />
                            
                        </div>
                        </>}
                       {state.exValue && <Row>
                            <Col className='Col-auto me-auto' >Expected  output</Col>
                            <Col  className='col-auto'>{state.exValue}</Col>
                        </Row>}
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>  
                </> 
        }
        <br/>
        {state.err && state.err!=='notshow'  && <Alert variant='danger' style={{textAlign:'center'}} > {state.err}</Alert>}
             
            </>
});

export default StatusBar;

