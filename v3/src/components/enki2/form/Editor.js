import React, {useImperativeHandle,useState,useRef, forwardRef, useEffect } from "react";
import editStyle from '../../../styles/editor.module.css'
import SCProperty from "../../enki3/SCProperty";
import Media from "../../enki3/Media";

const Editor = forwardRef(({currentObj,nums,t,tc,accountAr,actor,showProperty=true }, ref) => {
  const delHtml=()=>{
    let temp=(currentObj?.content || '').replaceAll('</p><p>','\n')
    temp=temp.replaceAll('<p>','')
    temp=temp.replaceAll('</p>','')
    return temp
  }

  const [inputValue, setInputValue] = useState(delHtml());  //文本框的值
  const [remainingChars, setRemainingChars] = useState(currentObj?.content? nums-currentObj.content.length:nums); //还余多少字符
    
  const textareaRef = useRef(null);  //嗯文内容
  const propertyRef = useRef(null); //属性组件
  const mediaRef = useRef(null); //图片视频组件

  useImperativeHandle(ref, () => ({
    getData: ()=>{return inputValue},
    getImg:()=>{return mediaRef.current.getImg()},
    getFileType:()=>{return mediaRef.current.getFileType()},
    getVedioUrl:()=>{return mediaRef.current.getVedioUrl()},
    getProperty:()=>{return propertyRef.current.getData()},
    getAccount:()=>{return propertyRef.current.getAccount()},
  }));

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight+6}px`;
  }, [inputValue]);

 
  //输入处理
  const onInput = (e) => {
    const value = e.target.value;
    if (value.length <= nums) {
      setRemainingChars(nums - value.length);
    } else 
    {
        setInputValue(value.slice(0, nums));
    }
  };

  return (
  <>
    <textarea className="form-control" ref={textareaRef} rows={5}   onInput={onInput}  value={inputValue}  
    onChange={(e) => setInputValue(e.target.value)} />
    
    <Media ref={mediaRef} t={t} tc={tc} currentObj={currentObj} >
       {showProperty && <SCProperty ref={propertyRef} t={t} currentObj={currentObj} accountAr={accountAr}  actor={actor} >
          <div className={editStyle.charcount}>{t('remainingText')}: {remainingChars} </div> 
        </SCProperty>}
    </Media>
  </>
 
  );
});

export default React.memo(Editor);

