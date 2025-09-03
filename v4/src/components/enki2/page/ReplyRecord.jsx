import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "../form/EnkiMember"
import ShowVedio from "../form/ShowVedio";





export default function ReplyRecord({locale,replyObj}) {


    return (
        <div style={{borderBottom:'1px solid #D2D2D2',width:'100%',paddingLeft:`10px`}}>
           <div style={{width:'100%',paddingLeft:"10px"}} className="d-inline-flex justify-content-between align-items-center"   >
               <div style={{width:'50%'}} > <EnkiMember messageObj={replyObj} isLocal={false} hw={32} locale={locale} /></div>
                <div  style={{paddingRight:'10px'}}  >
                    <TimesItem_m currentObj={replyObj} /> 
                </div>
            </div> 
            <div className="daism-reply-item" style={{paddingBottom:'10px'}} >
                <div style={{minHeight:'40px'}} dangerouslySetInnerHTML={{__html: replyObj.content}}></div>
                {replyObj?.content_link && <div dangerouslySetInnerHTML={{__html: replyObj.content_link}}></div>}
                {replyObj?.top_img && <Image  className="mt-2 mb-2" alt="" src={replyObj.top_img} style={{maxWidth:'100%'}} />
                }
                {replyObj?.vedio_url && <ShowVedio vedioUrl={replyObj.vedio_url} /> 
                }
            </div> 
        </div> 
    );
}


