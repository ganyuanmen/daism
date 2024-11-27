


// import Card from "react-bootstrap/Card";
import EnkiMemberItem from "../../../components/enki2/form/EnkiMemberItem";
import {useDispatch} from 'react-redux';
import { setTipText, setMessageText } from '../../../data/valueData'

// const crypto = require('crypto');


export default function Contentdiv({env, locale, t,messageObj,actor,setCurrentObj,setActiveTab}) {
    
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    // const months=t('monthText').split(',')
    // const getMonth=()=>{
    //     let m=new Date(messageObj?.start_time)
    //     return months[m.getMonth()]
    // }
    // const getDay=()=>{
    //     let m=new Date(messageObj?.start_time)
    //     return m.getDate()
    // }

    // const bStyle={
    //     width:'80px',
    //     position:'absolute',
    //     top:'0',
    //     left:'0',
    //     borderRadius:'0.3rem',
    //     backgroundColor:'white'
    // }
    // const aStyle={
    //     overflow: 'hidden',
    //     whiteSpace: 'nowrap',
    //     textAlign:'center',
    //     textOverflow: 'ellipsis'
    // }
    
// const encrypt=(text)=>{
//     const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
//   }

  // const getDomain=()=>{
  //   let _account=(messageObj?.send_type==0?messageObj?.actor_account:messageObj?.receive_account);
  //   return _account.split('@')[1];
  // }

  // const geneType=()=>{
  //   if(messageObj?.send_type==1) return ''; //推送的都在message
  //   if(parseInt(messageObj?.dao_id)>0) return 'sc'; //sc 发表的
  //   return ''; // 默认在message
  // }
  const handle=()=>{
    setCurrentObj(messageObj);
    setActiveTab(2);
    // document.getElementById('daism_message').style.display='block';
    // setSs(1);
    history.pushState({ id: messageObj?.id }, `id:${messageObj?.id}`, `?id=${messageObj?.message_id}`);
  }
    return (
   

       <div style={{padding:'10px',borderBottom:'1px solid #D9D9E8'}}>
            
            <EnkiMemberItem messageObj={messageObj} t={t}  domain={env?.domain} isEdit={false} locale={locale} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />    {/* '不检测关注' 不修改不删除 */}
           
            <br/>
            <div className="daism-a" onClick={handle} >
                <div dangerouslySetInnerHTML={{__html:messageObj?.content}}></div>
           </div>
        </div>

    );
}
