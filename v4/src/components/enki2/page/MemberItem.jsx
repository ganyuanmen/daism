import TimesItem from "../../federation/TimesItem";
import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "../form/EnkiMember"
import { useState,useEffect,useRef } from "react";
import { Overlay,Tooltip } from "react-bootstrap";
import { useTranslations } from 'next-intl'
import { MoreBtn } from "../../../lib/jssvg/SvgCollection";
import Image from "next/image";

/**
 * 显示嗯文头部信息，包括用户头像，荣誉证, 时间
 * @locale zh/cn 
 * @messageObj 嗯文对象
 * @domain 当前服务器域名
 */
export default function MemberItem({locale,messageObj,honor}) {
    const t = useTranslations('ff')
    return (<>
        <div className="desktop-only ">
        <div style={{width:'100%'}} className="d-inline-flex justify-content-between align-items-center"   >
            <div style={{width:'56%'}} ><EnkiMember locale={locale} messageObj={messageObj} isLocal={messageObj?.actor_id>0} /></div>
            {honor.length>0 && <div><Honor honor={honor} t={t} messageObj={messageObj} locale={locale}/> </div>}
          
            <div style={{paddingLeft:'4px'}} ><TimesItem currentObj={messageObj} /></div>
        </div>
        </div>
        <div className="mobile-only">
        <div style={{width:'100%'}} className="d-inline-flex justify-content-between align-items-center"   >
          <div style={{width:'56%'}} ><EnkiMember locale={locale} messageObj={messageObj} isLocal={messageObj?.actor_id>0} /></div>
          {honor.length>0 && <div style={{paddingLeft:'8px'}}><Honor_m honor={honor} t={t} messageObj={messageObj} locale={locale}/> </div>}
          <div style={{paddingLeft:'4px'}} ><TimesItem_m currentObj={messageObj} /></div>
      </div>
      </div>
      </>
    );
}

function Honor({honor,t,messageObj,locale}){
    const overlayRef=useRef();
    const geneHonor=()=>{
        const [show, setShow] = useState(false);
        const target = useRef(null);

        const handleClickOutside = (event) => { //单击隐藏弹窗
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
              setShow(false)
            }
          
          };
           useEffect(() => {
              document.addEventListener('click', handleClickOutside, true);
              return () => {
                document.removeEventListener('click', handleClickOutside, true);
              };
           }, []);
           
      
        if(honor.length===3){
            return honor.map((obj,idx)=>(<SvgShow locale={locale} messageObj={messageObj} tokensvg={obj.tokensvg} key={`lk${idx}`} />));
        }
        else if(honor.length>2) {
            return <>
            <SvgShow locale={locale} messageObj={messageObj} tokensvg={honor[0].tokensvg} />
            <SvgShow locale={locale} messageObj={messageObj} tokensvg={honor[1].tokensvg} />
            <button className="daism-ff"  ref={target} onClick={() => setShow(!show)} title={t('moreText')}>
            <MoreBtn size={20} />
            </button>
            <Overlay ref={overlayRef} target={target.current} show={show} placement="bottom">
                {(props) => (
                <Tooltip id="overlay-example78" {...props}>
                  { 
                  honor.map((obj,idx)=>(<SvgShow locale={locale} messageObj={messageObj} tokensvg={obj.tokensvg} key={`lk${idx}`} />))
                  }
                </Tooltip>
                )}
            </Overlay>
            </>
        }
        else { //0,1,2
            return honor.map((obj,idx)=>(<SvgShow locale={locale} messageObj={messageObj} tokensvg={obj.tokensvg} key={`lk${idx}`} />));
        }
    }

    return <>{geneHonor()}</>
    
 
}


function Honor_m({honor,t,messageObj,locale}){

    const overlayRef=useRef();

 

      
 
        const [show, setShow] = useState(false);
        const target = useRef(null);

        const handleClickOutside = (event) => { //单击隐藏弹窗
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
              setShow(false)
            }
          
          };
           useEffect(() => {
              document.addEventListener('click', handleClickOutside, true);
              return () => {
                document.removeEventListener('click', handleClickOutside, true);
              };
           }, []);
           
      
      
            return <>
    
            <button className="daism-ff" ref={target} onClick={() => setShow(!show)} title={t('moreText')}>
                <MoreBtn size={20} />
            </button>
            <Overlay ref={overlayRef} target={target.current} show={show} placement="bottom">
                {(props) => (
                <Tooltip id="overlay-example78" {...props}>
                  { 
                  honor.map((obj,idx)=>(<SvgShow locale={locale} messageObj={messageObj} tokensvg={obj.tokensvg} key={`lk${idx}`} />))
                  }
                </Tooltip>
                )}
            </Overlay>
            </>
        
      
    
}

function SvgShow({tokensvg,locale,messageObj}){
    
    const svgToBase=(svgCode)=> {
      const buffer = Buffer.from(svgCode, 'utf-8');
      return 'data:image/svg+xml;base64,' + buffer.toString('base64');
	}

    return <a href={`/${locale}/honortokens/${messageObj.manager}`} alt=''>
      <Image src={svgToBase(tokensvg)} className="honor" /></a>
}