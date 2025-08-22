
import EnkiMemberItem from "../enki2/form/EnkiMemberItem";
import MessageReply from "../enki2/form/MessageReply";
import EnKiBookmark from "../enki2/form/EnKiBookmark";
import EnKiHeart from "../enki2/form/EnKiHeart";
import EnkiShare from "../enki2/form/EnkiShare";
import ShowVedio from "../enki2/form/ShowVedio";
import { useRef,useState,useEffect,useCallback } from "react";
import { Down } from "../../lib/jssvg/SvgCollection";
import EnkiEditItem from "../enki2/form/EnkiEditItem";
import { Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl'
import ShowAddress from "../ShowAddress";

/**
 * 列表中的单个嗯文
 * @path enki/enkier 
 * @env 环境变量
 * @locale zh/cn
 * @messageObj 嗯文对象
 * @setCurrentObj 设置当前嗯文
 * @setActiveTab 主页模块显示
 * @replyAddCallBack 回复增加后回调
 * @delCallBack 删除嗯文后回调
 * @afterEditCall 修改嗯文后回调
 * @data_index 主页嗯文列表中的当前序号
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @daoData 个人所属的smart common 集合
 * @fromPerson 个人信息、中允许修改
 */

export default function Contentdiv({path,env,locale,messageObj,setCurrentObj,filterTag,
  setActiveTab,replyAddCallBack,delCallBack,afterEditCall,data_index,accountAr,daoData,tabIndex,fromPerson=false}) {
    
    const actor = useSelector((state) => state.valueData.actor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const t = useTranslations('ff')
    const [divContent, setDivContent] = useState(null);

    const handleDivRef = useCallback((node) => {
      if (node !== null) setDivContent(node?.textContent.slice(0,120).replaceAll('\n',''));
      if(node?.scrollHeight > 400) setShowBtn(true)
    }, [messageObj]); 

    const [isEdit,setIsEdit]=useState(false);
    // const [showAll, setShowAll] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
   
   
    useEffect(()=>{
      const checkIsEdit=()=>{  //是否允许修改
          if(!loginsiwe) return false;
          if(!messageObj?.actor_account && !messageObj?.actor_account?.includes('@')) return false;
          if(!actor?.actor_account || !actor?.actor_account?.includes('@')) return false;
          //远程读取不可修改
          if(env.domain!=messageObj.actor_account.split('@')[1]) return false;
          if(messageObj.dao_id>0){  //SC
              if(path!=='enki') return false; // 不是从我的社区模块进入，不允许修改
              let _member=daoData.find((obj)=>{return obj.dao_id===messageObj.dao_id})
              if(_member){
                   return true;
              } 
          }else { //个人
              if(path!=='enkier') return false;// 不是从个人社交模块进入，不允许修改
                //非本地登录
              if(actor?.actor_account.split('@')[1]!=env.domain) return false;
              if(messageObj.send_type===0){ //本地
                  if(actor?.actor_account===messageObj.actor_account) return true;
              }
              // else { //接收
              //     if(actor?.actor_account===messageObj.receive_account) return true;
              // }
          }
          //超级管理员
          if(actor?.manager?.toLowerCase()==env.administrator.toLowerCase()) return true;
          return false;
      }

      setIsEdit(checkIsEdit())

    },[actor,messageObj])

    const ableReply = () => { //是否允许回复，点赞，书签
      if(!loginsiwe || !actor?.actor_account) return false;
      if(messageObj?.httpNetWork) return false; // 远程服务器不可回复
      return true;
  }

    const months=t('monthText').split(',')
    const getMonth=()=>{
        let m=new Date(messageObj.start_time)
        return months[m.getMonth()]
    }
    const getDay=()=>{
        let m=new Date(messageObj.start_time)
        return m.getDate()
    }
  
    const bStyle={
        width:'80px',
        position:'absolute',
        top:'0',
        left:'0',
        borderRadius:'0.3rem',
        backgroundColor:'white'
    }

const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;

const filter = (para) => {
if(typeof filterTag === 'function') filterTag.call(null,para)
};
 const replacedText = messageObj?.content.replace(regex, (match, p1) => {
  const escapedParam = p1.replace(/"/g, '&quot;');
  return `<span class="tagclass" data-param="${escapedParam}">#${p1}</span>`;
});

// 点击事件处理
const handleClick = useCallback((event) => {
  const target = event.target;
  if (target.classList.contains('tagclass')) {
    const param = target.dataset.param;
    if (param) {
      filter(param);
    } else afterEditCall.call(this,messageObj)
  } else 
  afterEditCall.call(this,messageObj)
}, []); // fi




    return (
   

       <div id={`item-${messageObj.id}`}  style={{padding:'10px',borderBottom:'1px solid #D9D9E8'}}>
           <EnkiMemberItem messageObj={messageObj} domain={env.domain} locale={locale} fromPerson={fromPerson} />

            <div style={{position:'relative'}}  className="daism-a mt-2 mb-3"  onClick={handleClick}
               > 
                <div className="daismCard"  ref={handleDivRef} style={messageObj._type===1?{paddingLeft:'90px',minHeight:'80px',
                    maxHeight: '400px', overflow: 'hidden'}
                    :{maxHeight: '400px', overflow: 'hidden'}} 
                    dangerouslySetInnerHTML={{__html:replacedText}}>
                </div>
                {messageObj._type===1 && 
                <div className='border' style={bStyle} >
                    <div style={{borderRadius:'0.3rem 0.3rem 0 0', backgroundColor:'red',height:'26px'}} ></div>
                    <div className='fs-4' style={{textAlign:'center'}} ><strong>{getDay()}{t('dayText')}</strong></div>
                    <div className='fs-7 mb-2' style={{textAlign:'center'}} ><strong>{getMonth()}</strong></div>
                </div>
                }
                { showBtn && <Button variant="light" onClick={handleClick}
                     style={{position:'absolute',right:0,bottom:0}} title={t('showmore')}>  
                        <Down size={24} />...
                    </Button>
                }
           </div>
           
            {messageObj?.content_link && <div dangerouslySetInnerHTML={{__html: messageObj.content_link}}></div>}
            {messageObj?.top_img && <div className="image-container" ><img  onClick={()=>afterEditCall.call(this,messageObj)} className="daism-a mt-2 mb-2" 
                alt="" src={messageObj.top_img} /></div>
            }
            {messageObj?.vedio_url && <ShowVedio vedioUrl={messageObj.vedio_url} /> }
        
            
            {/* 发起者 */}
            {messageObj?.self_account  &&<div className="d-flex align-items-center mt-1">
              <div className="d-inline-flex align-items-center" >
                 <span style={{display:'inline-block',paddingRight:'4px'}} >{t('proposedText')}:</span>
                 <img src={messageObj?.self_avatar} alt='' style={{borderRadius:'10px'}} width={32} height={32}/> 
              </div>
              <div style={{flex:1}}  className="d-flex flex-column flex-md-row justify-content-between ">
                  <span> {messageObj?.self_account} </span>
                  <div>
                  <ShowAddress address={messageObj?.manager} />
                  </div>
              </div>
          </div>
            }

           <div className="d-flex justify-content-between align-items-center" style={{padding:'4px 8px'}}  >
                
                <MessageReply currentObj={messageObj} isEdit={ableReply()} isTopShow={true}
                 addReplyCallBack={replyAddCallBack} data_index={data_index} accountAr={accountAr} />

                <EnKiHeart isEdit={ableReply() && actor?.domain===env.domain} currentObj={messageObj} path={path} />
                {/* 非注册地登录，不能收藏 */}
                <EnKiBookmark isEdit={ableReply() && actor?.domain===env.domain} currentObj={messageObj} path={path}/>

              {divContent && <EnkiShare  content={divContent} env={env} currentObj={messageObj}  />}
            
             {path!=='SC' && actor?.domain===env.domain && <EnkiEditItem path={path}  isEdit={isEdit} env={env} actor={actor} messageObj={messageObj} delCallBack={delCallBack}
               preEditCall={()=>{ setCurrentObj(messageObj);setActiveTab(tabIndex);}} sctype={messageObj?.dao_id>0?'sc':''} fromPerson={fromPerson}  /> }
            </div>

        </div>

    );
}
