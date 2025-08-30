import { InputGroup, Button, Form } from 'react-bootstrap';
import { UploadSvg } from '@/lib/jssvg/SvgCollection';
import { useRef } from 'react';
import { fetchJson } from '@/lib/utils/fetcher';
import { useSelector, useDispatch } from 'react-redux';
import {type RootState,type AppDispatch,setUser,setErrText,setTipText, setLoginsiwe} from '@/store/store';
import { useTranslations } from 'next-intl';
import { getDaismContract } from '@/lib/globalStore';

interface EnKiRigesterProps {
  setRegister?: (show: boolean) => void;
}

interface UserRegister{
  allTotal:number; //所有注册数
  nameTotal:number; //本人是否已注册 >0=>true
  [key: string]: any; // 允许任意额外属性
}

/**
 * 个人注册帐号
 * @param setRegister 可选，隐藏上层弹出的窗口
 */
export default function EnKiRigester({ setRegister }: EnKiRigesterProps) {
  const nameRef = useRef<HTMLInputElement | null>(null);

  const actor = useSelector((state: RootState) => state.valueData.actor);
  const user = useSelector((state: RootState) => state.valueData.user); // 钱包登录用户信息

  const tc = useTranslations('Common');
  const t = useTranslations('ff');
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(''));
  }
  function showClipError(str: string) {
    dispatch(setErrText(str));
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN as string;
  const daismObj=getDaismContract();

  const register = async () => {
    const actorName = nameRef.current?.value?.trim();
    if (!actorName || actorName.length > 12) {
      showClipError(t('noEmptygt12'));
      return;
    }

    showTip(t('submittingText'));

    const re = await fetchJson<UserRegister>(`/api/getData?account=0x${actorName}@${domain}`,{headers:{'x-method':'getSelfAccount'}});
    if(!re) return;
  
    if (re!.allTotal > parseInt(process.env.NEXT_PUBLIC_TOTAL as string)) {
      closeTip();
      showClipError(t('exceedAmount'));
      return;
    }

    if (re.nameTotal > 0) {
      showClipError(`${actorName}@${domain} ${t('registeredText')}`);
      closeTip();
      return;
    }

    let ree = await daismObj?.Domain.addr2Info(user.account);
    if (setRegister) setRegister(false);
    if (ree && ree.domain === domain && ree.name === '0x' + actorName) {
      showClipError(`${actorName}@${domain} ${t('registeredText')}`);
      closeTip();
      return;
    }

    // 重新设置登录信息
    daismObj?.Domain.recordInfo(actorName, domain).then(
      (re) => {
        closeTip();
        dispatch(setUser({ ...user, connected: 0, account: '', chainId: 0 }));
        dispatch(setLoginsiwe(false));

        if (re && actor?.actor_account) {
          // 重新注册，恢复资料
          setTimeout(() => {
            fetch(`/api/admin/recover`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                actorName: `0x${actorName}`,
                domain: domain,
                oldAccount: actor?.actor_account,
                sctype: '',
                daoid: 0,
              }),
            }).then(async () => {
              console.info('recover ok');
            });
          }, 3000);
        }
      },
      (err) => {
        console.error(err);
        closeTip();
        showClipError(tc('errorText') + (err.message ? err.message : err));
      }
    );
  };

  return (
    <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
      <Form.Control placeholder={t('nickName')} ref={nameRef} />
      <InputGroup.Text>{`@${domain}`}</InputGroup.Text>
      <Button variant="outline-secondary" onClick={register}>
        <UploadSvg size={24} /> {t('registerText')}
      </Button>
    </InputGroup>
  );
}
