import { useState,useEffect,useRef,forwardRef,useImperativeHandle,lazy, Suspense  } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import ShowErrorBar from '../../../../components/ShowErrorBar';
import {setTipText,setMessageText} from '../../../../data/valueData'
import DaismImg from '../../../../components/form/DaismImg';
import DaismInputGroup from '../../../../components/form/DaismInputGroup';
import { useRouter } from 'next/navigation'
import { Button,Card,Form,InputGroup,DropdownButton,Dropdown } from 'react-bootstrap';
import Breadcrumb from '../../../../components/Breadcrumb';
import Editor from '../../../../components/form/Editor';
import MemberItem from '../../../../components/federation/MemberItem'
import ErrorBar from '../../../../components/form/ErrorBar';
import { SendSvg } from '../../../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import PageLayout from '../../../../components/PageLayout';
import { getJsonArray } from '../../../../lib/mysql/common';


const DateTimeItem = lazy(() => import('../../../../components/form/DateTimeItem'));

export default function NewPage({daoData,members}) {
  const user = useSelector((state) => state.valueData.user)
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
  let tc = useTranslations('Common')
  let t = useTranslations('ff')
  return (
    <PageLayout>
     {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />
     :!loginsiwe?<Wecome />
     :daoData.dao_id?<NewMain daoData={daoData} members={members} user={user} t={t} tc={tc} />
     :<ShowErrorBar  errStr={t('noDaoMemberText')} />
     }  
    </PageLayout>
  );

}

function NewMain({daoData,members,user,t,tc}) {
  const imgstrRef=useRef(null) //头部图片
  const startDateRef=useRef(null) //开始时间
  const endDateRef=useRef(null);//结束时间
  const participateRef=useRef(null) //默认匿名参与
  const sendRef = useRef(null);  //允许推送
  const discussionRef=useRef(null) //允许评论
  const originalRef=useRef(null) //组织者
  const editorRef=useRef(null) //活动描述
  const titleRef=useRef(null)  //标题
  const numbersRef=useRef(null) //人数
  const addressRef=useRef(null)  //活动地址
  const urlRef=useRef(null)  //网站地址
  const timeRef=useRef(null)  //定时任务
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const router = useRouter()

  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  function showClipError(str){dispatch(setMessageText(str))}

  async function submit()
  { 
    let titleText=titleRef.current.getData()
    if (!titleText || titleText.length > 256) {
      titleRef.current.notValid(t('titleValidText'))
      return
    }
    let eventUrl=urlRef.current.getData()
    if(eventUrl && !/^((https|http)?:\/\/)[^\s]+/.test(eventUrl)){
        urlRef.current.notValid(t('uriValidText'))
        return
    }
    let numbers=parseInt(numbersRef.current.getData())
    if(numbers.toString() === "NaN" || numbers<0)
    {
        numbersRef.current.notValid(t('numbersValid'))
        return
    }
    let textValue=editorRef.current.getData()
    if(!textValue)
    {
        showClipError(t('eventsContenNoEmpty'))
        return
    }
    showTip(t('submittingText'))  
    const formData = new FormData();
    formData.append('title', titleText);
    formData.append('content', textValue);
    formData.append('daoid',daoData.dao_id);
    formData.append('image', imgstrRef.current.getFile());
    formData.append('fileType',imgstrRef.current.getFileType());
    formData.append('did',user.account);
    formData.append('contentText',editorRef.current.getText());
    formData.append('isSend',sendRef.current.checked?1:0);
    formData.append('isDiscussion',discussionRef.current.checked?1:0);
    formData.append('startTime',startDateRef.current.getData());
    formData.append('endTime',endDateRef.current.getData());
    formData.append('original',originalRef.current.getData());
    formData.append('numbers',numbers);
    formData.append('participate',participateRef.current.checked?0:1);
    formData.append('eventUrl',eventUrl);
    formData.append('address',addressRef.current.getData());
    formData.append('time_event',timeRef.current.getData());

    fetch(`/api/admin/addevents`, {
      method: 'POST',
      headers:{encType:'multipart/form-data'},
      body: formData
    })
  .then(async response => {
    closeTip()
    let re=await response.json()
    if(re.errMsg) { showClipError(re.errMsg); return }
    router.push(`/info/events/message/${re.id}`, { scroll: false }) 
  })
  .catch(error => {
    closeTip()
    showClipError(`${tc('dataHandleErrorText')}!${error}`)
   
  });   
  }


  const menu=[
    {url:`/info/visit/${daoData.dao_id}`,title:daoData.dao_name},
    {url:`/info/events/list/${daoData.dao_id}`,title:'events'}
]

  return (
      <>
          <Breadcrumb menu={menu} currentPage='Create' />
          <Card>
              <Card.Body>
              <h1>{t('createEventsText')}</h1><br/>
              <DaismImg title={t('selectTopImg')} ref={imgstrRef}  maxSize={1024*1024} fileTypes='svg,jpg,jpeg,png,gif,webp' />
              <DaismInputGroup title={t('titileText')}   ref={titleRef} horizontal={true} width={90} />
              
              <div className='row' >
                  <div className='col' >
                      <Suspense fallback={<div>Loading...</div>}>
                      <DateTimeItem  title={t('startDateText')} ref={startDateRef} />
                      </Suspense>
                  </div>
                  <div className='col' >
                      <NumbersItem  ref={numbersRef} />
                  </div>
              </div>
              <div className='row' >
                  <div className='col' >
                      <Suspense fallback={<div>Loading...</div>}>
                        <DateTimeItem title={t('endDateText')}  ref={endDateRef} />
                      </Suspense>
                  </div>
                  <div className='col' >
                      <DaismInputGroup title={t('urlText')} ref={urlRef} horizontal={true} />
                  </div>
              </div>

              <OriginalItem  ref={originalRef}  members={members} user={user} />
              <EventAdrdessItem  ref={addressRef} />
              <Timedevent ref={timeRef} />
              <Editor title={t('eventsDescText')} ref={editorRef}  ></Editor><br/>
              <div className="form-check form-switch mb-3">
                  <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={true} />
                  <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
              </div>
              <div className="form-check form-switch mb-3">
                  <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={true} />
                  <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
              </div>
              <div className="input-group mb-3">
                  <Form.Check ref={participateRef} id='participate1' type="radio" label={t('anonymousInvit')} inline name="participate-radioGroup"  defaultChecked={true} />
                  <Form.Check id='participate2' type="radio" label={t('managerApproveText')} inline name="participate-radioGroup" />
              </div> 
              <Button  onClick={submit}  variant="primary"> <SendSvg size={16} /> {t('createEventsText')}</Button>
              </Card.Body>
      </Card>
     </>
  );
}


const NumbersItem = forwardRef((props, ref) => {
    const [upperLimit, setUpperLimit] = useState(true); 
    const [showError,setShowError]=useState(false)
    const [invalidText,setInvalidText]=useState('')
    const inputRef=useRef()
    let t = useTranslations('ff')

    const getData = () => {
      return upperLimit?0:inputRef.current.value;
    };
    
    const notValid = (errorText) => {
        setShowError(true)
        setInvalidText(errorText)
     };

    useImperativeHandle(ref, () => ({
      getData: getData,
      notValid:notValid
    }));

    const handleChange=()=>{
        setUpperLimit(!upperLimit)
        inputRef.current.value='0'
    }
  
    return (
        <div className="input-group mb-3">
            <span className="input-group-text">{t('upperLimitText')}</span>
            <input ref={inputRef} type="text" style={{border:showError?'1px solid red':void 0,minWidth:'30px'}}  disabled={upperLimit}  onFocus={() => { setShowError(false);}}  className="form-control"    />
            <span className="input-group-text">
                <Form.Check type="switch"  id="limit-switch" label={t('noUpperText')} checked={upperLimit} onChange={handleChange} />
            </span>
            <ErrorBar show={showError} target={inputRef} placement='bottom' invalidText={invalidText} ></ErrorBar>
        </div>
    );
});


const OriginalItem = forwardRef((props, ref) => {
    const [originalSelect, setOriginalSelect] = useState(''); //组织者显示
    const didRef=useRef()
    let t = useTranslations('ff')
    const memberRef=useRef(props.members)
    const accountRef=useRef(props.user.account)
    const defaultRef=useRef(props.defaultValue)
   
    useEffect(()=>{
        let account=defaultRef.current?defaultRef.current:accountRef.current
        let data=memberRef.current.find((obj)=>{return obj.member_address.toLowerCase()===account.toLowerCase()})
         setOriginalSelect(data?data:memberRef.current[0])
         didRef.current.setAttribute('did',data?data.member_address:memberRef.current[0].member_address)
    },[])

    const getData = () => {
      return didRef.current.getAttribute('did')
    };
  
    useImperativeHandle(ref, () => ({
      getData: getData
    }));

    const handleOriginal=(eventKey)=>{
        didRef.current.setAttribute('did',eventKey)
        setOriginalSelect(props.members.find((obj)=>{return obj.member_address===eventKey}))
     }
  
    return (
        <InputGroup className="mb-3">
            <span className="input-group-text">{t('groupsManager')}</span>
            <div className="form-control" ref={didRef} did='' >
                {originalSelect && <MemberItem  record={originalSelect} noLink={true}  ></MemberItem>} 
            </div>
            <DropdownButton variant="outline-secondary" title={t('selectText')} onSelect={handleOriginal}   align="end">
                {props.members.map((obj,idx)=>(
                    <Dropdown.Item key={idx} eventKey={obj.member_address} href="#">
                        <MemberItem  record={obj} noLink={true} ></MemberItem>
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </InputGroup>
    );
});

const EventAdrdessItem = forwardRef((props, ref) => {
    const [onLine,setOnLine]=useState(true) //完全线上活动
    const inputRef=useRef()
    let t = useTranslations('ff')

    const getData = () => {
      return onLine?'':inputRef.current.value;
    };
  
    useImperativeHandle(ref, () => ({
      getData: getData
    }));

    const handleChange=()=>{
        setOnLine(!onLine)
        inputRef.current.value=''
    }
  
    return (
        <>
            <div className="form-check form-switch ">
                <input className="form-check-input" type="checkbox" id="onLineBox" checked={onLine} onChange={handleChange}/>
                <label className="form-check-label" htmlFor="onLineBox">{t('onLineText')}</label>
            </div>     
            <div className="input-group mb-3">
                <span className="input-group-text">{t('addressText')}</span>
                <input ref={inputRef} type="text"  disabled={onLine} defaultValue={props.defaultValue}  className="form-control" />
            </div> 
      </>
    );
});

//定时活动
const Timedevent = forwardRef((props, ref) => {
  const [onLine,setOnLine]=useState(true) //开启定时事
  const [vstyle,setVtyle]=useState({}) //开启定时事

  useEffect(()=>{
    document.getElementById(`inlineRadio7`).checked=true
  },[])
  
  useEffect(()=>{
    setVtyle(onLine?{}:{display:'none'})
  },[onLine,setVtyle])
  let t = useTranslations('ff')

  const getData = () => {
    if(!onLine) return -1
    
    for(var i=1;i<=7;i++)
    {
      if(document.getElementById(`inlineRadio${i}`).checked) break
    }
    return i>7?7:i;
  }

  useImperativeHandle(ref, () => ({
    getData: getData
  }));

  const handleChange=()=>{
      setOnLine(!onLine)

  }
 


  return (
      <>
          <div className="form-check form-switch ">
              <input className="form-check-input" type="checkbox" id="onLineBox" checked={onLine} onChange={handleChange}/>
              <label className="form-check-label" htmlFor="onLineBox">{t('timeText')}</label>
          </div>     
          <div  style={vstyle} >
          {[1,2,3,4,5,6,7].map((idx)=>(
                   <div key={idx} className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name='inlineRadioOptions' id={`inlineRadio${idx}`} value={idx} />
                      <label className="form-check-label" htmlFor={`inlineRadio${idx}`}> {t('weekText').split(',')[idx-1]}</label>
                 </div>
                ))
          }

          </div> 
          <br/>
    </>
  );
});





export const getServerSideProps = async ({ req, res,locale,query }) => {
    return {
      props: {
        messages: {
          ...require(`../../../../messages/shared/${locale}.json`),
          ...require(`../../../../messages/federation/${locale}.json`)
        },
        daoData:await getJsonArray('daodata2',[query.id],true),
        members:await getJsonArray('daomember',[query.id])
      }
    }
  }

  
