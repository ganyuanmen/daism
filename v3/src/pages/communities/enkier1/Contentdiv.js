
import EnkiMemberItem from "../../../components/enki2/form/EnkiMemberItem";
import {useDispatch} from 'react-redux';
import { setTipText, setMessageText } from '../../../data/valueData'
import MessageReply from "../../../components/enki2/form/MessageReply";
import EnKiBookmark from "../../../components/enki2/form/EnKiBookmark";
import EnKiHeart from "../../../components/enki2/form/EnKiHeart";
import EnkiShare from "../../../components/enki2/form/EnkiShare";
import ShowVideo from "../../../components/enki2/form/ShowVideo";
import { useRef } from "react";
const crypto = require('crypto');

export default function Contentdiv({env,locale,tc, t,messageObj,actor,setCurrentObj,setActiveTab,loginsiwe,replyAddCallBack}) {
    
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const contentDiv=useRef()
   
    const encrypt=(text)=>{
      const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    }
  
    const getDomain=()=>{
      let _account=(messageObj.send_type==0?messageObj.actor_account:messageObj.receive_account);
      return _account.split('@')[1];
    }
  
    const geneType=()=>{
      if(messageObj?.send_type==1) return ''; //推送的都在message
      if(parseInt(messageObj?.dao_id)>0) return 'sc'; //sc 发表的
      return ''; // 默认在message
    }
    const ableReply = () => { //是否允许回复，点赞，书签
      if(!loginsiwe) return false;
      if(!actor?.actor_account && !actor?.actor_account?.includes('@')) return false;

      //发布帐号，用于判断是否本域名
      let _account=messageObj?.send_type==0?messageObj?.actor_account:messageObj?.receive_account;
      const [name, messDomain] = _account.split('@');
      return env.domain === messDomain; //本域名发布，可以回复
  }

  const handle=()=>{

    setCurrentObj(messageObj);
    setActiveTab(2);
  
    history.pushState({ id: messageObj?.id }, `id:${messageObj?.id}`, `?d=${encrypt(`${messageObj.id},${geneType()},${getDomain()}`)}`);
  }
    return (
   

       <div style={{padding:'10px',borderBottom:'1px solid #D9D9E8'}}>
      
            
            <EnkiMemberItem messageObj={messageObj} t={t}  domain={env?.domain} isEdit={false} locale={locale} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />    {/* '不检测关注' 不修改不删除 */}
           
      
            <div className="daism-a mt-2 mb-3" style={{fontWeight:'bold'}}  onClick={handle} >
                <div ref={contentDiv} dangerouslySetInnerHTML={{__html:messageObj?.content}}></div>
           </div>
            {messageObj?.content_link && <div dangerouslySetInnerHTML={{__html: messageObj.content_link}}></div>}
            {messageObj?.top_img && <img  className="mt-2 mb-2" alt="" src={messageObj.top_img} style={{width:'100%'}} />
            }
            {messageObj?.vedio_url && <ShowVideo videoUrl={messageObj.vedio_url} title='' /> 
            }
           <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                
                <MessageReply  t={t} tc={tc} actor={actor} currentObj={messageObj} total={messageObj.total} isEdit={ableReply()}
                 addReplyCallBack={replyAddCallBack}  domain={env.domain} loginsiwe={loginsiwe}
                 showTip={showTip} closeTip={closeTip} showClipError={showClipError} />

                <EnKiHeart isEdit={ableReply()} t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} currentObj={messageObj}
                 domain={env.domain} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />

                <EnKiBookmark isEdit={ableReply() && actor.actor_account.split('@')[1]==env.domain} t={t} tc={tc}
                 loginsiwe={loginsiwe} actor={actor} currentObj={messageObj} domain={env.domain} showTip={showTip}
                  closeTip={closeTip} showClipError={showClipError}  />

              {messageObj.send_type===0 && <EnkiShare content={contentDiv.current?.textContent} locale={locale}
               currentObj={messageObj} t={t} tc={tc} />}
            </div>

         {/* <FootButton actor={actor} env={env} t={t} tc={tc} messageObj={messageObj} showClipError={showClipError} showTip={showTip} closeTip={closeTip} replyAddCallBack={replyAddCallBack} /> */}
        </div>

    );
}
