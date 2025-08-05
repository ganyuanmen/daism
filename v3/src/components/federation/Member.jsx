import { User1Svg } from '../../lib/jssvg/SvgCollection'
//"../../../lib/jssvg/SvgCollection";
import ShowAddress from '../ShowAddress'
//"../../ShowAddress";
import { useTranslations } from 'next-intl'
/**
 * 显示用户信息，包括头像，钱包地址，enki 帐号
 * @messageObj 
 * @isLocal 是否本地帐号，非本地帐号打开个人信息时，启用新的窗口，凡是enki 和智能公器帐号都是本地帐号
 * @locale zh/cn 
 */

export default function Member({messageObj,locale})
{
    const t = useTranslations('ff');
    const manager=messageObj.manager;
    const account=messageObj?.self_account || messageObj.actor_account;
    const avatar=messageObj?.self_avatar || messageObj.avatar;
    
    const [enkiName,domain]=account.split('@');
 
    return( 
        //.
  
        <div style={{width:'90%'}} className="d-inline-flex align-items-center"  >

            <a href={`https://${domain}/${enkiName}`} className="daism-a"  >
                {avatar?
                <img src={avatar} alt='' width={48} height={48} style={{borderRadius:'10px'}} />
                :<User1Svg size={48} />
                }
            </a>
            
        
            <div style={{paddingLeft:'2px',width:'100%'}} >
              
                <div  className="daism-account" >{account}</div>
               <ShowAddress address={manager} />
                
            
            </div>
        </div>
   
    );
}

