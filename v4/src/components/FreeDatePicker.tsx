import React, { forwardRef, useImperativeHandle, useState } from "react";
import "react-day-picker/dist/style.css";
import dayjs, { Dayjs } from "dayjs";

type DateProps={defaultValue?:string|Date};
export interface DateRef {getDate: () => string;}

const FreeDatePicker = forwardRef<DateRef, DateProps>(({defaultValue}, ref) => {

    const curDate=defaultValue?dayjs(defaultValue):dayjs();
    const [dateTime, setDateTime] = useState<Dayjs>(curDate);


    useImperativeHandle(ref, () => ({
        getDate: () => { return dateTime.format("YYYY-MM-DD HH:mm:ss")}
      
      }));


  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      <div>
        <input
          type="date"
          value={dateTime.format("YYYY-MM-DD")}
          onChange={(e) =>
            setDateTime(dayjs(e.target.value).hour(dateTime.hour()).minute(dateTime.minute()))
          }
        />
        <input
          type="time"
          value={dateTime.format("HH:mm")}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            setDateTime(dateTime.hour(h).minute(m));
          }}
        />
        {/* <div>选中日期时间: {dateTime.format("YYYY-MM-DD HH:mm:ss")}</div> */}
      </div>
    </div>
  );
});


export default React.memo(FreeDatePicker);