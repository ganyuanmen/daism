import Head from 'next/head';
import { getData } from "../lib/mysql/common";
import {getEnv} from '../lib/utils/getEnv'
/**
 * 我的奖励
 */
export default function ListBook({data1,data2,env}) {
    const renderedArrays1 = data1.map((obj, idx) => {
       let url;
        if(obj.message_id.startsWith('http')) url=`https://${env.domain}/communities/enkier/${obj.id}`
        else url=`https://${env.domain}/communities/enkier/${obj.message_id}`
        return (
            <a href={url}>{obj.title?obj.title:obj.message_id}</a>
        );
      });

      const renderedArrays2 = data2.map((obj, idx) => {
       
         return (
         <a href={`https://${env.domain}/communities/enki/${obj.message_id}`}>{obj.title?obj.title:obj.message_id}</a>
         );
       });
  
    return (<>
      <Head>
          <title>ListBook</title>
      </Head>
        {renderedArrays1}
        {renderedArrays2}
      </>
    );
    }

    
    

  export const getServerSideProps =async ({locale }) => {  
    const data1=await getData("SELECT a.message_id,a.title,b.id FROM a_message a JOIN (SELECT message_id,MIN(id) id FROM a_sendmessage GROUP BY message_id) b ON a.`message_id`=b.message_id",[]);
    const data2=await getData("SELECT message_id,title FROM v_messagesc",[]);
  
  
    return {
      props: {
       data1,data2,env:getEnv()
      }
    }
  }

    