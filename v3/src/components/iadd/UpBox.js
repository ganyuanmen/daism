import { Button, Card, Col,Row } from "react-bootstrap";
import RecordItem from "./RecordItem";
import { useSelector,useDispatch } from 'react-redux';
import InputBox from "./InputBox";
// import ethlogo from '../../images/eth.png';
// import {setTipText,setMessageText} from '../../data/valueData'
import { OpenWindowButton } from "./OpenWindowButton";
import React, {useImperativeHandle,useRef,useEffect,useState, forwardRef } from "react";
import { UnlockSvg,VitaSvg } from "../../lib/jssvg/SvgCollection";
import Spinner from 'react-bootstrap/Spinner';
import { useTranslations } from 'next-intl'
import TipWin from "./TipWin";

//downRef 输出区域  statusRef 状态区域 submitRef 提交按钮区域 isTip是否允许打赏
const UpBox = forwardRef(({outobj, downRef,tipRef,statusRef,submitRef,user,gasPrice,priorty,comulate,utoken,iadd,price,ratioRef,utokenBalance,isTip,setIsTip}, ref) => {
    const [vita, setVita] = useState(''); //vita信息
    const ethBalance = useSelector((state) => state.valueData.ethBalance)

    // const [isallow, setIsallow] = useState(true); //是否授权
    // const dispatch = useDispatch();
    const balanceRef=useRef() //余额
    const inputRef=useRef()  //输入框 
    const [inobj, setInobj] = useState({ btext: 'ETH', blogo: '/eth.png', token_id: -2 }) //上选择对象，输入对象 btext:显示文本， blogo:logo图片
    // let utokenApprove =useRef(undefined)
    // let tokenApprove = useRef(undefined)
    // function showTip(str){dispatch(setTipText(str))}
    // function closeTip(){dispatch(setTipText(''))}
    // function showClipError(str){dispatch(setMessageText(str))}
    const setBalance=(value)=>{balanceRef.current.setBalance(value)}
    const clear=()=>{inputRef.current.clear();setVita('');}
    const getToken=()=>{return inobj}
    const getValue = () => {return inputRef.current.getValue()};
    const getBalance=()=>{return balanceRef.current.getBalance()}
    const setinputRatio=(v)=>{inputRef.current.setRatio(v)}
    const setOutput=()=>{inputRef.current.setOutput()}
    const tokenPriceRef=useRef()
    const t = useTranslations('iadd')
    // const tc = useTranslations('Common')


    useImperativeHandle(ref, () => ({
        clear: clear,
        getToken:getToken,
        setToken:setInobj,
        getValue:getValue,
        getBalance:getBalance,
        setBalance:setBalance,
        setinputRatio:setinputRatio,
        setOutput:setOutput,
        setSubmitButton:()=> inputRef.current.setSubmitButton(),
        inputError:()=>{return inputRef.current.inputError()},

    }));

    const  setTokenPrice=(v)=>{tokenPriceRef.current.innerHTML=v}

    useEffect(()=>{setBalance('0')},[])
  
    useEffect(()=>{
        if(ethBalance && inobj.token_id===-2) setBalance(Math.round(parseFloat(ethBalance)*1000000)/1000000)

        //登录后 显示兑换按钮
        let upv=parseFloat(inputRef.current.getValue())
        let balance= parseFloat(balanceRef.current.getBalance())
        submitRef.current.setShow(upv>0 && balance>upv)

    },[ethBalance,inobj,submitRef])
    
    useEffect(()=>{
        if(utokenBalance && inobj.token_id===-1) setBalance(Math.round(parseFloat(utokenBalance)*1000000)/1000000)
    },[utokenBalance,inobj])


    // //授权处理
    // const handleapprove = () => {
    //     if (inobj.token_id === -1) { //utoken 授权
    //        showTip(t('authorizingText'))
    //         window.daismDaoapi.UnitToken.approve(window.daismDaoapi.IADD.address, '9999999').then(e => {
    //            closeTip(); setIsallow(true);utokenApprove.current=true;inputRef.current.setInputError('');
    //            inputRef.current.setOutput() 
    //         }, err => {
    //             console.error(err);closeTip();
    //             showClipError(tc('errorText') + (err.message ? err.message : err));
    //         });
    //     } else {//token授权
    //         showTip(t('authorizingText'))
    //         window.daismDaoapi.DaoToken.approveGlobal(window.daismDaoapi.IADD.address, true).then(e => {
    //             closeTip(); setIsallow(true);tokenApprove.current=true;inputRef.current.setInputError('');
    //             inputRef.current.setOutput() 
    //         }, err => {
    //             console.error(err);closeTip();
    //             showClipError(tc('errorText') + (err.message ? err.message : err));
    //         });
    //     }
    // }

    return  <Card className='mb-2 mt-3' >
            <Card.Body style={{backgroundColor:'#F5F6FC'}} >
                <RecordItem title={t('inputText')}  ref={balanceRef} ></RecordItem>
                <Row className="align-items-center" >
                    <Col className="Col-auto me-auto" >
                    <InputBox ref={inputRef}  inobj={inobj} isTip={isTip} tipRef={tipRef} downRef={downRef} statusRef={statusRef} balanceRef={balanceRef} ratioRef={ratioRef}
                         setVita={setVita} user={user} gasPrice={gasPrice} priorty={priorty} comulate={comulate} utoken={utoken} iadd={iadd} price={price} />
                    </Col>
                    <Col className="col-auto" >
                        {/* {!isallow && inobj.token_id!==0 &&<Button  style={{borderRadius:'20px'}}  onClick={handleapprove} ><UnlockSvg size={18} /> 
                        {t('authorizeText')}</Button>}{'   '} */}
                        
                        <OpenWindowButton  user={user}  setOutput={setOutput} workIndex={-2} token={inobj} setToken={setInobj} setBalance={setBalance} 
                        ethBalance={ethBalance} utokenBalance={utokenBalance} setIsTip={setIsTip}
                        comulate={comulate} utoken={utoken} iadd={iadd}
                        getValue={getValue}  setTokenPrice={setTokenPrice}
                         downRef={downRef} statusRef={statusRef} inputRef={inputRef} submitRef={submitRef} 
                       />
                    </Col>
                </Row>
                <Row > 
                <Col className='Col-auto me-auto' >
                    <div style={{color:'#7780A0',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                        <div >  <VitaSvg size={12} /></div>
                        <div style={{paddingTop:'2px'}} >{vita==='loading'?<Spinner animation="border" size="sm" variant="primary" />:<span>{vita}</span>}</div>
                    </div>
                </Col> 
                <Col  className="col-auto" >
                     <div style={{color:'#984c0c',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                    <div >  <VitaSvg size={12} /></div>
                    <div style={{paddingTop:'2px',marginRight:'8px'}} ><span ref={tokenPriceRef} ></span></div>
                    </div>
                </Col>
                </Row>
                
               {isTip && <TipWin  setOutput={setOutput} inobj={inobj} outobj={outobj} ref={tipRef} /> }
            </Card.Body>
            </Card>
});

export default UpBox;

