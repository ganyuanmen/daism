import { Card } from "react-bootstrap";
import MemberItem from "./MemberItem";
import EventItem from "../form/EventItem";
import ShowVedio from "../form/ShowVedio";
import { useTranslations } from 'next-intl'
import ShowAddress from "../../ShowAddress";
import ReplyRecord from "./ReplyRecord";
import { ReplySvg,Heart, BookTap} from "../../../lib/jssvg/SvgCollection";

export default function EnkiMess({locale,currentObj,env,replyData,honor,bookTotal,heartTotal}) {
    const t = useTranslations('ff')
    const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
    const replacedText = currentObj?.content.replace(regex, (match, p1) => {
        const escapedParam = p1.replace(/"/g, '&quot;');
        return `<span class="tagclass daism-a" data-param="${escapedParam}">#${p1}</span>`;
    });

    return (
        <Card className=" mt-2 mb-3" >
            <Card.Header> 
                <MemberItem messageObj={currentObj} locale={locale} honor={honor} />
                {currentObj?._type===1 && <EventItem currentObj={currentObj} /> }
            </Card.Header>
        <Card.Body>
        <div className="daismCard"  dangerouslySetInnerHTML={{__html: replacedText}}></div>
        {currentObj?.content_link && <div dangerouslySetInnerHTML={{__html: currentObj.content_link}}></div>}
        {currentObj?.top_img && <img  className="mt-2 mb-2" alt="" src={currentObj.top_img} style={{maxWidth:'100%'}} /> }
        {currentObj?.vedio_url && <ShowVedio vedioUrl={currentObj.vedio_url} /> }
 
        </Card.Body>
        <Card.Footer style={{padding:0}} >

            {/* 发起者 */}
            {currentObj?.dao_id>0 && currentObj?.send_type===0 &&<div className="d-flex align-items-center mt-1">
              <div style={{paddingLeft:'10px'}} className="d-inline-flex align-items-center" >
                 <span style={{display:'inline-block',paddingRight:'4px'}}>{t('proposedText')}:</span>{' '}
                 <img src={currentObj?.self_avatar} alt='' style={{borderRadius:'10px'}} width={32} height={32}/> 
              </div>
              <div style={{flex:1}}  className="d-flex flex-column flex-md-row justify-content-between ">
                  <span> {currentObj?.self_account} </span>
                  <div>
                  <ShowAddress address={currentObj?.manager} />
                  </div>
              </div>
          </div>}

            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                <div><ReplySvg size={24} />{currentObj.total}</div>
                <div><Heart size={18} />{heartTotal}</div>
                <div><BookTap size={18} />{bookTotal}</div>
            </div>
            {currentObj?.link_url && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
                    <a target="_blank" href={currentObj?.link_url} >{t('origlText')}......</a>
                    </div> 
            }
          {replyData.map((obj,idx)=>(
            <ReplyRecord locale={locale} replyObj={obj} key={idx} />
            ))}
        </Card.Footer>
        </Card>
       
        
    );
}




