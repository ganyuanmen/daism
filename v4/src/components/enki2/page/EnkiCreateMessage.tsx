import { useState, forwardRef, useEffect, useImperativeHandle, Ref } from 'react';
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import DaismInputGroup from '../../form/DaismInputGroup';
import { SendSvg, BackSvg } from '@/lib/jssvg/SvgCollection';
import DateTimeItem from '../../form/DateTimeItem';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch, setTipText, setMessageText } from '@/store/store';
import RichEditor, { type RichEditorRef } from "../../enki3/RichEditor";
import Editor, { type EditorRef } from "../form/Editor";
import { useTranslations } from 'next-intl';
import ShowLogin from '../../enki3/ShowLogin';

interface DaoDataItem {
    dao_id: number;
    domain: string;
    actor_account: string;
    dao_logo?: string;
    dao_name?: string;
}

interface Actor {
    actor_account: string;
    id: string | number;
}

interface CurrentObj {
    message_id?: string;
    type_index?: number;
    start_time?: string;
    actor_account?: string;
    actor_name?: string;
    avatar?: string;
    title?: string;
    is_discussion?: number;
    is_send?: number;
    event_url?: string;
    event_address?: string;
    time_event?: number;
}

interface EnkiCreateMessageProps {
    daoData: DaoDataItem[];
    currentObj?: CurrentObj;
    afterEditCall?: (obj: any) => void;
    addCallBack?: () => void;
    accountAr?: string[];
    callBack?: () => void;
}

export default function EnkiCreateMessage({
    daoData,
    currentObj,
    afterEditCall,
    addCallBack,
    accountAr,
    callBack
}: EnkiCreateMessageProps) {
    const [show, setShow] = useState(false);
    const [typeIndex, setTypeIndex] = useState(currentObj?.type_index ?? 0);
    const [showEvent, setShowEvent] = useState(false);
    const [selectedDaoid, setSelectedDaoid] = useState<string>("");
    const [errorSelect, setErrorSelect] = useState(false);
    const [loginDomain, setLoginDomain] = useState("");
    const t = useTranslations('ff');
    const tc = useTranslations('Common');
    const actor = useSelector((state: RootState) => state.valueData.actor) as Actor;
    const dispatch = useDispatch<AppDispatch>();

    const nums = 500;

    const richEditorRef = useRef<RichEditorRef>(null);
    const editorRef = useRef<EditorRef>(null);
    const discussionRef = useRef<HTMLInputElement>(null);
    const sendRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<{ getData: () => string }>(null);
    const endDateRef = useRef<{ getData: () => string }>(null);
    const urlRef = useRef<{ getData: () => string; notValid: (msg: string) => void }>(null);
    const addressRef = useRef<{ getData: () => string }>(null);
    const timeRef = useRef<{ getData: () => number }>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const titleRef = useRef<{ getData: () => string }>(null);

    const showTip = (str: string) => dispatch(setTipText(str));
    const closeTip = () => dispatch(setTipText(''));
    const showClipError = (str: string) => dispatch(setMessageText(str));

    useEffect(() => {
        if (Array.isArray(daoData)) {
            const selectDao = daoData.find(obj => obj.domain === process.env.NEXT_PUBLIC_DOMAIN);
            if (selectDao) setSelectedDaoid(selectDao.dao_id.toString());
        }
    }, [daoData]);

    useEffect(() => {
        if (currentObj && currentObj.start_time) setShowEvent(true);
    }, [currentObj]);

    const getHTML = (): string => {
        if (typeIndex === 0) {
            const contentText = editorRef.current?.getData() ?? '';
            if (!contentText || contentText.length < 10) {
                showClipError(t('contenValidText'));
                return '';
            }
            if (contentText.length > nums) {
                showClipError(t('wordNotLess', { nums }));
                return '';
            }
            return `<p>${contentText.replaceAll('\n', '</p><p>')}</p>`;
        } else {
            const contentHTML = richEditorRef.current?.getData() ?? '';
            if (!contentHTML || contentHTML.length < 10) {
                showClipError(t('contenValidText'));
                return '';
            }
            return contentHTML;
        }
    };

    const submit = async () => {
        const res = await fetch('/api/siwe/getLoginUser?t=' + new Date().getTime());
        const res_data = await res.json();
        if (res_data.state !== 1) {
            setShow(true);
            return;
        }
        if (!currentObj?.message_id) {
            if (errorSelect) return showClipError(t('loginDomainText', { domain: loginDomain }));
            if (!selectedDaoid) return showClipError(t('notSelect'));
        }

        const contentHTML = getHTML();
        if (!contentHTML) return;

        let eventUrl = '';
        if (showEvent) {
            eventUrl = urlRef.current?.getData() ?? '';
            if (eventUrl && !/^((https|http)?:\/\/)[^\s]+/.test(eventUrl)) {
                urlRef.current?.notValid(t('uriValidText'));
                return;
            }
        }

        showTip(t('submittingText'));
        const formData = new FormData();

        if (currentObj?.message_id) {
            formData.append('messageId', currentObj.message_id);
            formData.append('account', currentObj.actor_account!);
            formData.append('actorName', currentObj.actor_name!);
            formData.append('avatar', currentObj.avatar!);
        } else {
            const selectDao = daoData.find(obj => obj.dao_id === parseInt(selectedDaoid));
            formData.append('account', actor.actor_account);
            formData.append('avatar', selectDao?.dao_logo ?? '');
            formData.append('actorName', selectDao?.dao_name ?? '');
        }

        if (showEvent) {
            formData.append('startTime', startDateRef.current!.getData());
            formData.append('endTime', endDateRef.current!.getData());
            formData.append('eventUrl', eventUrl);
            formData.append('eventAddress', addressRef.current!.getData());
            formData.append('time_event', timeRef.current!.getData().toString());
        }

        const editor = typeIndex === 0 ? editorRef.current : richEditorRef.current;

        formData.append('textContent', typeIndex === 0 ? contentHTML : richEditorRef.current!.getTextContent());
        formData.append('typeIndex', typeIndex.toString());
        formData.append('vedioURL', editor!.getVedioUrl());
        formData.append('propertyIndex', editor!.getProperty());
        formData.append('accountAt', editor!.getAccount());
        formData.append('actorid', actor.id.toString());
        formData.append('daoid', selectedDaoid);
        formData.append('_type', showEvent ? '1' : '0');
        formData.append('title', titleRef.current!.getData());
        formData.append('content', contentHTML);
        formData.append('image', editor!.getImg());
        formData.append('fileType', editor!.getFileType());
        formData.append('isSend', sendRef.current!.checked ? '1' : '0');
        formData.append('isDiscussion', discussionRef.current!.checked ? '1' : '0');

        try {
            const response = await fetch('/api/admin/addMessage', {
                method: 'POST',
                headers: { encType: 'multipart/form-data' },
                body: formData
            });
            closeTip();
            const re = await response.json();
            if (re.errMsg) { showClipError(re.errMsg); return; }
            if (currentObj) afterEditCall?.({ ...currentObj, ...re });
            else addCallBack?.();
        } catch (error) {
            closeTip();
            showClipError(`${tc('dataHandleErrorText')}!${error}`);
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDaoid(event.target.value);
        const _account = selectRef.current?.options[selectRef.current.selectedIndex].text ?? '';
        const [, accounDomain] = _account.split('@');
        if (accounDomain !== process.env.NEXT_PUBLIC_DOMAIN) {
            setErrorSelect(true);
            setLoginDomain(accounDomain);
        } else {
            setErrorSelect(false);
            setLoginDomain('');
        }
    };

    return (
        <>
            <div style={{ padding: '20px' }}>
                <InputGroup className="mb-3">
                    <InputGroup.Text>{t('publishCompany')}:</InputGroup.Text>
                    {currentObj?.message_id ?
                        <Form.Control readOnly disabled defaultValue={currentObj.actor_account} /> :
                        <Form.Select ref={selectRef} value={selectedDaoid} onChange={handleSelectChange} isInvalid={errorSelect} onFocus={() => setErrorSelect(false)}>
                            <option value=''>{t('selectText')}</option>
                            {daoData.map(option => (
                                <option key={option.dao_id} value={option.dao_id.toString()}>{option.actor_account}</option>
                            ))}
                        </Form.Select>
                    }
                    <Form.Control.Feedback type="invalid">{t('loginDomainText', { domain: loginDomain })}</Form.Control.Feedback>
                </InputGroup>

                <Form>
                    <Form.Check inline label={t('shortText')} name="group1" type='radio' defaultChecked={typeIndex === 0} onClick={e => { if ((e.target as HTMLInputElement).checked) setTypeIndex(0) }} id='inline-2' />
                    <Form.Check inline label={t('longText')} name="group1" type='radio' defaultChecked={typeIndex === 1} onClick={e => { if ((e.target as HTMLInputElement).checked) setTypeIndex(1) }} id='inline-1' />
                </Form>

                <DaismInputGroup horizontal title={t('htmlTitleText')} ref={titleRef} defaultValue={currentObj?.title ?? ''} />
                {typeIndex === 0 ?
                    <Editor ref={editorRef} currentObj={currentObj} nums={nums} isSC accountAr={accountAr} showProperty /> :
                    <RichEditor ref={richEditorRef} currentObj={currentObj} isSC accountAr={accountAr} />
                }

                <Form.Check className='mt-3' type="switch" checked={showEvent} onChange={() => setShowEvent(!showEvent)} id="ssdsd_swith1" label={t('eventArtice')} />
                {showEvent &&
                    <Card className='mb-3'>
                        <Card.Body>
                            <Row>
                                <Col md><DateTimeItem defaultValue={currentObj?.start_time ?? ''} title={t('startDateText')} ref={startDateRef} /></Col>
                                <Col md><DateTimeItem defaultValue={currentObj?.end_time ?? ''} title={t('endDateText')} ref={endDateRef} /></Col>
                            </Row>
                            <Row>
                                <Col lg><DaismInputGroup defaultValue={currentObj?.event_url ?? ''} title={t('urlText')} ref={urlRef} horizontal /></Col>
                                <Col lg><DaismInputGroup defaultValue={currentObj?.event_address ?? ''} title={t('addressText')} ref={addressRef} horizontal /></Col>
                            </Row>
                            <Timedevent ref={timeRef} t={t} currentObj={currentObj} />
                        </Card.Body>
                    </Card>
                }

                <div className="form-check form-switch mt-3">
                    <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?.is_discussion === 1 ?? true} />
                    <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
                </div>
                <div className="form-check form-switch mb-3 mt-3">
                    <input disabled ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?.is_send === 1 ?? true} />
                    <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Button onClick={callBack} variant="light"><BackSvg size={24} /> {t('esctext')}</Button>{' '}
                    <Button onClick={submit} variant="primary"><SendSvg size={24} /> {t('submitText')}</Button>
                </div>
            </div>
            <ShowLogin show={show} setShow={setShow} />
        </>
    );
}

// 定时活动
interface TimedeventProps {
    t: (key: string) => string;
    currentObj?: CurrentObj;
}

export const Timedevent = forwardRef<{ getData: () => number }, TimedeventProps>((props, ref) => {
    const [onLine, setOnLine] = useState(false);
    const [vstyle, setVstyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (props.currentObj && props.currentObj.time_event !== undefined && props.currentObj.time_event > -1) {
            setOnLine(true);
            const ele = document.getElementById(`inlineRadio${props.currentObj.time_event}`) as HTMLInputElement;
            if (ele) ele.checked = true;
        } else {
            const ele = document.getElementById(`inlineRadio7`) as HTMLInputElement;
            if (ele) ele.checked = true;
        }
    }, [props.currentObj]);

    useEffect(() => { setVstyle(onLine ? {} : { display: 'none' }); }, [onLine]);

    const getData = (): number => {
        if (!onLine) return -1;
        for (let i = 1; i <= 7; i++) {
            const ele = document.getElementById(`inlineRadio${i}`) as HTMLInputElement;
            if (ele?.checked) return i;
        }
        return 7;
    };

    useImperativeHandle(ref, () => ({ getData }));

    const handleChange = () => setOnLine(!onLine);

    return (
        <>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="onLineBox" checked={onLine} onChange={handleChange} />
                <label className="form-check-label" htmlFor="onLineBox">{props.t('timeText')}</label>
            </div>
            <div style={vstyle}>
                {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
                    <div key={idx} className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name='inlineRadioOptions' id={`inlineRadio${idx}`} value={idx} />
                        <label className="form-check-label" htmlFor={`inlineRadio${idx}`}> {props.t('weekText').split(',')[idx - 1]}</label>
                    </div>
                ))}
            </div>
            <br />
        </>
    );
});
