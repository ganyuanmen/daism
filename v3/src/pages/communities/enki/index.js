import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import ShowErrorBar from '../../../components/ShowErrorBar';
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import Loginsign from '../../../components/Loginsign';
import Main from '../../../components/enki2/page/Main';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import MessagePage from '../../../components/enki2/page/MessagePage';
import iaddStyle from '../../../styles/iadd.module.css'
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import { getEnv,decrypt } from '../../../lib/utils/getEnv';
import { getOne } from '../../../lib/mysql/message';
import Head from 'next/head';
import { httpGet } from '../../../lib/net';
import { Right,Left } from '../../../lib/jssvg/SvgCollection';
// import {useRouter} from 'next/router';
/**
 * 我的社区
 */

export default function enki({openObj, env,locale }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
        daoid: '',  //所有'1,2,..', 单个'1' 方便sql in(${daoid})
        actorid: 0, account: '', 
        where: '', //查询条件
        menutype: 1,
        v:0, 
        order: 'reply_time', //排序
        eventnum: 0  //0 活动 1 非活动
     });
    // const router = useRouter();
    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);
    const [daoData, setDaoData] = useState([]) //所属个人的社区列表
    const [big,setBig]=useState(true) //左边缩进按钮控制, 默认左边大

    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    
    function removeUrlParams() {
        setCurrentObj(null);
        if(window.location.href.includes('?d=')) {
            const url = new URL(window.location.href);
            url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', url.href);
        }
      }
    //生成我管理的公器ID 集合
    useEffect(() => { if (Array.isArray(daoActor)) setDaoData(daoActor.filter(obj => obj.actor_account)) }, [daoActor])
    useEffect(()=>{ 
        if(openObj.id){
            setCurrentObj(openObj);
            setActiveTab(2);
        } 
    },[openObj])

    useEffect(() => {
        if (daoData.length > 0) {
            setFetchWhere({
                ...fetchWhere,
                daoid: daoData.map((item) => { return item.dao_id }).join(',')
            })
        }
    }, [daoData, actor])

    const latestHandle=()=>{ //最新
        //account: '' 从本地读取
        removeUrlParams();
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time', account: '', eventnum: 0, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
    }

    const eventHandle=()=>{ //活动
        //account: '' 从本地读取
        removeUrlParams();
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'id', account: '', eventnum: 1, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
    }

    //发布
    const publishHandle=()=>{setCurrentObj(null);setActiveTab(1);}
    

    const refreshCallBack = () => {  setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time', account: '', eventnum: 0, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') });
     setActiveTab(0); } //刷新数据,从0页开始
    const preEditCall=()=>{setActiveTab(1);} //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调
  
    return (<>
        <Head>
            <title>{currentObj?.id?currentObj?.title:tc('enkiTitle')}</title>
        </Head>
        <PageLayout  env={env} >

            <div className="clearfix">
                <div className={`${iaddStyle.scsidebar} ${big?iaddStyle.scsidebarbig:iaddStyle.scsidebarsmall}`}>
                  <button onClick={e=>{setBig(!big)}} type="button" className="btn" style={{position:'absolute',padding:'4px',top:'4px',right:'2px'}} >
                    {big?<Left size={24} />:<Right size={24} />}
                  </button>
                 {big && <>
                    <div className='mb-3' >
                        {actor?.actor_account ? <EnkiMember locale={locale} messageObj={actor} isLocal={true} hw={64} /> : <EnkiAccount t={t} locale={locale} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    </div>
                    {loginsiwe &&<>
                        {Array.isArray(daoData) && daoData.length > 0 ?
                        <ul >
                            <li><a href="#" onClick={latestHandle} >{t('latestText')}</a></li>
                            <li><a href="#" onClick={eventHandle} >{t('eventText')}</a></li>
                           {actor?.actor_account && <li><a href="#" onClick={publishHandle} >{t('publishText')}</a></li>}
                            {daoData.map((obj, idx) => <li key={obj.dao_id} className={iaddStyle.scli}>
                                <a href="#" onClick={e=>{
                                    removeUrlParams()
                                    setFetchWhere({ ...fetchWhere, currentPageNum:0,order:'id',eventnum:0,where:'',daoid:obj.dao_id,account:obj.actor_account});
                                    setActiveTab(0);
                                    }} >
                                    <div style={{overflow:'hidden',display:'flex',alignItems:'center'}}>
                                    <img src={obj.dao_logo} alt={obj.actor_account} height={24} width={24} style={{marginRight:'10px'}} />{obj.actor_account}
                                    </div>
                                </a>
                                </li>)
                            }
                        </ul>
                        : <ShowErrorBar errStr={t('noRegisterText')} />
                        }
                    </>
                    }
                  </>}
                </div>

                {daoData.length > 0 && <div className={`${iaddStyle.sccontent} ${big?iaddStyle.sccontentsmall:iaddStyle.sccontentbig}`}>

                    {activeTab === 0 && <Main actor={actor} env={env} locale={locale} path="enki" t={t} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} />}
                    {activeTab === 1 && <EnkiCreateMessage env={env} daoData={daoData} actor={actor} t={t} tc={tc} addCallBack={refreshCallBack} currentObj={currentObj} afterEditCall={afterEditCall} />}
                    {activeTab === 2 && <MessagePage  path="enki" locale={locale} t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} env={env}
                        currentObj={currentObj} delCallBack={refreshCallBack} preEditCall={preEditCall}  />}

                </div>
                }

            </div>

        </PageLayout></>
    )
}

export const getServerSideProps = async ({ locale,query }) => {
    let openObj={}; 
    const env=getEnv();
    if(query.d){
        const [id,sctype,domain]=decrypt(query.d).split(',');
        if(domain==env.domain){
            openObj=await getOne({id,sctype})
        }
        else 
        {
            let response=await httpGet(`https://${domain}/api/getData?id=${id}&sctype=${sctype}`,{'Content-Type': 'application/json',method:'getOne'})
            if(response?.message) openObj=response.message
        }
        
    }
    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale
            ,env,openObj

        }
    }
}



