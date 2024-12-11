import Loadding from "../Loadding";
import { useEffect, useState, useRef } from "react"
import { client } from "../../lib/api/client";
import ShowErrorBar from "../ShowErrorBar";
import InfiniteScroll from 'react-infinite-scroll-component';
import Contentdiv from "./Contentdiv";
import { useTranslations } from 'next-intl'
/**
 * 嗯文列表
 * @env 环境变量 
 * @locale zh/cn
 * @setCurrentObj 设当前嗯文
 * @setActiveTab 设主页模块
 * @fetchWhere 根据此对象从服务器下载数据
 * @setFetchWhere 设置下载数据
 * @delCallBack 删除嗯文后回调
 * @afterEditCall 修改嗯文后回调
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人  
 * @path enki/enkier
 * @daoData 个人所属的smart common 集合
 */
export default function Mainself({env,locale,setCurrentObj,setActiveTab,fetchWhere,
     setFetchWhere,afterEditCall,delCallBack,accountAr,path,daoData}) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    const t = useTranslations('ff')
    
    const listRef = useRef(null);
    useEffect(()=>{
        if(fetchWhere.currentPageNum===0) setPageNum(0);
    },[fetchWhere])

    useEffect(() => { //数据加载完成后
        if(data && data.length) {
            const _id = parseInt(sessionStorage.getItem('daism-list-id'));       
            if (!isNaN(_id)) {
            const itemElement = listRef.current.querySelector(`#item-${_id}`);
            if (itemElement) {
                itemElement.scrollIntoView({ behavior: 'auto' }); //  smooth 滚动
                sessionStorage.removeItem('daism-list-id');
            }else fetchMoreData(); //循环读取数据，直到找到`#item-${_id}
            }
           
        }
      }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // console.log(fetchWhere)
            if (fetchWhere.currentPageNum === 0) setData([]);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&menutype=${fetchWhere.menutype}&daoid=${fetchWhere.daoid}&actorid=${fetchWhere.actorid}&w=${fetchWhere.where}&order=${fetchWhere.order}&eventnum=${fetchWhere.eventnum}&account=${fetchWhere.account}&v=${fetchWhere.v}`, 'messagePageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setHasMore(res.data.length >= 12);
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
        if(!isLoading && fetchWhere.currentPageNum>-1 ) {
            if(fetchWhere.menutype===3 && (fetchWhere.eventnum === 5 || fetchWhere.account))  fetchData(); //个人显示所有，或登录后显示所有
            else if (fetchWhere.menutype===1 && (fetchWhere.daoid || fetchWhere.v>0))  fetchData(); // 有我的注册dao集，才能获取 
            else if(fetchWhere.menutype===2) fetchData(); //公共社区直接获取
        }
    }, [fetchWhere]);


  const fetchMoreData = () => {
    // console.log("mess next------------>",fetchWhere)
    if(!isLoading && hasMore) setFetchWhere({ ...fetchWhere, currentPageNum: pageNum });
  };

    const footerdiv=()=>{
        if(!isLoading){
            if(err) return <ShowErrorBar errStr={err} />
            if(Array.isArray(data) && data.length==0) return <div className="mt-3" >{t('noFounData')}</div>
            if(!hasMore) return <div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>


        }else 
        {
            return <Loadding />
        }
    }

    const replyAddCallBack=(obj,index)=>{
        data[index].total=data[index].total+1;
        setData([...data])

    }

    return (

        <div className='sccontent'>
   
            <div ref={listRef} >
                <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                >
                    {data.map((obj,idx) => (
                        <Contentdiv path={path} env={env} locale={locale} messageObj={obj} 
                        key={idx} afterEditCall={afterEditCall} data_index={idx}
                        setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} replyAddCallBack={replyAddCallBack} 
                        delCallBack={delCallBack} accountAr={accountAr} daoData={daoData} />
                    ))}
                </InfiniteScroll> 
            </div>
            <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                    {footerdiv()}
            </div>
        </div>
    

    );
}

