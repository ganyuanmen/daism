import React, {useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useTranslations } from 'next-intl'
/**
 * 地址显示，有提示，能复制
 * @returns 
 */
export default function ShowAddress({address,isb=false}) {  //isb 字体是否加粗
    const t = useTranslations('Common')
    const [show, setShow] = useState(false); //显示提示
    const target = useRef(null);
    let delayTime; //延迟控制

    //生成地址格式
    function getAccount()
    {
        if(address && address.length===42)
            return address.slice(0,6)+'......'+address.slice(38,42)
        else 
             return address
    }

    return (
       <div style={{whiteSpace: 'nowrap'}}>

            <span >{isb?<b>{getAccount()}</b>:getAccount()} </span> {' '}
            
            <img alt=''  width={20} height={20}
                data-address={address}  
                src='/clipboard.svg' 
                ref={target} 
                onClick={(e) => { 
                    if(navigator.clipboard) navigator.clipboard.writeText(e.currentTarget.getAttribute("data-address"))
                    else return;
                    setShow(true); //显示提示
                    if(delayTime) return; //提示未到时间，不做处理
                    delayTime=setTimeout(() => { setShow(false);delayTime=null;}, 1000);}
                    }
                />
         
            <Overlay target={target.current} show={show} placement="bottom">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                    {t('copyText')}
                    </Tooltip>
                    )}
            </Overlay>
        </div>
    );
}

