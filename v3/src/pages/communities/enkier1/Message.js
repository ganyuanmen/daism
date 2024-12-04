// import { Card,Button } from "react-bootstrap";
import { useState,useEffect, useRef } from 'react';
// import EnkiMemberItem from "../../../components/enki2/form/EnkiMemberItem";
// import EventItem from "../../../components/enki2/form/EventItem";
// import MessageReply from '../../../components/enki2/form/MessageReply'
import ReplyItem from "../../../components/enki2/form/ReplyItem";
// import Loadding from "../../Loadding";
import ShowErrorBar from "../../../components/ShowErrorBar";
import {useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
// import EnKiHeart from "../../../components/enki2/form/EnKiHeart";
// import EnKiBookmark from "../../../components/enki2/form/EnKiBookmark";
// import { ExitSvg } from "../../../lib/jssvg/SvgCollection";
// import EnkiShare from "../../../components/enki2/form/EnkiShare";
import { client } from "../../../lib/api/client";
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import EnkiMemberItem from "../../../components/enki2/form/EnkiMemberItem";
/**
 * 单登个发文信息界面 // preEditCall:修改前回调 delCallBack:删除后已刷新
 * isEdit 是否允许修改  
 */
export default function Message({locale,t,tc,currentObj,actor,loginsiwe,env}) { 
    const[fetchWhere, setFetchWhere] = useState({});


    // const daoActor=useSelector((state) => state.valueData.daoActor)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    // const [isEdit,setIsEdit]=useState(false);
    // const [total,setTotal]=useState(0);//回复总数
    const [refresh,setRefresh]=useState(false);  //刷新回复总数
    const [replyObj,setReplyObj]=useState(null) //回复内容，用于修改，为null表示新增
            
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const repluBtn=useRef()
    // const contentDiv=useRef()

    useEffect(()=>{
        if(currentObj?.id)
        setFetchWhere({currentPageNum:0
            ,account:currentObj?.send_type==0?currentObj?.actor_account:currentObj?.receive_account 
            ,sctype:''
            ,pid:currentObj?.id})
    },[currentObj])

   
    const ableReply = () => { //是否允许回复，点赞，书签
        if(!loginsiwe) return false;
        if(!actor?.actor_account && !actor?.actor_account?.includes('@')) return false;

        //发布帐号，用于判断是否本域名
        let _account=currentObj?.send_type==0?currentObj?.actor_account:currentObj?.receive_account;
        if(_account && _account.includes('@')) {
        const [name, messDomain] = _account.split('@');
        return env?.domain === messDomain; //本域名发布，可以回复

        }
        return false; //本域名发布，可以回复
    }
  
   

    const callBack=()=>{setFetchWhere({...fetchWhere,currentPageNum:0});setRefresh(!refresh)} //删除、增加回复后后回调
    const preEditCallBack=(obj)=>{setReplyObj(obj);repluBtn.current.show();} //修改评论 ，弹出窗口
  
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&pid=${fetchWhere.pid}&account=${fetchWhere.account}&sctype=${fetchWhere.sctype}`,'replyPageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setHasMore(res.data.length >= 20);
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
        // console.log("reply next------------>",fetchWhere)
        setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 });
      };

    const footerdiv=()=>{
        if(!isLoading) {
            if(err) return <ShowErrorBar errStr={err} />
        }
    }

  
    
    return (
        <>
        <div style={{padding:'10px',borderBottom:'1px solid #D9D9E8'}}>   
            <EnkiMemberItem messageObj={currentObj} t={t}  domain={env?.domain} isEdit={false} locale={locale}
            actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />    {/* '不检测关注' 不修改不删除 */}
            <div className="mt-2">
                <div dangerouslySetInnerHTML={{__html:currentObj?.content}}></div>
            </div>
  
        </div>

            <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    // loader={<Loadding />}
                    // endMessage={<div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>}
                >
                    {data.map((obj, idx) => (
                        <ReplyItem locale={locale} isEdit={ableReply() && actor.actor_account===obj.actor_account } key={obj.id} t={t}
                         paccount={currentObj.actor_account} replyObj={obj} actor={actor} delCallBack={callBack} 
                         preEditCall={preEditCallBack} sctype={currentObj?.dao_id>0?'sc':''} />
                    ))}
            </InfiniteScroll>

            { footerdiv()}
       
       
        </>
    );
}




