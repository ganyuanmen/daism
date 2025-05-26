import { Button,Modal,Overlay, Tooltip } from "react-bootstrap";
import { useState,useRef } from "react";
import { LocationSvg  } from '../../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'

/**
 * 分享 显示链接 和 html 内容
 * content 嗯文文本内容
 * locale zh/cn
 * currentObj 嗯文对象
 */
export default function EnkiShare({content, env, currentObj})
{

    const t = useTranslations('ff')
    const tc = useTranslations('Common')
    const [show,setShow]=useState(false)
    const [showOver1,setShowOver1]=useState(false)
    const [showOver2,setShowOver2]=useState(false)

    const target1 = useRef(null);
    const target2 = useRef(null);


    let delayTime=null;



    const uc=`<a href="${currentObj.link_url}" target="_blank" style="width:100%; align-items:center;border:1px solid #ccc;font-size:1rem; color: currentColor;border-radius:8px;display:flex;text-decoration:none" >
        <div style="aspect-ratio:1;flex:0 0 auto;position:relative;width:120px;border-radius:8px 0 0 8px;" >
            <img src='${currentObj.top_img || currentObj.avatar}' alt="" style="background-position:50%;background-size:cover;display:block;height:100%;margin:0;object-fit:cover;width:100%;border-radius:8px 0 0 8px;">
        </div>
        <div style="width:100%" >
            <div style="padding:2px 8px 2px 8px" >${currentObj.actor_account.split('@')[1]}</div>
            <div style="padding:2px 8px 2px 8px" >${currentObj.actor_name} (${currentObj.actor_account})</div>
            <div style="width:100%;padding:2px 8px 2px 8px;display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;" > ${content}</div>	
        </div>
        </a>` ;


    const getHtml=()=>{
        if(navigator.clipboard) navigator.clipboard.writeText(uc);
        else return;
        setShowOver2(true); //显示提示
        if(delayTime) return; //提示未到时间，不做处理
        delayTime=setTimeout(() => { setShowOver2(false);delayTime=null;}, 1000);
    }

    return(
        <>
          <button type="button" onClick={() => {setShow(true)}} className="btn btn-light" data-bs-toggle="tooltip" 
          data-bs-html="true" title={t('shareText')}>  
               <LocationSvg  size={18} />
           </button>
  

        <Modal size="lg" className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
        <Modal.Header closeButton>share </Modal.Header>
        <Modal.Body  >
            <div> {t('linkText')}：</div>
            <div className="d-flex align-items-center flex-wrap  mb-3" >
                <div style={{wordWrap: 'break-word', wordBreak: 'break-all'}} >{currentObj.link_url} </div>
                <div><Button variant="light" size="sm"   onClick={(e) => { 
                    if(navigator.clipboard) navigator.clipboard.writeText(currentObj.link_url);
                    else return;
                    setShowOver1(true); //显示提示
                    if(delayTime) return; //提示未到时间，不做处理
                    delayTime=setTimeout(() => { setShowOver1(false);delayTime=null;}, 1000);}
                    }  ref={target1}  > <img src='/clipboard.svg' alt=""/>  {t('copyText')}</Button> </div>
           
            </div>
            <div dangerouslySetInnerHTML={{__html: uc}}></div>
            <div style={{textAlign:'right',padding:'16px'}} >
            <Button  ref={target2} variant="light" size="sm" onClick={getHtml} > <img src='/clipboard.svg' alt=""/> {t('copyLinkText')}</Button>
            </div>
         

            <Overlay target={target1.current} show={showOver1} placement="bottom">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                    {tc('copyText')}
                    </Tooltip>
                    )}
            </Overlay>
            <Overlay target={target2.current} show={showOver2} placement="bottom">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                    {tc('copyText')}
                    </Tooltip>
                    )}
            </Overlay>
        </Modal.Body>
        </Modal>
                 
        </>
    );
}

