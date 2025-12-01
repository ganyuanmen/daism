'use client'
import { Button, Modal, InputGroup, Form, FormControl } from 'react-bootstrap';
// import { useGetDappOwner } from '@/hooks/useGetDappOwner';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import { Honor } from '@/lib/jssvg/SvgCollection';
import { RootState, AppDispatch, setTipText, setErrText } from '@/store/store';
import { getDaismContract } from '@/lib/globalStore';
import { useFetch } from '@/hooks/useFetch';

export interface DaoType {
  dao_id: number;
  dao_name: string;
  dao_symbol: string;
}


interface Member {
  index: number;
  hasError: boolean;
}

const Nftmint: React.FC = () => {
  const t = useTranslations('nft');
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user);
  const dispatch = useDispatch<AppDispatch>();

  const showError = (msg: string) => dispatch(setErrText(msg));
  const showTip = (msg: string) => dispatch(setTipText(msg));
  const closeTip = () => dispatch(setTipText(''));

  const [show, setShow] = useState(false);
  const [tipsCount, setTipsCount] = useState(1);
  const [batch, setBatch] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [allAr, setAllAr] = useState<Member[]>([]);
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstVoteError, setFirstVoteError] = useState(false);

  // const daoData = useGetDappOwner(user.account);
  
  const { data } = useFetch<DaoType[]>(`/api/getData?did=${user.account}`,
    'getDappOwner',[]);
  // export function useGetDappOwner(account?: string) {
  //   return useFetch<DaoType[]>(account ? `/api/getData?did=${account}` : '','getDappOwner');
  // }



 
  let daismObj=getDaismContract();

  // 初始化 allAr
  useEffect(() => {
    const newAll = Array.from({ length: tipsCount }, (_, i) => ({ index: i, hasError: false }));
    setAllAr(newAll);
  }, [tipsCount]);

  const checkAddress = (v: string) => /^0x[A-Fa-f0-9]{40}$/.test(v);
  const checkNum = (v: string) => /^[1-9][0-9]*$/.test(v);

  const validateForm = (form: HTMLFormElement) => {
    let errorCount = 0;

    const firstName = (form.org_firstName as HTMLInputElement).value.trim();
    if (!firstName || !checkAddress(firstName)) {
      errorCount++;
      setFirstNameError(true);
    }

    const firstVote = (form.org_firstvote as HTMLInputElement).value.trim();
    if (!firstVote || !checkNum(firstVote)) {
      errorCount++;
      setFirstVoteError(true);
    }

    // 第二成员及之后验证
    setMembers((prev) =>
      prev.map((m) => {
        const val = (form['org_firstName' + m.index] as HTMLInputElement).value.trim();
        const hasError = !val || !checkAddress(val);
        if (hasError) errorCount++;
        return { ...m, hasError };
      })
    );

    return errorCount === 0;
  };

  const mintSvg = () => {
    if(!daismObj) daismObj=getDaismContract();
    const form = document.getElementById('nftform') as HTMLFormElement;
    if (!form) return;

    let hasEmpty = false;
    const tipValues = allAr.map((a) => {
      const val = (form['nft_svg_' + a.index] as HTMLInputElement).value.trim();
      if (!val) hasEmpty = true;
      return val;
    });

    if (hasEmpty) {
      setAllAr((prev) => prev.map((a, i) => ({ ...a, hasError: !tipValues[i] })));
      showError(t('checkError'));
      return;
    }

    const daoSelect = (form.daoselect as HTMLSelectElement).value;
    if (!daoSelect) {
      showError(t('selectDaoText'));
      return;
    }

    if (batch) {
      if (!validateForm(form)) {
        showError(t('checkError'));
        return;
      }
      showTip(tc('blockchainText3'));
      const memberAddresses = [(form.org_firstName as HTMLInputElement).value.trim(), ...members.map((m) => (form['org_firstName' + m.index] as HTMLInputElement).value.trim())];
      daismObj?.Mynft.mintBatch(daoSelect, memberAddresses, tipValues, (form.org_firstvote as HTMLInputElement).value.trim()).then(
        () => setTimeout(() => window.location.reload(), 1000),
        (err: any) => {
          closeTip();
          showError(tc('errorText') + (err.message ?? err));
        }
      );
    } else {
      showTip(tc('blockchainText3'));
      daismObj?.Mynft.mint(daoSelect, user.account, tipValues).then(
        () => setTimeout(() => window.location.reload(), 1000),
        (err: any) => {
          closeTip();
          showError(tc('errorText') + (err.message ?? err));
        }
      );
    }
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { index: prev.length ? prev[prev.length - 1].index + 1 : 0, hasError: false }]);
  };

  const delMember = (index: number) => {
    setMembers((prev) => prev.filter((m) => m.index !== index));
  };

  const stylea = { width: '60px' };

  return (
    <>
      <Button size='lg' variant='primary' onClick={() => setShow(true)}>
        <Honor size={24} /> mint {t('nftText')}
      </Button>

      <Modal size='lg' className='daism-title' show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>{t('nftText')}</Modal.Header>
        <Modal.Body>
          <Form id='nftform'>
            <div className='mb-2 d-flex justify-content-between align-items-center'>
              <div>
                <Button size='sm' variant='info' onClick={() => setTipsCount((prev) => prev + 1)}>
                  {t('addBtnText')}
                </Button>
                <Button size='sm' variant='warning' style={{ marginLeft: '10px' }} onClick={() => tipsCount > 1 && setTipsCount((prev) => prev - 1)}>
                  {t('reduBtnText')}
                </Button>
              </div>
              <Form.Select id='daoselect' style={{ width: '300px' }}>
                {data && data.map((obj, idx) => (
                    <option key={'dao_' + idx} value={obj.dao_id}>
                      {obj.dao_name}(Valuation Token: {obj.dao_symbol})
                    </option>
                  ))
                }
              </Form.Select>
            </div>

            {allAr.map((a) => (
              <InputGroup key={a.index} className='mt-2' hasValidation>
                <InputGroup.Text style={stylea}>{t('eventsDesc')}</InputGroup.Text>
                <FormControl
                  id={'nft_svg_' + a.index}
                  as='textarea'
                  rows={2}
                  isInvalid={a.hasError}
                  onFocus={() => setAllAr((prev) => prev.map((x) => (x.index === a.index ? { ...x, hasError: false } : x)))}
                />
                <Form.Control.Feedback type='invalid'>{t('noEmptyText')}</Form.Control.Feedback>
              </InputGroup>
            ))}

            <Form.Check className='mt-2' type='switch' id='batch-switch' checked={batch} onChange={(e) => setBatch(e.currentTarget.checked)} label={t('batchText')} />

            {batch && (
              <>
                <InputGroup className='mb-2' hasValidation>
                  <InputGroup.Text style={{ width: '240px' }}>{t('mintNumberText')}</InputGroup.Text>
                  <FormControl id='org_firstvote' type='text' defaultValue='1' isInvalid={firstVoteError} onFocus={() => setFirstVoteError(false)} />
                  <Form.Control.Feedback type='invalid'>{t('mintValue')}</Form.Control.Feedback>
                </InputGroup>

                <InputGroup className='mb-0' hasValidation>
                  <InputGroup.Text style={{ width: '80px' }}>{t('memberText')}</InputGroup.Text>
                  <FormControl id='org_firstName' defaultValue={user.account} type='text' isInvalid={firstNameError} onFocus={() => setFirstNameError(false)} />
                  <Button variant='primary' onClick={addMember}>{t('addMember')}</Button>
                  <Form.Control.Feedback type='invalid'>{t('addressCheck')}</Form.Control.Feedback>
                </InputGroup>

                {members.map((m) => (
                  <InputGroup key={m.index} className='mt-2' hasValidation>
                    <InputGroup.Text style={{ width: '80px' }}>{t('memberText')}</InputGroup.Text>
                    <FormControl
                      id={'org_firstName' + m.index}
                      type='text'
                      isInvalid={m.hasError}
                      defaultValue=''
                      onFocus={() => setMembers((prev) => prev.map((x) => (x.index === m.index ? { ...x, hasError: false } : x)))}
                    />
                    <Button variant='warning' onClick={() => delMember(m.index)}>{t('delMember')}</Button>
                    <Form.Control.Feedback type='invalid'>{t('addressCheck')}</Form.Control.Feedback>
                  </InputGroup>
                ))}
              </>
            )}

            <div className='d-flex justify-content-center mt-2'>
              <Button variant='primary' onClick={mintSvg}>
                <Honor size={24} /> mint {t('nftText')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Nftmint;
