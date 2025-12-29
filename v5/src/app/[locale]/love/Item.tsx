
import { useState,useEffect, useRef } from "react";
import {  Down,  Up } from "@/lib/jssvg/SvgCollection";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

  // props 类型
  interface ReplyItemProps {
    record: LoveType;
   
  }
  
  export default function Item({record}: ReplyItemProps) {


    const [exPandID,setExPandID]=useState(''); //扩展的ID

    const t = useTranslations('ff')
    const [showToggle, setShowToggle] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = contentRef.current;
      if (el && el.scrollHeight > 200) {
        setShowToggle(true);
      }
    }, []);
  
  
  
    return (
 
        <div className="daism-reply-item" style={{ paddingBottom: "10px" }}>
          <div ref={contentRef} className={record.message_id===exPandID?'':'daism-expand'} style={{ minHeight: "40px", }}
            dangerouslySetInnerHTML={{ __html: record.content }}/>
        
          {showToggle && (
          <Button
            variant="light"
            onClick={() => setExPandID(exPandID?'':record.message_id)}
            style={{ position: "absolute", right: 0, bottom: 0 }}
            title={t("showmore")}
          >
           {exPandID?<Up size={24} />:<Down size={24}/> }
            
          </Button>
        )}
        
        </div>
    
    );
  }

