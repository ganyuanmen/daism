import React, {  useEffect, useRef } from "react";
import {type tipType } from './TipWin'

interface InputBoxProps { 
  setTokenValue:(v:number)=>void; //录入赋值
  inputError:string;
  setInputError:(v:string)=>void;
  tipValue:tipType;
  inObj:DaismToken; //上层选择的token
  outObj:DaismToken; //下层选择的token
  tokenValue:number;
  calcStatus:(value:number,tip_value:number,in_id:number,out_id:number)=>void;

}

export default function InputBox({setTokenValue,setInputError,inputError,tipValue,inObj,outObj,calcStatus,tokenValue }:InputBoxProps) {
  const valueRef = useRef("0");
  const inputRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(tokenValue === 0 && inputRef.current) {
      inputRef.current.value = ''; }  //外部改变tokenValue
  },[tokenValue])
 
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let prev = valueRef.current;
    const cur = e.currentTarget.value.trim();
    if (!cur) prev = "";
    else if (cur[0] === "0" && cur[1] !== ".") prev = "0";// 第一位是0，第二位不是.
    else if (!isNaN(parseFloat(cur)) && isFinite(+cur)) prev = cur;  //+cur 一元加号运算符，作用是把 string 转换成 number
    e.currentTarget.value = prev;
    if (+valueRef.current === +prev) return;
    valueRef.current = prev;
    setTokenValue(+prev);
    calcStatus(+prev,tipValue.value,inObj.token_id,outObj.token_id)
  };
  
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="0.0"
      onChange={inputChange}
      onFocus={() => setInputError('')}
      style={{ color: inputError ? "red" : "#0D111C", fontSize: "2rem", width: "100%", minWidth: 120, border: 0, background: "transparent", outline: "none" }}
    />
  );
}

