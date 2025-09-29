import React, {useRef} from "react";
import { useTranslations } from 'next-intl';
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import type { Dispatch, SetStateAction } from 'react';

export interface tipType{
  isShowTip:boolean; //是否显示打赏
  isTip:boolean; //是否打赏
  isBurn: boolean; //是否铸造eth
  isNft: boolean; //是否mint NFT
  selectToken:boolean;  //当token->token时，选择哪个token的svg   true 为下层token， false 为上层token
  value:number; //打赏金额


}

// 定义组件 props 类型
type TipWinProps= {
  setTipValue: Dispatch<SetStateAction<tipType>>;
  tipValue:tipType;
  inObj:DaismToken;
  outObj:DaismToken;
  tokenValue:number; //录入值
  calcStatus:(value:number,tip_value:number,in_id:number,out_id:number)=>void;
  
};

export default function TipWin ({setTipValue,calcStatus,inObj,outObj,tipValue,tokenValue }:TipWinProps) {
  const t = useTranslations('iadd');
  const inputRef = useRef<HTMLInputElement>(null);
 
  const setChange = () => {
    const _uto = parseFloat(inputRef.current?.value || '0') || 0;
    setTipValue({...tipValue,isNft:_uto > 0,value:_uto});
    calcStatus(tokenValue,_uto,inObj.token_id,outObj.token_id); //触发重新计算输出值
  };

  const selectChange = (isOut: boolean) => {
    setTipValue(pre => ({
      ...pre,
      selectToken: isOut, // true 表示选 out，false 表示选 in
    }));
  };

  return (
    <div className="mt-3">
      <div className="d-flex mb-3">
        {/* 显示，是否打赏 */}
        <Form.Check
          type="switch"
          id="custom-switch1"
          checked={tipValue.isTip}
          onChange={() => setTipValue({...tipValue, isTip:!tipValue.isTip})}
          label={(inObj.token_id === -2 && outObj.token_id === -1) ? t('tipTextE2U') : t('tipText')}
        />
        {/* eth --> token 时才显示 */}
        {(inObj.token_id === -2 && outObj.token_id > 0) && (
          <Form.Check
            style={{ marginLeft: '20px' }}
            type="switch"
            id="custom-switch3"
            checked={tipValue.isBurn}
            onChange={() => setTipValue({...tipValue,isBurn:!tipValue.isBurn})}
            label={t('tipTextE2U')}
          />
        )}
      </div>

      {tipValue.isTip && !(inObj.token_id === -2 && outObj.token_id === -1) && (
        <Row>
          <Col className='col-auto me-auto'>
            <InputGroup>
              <InputGroup.Text>{t('tipText')}</InputGroup.Text>
              <Form.Control
                ref={inputRef}
                style={{ textAlign: "right" }}
                onChange={setChange}
              />
              <InputGroup.Text>UTO</InputGroup.Text>
            </InputGroup>
            <div className="d-flex justify-content-between mt-2">
              {[50, 200, 300, 500, 800].map((val) => (
                <Button
                  key={val}
                  variant="light"
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = val.toString();
                    setChange();
                  }}
                >
                  {val}
                </Button>
              ))}
            </div>
          </Col>

          <Col className='col-auto mt-2'>
          {/* 打赏荣誉通证 */}
            <Form.Check    
              className='mb-3'
              type="switch"
              id="custom-switch2"
              checked={tipValue.isNft}
              onChange={() => setTipValue({...tipValue,isNft:!tipValue.isNft})}
              label={t('minthonorText')}
            />
            {inObj.token_id > 0 && outObj.token_id > 0 && (
              <div>
                {/* 两个token 选择 */}
                <Form.Check inline label={inObj.dao_symbol} name="grouptip1" type='radio' id='grouptip1_in'
                 checked={!tipValue.selectToken}     // 选 in 时 = false
                 onChange={() => selectChange(false)}
                />
                <Form.Check
                  inline
                  label={outObj.dao_symbol}
                  name="grouptip1"
                  type='radio'
                  checked={tipValue.selectToken}     // 选 in 时 = false
                  onChange={() => selectChange(true)}
                  id='grouptip1_out'
                />
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}


