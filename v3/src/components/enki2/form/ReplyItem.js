import TimesItem from "../../federation/TimesItem";
import EnkiMember from "./EnkiMember"
import EnkiEditItem from "./EnkiEditItem"
import { useSelector } from 'react-redux';

//关注内容 
export default function ReplyItem({locale,isEdit,t,replyObj,delCallBack,preEditCall,sctype}) {

 const editCallBack=()=>{
    preEditCall(replyObj)
 }


    return (
        <div style={{borderBottom:'1px solid #D2D2D2'}}>
           <div className="d-flex justify-content-between align-items-center" style={{paddingLeft:"20px"}}  >
                <EnkiMember messageObj={replyObj} isLocal={false} hw={32} locale={locale} />
                <div style={{paddingRight:'10px'}}  >
                    {isEdit && <EnkiEditItem  messageObj={replyObj}  t={t} delCallBack={delCallBack} preEditCall={editCallBack} type={1} sctype={sctype} />
                    } 
                    <TimesItem times={replyObj.times} t={t} />
                </div>
            </div> 
            <div className="daism-reply-item" style={{paddingBottom:'20px'}} dangerouslySetInnerHTML={{__html: `<p>${replyObj.content.replaceAll("\r\n",'</p><p>')}</p>`}}></div> 
        </div> 
    );
}

