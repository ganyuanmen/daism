import { useState,useEffect,useRef } from "react"
import Mainself from  './Mainself'
import CreateMess from './CreateMess'
import MessagePage from '../enki2/page/MessagePage'
import { useSelector} from 'react-redux';

/**
 * 个人社区
 * @openObj 查看单个嗯文
 * @env 环境变量
 * @locale zh/cn
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 */ 
export default function EnkiView({env,locale,accountAr }) {
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const [fetchWhere, setFetchWhere] = useState({
        daoid: 0,  //此处不用
        actorid: 0, 
        where: '', //查询条件
        menutype: 3,
        v:0,
        order: 'reply_time', //排序
        currentPageNum: 0, eventnum: 2,account: actor?.actor_account
    });
 
    const actorRef=useRef();
    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);
    useEffect(()=>{if(actor?.id) actorRef.current=actor;},[actor])
    const afterEditCall=(messageObj)=>{
        setCurrentObj(messageObj);
        setActiveTab(0);
      }

      const callBack=()=>{  //回退处理，包括删除
      setFetchWhere({...fetchWhere,currentPageNum:0})
        
    }

    return (<div className="mt-3" >

                    {activeTab === 0 ? <Mainself env={env} locale={locale} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} 
                    fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} isSelf={true}
                    delCallBack={callBack} afterEditCall={afterEditCall} accountAr={accountAr} path='enkier' />

                    :activeTab === 1 ? <CreateMess accountAr={accountAr} currentObj={currentObj} 
                    afterEditCall={afterEditCall}  
                    callBack={callBack} />

                    : <MessagePage  path="enkier" locale={locale} env={env} currentObj={currentObj} 
                    delCallBack={callBack} setActiveTab={setActiveTab} accountAr={accountAr}/>

                   
                }
            </div>
    )
}
