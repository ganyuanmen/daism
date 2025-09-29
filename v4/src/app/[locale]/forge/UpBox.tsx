import React, {useState } from "react";
import { Card, Col, Row, Button, Spinner } from "react-bootstrap";
import { useTranslations } from "next-intl";
import RecordItem from "./RecordItem";
import InputBox from "./InputBox";
import TipWin from "./TipWin";
import SwapWindow from "./SwapWindow";
import iaddStyle from "@/styles/iadd.module.css";
import { type tipType } from "./TipWin";
import type { Dispatch, SetStateAction } from 'react';
import ImageWithFallback from "@/components/ImageWithFallback";

interface UpBoxProps { 
   inObj:DaismToken; //上层选择的token
   outObj:DaismToken; //下层选择的token
   upVita:string;
   inputError:string;
   setTokenValue:(v:number)=>void; //录入赋值
   setTipValue: Dispatch<SetStateAction<tipType>>; //打赏赋值
   setInputError:(v:string)=>void;
   upBalance:string;
   tokenValue:number;
   tipValue:tipType;
   calcStatus:(value:number,tip_value:number,in_id:number,out_id:number)=>void;
   slectToken:(obj:DaismToken,flag:'up'|'down')=>void;
   upTokenPrice:string;
  }

  export default function UpBox(
    {upBalance,upVita,upTokenPrice,inObj,outObj,inputError,tokenValue,tipValue,setInputError,slectToken,
      setTokenValue,setTipValue,calcStatus}:UpBoxProps)  {
  
  const [show, setShow] = useState(false);
  const t = useTranslations('iadd');
  const selectToken=async (obj:DaismToken)=>{slectToken(obj,'up');}
 
  return (
    <>
      <Card className="mb-2 mt-3">
        <Card.Body style={{ backgroundColor: "#F5F6FC" }}>
          <RecordItem title={t("inputText")} balance={upBalance} />
          <Row className="align-items-center">
            <Col className="Col-auto me-auto">
              <InputBox  inputError={inputError} calcStatus={calcStatus} tipValue={tipValue}
              setInputError={setInputError}
              setTokenValue={setTokenValue}
              tokenValue={tokenValue}
              inObj={inObj} outObj={outObj}
               /></Col>
            <Col className="col-auto">
              <Button className={iaddStyle.iadd_btn} variant="outline-secondary" onClick={() => setShow(true)} size="lg">
                {inObj.dao_logo && <ImageWithFallback alt="" width={24} height={24} src={inObj.dao_logo} />}
                <span style={{ display: "inline-block", padding: "0 4px", fontSize: "20px", color: "#0D111C" }}>{inObj.dao_symbol}</span>
                <ImageWithFallback alt="" width={24} height={24} src="/down.svg" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="Col-auto me-auto">
              <div style={{ color: "#7780A0", fontSize: "14px", display: "flex", alignItems: "center" }}>
                <div style={{ paddingRight: 4 }}>jeedd</div>
                <div style={{ paddingTop: 2 }}>{upVita === "loading" ? <Spinner animation="border" size="sm" variant="primary" /> 
                : <span>{upVita}</span>}</div>
              </div>
            </Col>
            <Col className="col-auto">
              <div style={{ color: "#984c0c", fontSize: "14px", display: "flex", alignItems: "center" }}>
                <div style={{ paddingRight: 4 }}>jeedd</div>
                <div style={{ paddingTop: 2, marginRight: 8 }}><span>{upTokenPrice}</span></div>
              </div>
            </Col>
          </Row>
          {tipValue.isShowTip && <TipWin tokenValue={tokenValue} tipValue={tipValue} calcStatus={calcStatus} setTipValue={setTipValue} inObj={inObj} outObj={outObj} />}
        </Card.Body>
      </Card>
      <SwapWindow workspace="up" show={show} setShow={setShow} selectToken={selectToken} />
    </>
  );
}


