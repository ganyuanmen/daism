
import React, {useImperativeHandle,useRef, forwardRef,useState,useEffect } from "react";
import { useTranslations } from 'next-intl'
import { Row,Col,InputGroup,Form, Button } from "react-bootstrap";
// import { ethers } from 'ethers';
//{ btext: 'ETH', blogo: '/eth.png', token_id: -2 }
//打赏 和min NFT 窗口
//downRef 输出区域  statusRef 状态区域 submitRef 提交按钮区域 balanceRef余额 inobj 上选择内容  setVita 设置输入框价值
const TipWin = forwardRef(({setOutput,inobj,outobj}, ref) => {
    const [showBurn, setShowBurn] = useState(false);//是否锻造
    const [showTip, setShowTip] = useState(false);//是否打赏
    const [showNft, setShowNft] = useState(false);//是否mint NFT
    const [token, setToken] = useState(true); //默认选择第二个
  
    const t = useTranslations('iadd')

    const inputRef=useRef(null)

    
    useImperativeHandle(ref, () => ({
        getTip:()=>{return showTip},
        getBurn:()=>{return showBurn},
        getValue:()=>{return inputRef.current.value},
        getNft:()=>{return showNft},
        getTokenId:()=>{
            if(inobj.token_id>0 && outobj.token_id>0) {
            if(!token) return inobj.token_id
            else  return outobj.token_id
            }
            else return 0;
        },
        setTip:(flag)=>{setShowTip(flag)},
        setBurn:(flag)=>{setShowBurn(flag)},
    }));

    const setChange=()=>{
        let _uto=parseFloat(inputRef.current.value) || 0
        setShowNft(_uto>0)
        setOutput.call(null);
        
    }
   
    useEffect(()=>{setOutput.call(null)},[showTip])

    return (  
        <div className="mt-3" >
                <div className="d-flex mb-3" >
                <Form.Check  type="switch" id="custom-switch1" checked={showTip} onChange={e=>{setShowTip(!showTip)}} 
                label={(inobj.token_id==-2 && outobj.token_id==-1)?t('tipTextE2U'):t('tipText')} />
                {(inobj.token_id==-2 && outobj.token_id>0) &&<Form.Check style={{marginLeft:'20px'}}  type="switch" id="custom-switch3" checked={showBurn} onChange={e=>{setShowBurn(!showBurn)}} 
                label={t('tipTextE2U')} /> }
                </div>
              
            {showTip && !(inobj.token_id==-2 && outobj.token_id==-1) &&
              <Row>
              <Col className='col-auto me-auto' >
                <InputGroup >
                    <InputGroup.Text>{t('tipText')}</InputGroup.Text>
                    <Form.Control onChange={setChange}  ref={inputRef} style={{textAlign:"right"}}  />
                    <InputGroup.Text>UTO</InputGroup.Text>
                </InputGroup> 
                <div className="d-flex justify-content-between mt-2" >
                    <Button variant="light" onClick={()=>{inputRef.current.value=50;setChange();}}>50</Button>
                    <Button variant="light" onClick={()=>{inputRef.current.value=200;setChange();}}>200</Button>
                    <Button variant="light" onClick={()=>{inputRef.current.value=300;setChange();}}>300</Button>
                    <Button variant="light" onClick={()=>{inputRef.current.value=500;setChange();}}>500</Button>
                    <Button variant="light" onClick={()=>{inputRef.current.value=800;setChange();}}>800</Button>
                </div>
              </Col>
              <Col className='col-auto mt-2' >
              <Form.Check className='mb-3' type="switch" id="custom-switch2" checked={showNft} onChange={e=>{setShowNft(!showNft)}} label={t('minthonorText')} />
                {inobj.token_id>0 && outobj.token_id>0 && <div>
                    <Form.Check inline label={inobj.btext} name="grouptip1"  type='radio' id='grouptip1_in' />
                    <Form.Check inline label={outobj.btext} name="grouptip1" checked={token} onChange={e=>{setToken(!token)}}  type='radio' id='grouptip1_out' />
                </div>

                }
              </Col>
             </Row>
             
            }
           
           
        </div>
   )

});

export default TipWin;

