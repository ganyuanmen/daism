import { Card,Button } from "react-bootstrap";
import { useState,useRef } from "react";
import { EditSvg } from "../../lib/jssvg/SvgCollection";
import ConfirmWin from "./ConfirmWin";
import {setTipText,setMessageText,setDaoActor} from '../../data/valueData'
import { useDispatch } from 'react-redux';


/**
 * 域名管理
 */
export default function Domain_div({record,t,tc,loginsiwe,domain,user}) {  
    const [show,setShow]=useState(false)
    const domainRef=useRef()
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}

    async function handleSubmit()
    {
        setShow(false)
        showTip(t('submittingText'))   
        let re=await window.daismDaoapi.Domain.daoId2Domain(record.dao_id);
        if(re && re===domain){ 
            showClipError(t('domainbindText'))
            closeTip()
            return
        }
        
        window.daismDaoapi.Domain.record(record.dao_id,domain).then(async re => {
           
            setTimeout(async () => {
                const res = await fetch('/api/siwe/getdaoactor')
                let data=await res.json();
                if(res.status===200) { 
                    if(data.daoActor.length){
                        dispatch(setDaoActor(data.daoActor))
                        window.sessionStorage.setItem("daoActor", JSON.stringify(data.daoActor))
                    }
                }
                window.location.reload()
            }, 1000);
          
           
        }, err => {
            console.error(err); closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        });

    }
    return (
        <> 
        { 
        <Card className='mb-2 daism-title mt-2' >
        <Card.Header>{t('companyText')}</Card.Header>
        <Card.Body>
        <div className="mb-1" >
            <strong>{t('alredyDomainText')}</strong>:<strong style={{display:'inline-block',paddingLeft:'12px'}} >{record?.domain}</strong>
        </div>
        <div className='row mb-1 ' >
            <div className='col-auto me-auto' >
              <strong>{t('localDomainText')}</strong>:<strong style={{display:'inline-block',paddingLeft:'12px'}} >{domain}</strong>
            </div>
            <div className='col-auto' >
                {loginsiwe && user && user.account && record.dao_manager.toLowerCase()===user.account.toLowerCase() &&domain!==record.domain && <Button onClick={()=>{setShow(true)}} >
                        <EditSvg size={18} /> {record.domain?t('editText'):t('bindText')}</Button>}
            </div>
        </div>
        <div className="mb-1" >{t('DomainDescText')}</div>
      
        </Card.Body>
        </Card>
        }
      <ConfirmWin  show={show} setShow={setShow} question={record.domain?t('confirmEditText'):t('confirmBindText')} callBack={handleSubmit} />
        
        </>
    );
}




