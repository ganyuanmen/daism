"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, setErrText, setTipText } from "@/store/store";
import ShowErrorBar from "@/components/ShowErrorBar";
import { useTranslations } from "next-intl";
import { Button, Card } from "react-bootstrap";
import EnkiMemberItem from "@/components/enki2/form/EnkiMemberItem";
import { useCallback, useEffect, useRef, useState } from "react";
import {  Down,  Up } from "@/lib/jssvg/SvgCollection";
import MessageReply1, { type MessageReplyRef } from "@/components/enki2/form/MessageReply1";
import { fetchJson } from "@/lib/utils/fetcher";
import Loadding from "@/components/Loadding";
import EnkiShare from "@/components/enki2/form/EnkiShare";
import InfiniteScroll from "react-infinite-scroll-component";
import ReplyItem1 from "@/components/enki2/form/ReplyItem1";
interface PropsType{
    enkiMessObj:EnkiMessType;
  
}
interface WhereType{
    currentPageNum: number;
      sctype: string;
      pid: string;
}


export default function Clienwindow({enkiMessObj}:PropsType) {
 
    const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
     const [pageNum, setPageNum] = useState(0);
       const [replyIndex, setReplyIndex] = useState(1);
    const [divContent, setDivContent] = useState<string | null>(null);
     const [exPandID,setExPandID]=useState(''); //扩展的ID

     const [err, setErr] = useState("");
     const [fetchWhere, setFetchWhere] = useState<WhereType>({
          currentPageNum: 0,
          sctype: enkiMessObj.dao_id > 0 ? "sc" : "",
          pid: enkiMessObj.message_id,
        });
        const [data, setData] = useState<DaismReplyType[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);

 
    useEffect(()=>{
        if(fetchWhere.currentPageNum===0) setPageNum(0);
    },[fetchWhere])


   const dispatch = useDispatch<AppDispatch>();
  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(""));
  const showClipError = (str: string) => dispatch(setErrText(str));

    const repluBtn = useRef<MessageReplyRef>(null);
    //加载完成后，把div 内容赋值给
        const handleDivRef = useCallback(
          (node: HTMLDivElement | null) => {
            if (node !== null)
              setDivContent(node?.textContent?.slice(0, 120).replaceAll("\n", "") ?? "");
          },
          []
        );
            
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
 
    // 对replyItem 回复
    const replyCallBack=(reply_index:number,_bid:string)=>{
        setReplyIndex(reply_index);
        repluBtn.current?.show(_bid);
    } 

       

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
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
        if(isLoading) return <Loadding isImg={true} spinnerSize="sm" />
        else 
        {
            if(err) return <ShowErrorBar errStr={err} />
            else if(!hasMore && pageNum>1) return <div style={{width:'100%',textAlign:'center'}}>{t('footText')}</div>
        }
    }



// 删除回复 
const replyDelCallBack = (index: number,mid:string) => {
  const upData = {
    mid,
    account: '',
    type: 1,
    sctype: enkiMessObj.dao_id > 0 ? "sc" : '',
    path:'',
    pid: enkiMessObj.message_id,
    rAccount: enkiMessObj?.receive_account ?? ''
  };
    showTip(t("submittingText"));
  
  fetch("/api/postwithsession", {
    method: 'POST',
    headers: { 'x-method': 'messageDel' },
    body: JSON.stringify(upData)
  })
  .then(re => {
    closeTip();
    if (re.ok) {
      enkiMessObj.total = enkiMessObj.total - 1;
      data.splice(index, 1);
      setData([...data]);
    } else {
      return re.json().then(reData => {
        showClipError(`${tc("dataHandleErrorText")}!\n ${reData?.errMsg}`);
      });
    }
  })
  .catch(error => {
    closeTip();
    showClipError(`${tc("dataHandleErrorText")}!\n ${error.message}`);
  })

};

 //显示回复记录
  let lastArray: DaismReplyType | null = null;
  const renderedArrays = data.map((obj: DaismReplyType, idx: number) => {
    const isSameAsLast = obj.bid === lastArray?.bid;
    lastArray = obj;
    return (
      <ReplyItem1 replyObj={obj} delCallBack={replyDelCallBack} replyCallBack={replyCallBack}
        pleft={isSameAsLast ? 40 : 10} key={idx} reply_index={idx} user={user}
      />
    );
  });
  return (
 
   <div style={{marginTop:'20px'}} >
             {
               user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
               :  <Card className=" mt-2 mb-3" >
            <Card.Header><EnkiMemberItem messageObj={enkiMessObj} /></Card.Header>
        <Card.Body style={{position:'relative'}} >
            {/* 嗯文内容 */}
            <div className={enkiMessObj.message_id===exPandID?' daismCard':'daismCard daism-expand'}  ref={handleDivRef} dangerouslySetInnerHTML={{__html: enkiMessObj.content}}></div>
          
      
          <Button
            variant="light"
            onClick={() => setExPandID(exPandID?'':enkiMessObj.message_id)}
            style={{ position: "absolute", right: '10px', bottom: '6px' }}
            title={t("showmore")}
          >
           {exPandID?<Up size={24} />:<Down size={24}/> }
            
          </Button>
    
        </Card.Body>
        <Card.Footer style={{padding:0}} >


            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                {/* 回复按钮 */}
               <MessageReply1  ref={repluBtn} currentObj={enkiMessObj} user={user} addReplyCallBack={addReplyCallBack}  />
           
              
                {/* 分享按钮，需要嗯文渲染后 */}
                {divContent ? <EnkiShare content={divContent}  currentObj={enkiMessObj} />:<Loadding isImg={true} spinnerSize="sm" />}
              
            </div>
           
          <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<Loadding />}
                >
                    {renderedArrays}
            </InfiniteScroll>

          {/* } */}
            { footerdiv()}
        </Card.Footer>
        </Card>
             }
           </div>
  );
}
