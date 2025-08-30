"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Modal, Tabs, Tab, Accordion } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch, setTipText, setErrText, setActor } from '@/store/store';
import DaismImg ,{type DaismImgHandle} from '@/components/form/DaismImg';
import { EditSvg, UploadSvg } from '@/lib/jssvg/SvgCollection';
import EnkiMember from './EnkiMember';
import dynamic from 'next/dynamic';
import DaoItem from '../../federation/DaoItem';
import { useFollow, useTip } from '@/hooks/useMessageData';
import MyFollow from './MyFollow';
import FollowMe from './FollowMe';
import EnKiRigester from './EnKiRigester';
import { useTranslations } from 'next-intl';
import TipToMe from '../../enki3/TipToMe';
import ShowLogin,{type ShowLoginRef} from '../../enki3/ShowLogin';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

interface ActorMemberProps {
  notice: number;
}



export default function ActorMember({ notice }: ActorMemberProps) {

  const user = useSelector((state: RootState) => state.valueData.user) as DaismUserInfo;
  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor) || [];

  const tc = useTranslations('Common');
  const t = useTranslations('ff');

  const [content, setContent] = useState(actor?.actor_desc ?? '');
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [register, setRegister] = useState(false);

  // const imgRef = useRef<{ getFile: () => File | null; getFileType: () => string }>(null);
  const imgRef = useRef<DaismImgHandle>(null);

  const loginRef=useRef<ShowLoginRef>(null);


  const follow0 = useFollow(actor?.actor_account, 'getFollow0');
  const follow1 = useFollow(actor?.actor_account, 'getFollow1');
  const tipToMe = useTip(actor?.manager, 'getTipToMe');
  const tipFrom = useTip(actor?.manager, 'getTipFrom');

  const dispatch = useDispatch<AppDispatch>();
  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));
  const showClipError = (str: string) => dispatch(setErrText(str));

  useEffect(() => {
    if (actor?.actor_account) {
      const [enkiName, domain] = actor.actor_account.split('@');
      setUrl(`https://${domain}/${enkiName}`);
    }
  }, [actor]);

  const handleSubmit = async () => {
    if(!loginRef.current?.checkLogin()) return;

    showTip(t('submittingText'));

    const formData = new FormData();
    formData.append('account', actor?.actor_account ?? '');
    formData.append('actorDesc', content);
    formData.append('image', imgRef.current?.getFile() ?? new File([], ''));
    formData.append('fileType', imgRef.current?.getFileType() ?? '');
    formData.append('did', actor?.manager ?? '');

    try {
      const response = await fetch(`/api/admin/updateactor`, {
        method: 'POST',
        headers: { encType: 'multipart/form-data' },
        body: formData
      });
      closeTip();
      const re = await response.json();
      if (re.errMsg) {
        showClipError(re.errMsg);
        return;
      }
      dispatch(setActor(re));
      window.sessionStorage.setItem('actor', JSON.stringify(re));
      dispatch(setErrText('saveprimarysText'));
      setShow(false);
    } catch (error: any) {
      closeTip();
      showClipError(`${tc('dataHandleErrorText')}!${error}`);
    }
  };

  return (
    <>
      <Card className="daism-title mt-2">
        <Card.Header>
          {t('myAccount')}{' '}
          <Link className="daism-a" href={url}>
            {url}
          </Link>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-auto me-auto">
              <EnkiMember url={actor?.actor_url}  account={actor?.actor_account} avatar={actor?.avatar} manager={actor?.manager} />
            </div>
            <div className="col-auto">
              {actor &&
                actor.manager.toLowerCase() === user.account.toLowerCase() && (
                  <>
                    {actor.actor_account.includes('@') &&
                      process.env.NEXT_PUBLIC_DOMAIN !== actor.actor_account.split('@')[1] && (
                        <Button onClick={() => setRegister(true)}>
                          <UploadSvg size={18} /> {t('reRegisterText')}
                        </Button>
                      )}{' '}
                    <Button onClick={() => setShow(true)}>
                      <EditSvg size={18} /> {t('editText')}
                    </Button>
                  </>
                )}
            </div>
          </div>
          <hr />
          <div>
            <div className="mb-2">
              <b>{t('persionInfomation')}</b>
            </div>
            <div dangerouslySetInnerHTML={{ __html: actor?.actor_desc ?? '' }} />
          </div>
          <hr />

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <b>{t('daoGroupText')}:</b>
                {!daoActor.length && <span style={{ display: 'inline-block', paddingLeft: '16px' }}>{t('noSmartCommon')}</span>}
              </Accordion.Header>
              <Accordion.Body>
                {daoActor.map((obj: any) => (
                  <DaoItem key={obj.dao_id} record={obj} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {actor?.actor_account && (
            <Tabs defaultActiveKey={notice > 0 ? 'tipToMe' : 'follow0'} className="mb-3 mt-3">
              {follow0.status==='succeeded' && <Tab eventKey="follow0" title={t('followingText', { num: follow0.data.length })}>
                <div>{ follow0.data.map((obj: ActorInfo) => <MyFollow key={obj.id} isEdit={true} followObj={obj} />)}</div>
              </Tab>
              }
              {follow1.status==='succeeded' && <Tab eventKey="follow1" title={t('followedText', { num: follow1.data.length })}>
                <div>{follow1.data.map((obj: ActorInfo) => <FollowMe key={obj.id}  followObj={obj} />)}</div>
              </Tab>
              }
              {tipToMe.status==='succeeded' && <Tab eventKey="tipToMe" title={t('tipToMe', { num: tipToMe.data.length })}>
                <div>{tipToMe.data.map((obj: DaismTipType) => <TipToMe key={obj.id}  tipObj={obj} />)}</div>
              </Tab>
              }
              {tipFrom.status==='succeeded' && <Tab eventKey="tipFrom" title={t('tipFrom', { num: tipFrom.data.length })}>
                <div>{tipFrom.data.map((obj: DaismTipType) => <TipToMe key={obj.id} tipObj={obj} />)}</div>
              </Tab>
             }
            </Tabs>
          )}
        </Card.Body>
      </Card>

      <Modal className="daism-title" size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>{t('myAccount')}</Modal.Header>
        <Modal.Body>
          <div className="mb-2" style={{ paddingLeft: '10px' }}>
            {t('nickNameText')} : <strong>{actor?.actor_account}</strong>
          </div>

          <DaismImg
          ref={imgRef}
          title={t('uploadImgText')}
          defaultValue={actor?.avatar}
          maxSize={1024 * 500}
          fileTypes={['svg','jpg','jpeg','png','gif','webp']}
        />

          <RichTextEditor title={t('persionInfomation')} content={content} setContent={setContent} />

          <div style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={handleSubmit}>
              {t('saveText')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal className="daism-title" size="lg" show={register} onHide={() => setRegister(false)}>
        <Modal.Header closeButton>{t('reRegisterText')}</Modal.Header>
        <Modal.Body>
          <EnKiRigester setRegister={setRegister}  />
        </Modal.Body>
      </Modal>

      <ShowLogin ref={loginRef} />
    </>
  );
}
