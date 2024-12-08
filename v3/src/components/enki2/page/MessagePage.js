import { Card,Button } from "react-bootstrap";
import { useState,useEffect, useRef } from 'react';
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply from '../form/MessageReply'
import ReplyItem from "../form/ReplyItem";
import Loadding from "../../Loadding";
import ShowErrorBar from "../../ShowErrorBar";
import {useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import { ExitSvg } from "../../../lib/jssvg/SvgCollection";
import EnkiShare from "../form/EnkiShare";
import { client } from "../../../lib/api/client";
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ShowVedio from "../form/ShowVedio";
/**
 * 单登个发文信息界面 //  delCallBack:删除嗯文后回调
 * isEdit 是否允许修改  
 */

export default function MessagePage({path,locale,t,tc,actor,loginsiwe,env,currentObj,delCallBack,setActiveTab,accountAr}) { 
    const[fetchWhere, setFetchWhere] = useState({currentPageNum:0
        ,account:currentObj?.send_type==0?currentObj?.actor_account:currentObj?.receive_account 
        ,sctype:currentObj.dao_id>0?'sc':''
        ,pid:currentObj.id});

    const daoActor=useSelector((state) => state.valueData.daoActor)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    const [isEdit,setIsEdit]=useState(false);
    const [replyIndex,setReplyIndex]=useState(-1) //保存修改讨论的数组序号
    const [replyObj,setReplyObj]=useState(null) //回复内容，用于修改，为null表示新增
    const [pageNum, setPageNum] = useState(0);

    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const repluBtn=useRef()
    const contentDiv=useRef()

    useEffect(()=>{
        const checkIsEdit=()=>{  //是否允许修改
            if(!loginsiwe) return false;
            if(!actor?.actor_account && !actor?.actor_account?.includes('@')) return false;
            //远程读取不可修改
            if(env.domain!=currentObj.actor_account.split('@')[1]) return false;
            if(currentObj.dao_id>0){  //SC
                if(path!=='enki') return false; // 不是从我的社区模块进入，不允许修改
                let _member=daoActor.find((obj)=>{return obj.dao_id===currentObj.dao_id})
                if(_member){
                     return true;
                } 
            }else { //个人
                if(path!=='enkier') return false;// 不是从个人社交模块进入，不允许修改
                  //非本地登录
                if(actor.actor_account.split('@')[1]!=env.domain) return false;
                if(currentObj.send_type===0){ //本地
                    if(actor.actor_account===currentObj.actor_account) return true;
                }else { //接收
                    if(actor.actor_account===currentObj.receive_account) return true;
                }
            }
            //超级管理员
            if(actor?.manager?.toLowerCase()==env.administrator.toLowerCase()) return true;
            return false;
        }

        setIsEdit(checkIsEdit())

    },[actor,currentObj])

    const ableReply = () => { //是否允许回复，点赞，书签
        if(!loginsiwe) return false;
        if(!actor?.actor_account && !actor?.actor_account?.includes('@')) return false;

        //发布帐号，用于判断是否本域名
        let _account=currentObj?.send_type==0?currentObj?.actor_account:currentObj?.receive_account;
        const [name, messDomain] = _account.split('@');
        return env.domain === messDomain; //本域名发布，可以回复
    }
  
    const replyDelCallBack=(index)=>{
        currentObj.total=currentObj.total-1;
        data.splice(index, 1); //删除
        setData([...data])
         
    } 

    //修改评论前 ，弹出窗口
    const preEditCallBack=(obj,reply_index)=>{
        setReplyObj(obj);
        setReplyIndex(reply_index)
        repluBtn.current.show();} 
    
    const afterEditcall=(obj)=>{
        data[replyIndex].content=obj.content;
        data[replyIndex].top_img=obj.top_img;
        data[replyIndex].type_index=obj.type_index;
        data[replyIndex].vedio_url=obj.vedio_url;
        setData([...data])
    }  //修改讨论回调
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&pid=${fetchWhere.pid}&account=${fetchWhere.account}&sctype=${fetchWhere.sctype}`,'replyPageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setHasMore(res.data.length >= 20);
                        setPageNum((pageNum) => pageNum + 1)
                        if (fetchWhere.currentPageNum === 0) setData(res.data);
                        else setData([...data, ...res.data]);
                        setErr('');
                    } else { 
                        setHasMore(false); //读取错误，不再读
                        setErr(res?.data?.errMsg || "Failed to read data from the server");
                    }
                } else 
                {
                    setHasMore(false); //读取错误，不再读
                    setErr(res?.statusText || res?.data?.errMsg );
                }

            } catch (error) {
                console.error(error);
                setHasMore(false); //读取错误，不再读
                setErr(error?.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    
    }, [fetchWhere]);

    const fetchMoreData = () => {
          setFetchWhere({ ...fetchWhere, currentPageNum: pageNum });
      };

    const footerdiv=()=>{
        if(!isLoading) {
            if(err) return <ShowErrorBar errStr={err} />
        }
    }

    const addReplyCallBack=(obj)=>{
        currentObj.total=currentObj.total+1;
        data.unshift(obj);
        setData([...data])
    }
    return (
       

        <Card className=" mt-2 mb-3" >
            <Card.Header>
                <EnkiMemberItem t={t} messageObj={currentObj} domain={env.domain} actor={actor} locale={locale} delCallBack={delCallBack}
                 preEditCall={e=>{setActiveTab(1)}} showTip={showTip} closeTip={closeTip} showClipError={showClipError} isEdit={isEdit} />
               {/* 活动 */}
               {currentObj?._type===1 && <EventItem t={t} currentObj={currentObj} /> }
            </Card.Header>
        <Card.Body>
            <div ref={contentDiv} dangerouslySetInnerHTML={{__html: currentObj?.content}}></div>
            {currentObj?.content_link && <div dangerouslySetInnerHTML={{__html: currentObj.content_link}}></div>}
            {currentObj?.top_img && <img  className="mt-2 mb-2" alt="" src={currentObj.top_img} style={{maxWidth:'100%'}} />
            }
            {currentObj?.vedio_url && <ShowVedio vedioUrl={currentObj.vedio_url} /> 
            }
        </Card.Body>
        <Card.Footer style={{padding:0}} >
            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
         
                <MessageReply  ref={repluBtn} t={t} tc={tc} total={currentObj.total} actor={actor} currentObj={currentObj} 
                 isEdit={ableReply()} accountAr={accountAr}
                 addReplyCallBack={addReplyCallBack} replyObj={replyObj} setReplyObj={setReplyObj} 
                 afterEditcall={afterEditcall} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />

                <EnKiHeart isEdit={ableReply()} t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} currentObj={currentObj} domain={env.domain} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                <EnKiBookmark isEdit={ableReply() && actor.actor_account.split('@')[1]==env.domain} t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} currentObj={currentObj} domain={env.domain} showTip={showTip} closeTip={closeTip} showClipError={showClipError}  />
              {currentObj.send_type===0 && <EnkiShare content={contentDiv.current?.textContent} locale={locale} currentObj={currentObj} t={t} tc={tc} />}
            </div>
            {currentObj?.link_url && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
                    <a target="_blank" href={currentObj?.link_url} >{t('origlText')}......</a>
                    </div> 
            }
            <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    // loader={<Loadding />}
                    // endMessage={<div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>}
                >
                    {data.map((obj, idx) => (
                        <ReplyItem locale={locale} isEdit={ableReply() && actor.actor_account===obj.actor_account } key={idx} 
                        t={t} paccount={currentObj.actor_account} replyObj={obj} actor={actor} delCallBack={replyDelCallBack} 
                        preEditCall={preEditCallBack} sctype={currentObj.dao_id>0?'sc':''} reply_index={idx} />
                    ))}
            </InfiniteScroll>

            { footerdiv()}
        </Card.Footer>
        </Card>
       
        
    );
}




