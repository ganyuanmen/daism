import { Overlay, Popover  } from "react-bootstrap";
import { User1Svg } from "../../../lib/jssvg/SvgCollection";
import { useSelector} from 'react-redux';
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import EnkiMember from "./EnkiMember";
import { useTranslations } from 'next-intl'

/**
 * 显示未注册帐号
 * @locale zh/cn
 */
export default function EnkiAccount({locale})
{
    const t=useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)
    const target = useRef(null);
    const [show, setShow] = useState(false);

    useEffect(()=>{
        if(actor?.manager)
           if(actor?.actor_account) setShow(false)
           else setShow(true)
         else setShow(false)
    },[actor])
    
    return(
        <div className="d-inline-flex align-items-center p-2" style={{minWidth:'200px'}} >
            { actor?.manager?  // {/*已登录 */}
            <>
                {actor?.actor_account?  //已注册
                    <EnkiMember messageObj={actor} locale={locale} hw={64} isLocal={true} />
                    :<div onClick={e=>{setShow(false)}} >  {/*  //未注册*/}
                        <div ref={target}> <User1Svg size={64}  /></div>
                        <Overlay show={show} target={target.current} placement="right" containerPadding={4}>
                            <Popover id="popover-contained">
                                <Popover.Header as="h3">{t('registerTips')}</Popover.Header>
                                <Popover.Body>
                                    {t('registerShow')}
                                </Popover.Body>
                            </Popover>
                        </Overlay>
                    </div>
                   
                }
            </>
            :<>  {/* //游客*/}
                <User1Svg size={64} />
                <div style={{paddingLeft:'10px'}} >
                    <h3>{t('invitMember')}</h3>  {/*  不登录显示游客 */}
                </div>
            </>
            }
        </div>
    );
}

