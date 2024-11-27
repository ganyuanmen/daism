import { User1Svg } from "../../../lib/jssvg/SvgCollection";
import ShowAddress from "../../ShowAddress";

//islocal 是否本地帐号， 有钱包地址可以显示 hw 图片宽高，
export default function EnkiMember({messageObj,isLocal,locale,hw=48})
{
    const geneHref=()=>{
        
        if(messageObj?.dao_id>0){ //SC 帐号
            return `/${locale}/smartcommons/daoinfo/${messageObj?.dao_id}`
        }else{ //个人帐号
            return `/${locale}/smartcommons/actor/${messageObj?.actor_account}`
        }
    }

    return( 
  
        <div className="d-inline-flex align-items-center" >
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
        
            <div style={{paddingLeft:'10px'}} >
                <div>{messageObj?.actor_account || messageObj?.account}</div>
                {messageObj?.send_type==1 ? <div>to: {messageObj?.receive_account} </div>
                :isLocal && messageObj?.manager && <ShowAddress address={messageObj?.manager} />}
            </div>
        </div>
   
    );
}

