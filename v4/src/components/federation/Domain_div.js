import { Card,Button } from "react-bootstrap";
import { useState,useRef } from "react";
import { EditSvg } from "../../lib/jssvg/SvgCollection";
import ConfirmWin from "./ConfirmWin";
import {setTipText,setErrText,setDaoActor} from '../../data/valueData'
import { useDispatch } from 'react-redux';
import { client } from "../../lib/api/client";
import ShowErrorBar from "../ShowErrorBar";


/**
 * 域名管理
 */
export default function Domain_div({record,t,tc,daoActor,domain,accountTotal,loginsiwe}) {  

    const [show,setShow]=useState(false)
    // const domainRef=useRef()
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setErrText(str))}

    async function handleSubmit()
    {
        setShow(false)
        showTip(t('submittingText'))
        let re=await  client.get('/api/getData?account=','getSelfAccount');
        if(re.data.allTotal>parseInt(accountTotal)){
            closeTip()
            showClipError(t('exceedAmount'))
            return;
        }

        re=await window.daismDaoapi.Domain.daoId2Domain(record.dao_id);
        if(re && re===domain){ 
            showClipError(t('domainbindText'))
            closeTip()
            return
        }
     
        window.daismDaoapi.Domain.record(record.dao_id,domain).then(async re => {
           
            setTimeout(async () => {
                const res = await fetch('/api/siwe/getdaoactor?t='+new Date().getTime())
                let data=await res.json();
                if(res.status===200) { 
                    if(data.daoActor.length){
                        dispatch(setDaoActor(data.daoActor))
                        // window.sessionStorage.setItem("daoActor", JSON.stringify(data.daoActor))
                    }
                    if(re && record.actor_account){ //重新注册，恢复资料
                        fetch(`/api/admin/recover`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({actorName:record.dao_symbol,domain,oldAccount:record.actor_account,sctype:'sc',daoid:record.dao_id })
                        })
                        .then(async response => {console.info('recover ok') })
                    }
                    window.location.reload()
                }
              
            }, 2000);
          
           
        }, err => {
            console.error(err); closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        });

    }

    //管理员都可操作

    const checkDao=()=>{ 
        let _member=daoActor.find((obj)=>{return obj.dao_id===record.dao_id})
        if(_member) return true;
        else return false;
    }

    return (
        <> 
        { 
        <Card className='mb-2 daism-title mt-2' >
        <Card.Header>{t('companyText')}</Card.Header>
        <Card.Body>

        <div className="mb-1 d-flex justify-content-between align-items-center" >
            <div>
                <strong>{t('alredyDomainText')}</strong>:<strong style={{display:'inline-block',paddingLeft:'12px'}} >{record?.domain}</strong><br/>
                <strong>{t('localDomainText')}</strong>:<strong style={{display:'inline-block',paddingLeft:'12px'}} >{domain}</strong>
            </div>
            <div>
            {loginsiwe? checkDao() &&domain!==record.domain && <Button onClick={()=>{setShow(true)}} >
                        <EditSvg size={18} /> {record.domain?t('editText'):t('bindText')}</Button>
                        :<ShowErrorBar errStr={tc('notLoginText')} />
                }
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




