import { Card } from "react-bootstrap";
import MemberItem from "./MemberItem";
import EventItem from "../form/EventItem";
import ShowVedio from "../form/ShowVedio";
import { useTranslations } from 'next-intl'
import ShowAddress from "../../ShowAddress";
import EnkiAccount from "../form/EnkiAccount";
import { useSelector} from 'react-redux';
import Loginsign from "../../Loginsign";
import EnkiMember from "../form/EnkiMember";
import MessageReply from "../form/MessageReply";
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import ReplyItem from "../form/ReplyItem";
import { useState,useEffect, useRef } from 'react';
import Loadding from "../../Loadding";
import ShowErrorBar from "../../ShowErrorBar";
import InfiniteScroll from 'react-infinite-scroll-component';
import { client } from "../../../lib/api/client";


export default function EnkiMess({locale,currentObj,env,honor}) {
    const t = useTranslations('ff');
    const actor = useSelector((state) => state.valueData.actor);
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe);
    const repluBtn=useRef();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    const [pageNum, setPageNum] = useState(0); 
    const[fetchWhere, setFetchWhere] = useState({currentPageNum:0,sctype:currentObj?.dao_id>0?'sc':'',pid:currentObj.message_id});

    const regex = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;
    const replacedText = currentObj?.content.replace(regex, (match, p1) => {
        const escapedParam = p1.replace(/"/g, '&quot;');
        return `<span class="tagclass daism-a" data-param="${escapedParam}">#${p1}</span>`;
    });

    const ableReply = () => { //是否允许回复，点赞，书签
        if(!loginsiwe || !actor?.actor_account) return false;
        return true;
    }
    const addReplyCallBack=(obj)=>{
        // setFetchWhere({ ...fetchWhere });
        currentObj.total=currentObj.total+1;
        data.unshift(obj);
        setData([...data])
    }
    const replyDelCallBack=(index)=>{
        currentObj.total=currentObj.total-1;
        data.splice(index, 1); //删除
        setData([...data])
         
    } 


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
    let lastArray = null;

    const renderedArrays = data.map((obj, idx) => {
      const isSameAsLast = obj.bid === lastArray?.bid;
      lastArray = obj;
    
      return (
        <ReplyItem pleft={isSameAsLast?40:10}  key={idx} locale={locale}  actor={actor} loginsiwe={loginsiwe} 
        replyObj={obj} delCallBack={replyDelCallBack}  domain={env.domain} canEdit={false}
         sctype={currentObj.dao_id>0?'sc':''} reply_index={idx} />
      );
    });

    // const replyDelCallBack=(index)=>{
    //     currentObj.total=currentObj.total-1;
    //     data.splice(index, 1); //删除
    //     setData([...data])
         
    // } 
    
    const footerdiv=()=>{
        if(isLoading) return <Loadding />
        else 
        {
            if(err) return <ShowErrorBar errStr={err} />
            else if(!hasMore && pageNum>1) return <div style={{width:'100%',textAlign:'center'}}>{t('footText')}</div>
        }
    }


    return (<>
        <div className='mb-3 mt-3 d-flex flex-row align-items-center '  >
                        <EnkiAccount locale={locale} />
                        {!loginsiwe && <Loginsign />}
        </div>
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
            {currentObj?.dao_id>0 && currentObj?.self_account &&<div className="d-flex align-items-center mt-1">
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

            <div className="d-flex justify-content-around align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                <MessageReply  ref={repluBtn} currentObj={currentObj} isEdit={ableReply()} 
                 addReplyCallBack={addReplyCallBack}  bid=''  />
                <EnKiHeart isEdit={ableReply() && actor?.domain===env.domain} currentObj={currentObj} path="person mess" />
                <EnKiBookmark isEdit={ableReply() && actor?.domain===env.domain} currentObj={currentObj}  path="person mess" />

            </div>
             <InfiniteScroll dataLength={data.length} next={fetchMoreData} hasMore={hasMore}  >
                    {renderedArrays}
            </InfiniteScroll>
            { footerdiv()} 
        </Card.Footer>
        </Card>
       
        </>
    );
}




