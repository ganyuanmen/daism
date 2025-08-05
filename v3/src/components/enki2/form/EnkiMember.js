import { User1Svg } from "../../../lib/jssvg/SvgCollection";
import ShowAddress from "../../ShowAddress";
import { useTranslations } from 'next-intl'
/**
 * 显示用户信息，包括头像，钱包地址，enki 帐号
 * @messageObj 
 * @isLocal 是否本地帐号，非本地帐号打开个人信息时，启用新的窗口，凡是enki 和智能公器帐号都是本地帐号
 * @locale zh/cn 
 */

export default function EnkiMember({messageObj,isLocal,locale,hw=48})
{
    const t = useTranslations('ff')
    const geneHref=()=>{
        if(messageObj && messageObj.actor_account){
        const [enkiName,domain]=messageObj.actor_account.split('@');
              return `https://${domain}/${enkiName}`
        } else return '';
  
        // if(messageObj?.dao_id>0){ //SC 帐号
        //     return `/${locale}/smartcommons/daoinfo/${messageObj?.dao_id}`
        // }else{ //个人帐号
        //     return `/${locale}/smartcommons/actor/${messageObj?.actor_account}`
        // }
    }

    return( 
        //.
  
        <div style={{width:'90%'}} className="d-inline-flex align-items-center"  >
            {isLocal?
            <a href={geneHref()} className="daism-a"  >
                {messageObj?.avatar?
                <img src={messageObj?.avatar} alt='' width={hw} height={hw} style={{borderRadius:'10px'}} />
                :<User1Svg size={hw} />
                }
            </a>:
             <a href={messageObj?.actor_url || messageObj?.url} className="daism-a"  target="_blank"  >
                {messageObj?.avatar?
                <img src={messageObj?.avatar} alt='' width={hw} height={hw} style={{borderRadius:'10px'}} />
                :<User1Svg size={hw} />
                }
            </a>
            }
        
            <div style={{paddingLeft:'2px',width:'100%'}} >
                {messageObj?.send_type>7 || (messageObj?.send_type===0 && messageObj?.receive_account) ?<>
                <div  className="daism-account" >{t('amouseText')}: {messageObj?.actor_account || messageObj?.account}</div>
                <div className="daism-account" >to: {messageObj?.receive_account} </div>
                </>:<>
                <div  className="daism-account" >{messageObj?.actor_account || messageObj?.account}</div>
                {(!messageObj.dao_id || messageObj?.send_type>0) && <> {messageObj?.send_type==1 ? <div  className="daism-account">to: {messageObj?.receive_account} </div>
                :isLocal && messageObj?.manager && <ShowAddress address={messageObj?.manager} />}</>
                }</>
            }
            </div>
        </div>
   
    );
}

