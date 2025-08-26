
import FreeDatePicker,{DateRef} from "../FreeDatePicker";
import React, { useImperativeHandle, useState, forwardRef, ForwardRefRenderFunction, useRef } from "react";

// 定义组件props的接口
interface DateTimeItemProps {
  title?: string;
  defaultValue?: string|Date ;
}

// 定义ref暴露的接口
export interface DateTimeItemRef {
  getData: () => string|undefined;
}

const DateTimeItem: ForwardRefRenderFunction<DateTimeItemRef, DateTimeItemProps> = (props, ref) => {

  const DatePickerRef=useRef<DateRef>(null);
  
  useImperativeHandle(ref, () => ({
    getData:()=>{return DatePickerRef.current?.getDate();}
  }));
  
  return (
    <div className="input-group mb-3">
      <span className="input-group-text">{props.title}</span>
      <div className="form-control">
        <FreeDatePicker ref={DatePickerRef} defaultValue={props.defaultValue}        />
      </div>
    </div>
  );
};

export default React.memo(forwardRef(DateTimeItem));