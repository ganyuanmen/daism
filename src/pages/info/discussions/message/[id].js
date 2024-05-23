import { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData'
import { getJsonArray } from '../../../../lib/mysql/common';
import {client} from '../../../../lib/api/client'
import Breadcrumb from '../../../../components/Breadcrumb';
import Editor from '../../../../components/form/Editor'
import MessageItem from '../../../../components/federation/MessageItem';
import { SendSvg } from '../../../../lib/jssvg/SvgCollection';
import PageLayout from '../../../../components/PageLayout';


//不登录也可以查看
export default function MessagePage({discussionData,chilrenData}) {
  let t = useTranslations('ff')
  
  return (
    <PageLayout>
      {
      discussionData.id?<Message discussionData={discussionData} chilrenData={chilrenData}  />
      :<>
       <Breadcrumb menu={[]} currentPage='discussions' />
       <ShowErrorBar errStr={t('notDiscussionText')} />
      </>
      
      }
    </PageLayout>
  );
}


function Message({discussionData,chilrenData})
{
  
  let tc = useTranslations('Common')
  let t = useTranslations('ff')
    const dispatch = useDispatch();
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const editRef=useRef()
    const actor = useSelector((state) => state.valueData.actor) 
    const user = useSelector((state) => state.valueData.user) 
    const [childData,setChildData]=useState([])
    
    useEffect(()=>{setChildData(chilrenData)},[chilrenData])

    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const [isVist,setIsVist]=useState(true)  //是不是游客
    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(discussionData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
  
     },[daoActor])
  

    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
    
   
  async function submit()
  {
    let textValue=editRef.current.getData()
    if(!textValue)
    {
        showClipError(t('replyContenNoEmpty'))
        return
    }
    showTip(t('submittingText')) 

    let res=await client.post('/api/postwithsession','discussionsAddCommont',{
        id:discussionData['id'],
        did:user.account,
        content:textValue
    })
    
    if(res.status===200) {
       let curData=childData.slice()
       curData.push({
			id:res.data,
			pid:discussionData['id'],
			member_address:user.account,
			member_icon:actor.member_icon,
			member_nick:actor.member_nick,
			content:textValue,
			createtime:new Date().toLocaleString(),
			times:'0_minute'})
			
       setChildData(curData)      
    }
    else {
        showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
    }
    closeTip()
 
  }
  const menu=[ 
    {url:`/info/visit/${discussionData.dao_id}`,title:discussionData.dao_name},
    {url:`/info/discussions/list/${discussionData.dao_id}`,title:'discussions'}
  ]
    return <>  
               <Breadcrumb menu={menu} currentPage={discussionData.title} ></Breadcrumb>        
                <h1>{discussionData['title']}</h1>
                <MessageItem record={discussionData} actor={actor} replyLevel={0}
                   path='discussions' showTip={showTip} closeTip={closeTip} showClipError={showClipError} t={t} tc={tc} ></MessageItem>  
                
                {
                
                childData.map((obj,idx) => (
                    <MessageItem key={idx} record={obj} actor={actor} replyLevel={1}
                    showTip={showTip} closeTip={closeTip} showClipError={showClipError} path='discussions' t={t} tc={tc} ></MessageItem>
                    ))
                }
                {loginsiwe && <>
                <div className='mb-3' style={{backgroundColor:'white'}} >
                    <Editor  ref={editRef} title={t('myReplyText')}  ></Editor>
                </div>
                 <button type="button" onClick={submit} className="btn btn-primary"><SendSvg size={16} /> {t('replyText')}</button>
                </>
                }
            </>
}

export const getServerSideProps = async ({ req, res,locale,query }) => {
  
    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        discussionData:await getJsonArray('dview',[query.id],true),
        chilrenData:await getJsonArray('dcview',[query.id])
      }
    }
  }


  