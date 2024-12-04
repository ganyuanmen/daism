import React, {useImperativeHandle,useRef,useState,useEffect, forwardRef } from "react";
import {  Card, Col,Row } from "react-bootstrap";
import RecordItem from "./RecordItem";
import { OpenWindowButton } from "./OpenWindowButton";
import Spinner from 'react-bootstrap/Spinner';
import { VitaSvg } from "../../lib/jssvg/SvgCollection";
import { useTranslations } from 'next-intl'


const DownBox = forwardRef(({upRef,statusRef,submitRef,user,comulate,utoken,iadd,utokenBalance,setIsTip,outobj,setOutobj}, ref) => {
    const t = useTranslations('iadd')
    const [value,setValue]=useState(0)
    const balanceRef=useRef()
  
    const vitaRef=useRef()
    const tokenPriceRef=useRef()
    const setBalance=(value)=>{balanceRef.current.setBalance(value)}
    const getToken=()=>{return outobj}

    const setOutput=()=>{upRef.current.setOutput()}
    // function getEther(v){return window.daismDaoapi.ethers.parseEther(v+'')}
    // function fromEther(v){return  window.daismDaoapi.ethers.formatEther(v+'')}

    useImperativeHandle(ref, () => ({
        getToken:getToken,
        setShowValue:function(upVita,downVita,value){
            if(value>0)  //-1 是loading
        {
                let ratio=Math.round((downVita-upVita)/upVita*10000)/100
                vitaRef.current.innerHTML=`${downVita.toFixed(4)} (${ratio}%)`
                submitRef.current.setShow(parseFloat(upRef.current.getBalance())>parseFloat(upRef.current.getValue()))

            } else {
                vitaRef.current.innerHTML=''
                submitRef.current.setShow(false)
            }
            setValue(Math.round(value*1000000)/1000000)
        },
        setToken:setOutobj,
        setBalance:setBalance,
        getValue:()=>{return value},
        clear: function(){ 
            setValue(0) 
            vitaRef.current.innerHTML=''
        },
       
        
    }));

    const  setTokenPrice=(v)=>{tokenPriceRef.current.innerHTML=v}

    useEffect(()=>{
        if(utokenBalance && outobj.token_id===-1) setBalance(Math.round(parseFloat(utokenBalance)*1000000)/1000000)
        // setBalance(utokenBalance)
    },[utokenBalance,outobj])

    
    

    return  <Card className='mb-2 mt-2' >
            <Card.Body style={{backgroundColor:'#F5F6FC'}}>
                <RecordItem title={t('outputText')}  ref={balanceRef} ></RecordItem>
                <Row className="align-items-center" >
                    <Col className="Col-auto me-auto" >
                        {value===-1?<Spinner animation="border"  variant="primary" />:
                        <input readOnly style={{backgroundColor:'transparent',color:value>0?'#0D111C':'red', fontSize: '2rem', border: 0,outline:'none',width:'100%',minWidth:'120px'}} 
                         placeholder ='0.0' value={value} />}
                    </Col>
                    <Col className="col-auto" >
                    <OpenWindowButton user={user} setOutput={setOutput}  workIndex={-1} token={outobj} setToken={setOutobj} setBalance={setBalance}
                    setIsTip={setIsTip}
                    utokenBalance={utokenBalance}  isallow={true} setTokenPrice={setTokenPrice}
                    comulate={comulate} utoken={utoken} iadd={iadd}
                             upRef={upRef} statusRef={statusRef} submitRef={submitRef}    />
                    </Col>
                </Row>
                <Row > 
                <Col className='Col-auto me-auto' >
                    <div style={{color:'#7780A0',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                    <div > <img src='/vita.svg' width={12} height={14} alt='UTO' /></div>
                    <div style={{paddingTop:'2px'}} ><span ref={vitaRef} ></span></div>
                    </div>
                </Col> 
                <Col  className="col-auto" >
                     <div style={{color:'#984c0c',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                    <div >  <img src='/vita.svg' width={12} height={14} alt='UTO' /></div>
                    <div style={{paddingTop:'2px',marginRight:'8px'}} ><span ref={tokenPriceRef} ></span></div>
                    </div>
                </Col>
                </Row>

             
            </Card.Body>
            </Card>
});

export default DownBox;

