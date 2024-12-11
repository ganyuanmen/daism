import React, {useImperativeHandle,useRef, forwardRef,useState } from "react";
import Media from "./Media";
import SCProperty from "./SCProperty";
import dynamic from 'next/dynamic';


const Richwet = dynamic(() => import('./Richwet'), { ssr: false });


/**
 * 长文编辑框
 * @currentObj 修改的嗯文，新增则为空
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人, 回复不需要指定人，所以不传accountAr
  */

const RichEditor = forwardRef(({currentObj,accountAr}, ref) => {
 
    const mediaRef = useRef(null);
    const editorRef = useRef(null);
    
    const propertyRef=useRef('')

    useImperativeHandle(ref, () => ({
        getData: ()=>{return editorRef.current.value},
        getImg:()=>{return mediaRef.current.getImg()},
        getFileType:()=>{return mediaRef.current.getFileType()},
        getVedioUrl:()=>{return mediaRef.current.getVedioUrl()},
        getProperty:()=>{return propertyRef.current.getData()},
        getAccount:()=>{return propertyRef.current.getAccount()},
        getTextContent:getTextContent,
    }));

  
    const transformHTML=(html)=> {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let result = '';
        const allNodes = doc.body.childNodes;  
        allNodes.forEach(node => {
          if(node.textContent.trim())  result += `<p>${node.textContent.trim()}</p>`;
        });
        return result;
    }

    const getTextContent=()=>{
        const elements5 = document.querySelectorAll('.jodit-wysiwyg');
        return transformHTML(elements5[0].innerHTML); 
    
    }
   
    return (
        <>
           <Richwet defaultValue={currentObj?.content?currentObj.content:''} editorRef={editorRef} />
           <Media ref={mediaRef} currentObj={currentObj} >
              {accountAr &&  <SCProperty ref={propertyRef} currentObj={currentObj} accountAr={accountAr} >
                </SCProperty>}
            </Media>
        </>
    );
});

export default React.memo(RichEditor);

