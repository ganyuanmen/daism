

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, {useImperativeHandle,useState, forwardRef } from "react";

const DateTimeItem = forwardRef((props, ref) => {
    const [datetime, setDatetime] = useState(props.defaultValue? new Date(props.defaultValue): new Date())
    
function getDateTimeString(currentDate)
{  
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0'); 
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); 
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

    const getData = () => {
      return getDateTimeString(datetime)
    };
  
    useImperativeHandle(ref, () => ({
      getData: getData
    }));
  
    return (
        <div className="input-group mb-3">
            <span className="input-group-text">{props.title}</span>
            <div className="form-control">
                <DatePicker selected={datetime}  onChange={setDatetime} showTimeSelect dateFormat="Pp" />
            </div>
        </div>
    );
});

export default  React.memo(DateTimeItem);