import { Form,InputGroup } from "react-bootstrap";
import React, {useImperativeHandle,useState,useRef, forwardRef } from "react";
import ErrorBar from "./ErrorBar";

const DaismInputGroup = forwardRef(({title,defaultValue,...props}, ref) => {
    const [showError,setShowError]=useState(false)
    const [invalidText,setInvalidText]=useState('')
    const editRef=useRef()
   
    const getData = () => {
      return editRef.current.value
    };

    const notValid = (errorText) => {
       setShowError(true)
       setInvalidText(errorText)
    };

    const mySetValue=(v)=>{editRef.current.value=v}
    
    useImperativeHandle(ref, () => ({
      getData: getData,
      notValid:notValid,
      mySetValue:mySetValue

    }));


    return (<> 
            {props.horizontal? 
              <InputGroup className="mb-2">
                <InputGroup.Text  >{title}</InputGroup.Text>
                <Form.Control 
                ref={editRef} 
                isInvalid={showError} 
                type="text" 
                disabled={props.readonly}
                defaultValue={defaultValue} 
                placeholder={title} 
                onFocus={() => { setShowError(false);}} 
              />
              </InputGroup>
            : <Form.Group className="mb-2">
              <Form.Label className="mb-0" style={{marginLeft:'6px'}} >{title}:</Form.Label>
              <Form.Control 
                ref={editRef} 
                isInvalid={showError} 
                type="text" 
                disabled={props.readonly}
                defaultValue={defaultValue} 
                placeholder={title} 
                onFocus={() => { setShowError(false);}} 
              />
              </Form.Group>
            }
       <ErrorBar show={showError} target={editRef} placement='bottom' invalidText={invalidText} />
        </>
    );
});

export default React.memo(DaismInputGroup);
