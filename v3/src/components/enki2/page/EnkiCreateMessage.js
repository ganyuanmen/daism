import { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import DaismImg from '../../form/DaismImg';
import DaismInputGroup from '../../form/DaismInputGroup';
import { useRef } from 'react';
import { SendSvg } from '../../../lib/jssvg/SvgCollection';
import DateTimeItem from '../../form/DateTimeItem';
import { useDispatch } from 'react-redux';
import { setTipText, setMessageText } from '../../../data/valueData';
import dynamic from 'next/dynamic';
// import {transformHTML} from '../../../lib/utils';

const RichTextEditor = dynamic(() => import('../../RichTextEditor'), { ssr: false });

//currentObj 有值表示修改
export default function EnkiCreateMessage({ t, tc,env, actor, daoData, currentObj,afterEditCall, addCallBack,fetchWhere,setFetchWhere}) {

    const [showEvent, setShowEvent] = useState(false) //是否活动发文
    const [selectedDaoid, setSelectedDaoid] = useState(""); //智能公器选择值
    const [errorSelect, setErrorSelect] = useState(false); //选择帐号错误
    const [loginDomain, setLoginDomain] = useState(""); //需要登录的域名

    const dispatch = useDispatch();
    function showTip(str) { dispatch(setTipText(str)) }
    function closeTip() { dispatch(setTipText('')) }
    function showClipError(str) { dispatch(setMessageText(str)) }

    const titleRef = useRef(); //标题
    const editorRef = useRef();
    const imgstrRef = useRef();
    const discussionRef = useRef();
    const sendRef = useRef();
    const startDateRef = useRef()
    const endDateRef = useRef()
    const urlRef = useRef()
    const addressRef = useRef()
    const timeRef = useRef()
    const selectRef = useRef()

    useEffect(() => { //为select 设默认值 
        if(Array.isArray(daoData)){
            let selectDao = daoData.filter(obj => obj.domain === env.domain);
            if (selectDao.length > 0) setSelectedDaoid(selectDao[0].dao_id);
        }

    }, [daoData])

    const transformHTML=(html)=> {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let result = '';
        const allNodes = doc.body.childNodes;  
        allNodes.forEach(node => {
          if(node.textContent.trim())  result += `<p>${node.textContent.trim()}</p>`;
        });
      
        return result;
    }


    //是活动，打开活动面版
    useEffect(() => { if (currentObj && currentObj.start_time) setShowEvent(true); }, [currentObj])

    const submit = async () => {
        if(!currentObj?.id) {
            if (errorSelect) return showClipError(t('loginDomainText', { domain: loginDomain }));
            if (!selectedDaoid) return showClipError('没有选择发布的社区！')
        }

        const titleText = titleRef.current.getData()
        if (!titleText || titleText.length > 256) {
            titleRef.current.notValid(t('titleValidText'))
            return
        }
        const contentText = editorRef.current.value
        if (!contentText || contentText.length < 10) {
            showClipError(t('contenValidText'))
            return
        }

        let eventUrl = ''
        if (showEvent) {  //活动发文 网页url检测
            eventUrl = urlRef.current.getData()
            if (eventUrl && !/^((https|http)?:\/\/)[^\s]+/.test(eventUrl)) {
                urlRef.current.notValid(t('uriValidText'))
                return
            }
        }

        const elements5 = document.querySelectorAll('.jodit-wysiwyg');
        let words =transformHTML(elements5[0].innerHTML); 

        showTip(t('submittingText'))

        const formData = new FormData();
        if(currentObj?.id){  //修改
            formData.append('id', currentObj.id);

        } else { //新增
            formData.append('id', 0);
            let selectDao = daoData.filter(obj => obj.dao_id === parseInt(selectedDaoid))[0]
            formData.append('account', selectDao.actor_account); //社交帐号
        }
      

        if (showEvent) { //活动参数
            formData.append('startTime', startDateRef.current.getData());
            formData.append('endTime', endDateRef.current.getData());
            formData.append('eventUrl', eventUrl);
            formData.append('eventAddress', addressRef.current.getData());
            formData.append('time_event', timeRef.current.getData());
        }
        formData.append('textContent', words);  //推送非enki 站点
        formData.append('actorid', actor.id);
        formData.append('daoid', selectedDaoid);
        formData.append('_type', showEvent ? 1 : 0);  //活动还是普通 
        formData.append('title', titleText);  //标题
        formData.append('content', contentText); //，内容
        formData.append('image', imgstrRef.current.getFile()); //图片
        formData.append('fileType', imgstrRef.current.getFileType()); //后缀名
        formData.append('isSend', sendRef.current.checked ? 1 : 0);
        formData.append('isDiscussion', discussionRef.current.checked ? 1 : 0);

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
                else addCallBack.call();  //新增回调
            })
            .catch(error => {
                closeTip()
                showClipError(`${tc('dataHandleErrorText')}!${error}`)

            });
    }

    const handleSelectChange = (event) => {
        setSelectedDaoid(event.target.value);
        let _account = selectRef.current.options[selectRef.current.selectedIndex].text;
        const [name, accounDomain] = _account.split('@');
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
        <Card className='mb-3 mt-3' >
            <Card.Body>
                <DaismImg title={t('selectTopImg')} defaultValue={currentObj ? currentObj.top_img : ''} ref={imgstrRef} maxSize={1024 * 500} fileTypes='svg,jpg,jpeg,png,gif,webp' />
             
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
                

                <DaismInputGroup title={t('titileText')} defaultValue={currentObj ? currentObj.title : ''} ref={titleRef} horizontal={true} />
                <RichTextEditor defaultValue={currentObj ? currentObj.content : ''} title={t('contenText')} editorRef={editorRef} />
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

                <div className="form-check form-switch  mt-3">
                    <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj ? (currentObj.is_discussion === 1 ? true : false) : true} />
                    <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
                </div>
                <div className="form-check form-switch mb-3 mt-3">
                    <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj ? (currentObj.is_send === 1 ? true : false) : true} />
                    <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
                </div>

            </Card.Body>
            <Card.Footer className='d-flex justify-content-center'  >
                <div>
                    <Button onClick={() => { addCallBack() }} variant="light">  {t('esctext')} </Button> {' '}
                    <Button onClick={submit} variant="primary"> <SendSvg size={16} /> {t('submitText')}</Button>
                </div>
            </Card.Footer>
        </Card>
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
