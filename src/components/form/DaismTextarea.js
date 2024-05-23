import { Form } from "react-bootstrap";
import React, {useImperativeHandle,useState,useRef, forwardRef } from "react";
import ErrorBar from "./ErrorBar";

const DaismTextarea = forwardRef(({title,defaultValue}, ref) => {
    const editRef=useRef()
    const [showError,setShowError]=useState(false)
    const [invalidText,setInvalidText]=useState('')
    const getData = () => {
      return editRef.current.value
    };

    useImperativeHandle(ref, () => ({
      getData: getData,
      notValid:notValid
    }));
    const notValid = (errorText) => {
      setShowError(true)
      setInvalidText(errorText)
   };

    return (
        <Form.Group className="mb-3" >
        <Form.Label className="mb-0" style={{marginLeft:'6px'}}>{title}:</Form.Label>
        <Form.Control as="textarea"   isInvalid={showError}   onFocus={() => { setShowError(false);}}  
        defaultValue={defaultValue} ref={editRef} rows={3} />
        <ErrorBar show={showError} target={editRef} placement='top' invalidText={invalidText} ></ErrorBar>
        </Form.Group>
    );
});

export default  React.memo(DaismTextarea);
