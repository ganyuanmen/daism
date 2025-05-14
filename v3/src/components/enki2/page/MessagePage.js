import { Card } from "react-bootstrap";
import { useState,useEffect, useRef,useCallback } from 'react';
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply from '../form/MessageReply'
import ReplyItem from "../form/ReplyItem";
import ShowErrorBar from "../../ShowErrorBar";
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import EnkiShare from "../form/EnkiShare";
import { client } from "../../../lib/api/client";
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ShowVedio from "../form/ShowVedio";
import EnkiEditItem from "../form/EnkiEditItem";
import { useTranslations } from 'next-intl'
import Loadding from "../../Loadding";

import ShowAddress from "../../ShowAddress";

/**
 * 单登个发文信息界面 //  delCallBack:删除嗯文后回调
 * @path enki/enkier 能修改，其它不能修改
 * @locale zh/cn  
 * @env 环境变量
 * @currentObj 嗯文对象
 * @delCallBack 删除嗯文后回调
 * @setActiveTab 设置主页上的模块
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @daoData 个人所属的smart common 集合
 * @fromPerson 是否从 个人帐户 中打开
 */

export default function MessagePage({path,locale,env,currentObj,delCallBack,setActiveTab,accountAr,daoData,filterTag,fromPerson=false}) {
 
    const[fetchWhere, setFetchWhere] = useState({currentPageNum:0
        // ,account:currentObj?.receive_account?currentObj?.receive_account:currentObj?.actor_account
        ,sctype:currentObj?.dao_id>0?'sc':''
        ,pid:currentObj.message_id});
    const [data, setData] = useState([]);
    const [bid, setBid] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    const [isEdit,setIsEdit]=useState(false);
    const [replyIndex,setReplyIndex]=useState(-1) //保存修改讨论的数组序号
    const [replyObj,setReplyObj]=useState(null) //回复内容，用于修改，为null表示新增
    const [pageNum, setPageNum] = useState(0);
    // const [selectTag, setSelectTag] = useState([]);
    const repluBtn=useRef()

    const [divContent, setDivContent] = useState(null);

      const handleDivRef = useCallback((node) => {
      if (node !== null) setDivContent(node?.textContent.slice(0,120).replaceAll('\n',''));
     
    }, [currentObj]); 

    const actor = useSelector((state) => state.valueData.actor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const t = useTranslations('ff')

    useEffect(()=>{
        if(fetchWhere.currentPageNum===0) setPageNum(0);
    },[fetchWhere])


    

    useEffect(()=>{
        const checkIsEdit=()=>{  //是否允许修改 
            if(!loginsiwe || !actor?.actor_account) return false;
            if(currentObj?.httpNetWork) return false;  //远程读取不可修改
            if(actor?.domain!==env.domain) return false; //非注册地登录 
            if(env.domain!==currentObj?.actor_account?.split('@')[1]) return false; //非发贴服务器
            //超级管理员
            if(actor?.manager?.toLowerCase()===env.administrator.toLowerCase()) return true;
            if(path==='enki'){
                let _member=daoData.find((obj)=>{return obj.dao_id===currentObj.dao_id})
                return !!_member;
            }else if(path!=='enkier'){
                if(!currentObj.receive_account && actor?.actor_account===currentObj.actor_account && currentObj.dao_id===0) return true;
            }
            return false;
        }

        setIsEdit(checkIsEdit())

    },[actor,currentObj,loginsiwe])

    const ableReply = () => { //是否允许回复，点赞，书签
        if(!loginsiwe || !actor?.actor_account) return false;
        if(currentObj?.httpNetWork) return false; // 远程服务器不可回复
        return true;
    }
  
    const replyDelCallBack=(index)=>{
        currentObj.total=currentObj.total-1;
        data.splice(index, 1); //删除
        setData([...data])
         
    } 

    //回复评论前 ，弹出窗口
    const preEditCallBack=(obj,reply_index,_bid)=>{
        setReplyObj(obj);
        setReplyIndex(reply_index);
        setBid(_bid);
        repluBtn.current.show();} 
    
    const afterEditcall=(obj)=>{
        currentObj.total=currentObj.total+1;
        data.splice(replyIndex+1, 0, obj);  // 从索引1开始，不删除元素，插入 'a'
        // data[replyIndex].content=obj.content;
        // data[replyIndex].top_img=obj.top_img;
        // data[replyIndex].type_index=obj.type_index;
        // data[replyIndex].vedio_url=obj.vedio_url;
        setData([...data])
    }  //修改讨论回调
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&sctype=${fetchWhere.sctype}&pid=${fetchWhere.pid}`,'replyPageData');
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
        if(isLoading) return <Loadding />
        else 
        {
            if(err) return <ShowErrorBar errStr={err} />
            else if(!hasMore && pageNum>1) return <div style={{width:'100%',textAlign:'center'}}>{t('footText')}</div>
        }
    }

    const addReplyCallBack=(obj)=>{
        // setFetchWhere({ ...fetchWhere });
        currentObj.total=currentObj.total+1;
        data.unshift(obj);
        setData([...data])
    }

    
const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;

const filter = (para) => {
 if(typeof filterTag === 'function') filterTag.call(null,para)
};
 const replacedText = currentObj?.content.replace(regex, (match, p1) => {
  const escapedParam = p1.replace(/"/g, '&quot;');
  return `<span class="tagclass daism-a" data-param="${escapedParam}">#${p1}</span>`;
});

// 点击事件处理
const handleClick = useCallback((event) => {
  const target = event.target;
  if (target.classList.contains('tagclass')) {
    const param = target.dataset.param;
    if (param) {
      filter(param);
    } 
  } 
}, []); // fi

let lastArray = null;

const renderedArrays = data.map((obj, idx) => {
  const isSameAsLast = obj.bid === lastArray?.bid;
  lastArray = obj;

  return (
    <ReplyItem pleft={isSameAsLast?40:10}  key={idx} locale={locale}  actor={actor} loginsiwe={loginsiwe} 
    replyObj={obj} delCallBack={replyDelCallBack}  domain={env.domain}
    preEditCall={preEditCallBack} sctype={currentObj.dao_id>0?'sc':''} reply_index={idx} />
  );
});


    return (
       

        <Card className=" mt-2 mb-3" >
            <Card.Header>
                <EnkiMemberItem messageObj={currentObj} domain={env.domain} locale={locale} fromPerson={fromPerson} />
               {/* 活动 */}
               {currentObj?._type===1 && <EventItem currentObj={currentObj} /> }
            </Card.Header>
        <Card.Body>
        {/* {selectTag.map(tag => (
        <Button variant="light" style={{marginRight:'10px',color:'blue',fontWeight:'bold'}} key={tag.id}  onClick={()=>{filterTag.call(null,tag.name)}} >
          {tag.name}
        </Button>
      ))} */}
            <div className="daismCard"  onClick={handleClick} ref={handleDivRef} dangerouslySetInnerHTML={{__html: replacedText}}></div>
            {currentObj?.content_link && <div dangerouslySetInnerHTML={{__html: currentObj.content_link}}></div>}
            {currentObj?.top_img && <img  className="mt-2 mb-2" alt="" src={currentObj.top_img} style={{maxWidth:'100%'}} /> }
            {currentObj?.vedio_url && <ShowVedio vedioUrl={currentObj.vedio_url} /> }
 
        </Card.Body>
        <Card.Footer style={{padding:0}} >

            {/* 发起者 */}
            {path==='enki' &&<div className="d-flex align-items-center mt-1">
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
         
                <MessageReply  ref={repluBtn} currentObj={currentObj} isEdit={ableReply()} accountAr={accountAr}
                 addReplyCallBack={addReplyCallBack} replyObj={replyObj} setReplyObj={setReplyObj} 
                 afterEditcall={afterEditcall}  isTopShow={false} bid={bid} setBid={setBid} />

                <EnKiHeart isEdit={ableReply() && actor?.domain===env.domain} currentObj={currentObj} path={path} />
                <EnKiBookmark isEdit={ableReply() && actor?.domain===env.domain} currentObj={currentObj} path={path}/>
              {divContent && <EnkiShare content={divContent} locale={locale} currentObj={currentObj} />}
             {path!=='SC' && actor?.domain===env.domain && <EnkiEditItem path={path} env={env} isEdit={!fromPerson && isEdit} actor={actor} messageObj={currentObj} delCallBack={delCallBack} 
              preEditCall={e=>{setActiveTab(1)}} sctype={currentObj?.dao_id>0?'sc':''} fromPerson={fromPerson} /> }
            </div>
            {!currentObj.httpNetWork && !currentObj.actor_account.endsWith(env.domain) && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
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
                    {/* {data.map((obj, idx) => (
                        <ReplyItem pleft={10}  key={idx} locale={locale} isEdit={ableReply() && actor?.actor_account===obj.actor_account } 
                         replyObj={obj} delCallBack={replyDelCallBack}  domain={env.domain}
                         preEditCall={preEditCallBack} sctype={currentObj.dao_id>0?'sc':''} reply_index={idx} />
                    ))} */}
                    {renderedArrays}
            </InfiniteScroll>

            { footerdiv()}
        </Card.Footer>
        </Card>
       
        
    );
}




