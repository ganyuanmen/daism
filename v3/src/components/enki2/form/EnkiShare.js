import { Button,Modal,Overlay, Tooltip } from "react-bootstrap";
import { useState,useRef } from "react";
import { LocationSvg  } from '../../../lib/jssvg/SvgCollection';

/**
 * 分享 显示链接 和 html 内容
 */
export default function EnkiShare({content, locale, currentObj,t,tc})
{
    const [show,setShow]=useState(false)
    const [showOver1,setShowOver1]=useState(false)
    const [showOver2,setShowOver2]=useState(false)

    const target1 = useRef(null);
    const target2 = useRef(null);

    const path=currentObj.dao_id>0?'enki':'enkier';
    let url;
     
    
    let delayTime=null;
    let localDomain='';
   try{
    const myURL = new URL(currentObj.actor_url);
    localDomain= myURL.hostname;
    url=`https://${localDomain}/${locale==='zh'?'zh/':''}communities/${path}/${currentObj.message_id}`;

   }catch(e){}
    

    const uc=`<a href="${url}" target="_blank" style="align-items:center;border:1px solid #ccc;font-size:1rem; color: currentColor;border-radius:8px;display:flex;text-decoration:none" >
        <div style="aspect-ratio:1;flex:0 0 auto;position:relative;width:120px;border-radius:8px 0 0 8px;" >
            <img src='${currentObj.top_img || currentObj.avatar}' alt="" style="background-position:50%;background-size:cover;display:block;height:100%;margin:0;object-fit:cover;width:100%;border-radius:8px 0 0 8px;">
        </div>
        <div  >
            <div style="padding:2px 8px 2px 8px" >${localDomain}</div>
            <div style="padding:2px 8px 2px 8px" >${currentObj.actor_name} (${currentObj.actor_account})</div>
            <div style="padding:2px 8px 2px 8px;display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;" > ${currentObj.title+'\n'+content?.replaceAll('\n','')}</div>	
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
        
        <Button onClick={e=>setShow(true)}  variant="light"><LocationSvg  size={24} /> {t('shareText')} </Button>

        <Modal size="lg" className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
        <Modal.Header closeButton>share </Modal.Header>
        <Modal.Body  >
            <div> {t('linkText')}：</div>
            <div className="d-flex align-items-center justify-content-between mb-3" >
                <div>{url} </div>
                <div><Button variant="light" size="sm"   onClick={(e) => { 
                    if(navigator.clipboard) navigator.clipboard.writeText(url);
                    else return;
                    setShowOver1(true); //显示提示
                    if(delayTime) return; //提示未到时间，不做处理
                    delayTime=setTimeout(() => { setShowOver1(false);delayTime=null;}, 1000);}
                    }  ref={target1}  > <img src='/clipboard.svg' alt=""/>  {t('copyText')}</Button> </div>
           
            </div>
            <div dangerouslySetInnerHTML={{__html: uc}}></div>
            <div style={{textAlign:'right',padding:'16px'}} >
            <Button  ref={target2} variant="light" size="sm" onClick={getHtml} > <img src='/clipboard.svg' alt=""/> {t('copyLinkText')}html</Button>
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

