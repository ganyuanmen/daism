import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import DaismImg,{type DaismImgHandle} from '@/components/form/DaismImg';
import Alert from 'react-bootstrap/Alert';
import { useDispatch } from 'react-redux';
import { setTipText, setErrText } from '@/store/store';
import { EditSvg } from '@/lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl';
import { getDaismContract } from '@/lib/globalStore';

interface LogoProProps {
  daoName: string;
  setChangeLogo: (show: boolean) => void;
  delegator: string;
  setMess: (show: boolean) => void;
}

export default function LogoPro({ daoName, setChangeLogo, delegator, setMess }: LogoProProps) {
  const t = useTranslations('dao');
  const tc = useTranslations('Common');

  let daismObj=getDaismContract();

  const dispatch = useDispatch();
  const showError = (str: string) => dispatch(setErrText(str));
  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));

  const imgRef = useRef<DaismImgHandle>(null);

  async function changeLogoClick() {
    if(!daismObj) daismObj=getDaismContract();
    const imgbase64 = imgRef.current?.getData();
    if (!imgbase64) {
      showError(t('noSelectImgText'));
      return;
    }

    const imgstr = window.atob(imgbase64.split(',')[1]);

    setChangeLogo(false);
    showTip(t('submitingProText'));

    const pro:Proposal={
      account:'0x0000000000000000000000000000000000000003',
      dividendRights:1,
      createTime:Math.floor(Date.now() / 1000),
      rights:0,
      antirights:0,
      desc:'',
      proposalType:1
    }

    const logo:SCFile={
      fileType: 'svg',
      fileContent: imgstr
    }
1
    try {
      await daismObj?.Dao.addProposal(delegator,pro,logo);
      closeTip();
      setMess(true);
    } catch (err: any) {
      console.error(err);
      closeTip();
      if (err.message?.includes('proposal cooling period')) showError(t('noCooling'));
      else if (err.message?.includes('valid proposal exists')) showError(t('noComplete'));
      else showError(tc('errorText') + (err.message ?? err));
    }
  }

  return (
    <>
      <DaismImg ref={imgRef} title={`${t('uploadText')} logo`} maxSize={10480} fileTypes={["svg"]} />
      <Button variant="primary" className="mb-2" onClick={changeLogoClick}>
        <EditSvg size={20} /> {t('changeLogoProText')}
      </Button>

      <Alert variant="danger">
        <p>
          Smart Commons ({daoName}) {t('chageLogoWarnText')}
        </p>
      </Alert>
    </>
  );
}
