import { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import DaismInputGroup from '../../form/DaismInputGroup';
import { useRef } from 'react';
import { SendSvg,BackSvg } from '../../../lib/jssvg/SvgCollection';
import DateTimeItem from '../../form/DateTimeItem';
import { useDispatch } from 'react-redux';
import { setTipText, setMessageText } from '../../../data/valueData';
import RichEditor from "../../enki3/RichEditor";
import Editor from "../form/Editor";
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';

// import TagShow from '../../enki3/TagShow';

/**
 * 社区嗯文编辑
 * @env 环境变量 
 * @daoData  个人所属的smart common 集合
 * @currentObj 嗯文对象，新增则无
 * @afterEditCall 嗯文修改后回调
 * @addCallBack 嗯文增加后回调
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @callBack 回退到主页处理
 */
//currentObj 有值表示修改
export default function EnkiCreateMessage({ env,daoData, currentObj,afterEditCall, addCallBack,accountAr,callBack}) {

    const [typeIndex,setTypeIndex]=useState(currentObj?.type_index?currentObj.type_index:0)
    const [showEvent, setShowEvent] = useState(false) //是否活动发文
    const [selectedDaoid, setSelectedDaoid] = useState(""); //智能公器选择值
    const [errorSelect, setErrorSelect] = useState(false); //选择帐号错误
    const [loginDomain, setLoginDomain] = useState(""); //需要登录的域名
    const t = useTranslations('ff')
    const tc = useTranslations('Common')
    const actor = useSelector((state) => state.valueData.actor)
    const dispatch = useDispatch();
    function showTip(str) { dispatch(setTipText(str)) }
    function closeTip() { dispatch(setTipText('')) }
    function showClipError(str) { dispatch(setMessageText(str)) }
    const nums=500;
    const richEditorRef = useRef(); //标题
    const editorRef = useRef();

    const discussionRef = useRef();
    const sendRef = useRef();
    const startDateRef = useRef()
    const endDateRef = useRef()
    const urlRef = useRef()
    const addressRef = useRef()
    const timeRef = useRef()
    const selectRef = useRef()
    const titleRef=useRef();

    useEffect(() => { //为select 设默认值 
        if(Array.isArray(daoData)){
            let selectDao = daoData.find(obj => obj.domain === env.domain);
            if (selectDao) setSelectedDaoid(selectDao.dao_id);
        }

    }, [daoData])

  


    //是活动，打开活动面版
    useEffect(() => { if (currentObj && currentObj.start_time) setShowEvent(true); }, [currentObj])
        const getHTML=()=>{
            if(typeIndex===0){
                const contentText = editorRef.current.getData();
                if (!contentText || contentText.length < 10) {
                    showClipError(t('contenValidText'));
                    return '';
                }
                if (contentText.length >nums) {
                       showClipError(t('wordNotLess',{nums}));
                       return '';
                }
          
                let temp=contentText.replaceAll('\n','</p><p>')
                return `<p>${temp}</p>`;
            } else {
                const contentHTML =richEditorRef.current.getData();
    
                if (!contentHTML || contentHTML.length < 10) {
                    showClipError(t('contenValidText'));
                    return '';
                }
                return contentHTML;
            }
        }
    const submit = async () => {
        if(!currentObj?.id) {
            if (errorSelect) return showClipError(t('loginDomainText', { domain: loginDomain }));
            if (!selectedDaoid) return showClipError(t('notSelect'))
        }
        const contentHTML = getHTML();
        if(!contentHTML) return;
      

        let eventUrl = ''
        if (showEvent) {  //活动发文 网页url检测
            eventUrl = urlRef.current.getData()
            if (eventUrl && !/^((https|http)?:\/\/)[^\s]+/.test(eventUrl)) {
                urlRef.current.notValid(t('uriValidText'))
                return
            }
        }


        showTip(t('submittingText'))

        const formData = new FormData();
        if(currentObj?.id){  //修改
            formData.append('id', currentObj.id);
            formData.append('account', currentObj.actor_account); //社交帐号
            formData.append('actorName', currentObj?.actor_name);

        } else { //新增
            formData.append('id', 0);
            const selectDao=daoData.find((obj)=>{return obj.dao_id===parseInt(selectedDaoid)});
            formData.append('account', selectDao.actor_account); //社交帐号
            formData.append('actorName', selectDao?.dao_name);
        }
      

        if (showEvent) { //活动参数
            formData.append('startTime', startDateRef.current.getData());
            formData.append('endTime', endDateRef.current.getData());
            formData.append('eventUrl', eventUrl);
            formData.append('eventAddress', addressRef.current.getData());
            formData.append('time_event', timeRef.current.getData());
        }
        formData.append('textContent', typeIndex===0?contentHTML:richEditorRef.current.getTextContent());  //文本非enki 推送
        formData.append('typeIndex', typeIndex);  //长或短
        formData.append('vedioURL',(typeIndex===0?editorRef:richEditorRef).current.getVedioUrl());  //视频网址
        formData.append('propertyIndex',(typeIndex===0?editorRef:richEditorRef).current.getProperty());  //
        formData.append('accountAt',(typeIndex===0?editorRef:richEditorRef).current.getAccount());  //@用户
        formData.append('actorid', actor?.id);
        
        formData.append('daoid', selectedDaoid);
        formData.append('_type', showEvent ? 1 : 0);  //活动还是普通 
        formData.append('title', titleRef.current.getData());  //标题
        formData.append('content', contentHTML); //，内容
        formData.append('image',(typeIndex===0?editorRef:richEditorRef).current.getImg()); //图片
        formData.append('fileType',(typeIndex===0?editorRef:richEditorRef).current.getFileType()); //后缀名
        formData.append('isSend', sendRef.current.checked ? 1 : 0);
        formData.append('isDiscussion', discussionRef.current.checked ? 1 : 0);
        // formData.append('tags',JSON.stringify(inputRef.current.getData()));

        fetch(`/api/admin/addMessage`, {
            method: 'POST',
            headers: { encType: 'multipart/form-data' },
            body: formData
        })
            .then(async response => {
                closeTip()
                let re = await response.json()
                if (re.errMsg) { showClipError(re.errMsg); return }
                if (currentObj) afterEditCall.call(this,{...currentObj,...re}); //修改回调
                else if(typeof addCallBack === 'function') addCallBack.call();  //新增回调
            })
            .catch(error => {
                closeTip()
                showClipError(`${tc('dataHandleErrorText')}!${error}`)

            });
    }

    const handleSelectChange = (event) => {
        setSelectedDaoid(event.target.value);
        let _account = selectRef.current.options[selectRef.current.selectedIndex].text;
        const [, accounDomain] = _account?.split('@');
        if (accounDomain != env.domain) {
            setErrorSelect(true);
            setLoginDomain(accounDomain);
        }
        else {
            setErrorSelect(false);
            setLoginDomain('');
        }

    };

    return (
        <div style={{padding:'20px'}} >
          <InputGroup className="mb-3">
                    <InputGroup.Text>{t('publishCompany')}:</InputGroup.Text>
                    {currentObj?.id ?<Form.Control readOnly={true} disabled={true} defaultValue={currentObj.actor_account} />
                    :<Form.Select ref={selectRef} value={selectedDaoid} onChange={handleSelectChange}
                        isInvalid={errorSelect ? true : false} onFocus={e => { setErrorSelect(false) }}>
                        <option value=''>{t('selectText')}</option>
                        {daoData.map((option) => (
                            <option key={option.dao_id} value={option.dao_id}>
                                {option.actor_account}
                            </option>
                        ))}
                    </Form.Select>}
                    <Form.Control.Feedback type="invalid">
                        {t('loginDomainText', { domain: loginDomain })}
                    </Form.Control.Feedback>
            </InputGroup>
                
            <Form>
              <Form.Check inline label={t('shortText')} name="group1" type='radio' defaultChecked={typeIndex===0} onClick={e=>
                  {if(e.target.checked) setTypeIndex(0)}}  id='inline-2' />
              <Form.Check inline label={t('longText')} name="group1" type='radio' defaultChecked={typeIndex===1} onClick={e=>
                  {if(e.target.checked) setTypeIndex(1)}}  id='inline-1' />
              <Form.Check inline label={t('isFixButton')} name="group1" type='radio' defaultChecked={typeIndex===2} onClick={e=>
                    {if(e.target.checked) setTypeIndex(2)}}  id='inline-3' />
          </Form>
          <DaismInputGroup horizontal={true} title={t('htmlTitleText')} ref={titleRef} defaultValue={currentObj ? currentObj.title : ''} />
      {typeIndex===0?<Editor  ref={editorRef} currentObj={currentObj} nums={nums} isSC={true} accountAr={accountAr} showProperty={true}/>
      :<RichEditor  ref={richEditorRef} currentObj={currentObj} isSC={true} accountAr={accountAr} isFix={typeIndex===2} />}
        
        <Form.Check className='mt-3' type="switch" checked={showEvent} onChange={e => { setShowEvent(!showEvent) }} id="ssdsd_swith1" label={t('eventArtice')} />
         {showEvent &&
             <Card className='mb-3'>
                 <Card.Body>
                     <Row>
                         <Col md><DateTimeItem defaultValue={currentObj ? currentObj.start_time : ''} title={t('startDateText')} ref={startDateRef} /></Col>
                         <Col md><DateTimeItem defaultValue={currentObj ? currentObj.end_time : ''} title={t('endDateText')} ref={endDateRef} /></Col>
                     </Row>
                     <Row>
                         <Col lg ><DaismInputGroup defaultValue={currentObj ? currentObj.event_url : ''} title={t('urlText')} ref={urlRef} horizontal={true} /></Col>
                         <Col lg><DaismInputGroup defaultValue={currentObj ? currentObj.event_address : ''} title={t('addressText')} ref={addressRef} horizontal={true} /></Col>
                     </Row>
                     <Timedevent ref={timeRef} t={t} currentObj={currentObj} />
                 </Card.Body>
             </Card>
         }
   {/* <TagShow ref={inputRef} cid={currentObj?.id} type='sc' t={t} /> */}
          <div className="form-check form-switch  mt-3">
              <input  ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?(currentObj.is_discussion===1?true:false):true} />
              <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
          </div>
          <div className="form-check form-switch mb-3 mt-3">
              <input disabled={true} ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?(currentObj.is_send===1?true:false):true} />
              <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
          </div>
       
    
          <div style={{textAlign:'center'}} >
              <Button  onClick={callBack}  variant="light"> <BackSvg size={24} />  {t('esctext')} </Button> {' '}
              <Button onClick={submit} variant="primary"> <SendSvg size={24} /> {t('submitText')}</Button>
          </div>
    
    </div>

      
    );
}

//定时活动
const Timedevent = forwardRef((props, ref) => {
    const [onLine, setOnLine] = useState(false) //开启定时事
    const [vstyle, setVtyle] = useState({}) //开启定时事

    useEffect(() => {
        if (props.currentObj && props.currentObj.time_event > -1) {
            setOnLine(true)
            document.getElementById(`inlineRadio${props.currentObj.time_event}`).checked = true
        } else {
            document.getElementById(`inlineRadio7`).checked = true
        }
    }, [props.currentObj])

    useEffect(() => {
        setVtyle(onLine ? {} : { display: 'none' })
    }, [onLine, setVtyle])
    let t = props.t

    const getData = () => {
        if (!onLine) return -1
        for (var i = 1; i <= 7; i++) {
            if (document.getElementById(`inlineRadio${i}`).checked) break
        }
        return i > 7 ? 7 : i;
    }

    useImperativeHandle(ref, () => ({getData: getData}));

    const handleChange = () => {setOnLine(!onLine)}

    return (
        <>
            <div className="form-check form-switch ">
                <input className="form-check-input" type="checkbox" id="onLineBox" checked={onLine} onChange={handleChange} />
                <label className="form-check-label" htmlFor="onLineBox">{t('timeText')}</label>
            </div>
            <div style={vstyle} >
                {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
                    <div key={idx} className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name='inlineRadioOptions' id={`inlineRadio${idx}`} value={idx} />
                        <label className="form-check-label" htmlFor={`inlineRadio${idx}`}> {t('weekText').split(',')[idx - 1]}</label>
                    </div>
                ))
                }
            </div>
            <br />
        </>
    );
});
