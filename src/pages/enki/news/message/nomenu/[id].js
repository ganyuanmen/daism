
import { Card} from 'react-bootstrap';
import MemberItem from '../../../../../components/federation/MemberItem';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../../../../../components/ShowErrorBar';
import { getJsonArray } from '../../../../../lib/mysql/common';
import ShowImg from '../../../../../components/ShowImg'
import Rmenu from '../../../../../components/Rmenu';

//查看
export default function MessagePage({newsData}) {

let t = useTranslations('ff')
  return (
    <Rmenu>
      {
      newsData.id?<Message newsData={newsData} />
      :<ShowErrorBar errStr={t('noNewsExist')} /> 
      }
    </Rmenu>
  );
}


function Message({newsData})
{
  
   
  

    return <>     
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
          ...require(`../../../../../messages/shared/${locale}.json`),
          ...require(`../../../../../messages/federation/${locale}.json`)
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