
import EnkiMemberItem from "../../../components/enki2/form/EnkiMemberItem";
import {useDispatch} from 'react-redux';
import { setTipText, setMessageText } from '../../../data/valueData'
import MessageReply from "../../../components/enki2/form/MessageReply";
import EnKiBookmark from "../../../components/enki2/form/EnKiBookmark";
import EnKiHeart from "../../../components/enki2/form/EnKiHeart";
import EnkiShare from "../../../components/enki2/form/EnkiShare";
import ShowVideo from "../../../components/enki2/form/ShowVideo";
import { useRef,useState,useEffect } from "react";
import { client } from "../../../lib/api/client";

const crypto = require('crypto');

export default function Contentdiv({path,env,locale,loginsiwe,messageObj,t,tc,actor,setCurrentObj,setActiveTab,replyAddCallBack,delCallBack}) {
    
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const contentDiv=useRef()
    const [isEdit,setIsEdit]=useState(false);
    const [total,setTotal]=useState(0);//回复总数
    const encrypt=(text)=>{
      const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    }

     //选取回复总数  
     useEffect(()=>{
      let ignore = false;
      if(messageObj?.id)
      client.get(`/api/getData?sctype=${messageObj.dao_id>0?'sc':''}&pid=${messageObj.id}`,'getReplyTotal').then(res =>{ 
          if (!ignore) 
              if (res.status===200) setTotal(res.data)
        });
      return () => {ignore = true}
  },[messageObj])

    useEffect(()=>{
      const checkIsEdit=()=>{  //是否允许修改
          if(!loginsiwe) return false;
          if(!actor?.actor_account && !actor?.actor_account?.includes('@')) return false;
          //远程读取不可修改
          if(env.domain!=messageObj.actor_account.split('@')[1]) return false;
          if(messageObj.dao_id>0){  //SC
              if(path!=='enki') return false; // 不是从我的社区模块进入，不允许修改
              let _member=daoActor.find((obj)=>{return obj.dao_id===currentObj.dao_id})
              if(_member){
                   return true;
              } 
          }else { //个人
              if(path!=='enkier') return false;// 不是从个人社交模块进入，不允许修改
                //非本地登录
              if(actor.actor_account.split('@')[1]!=env.domain) return false;
              if(messageObj.send_type===0){ //本地
                  if(actor.actor_account===messageObj.actor_account) return true;
              }else { //接收
                  if(actor.actor_account===messageObj.receive_account) return true;
              }
          }
          //超级管理员
          if(actor?.manager?.toLowerCase()==env.administrator.toLowerCase()) return true;
          return false;
      }

      setIsEdit(checkIsEdit())

  },[actor,messageObj])

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

  const handle=(id)=>{

    setCurrentObj(messageObj);
    setActiveTab(2);
    sessionStorage.setItem("daism-list-id",id)
    history.pushState({ id: messageObj?.id }, `id:${messageObj?.id}`, `?d=${encrypt(`${messageObj.id},${geneType()},${getDomain()}`)}`);
  }
    return (
   

       <div id={`item-${messageObj.id}`}  style={{padding:'10px',borderBottom:'1px solid #D9D9E8'}}>
      
{/*             
            <EnkiMemberItem messageObj={messageObj} t={t}  domain={env?.domain} isEdit={false}
             locale={locale} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />   */}
           
           <EnkiMemberItem t={t} messageObj={messageObj} domain={env.domain} actor={actor} locale={locale} delCallBack={delCallBack}
                 preEditCall={e=>{ setCurrentObj(messageObj);setActiveTab(1);}} showTip={showTip} closeTip={closeTip}
                 showClipError={showClipError} isEdit={isEdit} />

            <div className="daism-a mt-2 mb-3" style={{fontWeight:'bold'}}  onClick={()=>handle(messageObj.id)} >
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
