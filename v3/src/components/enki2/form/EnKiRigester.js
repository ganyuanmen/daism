import { InputGroup,Button,Form } from "react-bootstrap";
import { UploadSvg } from '../../../lib/jssvg/SvgCollection';
import { useRef } from "react";
import { client } from "../../../lib/api/client";
import { useSelector,useDispatch} from 'react-redux';
import {setTipText,setMessageText,setUser,setLoginsiwe} from '../../../data/valueData'

//活动附加信息 re 是否重新注册
export default function EnKiRigester({t,user,domain,setRegister,re,accountTotal})
{
    const nameRef=useRef()
    const actor = useSelector((state) => state.valueData.actor) 
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
        
    const register= async ()=>{
        let actorName=nameRef.current.value;
        if (!actorName || actorName.length > 12) {
            showClipError(t('noEmptygt12'))
            return
        }

        showTip(t('submittingText'))  
        // actorName='0x'+actorName 
        let re=await  client.get(`/api/getData?account=0x${actorName}@${domain}`,'getSelfAccount');
        if(re.data.allTotal>parseInt(accountTotal)){
            closeTip()
            showClipError(t('exceedAmount'))
            return;
        }

        if(re.status!==200 || re.data.nameTotal>0 )
        {
            showClipError(`${actorName}@${domain} ${t('registeredText')}`)
            closeTip()
            return
        }
        
        re=await window.daismDaoapi.Domain.addr2Info(user.account);
        if(setRegister) setRegister(false)
        if(re && re[0]===domain && re[1]==='0x'+actorName){ 
            showClipError(`${actorName}@${domain} ${t('registeredText')}`)
            closeTip()
            return
        }
    
        //重新设置登录信息
        window.daismDaoapi.Domain.recordInfo(actorName,domain).then(re => {
            // dispatch(setActor({...actor,domain,actor_name:actorName,actor_account:`${actorName}@${domain}`,actor_url:`https://${domain}/api/activitepub/users/${actorName}`}))
            closeTip()
            dispatch(setUser({...user,connected:0,account:'',chainId:0}))
            dispatch(setLoginsiwe(false))
            
            if(re && actor?.actor_account){ //重新注册，恢复资料
                setTimeout(() => {
                    fetch(`/api/admin/recover`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ actorName:`0x${actorName}`,domain,oldAccount:actor.actor_account,sctype:'',daoid:0})
                    })
                    .then(async response => {console.info('recover ok') })
            }, 3000);

            }
        }, err => {
            console.error(err); closeTip();
            showClipError(tc('errorText') + (err.message ? err.message : err));
        });
    
    }

    return(
        <InputGroup className="mb-3" style={{maxWidth:"400px"}} >
            <Form.Control placeholder={t('nickName')} ref={nameRef} />
            <InputGroup.Text  >{`@${domain}`}</InputGroup.Text>
            <Button variant="outline-secondary" onClick={register}   ><UploadSvg size={24} /> {t('registerText')} </Button>
       </InputGroup>
    );
}




