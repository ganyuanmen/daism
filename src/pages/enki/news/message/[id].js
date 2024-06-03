
import { Card} from 'react-bootstrap';
import MemberItem from '../../../../components/federation/MemberItem'; import EditItem from '../../../../components/federation/EditItem';
import { useSelector,useDispatch} from 'react-redux';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData'
import { getJsonArray } from '../../../../lib/mysql/common';
import Breadcrumb from '../../../../components/Breadcrumb';
import PageLayout from '../../../../components/PageLayout';
import { useState,useEffect } from 'react';
import ShowImg from '../../../../components/ShowImg'

//不登录也可以查看
export default function MessagePage({newsData}) {

let t = useTranslations('ff')
  return (
    <PageLayout>
      {
      newsData.id?<Message newsData={newsData} />
      :<>
       <Breadcrumb menu={[]} currentPage='news' />
       <ShowErrorBar errStr={t('noNewsExist')} />
      </>
      
      }
    </PageLayout>
  );
}


function Message({newsData})
{
    let t=useTranslations('ff')
    let tc=useTranslations('Common')
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
    const daoAddress = useSelector((state) => state.valueData.daoAddress)
    const actor = useSelector((state) => state.valueData.actor) //联邦软件登录帐号

    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const [isVist,setIsVist]=useState(true)  //是不是游客
    useEffect(()=>{
      if(daoActor && daoActor.length) {
      let _daoData=daoActor.find((detailObj)=>{return parseInt(detailObj.dao_id)===parseInt(newsData.dao_id)})
      if(_daoData) setIsVist(false) ; else setIsVist(true);
      }
      else setIsVist(true);
  
     },[daoActor])
  
  
     const menu=[ 
      {url:`/enki/visit/${newsData.dao_id}`,title:newsData.dao_name}, 
      {url:`/enki/news/list/${newsData.dao_id}`,title:'news'}
    ]


    return <>     <Breadcrumb menu={menu} currentPage={newsData.title} ></Breadcrumb>   
                  <div style={{ position:'relative', textAlign:'center'}} >
                   <ShowImg path={newsData.top_img} alt='' maxHeight="200px" />
                  </div>     
                
                <h1>{newsData['title']}</h1>
                <Card>
                <Card.Body>
                <div className='row' >
                    <div className='col-auto me-auto' >
                        <MemberItem record={newsData} />
                    </div>
                    <div className='col-auto'>
                    {actor && (actor?.member_address?.toLowerCase()===newsData?.member_address?.toLowerCase() || actor?.member_address?.toLowerCase()===daoAddress['administrator']?.toLowerCase()) && 
                        <EditItem  message={newsData} showTip={showTip} closeTip={closeTip}
                        showClipError={showClipError} replyLevel={0} path='news' t={t} tc={tc}
                        />
                    }
                    </div>
                </div>
                </Card.Body>
                </Card>
                <div>{newsData.createTime}</div>
                <Card>
                <Card.Body>
                    <div dangerouslySetInnerHTML={{__html: newsData.content}}></div>
                </Card.Body>
                </Card>
            </>
}


export const getServerSideProps = async ({ req, res,locale,query }) => {

    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        newsData:await getJsonArray('nview',[query.id],true)
      }
    }
  }



  //layout="fill" objectFit="contain"

  // function ShowImg({path,...props})
  // {
  //   const [isrc,setIsrc]=useState(path)
  //   if(path.endsWith('.svg')) {
  //     fetch(path).then(async res=>{setIsrc(await res.text())})
  //     return <img alt='' src={isrc} style={props} />
  //   }
  //   else 
  //   return <img alt='' src={path} style={props} />
  // }