import TimesItem from "../../federation/TimesItem";
import TimesItem_m from "../../federation/TimesItem_m";
import EnkiMember from "./EnkiMember"
import EnKiFollow from "./EnKiFollow";
import { useState,useEffect,useRef } from "react";
import { client } from "../../../lib/api/client";
import { Button,Overlay,Tooltip } from "react-bootstrap";
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';
import { MoreBtn,PinTop } from "../../../lib/jssvg/SvgCollection";

/**
 * 显示嗯文头部信息，包括用户头像，荣誉证, 时间
 * @locale zh/cn 
 * @messageObj 嗯文对象
 * @domain 当前服务器域名
 */
export default function EnkiMemberItem({locale,messageObj,domain}) {
    const [honor,setHonor]=useState([])
    const [isTop,setIsTop]=useState(false)
    const [isFollow,setIsFollow]=useState(true) //默认已关注
    const myFollow = useSelector((state) => state.valueData.myFollow)
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')

    useEffect(() => {
        let item = myFollow.find(obj => obj.actor_account?.toLowerCase() === messageObj?.actor_account?.toLowerCase());
        //本人不能关注本人，设为已关注 用户不在注册地登录的，设为已注册，不需要显示关注的按钮
        if(item || actor?.actor_account===messageObj.actor_account || domain!=actor?.actor_account?.split('@')[1]) 
            setIsFollow(true); else setIsFollow(false);
    }, [myFollow]);  


    useEffect(()=>{
        const fetchData = async () => {
            try {
                const res = await client.get(`/api/getData?did=${messageObj.manager}`,'getMynft');
                if(res.status===200)
                    if(Array.isArray(res.data)) setHonor(res.data)
                 
            } catch (error) {
                console.error(error);
            } 
        };

        if (messageObj.dao_id === 0 && messageObj.manager) fetchData();
        else if (messageObj.dao_id > 0 && messageObj.is_top) setIsTop(true);

    },[messageObj]) 
 
  //isLocal={messageObj?.actor_id>0} a_messagesc中actor_id 是发布人的id,都大于0，都属本地帐号，
  //a_message中的actor_id,关联到a_account, 是enki 帐号的都是本地。
    return (<>
        <div className="desktop-only ">
        <div style={{width:'100%'}} className="d-inline-flex justify-content-between align-items-center"   >
            <div style={{width:'50%'}} ><EnkiMember locale={locale} messageObj={messageObj} isLocal={messageObj?.actor_id>0} /></div>
            {honor.length>0 && <div><Honor honor={honor} t={t} messageObj={messageObj} locale={locale}/> </div>}
            {!isFollow && <div><EnKiFollow searObj={messageObj} /> </div>}
            {isTop &&  <div ><PinTop size={24} /></div>}
            <div style={{paddingLeft:'4px'}} ><TimesItem currentObj={messageObj} /></div>
        </div>
        </div>
        <div className="mobile-only">
        <div style={{width:'100%'}} className="d-inline-flex justify-content-between align-items-center"   >
          <div style={{width:'50%'}} ><EnkiMember locale={locale} messageObj={messageObj} isLocal={messageObj?.actor_id>0} /></div>
          {honor.length>0 && <div style={{paddingLeft:'8px'}}><Honor_m honor={honor} t={t} messageObj={messageObj} locale={locale}/> </div>}
          {!isFollow && <div><EnKiFollow searObj={messageObj} /> </div>}
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
	    const utf8Bytes = new window.TextEncoder().encode(svgCode);
	    return 'data:image/svg+xml;base64,' +window.btoa(String.fromCharCode.apply(null, utf8Bytes));
	}

    return <a href={`/${locale}/honortokens/${messageObj.manager}`} alt=''><img src={svgToBase(tokensvg)} className="honor" /></a>
}