import Head from 'next/head';
import { getData } from "../lib/mysql/common";
/**
 * 我的奖励
 */
export default function ListBook({data1,data2}) {
    const renderedArrays1 = data1.map((obj, idx) => {
       const [,domain]=obj.account.split('@');
       let url;
       if(obj.title) url=`https://${domain}/enki/${obj.message_id}.html`
       else url=`https://${domain}/communities/enkier/${obj.message_id}`
        return (
            <a href={url}>{obj.title?obj.title:obj.message_id}</a>
        );
      });

      const renderedArrays2 = data2.map((obj, idx) => {
        const [,domain]=obj.account.split('@');
        let url;
        if(obj.title) url=`https://${domain}/enki/${obj.message_id}.html`
        else url=`https://${domain}/communities/enki/${obj.message_id}`
         return (
         <a href={url}>{obj.title?obj.title:obj.message_id}</a>
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
    const data1=await getData("SELECT message_id,MAX(actor_account) account,MAX(title) title FROM a_message WHERE message_id NOT LIKE 'http%' GROUP BY message_id",[]);
    const data2=await getData("SELECT message_id,MAX(actor_account) account,MAX(title) title FROM v_messagesc GROUP BY message_id",[]);
  
  
    return {
      props: {
       data1,data2
      }
    }
  }

    