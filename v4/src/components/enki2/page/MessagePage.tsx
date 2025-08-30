import { Card } from "react-bootstrap";
import { useState, useEffect, useRef, useCallback } from "react";
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply,{type MessageReplyRef} from "../form/MessageReply";
import ReplyItem from "../form/ReplyItem";
import ShowErrorBar from "../../ShowErrorBar";
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import EnkiShare from "../form/EnkiShare";

import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import ShowVedio from "../form/ShowVedio";
import EnkiEditItem from "../form/EnkiEditItem";
import { useTranslations } from "next-intl";
import Loadding from "../../Loadding";
import ShowAddress from "../../ShowAddress";
import { type RootState } from "@/store/store";
import { fetchJson } from "@/lib/utils/fetcher";

interface MessagePageProps {
  tabIndex: number; //修改 所在页面的tab
  path: string;
  enkiMessObj: EnkiMessType;
  refreshPage: (flag?:string) => void; 
  setActiveTab?: (index: number) => void;
  daoData?: DaismDao[]|null;
  filterTag?: (tag: string) => void;
}

interface WhereType{
    currentPageNum: number;
      sctype: string;
      pid: string;
}

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

export default function MessagePage({
    tabIndex,
    path,
    enkiMessObj,
    refreshPage,
    setActiveTab,
    daoData,
    filterTag,
  }: MessagePageProps) {
    const [fetchWhere, setFetchWhere] = useState<WhereType>({
      currentPageNum: 0,
      sctype: enkiMessObj.dao_id > 0 ? "sc" : "",
      pid: enkiMessObj.message_id,
    });
    const [data, setData] = useState<DaismReplyType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err, setErr] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [replyIndex, setReplyIndex] = useState(-1);
    
    const [pageNum, setPageNum] = useState(0);
    const repluBtn = useRef<MessageReplyRef>(null);
  
    const [divContent, setDivContent] = useState<string | null>(null);
  
    //加载完成后，把div 内容赋值给
    const handleDivRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node !== null)
          setDivContent(node?.textContent?.slice(0, 120).replaceAll("\n", "") ?? "");
      },
      [enkiMessObj]
    );
  
    const actor = useSelector((state: RootState) => state.valueData.actor);
    const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
    const t = useTranslations("ff");

    useEffect(()=>{
        if(fetchWhere.currentPageNum===0) setPageNum(0);
    },[fetchWhere])


    useEffect(()=>{
        const checkIsEdit=()=>{  //是否允许修改 
            if(!loginsiwe || !actor?.actor_account) return false;
            if(enkiMessObj?.httpNetWork) return false;  //远程读取不可修改
            if(actor?.domain!==process.env.NEXT_PUBLIC_DOMAIN) return false; //非注册地登录 
            if(process.env.NEXT_PUBLIC_DOMAIN!==enkiMessObj?.actor_account?.split('@')[1]) return false; //非发贴服务器
            //超级管理员
            if(actor?.manager?.toLowerCase()===(process.env.NEXT_PUBLIC_ADMI_ACTOR as string) .toLowerCase()) return true;
            if(path==='enki'){
                if(daoData){
                let _member=daoData.find((obj)=>{return obj.dao_id===enkiMessObj.dao_id})
                return !!_member;
                }
            }else if(path==='enkier'){
                if(!enkiMessObj.receive_account && actor?.actor_account===enkiMessObj.actor_account && enkiMessObj.dao_id===0) return true;
            }
            return false;
        }
        setIsEdit(checkIsEdit())

    },[actor,enkiMessObj,loginsiwe,daoData])

    const ableReply = () => { //是否允许回复，点赞，书签
        if(!loginsiwe || !actor?.actor_account) return false;
        if(enkiMessObj?.httpNetWork) return false; // 远程服务器不可回复
        return true;
    }
  
    //删除回复 
    const replyDelCallBack=(index:number)=>{
        enkiMessObj.total=enkiMessObj.total-1;
        data.splice(index, 1); //删除
        setData([...data])
         
    } 

    // 对replyItem 回复
    const replyCallBack=(reply_index:number,_bid:string)=>{
        setReplyIndex(reply_index);
        repluBtn.current?.show(_bid);
    } 

        
    //新增加回复
    const addReplyCallBack=(obj?:DaismReplyType,isNew?:boolean)=>{
        enkiMessObj.total=enkiMessObj.total+1;
        if(obj){
          if(isNew){ //回复评论
            data.splice(replyIndex+1, 0, obj);  // 从索引1开始，不删除元素，插入 'a'
          }else{ //回复嗯文
            data.unshift(obj);
          }
        }
        setData([...data])
    }
 
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
//
            try {
                const resData = await fetchJson<DaismReplyType[]>(`/api/getData?pi=${fetchWhere.currentPageNum}&sctype=${fetchWhere.sctype}&pid=${fetchWhere.pid}`,
                  { headers: { 'x-method': 'replyPageData' } }
                );
        
                if (resData) {
                  setHasMore(resData.length > 0);
                  setPageNum((pageNum) => pageNum + 1);
                  if (fetchWhere.currentPageNum === 0) setData(resData);
                  else setData((prev) => [...prev, ...resData]);
                  setErr('');
                } else {
                  setHasMore(false);
                  setErr(
                    (resData as any)?.errMsg || 'Failed to read data from the server'
                  );
                }
              } catch (error: any) {
                console.error(error);
                setHasMore(false);
                setErr(error?.message??'handle data error');
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


        
    const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;

    const filter = (para:string) => {
    if(typeof filterTag === 'function') filterTag.call(null,para)
    };

  const replacedText = enkiMessObj?.content.replace(regex, (match, p1) => {
    const escapedParam = p1.replace(/"/g, '&quot;');
    return `<span class="tagclass daism-a" data-param="${escapedParam}">#${p1}</span>`;
  });

// 点击tag事件处理
const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("tagclass")) {
      const param = target.dataset.param;
      if (param) {
        filter(param);
      }
    }
  }, []);


  //显示回复记录
  let lastArray: DaismReplyType | null = null;
  const renderedArrays = data.map((obj: DaismReplyType, idx: number) => {
    const isSameAsLast = obj.bid === lastArray?.bid;
    lastArray = obj;
    return (
      <ReplyItem replyObj={obj} delCallBack={replyDelCallBack} replyCallBack={replyCallBack}
        pleft={isSameAsLast ? 40 : 10} key={idx} reply_index={idx}
      />
    );
  });

    return (
        <Card className=" mt-2 mb-3" >
            <Card.Header>
                <EnkiMemberItem messageObj={enkiMessObj} />
               {/* 活动 */}
               {enkiMessObj?._type===1 && <EventItem currentObj={enkiMessObj} /> }
             
            </Card.Header>
        <Card.Body>
            {/* 嗯文内容 */}
            <div className="daismCard"  onClick={handleClick} ref={handleDivRef} dangerouslySetInnerHTML={{__html: replacedText}}></div>
            {/* 链接条 */}
            {enkiMessObj?.content_link && <div dangerouslySetInnerHTML={{__html: enkiMessObj.content_link}}></div>}
            {/* 首页图片 */}
            {enkiMessObj?.top_img && <img  className="mt-2 mb-2" alt="" src={enkiMessObj.top_img} style={{width:'100%'}} /> }
            {/* 首页视频 */}
            {enkiMessObj?.vedio_url && <ShowVedio vedioUrl={enkiMessObj.vedio_url} /> }
 
        </Card.Body>
        <Card.Footer style={{padding:0}} >

            {/* 发起者 */}
            {enkiMessObj?.self_account &&<div className="d-flex align-items-center mt-1">
              <div style={{paddingLeft:'10px'}} className="d-inline-flex align-items-center" >
                 <span style={{display:'inline-block',paddingRight:'4px'}}>{t('proposedText')}:</span>{' '}
                 {enkiMessObj?.self_avatar && <img src={enkiMessObj?.self_avatar} alt='' style={{borderRadius:'10px'}} width={32} height={32}/> }
              </div>
              <div style={{flex:1}}  className="d-flex flex-column flex-md-row justify-content-between ">
                  <span> {enkiMessObj?.self_account} </span>
                  <div>
                  <ShowAddress address={enkiMessObj?.manager} />
                  </div>
              </div>
          </div>}

            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                {/* 回复按钮 */}
                <MessageReply  ref={repluBtn} currentObj={enkiMessObj} isEdit={ableReply()} addReplyCallBack={addReplyCallBack}  />
                {/* 点赞按钮 */}
                <EnKiHeart isEdit={ableReply() && actor?.domain===process.env.NEXT_PUBLIC_DOMAIN} currentObj={enkiMessObj} path={path} />
               {/* 书签按钮 */}
                <EnKiBookmark isEdit={ableReply() && actor?.domain===process.env.NEXT_PUBLIC_DOMAIN} currentObj={enkiMessObj} path={path}/>
                {/* 分享按钮，需要嗯文渲染后 */}
                {divContent && <EnkiShare content={divContent}  currentObj={enkiMessObj} />}
                {/* 修改/删除/转发/置顶上拉框 */}
                {path!=='SC' && actor?.domain===process.env.NEXT_PUBLIC_DOMAIN 
                    && <EnkiEditItem path={path} isEdit={isEdit} messageObj={enkiMessObj} refreshPage={refreshPage} 
                preEditCall={()=>{if(setActiveTab) setActiveTab(tabIndex)}} /> }
            </div>
            {/* 其它服务器推送的回复显示原文链接 */}
            {!enkiMessObj.httpNetWork && !enkiMessObj.actor_account.endsWith(process.env.NEXT_PUBLIC_DOMAIN as string) && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
                    <a target="_blank" href={enkiMessObj?.link_url} >{t('origlText')}......</a>
                    </div> 
            }
            {/* 回复列表 */}
            <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<Loadding />}
                >
                    {renderedArrays}
            </InfiniteScroll>

            { footerdiv()}
        </Card.Footer>
        </Card>
       
        
    );
}




