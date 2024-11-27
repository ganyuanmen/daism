import React, {useImperativeHandle,useState,useRef, forwardRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import editStyle from '../../../styles/editor.module.css'
import ErrorBar from "../../form/ErrorBar";
// import { client } from "../../../lib/api/client";

const Editor = forwardRef(({title,defaultValue,t}, ref) => {
  const [showError,setShowError]=useState(false)
  const [invalidText,setInvalidText]=useState('')   //检测出错提示
  const [inputValue, setInputValue] = useState(defaultValue);  //文本框的值
  // const [autocompleteItems, setAutocompleteItems] = useState([]);  //过滤出帐号昵称的数组
  const [remainingChars, setRemainingChars] = useState(200); //还余多少字符
  // const [predefinedKeywords,setPredefinedKeywords]=useState([])  //所有帐号昵称的值

  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: ()=>{return inputValue},
    notValid:(errorText)=>{setShowError(true);setInvalidText(errorText);}
  }));

  // useEffect(()=>{
  //   let ignore = false;
  //   client.get(`/api/getData`,'getNick').then(res =>{ 
  //       if (!ignore) {if (res.status===200) { 
  //         const nicks = res.data.map(item => item.actor_name);
  //         setPredefinedKeywords(nicks); 
  //       }}
  //   });
  //   return () => {ignore = true}
  //  },[])

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight+6}px`;
  }, [inputValue]);

 
  //输入处理
  const onInput = (e) => {
    // e.target.style.height = 'auto';
    // e.target.style.height = (e.target.scrollHeight) + 'px';
    const value = e.target.value;
    if (value.length <= 200) {
    
      setRemainingChars(200 - value.length);
      // const cursorPos = e.target.selectionStart;
      // const textBeforeCursor = value.slice(0, cursorPos);
      // const hashWordMatch = textBeforeCursor.match(/@([\w\u4e00-\u9fa5\d]+)$/);
      // if (hashWordMatch) {
      //   const currentWord = hashWordMatch[1];
      //   const filteredKeywords = predefinedKeywords.filter(keyword => keyword.startsWith(currentWord));
      //   setAutocompleteItems(filteredKeywords);
      // } else {
      //   setAutocompleteItems([]);
      // }
    } else 
    {
        setInputValue(value.slice(0, 200));
    }
  };


  //单击选择名称后替换
  // const replaceHashWord = (newWord) => {
  //   const cursorPos = textareaRef.current.selectionStart;
  //   const textBeforeCursor = inputValue.slice(0, cursorPos);
  //   const textAfterCursor = inputValue.slice(cursorPos);
  //   const newTextBeforeCursor = textBeforeCursor.replace(/@[\w\u4e00-\u9fa5\d]+$/, `@${newWord} `);
  //   const newValue = newTextBeforeCursor + textAfterCursor;
  //   setInputValue(newValue);
  //   setAutocompleteItems([]);
  //   setTimeout(() => {
  //     textareaRef.current.setSelectionRange(newTextBeforeCursor.length + 1, newTextBeforeCursor.length + 1);
  //     textareaRef.current.focus();
  //   }, 0);
  // };

  
  return (
  <Form >
     <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>{title}:</Form.Label>
        <Form.Control as="textarea"  isInvalid={showError} onFocus={() => { setShowError(false);}}  
        ref={textareaRef} rows={3}  value={inputValue}  onChange={(e) => setInputValue(e.target.value)}  
        onInput={onInput}  />
         <ErrorBar show={showError} target={textareaRef} placement='top' invalidText={invalidText} ></ErrorBar>
      </Form.Group>

    {/* <InputGroup className="mb-1">
      <Form.Label></Form.Label>
      <InputGroup.Text >{title}</InputGroup.Text>
      <Form.Control as="textarea" isInvalid={showError} onFocus={() => { setShowError(false);}}  
        ref={textareaRef} rows={3}  value={inputValue}  onChange={(e) => setInputValue(e.target.value)}  
        onInput={onInput} 
      />
     
    </InputGroup> */}
    <span className={editStyle.charcount}>{t('remainingText')}: {remainingChars}</span>  
    {/* {autocompleteItems.length > 0 && (
      <div className={editStyle.autocompleteitems}>
        {autocompleteItems.map((item, index) => (
          <div key={index} className={editStyle.autocompleteitem} onClick={() => replaceHashWord(item)}>
            @{item}
          </div>
        ))}
      </div>
    )} */}
  </Form>
 
  );
});

export default React.memo(Editor);
