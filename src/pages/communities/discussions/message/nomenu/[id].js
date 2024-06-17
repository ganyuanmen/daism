import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { getJsonArray } from '../../../../../lib/mysql/common';
import MessageItem from '../../../../../components/federation/MessageItem';
import useDiscusionList from "../../../../../hooks/useDiscusionList"
import Loadding from '../../../../../components/Loadding';
import PageItem from '../../../../../components/PageItem';
import Rmenu from '../../../../../components/Rmenu';

//查看
export default function MessagePage({discussionData}) {
  let t = useTranslations('ff')
  
  return (
    <Rmenu>
      {
      discussionData?.id?<Message discussionData={discussionData} t={t}  />
      :<ShowErrorBar errStr={t('notDiscussionText')} />     
      }
    </Rmenu>
  );
}


function Message({discussionData,t})
{
  
  const tc = useTranslations('Common')
  const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
  const pageData=useDiscusionList({currentPageNum,pid:discussionData.id,pages:20,method:'dcviewPageData'})
 
   const [childData,setChildData]=useState([])
    
   useEffect(()=>{ if(pageData && pageData.rows) setChildData(pageData.rows) },[pageData])


    return <>      
                <h1>{discussionData['title']}</h1>
                <MessageItem record={discussionData} t={t} tc={tc} ></MessageItem>  
                {childData.length?
                  <>
                    {childData.map((obj,idx) => (
                    <MessageItem key={idx} record={obj} t={t} tc={tc} ></MessageItem>
                    ))
                    }
                    <PageItem records={pageData.total} pages={pageData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={pageData.status} />
                  </>
                  :pageData.status==='failed'?<ShowErrorBar errStr={pageData.error} />
                  :pageData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
                  :<Loadding />
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
        // chilrenData:await getJsonArray('dcview',[query.id])
      }
    }
  }


  