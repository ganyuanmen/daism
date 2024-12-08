import React, {useImperativeHandle,useRef, forwardRef,useState } from "react";

// import JoditEditor from 'jodit-react';
import Media from "./Media";
import SCProperty from "./SCProperty";
import dynamic from 'next/dynamic';

const Richwet = dynamic(() => import('./Richwet'), { ssr: false });

const RichEditor = forwardRef(({currentObj,tc,t,accountAr,actor,showProperty=true}, ref) => {
    
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
           <Media ref={mediaRef} t={t} tc={tc} currentObj={currentObj} >
              {showProperty &&  <SCProperty ref={propertyRef} t={t} currentObj={currentObj} accountAr={accountAr} actor={actor} >
                </SCProperty>}
            </Media>
        </>
    );
});

export default React.memo(RichEditor);

