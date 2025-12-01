
import { getData } from '@/lib/mysql/common';
import { getSession } from '@/lib/session';
// import { getClientIpPage } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { headers } from 'next/headers';
import RefreshButton from './RefreshButton';
import SetPage from './SetPage';

export interface HomeDataType{
  svg_big_zh:string;
  svg_big_en:string;
  svg_sm_zh:string;
  svg_sm_en:string;
  var_zh:string;
  var_en:string;
}


export default function Home() {
  
  const locale: string = useLocale().toString().toLowerCase();
  
    return (
        <div style={{paddingTop:'20px'}}>
        <Imgsvg locale={locale}/>
        </div>
    )
    }
   

    async function Imgsvg({locale}:{locale:string}){
        const session = await getSession();
        const request =await headers();
        // const currentIp = getClientIpPage(request);


        if (!session ||  session.userAgent !== request.get('user-agent')) {
          return(  
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>401 Unsigned Login</h1> <RefreshButton />
          </div>
          )
        }
  
        if(session.did.toLowerCase()!==process.env.NEXT_PUBLIC_SITEMANAGER?.toLowerCase() 
          && session.did.toLowerCase()!==process.env.NEXT_PUBLIC_ADMI_ACTOR?.toLowerCase()){
            return(  
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  <h1>401 unauthorized</h1>  <RefreshButton />
                </div>
                )
        }
        
    const data:HomeDataType[]=await getData("SELECT * FROM a_home",[]);



        return(
          <SetPage data={data} />
        );
    }

