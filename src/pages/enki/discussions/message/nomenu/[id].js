import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { getJsonArray } from '../../../../../lib/mysql/common';
import MessageItem from '../../../../../components/federation/MessageItem';
import Rmenu from '../../../../../components/Rmenu';

//只查看
export default function MessagePage({discussionData,chilrenData}) {
  let t = useTranslations('ff')
  
  return (
    <Rmenu>
      {
      discussionData.id?<Message discussionData={discussionData} chilrenData={chilrenData} t={t}  />
      :<ShowErrorBar errStr={t('notDiscussionText')} />
      }
    </Rmenu>
  );
}


function Message({discussionData,chilrenData,t})
{
  
  let tc = useTranslations('Common')

    const [childData,setChildData]=useState([])
    
    useEffect(()=>{setChildData(chilrenData)},[chilrenData])

    return <>  
               
                <h1>{discussionData['title']}</h1>
                <MessageItem record={discussionData} t={t} tc={tc} />
                {
                childData && childData.length>0 &&
                childData.map((obj,idx) => (
                    <MessageItem key={idx} record={obj} 
                    noLink={obj.send_id && obj.send_id.startsWith('http')} 
                    isrealyImg={obj.send_id && obj.send_id.startsWith('http')} 
                     t={t} tc={tc} />
                    ))
                }
               
            </>
}

export const getServerSideProps = async ({ req, res,locale,query }) => {
  
    return {
      props: {
        messages: {
          ...require(`../../../../../messages/shared/${locale}.json`),
          ...require(`../../../../../messages/federation/${locale}.json`)
        },
        discussionData:await getJsonArray('dview',[query.id],true),
        chilrenData:await getJsonArray('dcview',[query.id])
      }
    }
  }


  