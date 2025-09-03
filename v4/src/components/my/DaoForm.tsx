import { useRef, useState, FormEvent, ChangeEvent, MouseEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import DaismImg from '../form/DaismImg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { ethers } from 'ethers';
import { Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LoginButton from '../LoginButton';
import editStyle from '@/styles/editor.module.css';
import { getDaismContract } from '@/lib/globalStore';
// import { useEipTypes } from '@/hooks/useMessageData';
import { type AppDispatch,type RootState, setErrText, setTipText } from '@/store/store';
import { useTranslations } from 'next-intl';
import { useFetch } from '@/hooks/useFetch';

interface DaoFormProps {
  setRefresh?: (refresh: boolean) => void;
  setShow: (show: boolean) => void;
}

interface AddArItem { index: number; isErr1: boolean; isErr2: boolean; }

export default function DaoForm({setRefresh, setShow }: DaoFormProps) {
  const [addAr, setAddAr] = useState<AddArItem[]>([]);
  const [errorManager, setErrorManager] = useState(false);
  const [errorDaoName, setErrorDaoName] = useState(false);
  const [errorDaoSymbol, setErrorDaoSymbol] = useState(false);
  const [errorFirrstName, setErrorFirrstName] = useState(false);
  const [errorFirrstVote, setErrorFirrstVote] = useState(false);
  const [errorPerNumber, setErrorPerNumber] = useState(false);
  const [errorS, setErrorS] = useState(false);
  const [errorLife, setErrorLife] = useState(false);
  const [errorCool, setErrorCool] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [typeNameErr, setTypeNameErr] = useState(false);
  const [typeDescErr, setTypeDescErr] = useState(false);
  const [type, setType] = useState(1);
  const typeNameRef = useRef<HTMLInputElement>(null);
  const [createName, setCreateName] = useState(false);
  const [errcontract, setErrcontract] = useState(false);
  const [daoName, setDaoName] = useState(false);
  const [daoSymbol, setDaoSymbol] = useState(false);
  const [batch, setBatch] = useState(false);
  const loginsiwe = useSelector((state: any) => state.valueData.loginsiwe);
  const imgRef = useRef<any>(null);
  const loginRef = useRef<any>(null);
  const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;
    
  const dispatch = useDispatch<AppDispatch>();
  function showTip(str:string){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  function showErrorTip(str:string){dispatch(setErrText(str))}
  const t = useTranslations('my')
  const tc = useTranslations('Common')


  // const typeData=useEipTypes() //所有eip类型
  const typeData= useFetch<DaismTipType[]>(`/api/getData`,
    'getEipTypes',[]);
    
  
//  export interface EipTypes{
//   type_name:string;
//   type_desc:string;
// }
// export function useEipTypes() {
//   return useFetch<DaismTipType[]>(`/api/getData` ,'getEipTypes');
// }



  // let daismObj=getDaismContract();

  const checkAddress = (v: string): boolean => /^0x[A-Fa-f0-9]{40}$/.test(v);
  const checkNum = (v: string): boolean => /^[1-9][0-9]*$/.test(v);

  const myCheck = (form: HTMLFormElement): boolean => {
    let _err = 0;
    let _temp:string|number;
     _temp = (form.elements.namedItem('createdao_name') as HTMLInputElement).value.trim();
    if (!_temp || _temp.length > 128) { _err++; setErrorDaoName(true); setDaoName(false); }

    _temp = (form.elements.namedItem('createdao_sysmobl') as HTMLInputElement).value.trim();
    if (!_temp || _temp.length > 128) { _err++; setErrorDaoSymbol(true); setDaoSymbol(false); }

    if (type === 1) {
      _temp = (form.elements.namedItem('createdao_manager') as HTMLInputElement).value.trim();
      if (!_temp || !checkAddress(_temp)) { _err++; setErrorManager(true); setCreateName(false); setErrcontract(false); }
    }

    _temp = (form.elements.namedItem('org_firstName') as HTMLInputElement).value.trim();
    if (!_temp || !checkAddress(_temp)) { _err++; setErrorFirrstName(true); }

    _temp = (form.elements.namedItem('org_firstvote') as HTMLInputElement).value.trim();
    if (!_temp || !checkNum(_temp) || parseInt(_temp) < 0 || parseInt(_temp) > 10000) { _err++; setErrorFirrstVote(true); }

    if (batch) {
      _temp = (form.elements.namedItem('per_number') as HTMLInputElement).value.trim();
      if (!_temp || !checkNum(_temp) || parseInt(_temp) > 3) { _err++; setErrorPerNumber(true); }
    }

    addAr.forEach(v => {
      _temp = (form.elements.namedItem('org_firstName' + v.index) as HTMLInputElement).value.trim();
      if (!_temp || !checkAddress(_temp)) { _err++; v.isErr1 = true; }
      _temp = (form.elements.namedItem('org_firstvote' + v.index) as HTMLInputElement).value.trim();
      if (!_temp || !checkNum(_temp) || parseInt(_temp) < 0 || parseInt(_temp) > 10000) { _err++; v.isErr2 = true; }
    });

    _temp = parseFloat((form.elements.namedItem('org_s') as HTMLInputElement).value);
    if (_temp < 0 || _temp > 50) { _err++; setErrorS(true); }

    _temp = parseInt((form.elements.namedItem('org_life') as HTMLInputElement).value);
    if (_temp < 3) { _err++; setErrorLife(true); }

    _temp = parseInt((form.elements.namedItem('org_cool') as HTMLInputElement).value);
    if (_temp < 3) { _err++; setErrorCool(true); }

    return _err === 0;
  };

  const getType = (form: HTMLFormElement): { typeName: string; typeDesc: string } | undefined => {
    const _mtype = (form.elements.namedItem('type_name') as HTMLInputElement).value.trim();
    if (!_mtype || _mtype.length > 8 || _mtype === 'app' || _mtype === 'apps' || _mtype === 'dapps') {
      setTypeNameErr(true); showErrorTip(t('checkError')); return undefined;
    }
    if (!(form.elements.namedItem('type_desc') as HTMLInputElement).value.trim()) {
      setTypeDescErr(true); showErrorTip(t('checkError')); return undefined;
    }
    return { typeName: _mtype, typeDesc: (form.elements.namedItem('type_desc') as HTMLInputElement).value.trim() };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); event.stopPropagation();
    const form = event.currentTarget;
    if (!myCheck(form)) { showErrorTip(t('checkError')); return; }

    let _type;
    if (type === 3) {
      _type = getType(form);
      if (_type === undefined) return;
      if (!loginsiwe) { loginRef.current.siweLogin(); return; } 
      else { 
        fetch('/api/postwithsession',{
          method:'POST',
          headers:{'x-method':'addEipType'},
          body:JSON.stringify({ _type: _type.typeName, _desc: _type.typeDesc})
        })
        // client.post('/api/postwithsession', 'addEipType', { _type: _type.typeName, _desc: _type.typeDesc });
      
      }
    }

    const imgbase64 = imgRef.current.getData();
    if (!imgbase64) { showErrorTip(t('noSelectImgText')); return; }

    showTip(tc('blockchainText3'));

    fetch(`/api/checkdao?daoName=${(form.elements.namedItem('createdao_name') as HTMLInputElement).value.trim()}&daoSymbol=${(form.elements.namedItem('createdao_sysmobl') as HTMLInputElement).value.trim().toUpperCase()}&creator=${type === 1 ? (form.elements.namedItem('createdao_manager') as HTMLInputElement).value.trim() : '0x123'}&t=${new Date().getTime()}`)
      .then(async response => {
        if (response.status === 200) {
          const imgstr = window.atob(imgbase64.split(',')[1]);
          const re = await response.json();
          if (!re.creator && !re.dao_name && !re.dao_symbol) {
            const members = [(form.elements.namedItem('org_firstName') as HTMLInputElement).value.trim()];
            const votes = [(form.elements.namedItem('org_firstvote') as HTMLInputElement).value.trim()];
            addAr.forEach(v => {
              members.push((form.elements.namedItem('org_firstName' + v.index) as HTMLInputElement).value.trim());
              votes.push((form.elements.namedItem('org_firstvote' + v.index) as HTMLInputElement).value.trim());
            });

            let mintnftparas = '0x';
            if (batch) {
              const abicoder = new ethers.AbiCoder();
              const functionData = abicoder.encode(['address[]', 'uint256'], [members, (form.elements.namedItem('per_number') as HTMLInputElement).value.trim()]);
              mintnftparas = abicoder.encode(["address", "bytes"], [process.env.NEXT_PUBLIC_DAISMSINGLENFT, functionData]);
            }

            const daoinfo:SCInfo = {
              name:(form.elements.namedItem('createdao_name') as HTMLInputElement).value.trim(),
              symbol:(form.elements.namedItem('createdao_sysmobl') as HTMLInputElement).value.trim().toUpperCase(),
              desc:(form.elements.namedItem('createdao_dsc') as HTMLInputElement).value.trim(),
              manager:type === 1 ? (form.elements.namedItem('createdao_manager') as HTMLInputElement).value.trim() : user.account,
              version:1,
              SCType:type === 1 ? 'dapp' : (type === 2 ? 'EIP' : _type!.typeName)
            };

            const s = Math.floor(parseFloat((form.elements.namedItem('org_s') as HTMLInputElement).value) / 100 * 65535);
            const life = parseInt((form.elements.namedItem('org_life') as HTMLInputElement).value);
            const cool = parseInt((form.elements.namedItem('org_cool') as HTMLInputElement).value);

            const _logo:SCFile={fileType:'svg',fileContent:imgstr}
            const  daismObj=getDaismContract();
            daismObj?.Register.createSC(daoinfo, members, votes, s, life, cool,_logo,mintnftparas).then(
              () => setTimeout(() => { closeTip(); setShow(false); setRefresh?.(true); }, 1000),
              (err: any) => {
                closeTip();
                if (err.message && (err.message.includes('bad address') || err.message.includes('sender must be contract'))) {
                  setErrcontract(true); setCreateName(false); setErrorManager(true); showErrorTip("invalidAddress");
                } else { console.error(err); showErrorTip(tc('errorText') + (err.message ? err.message : err)); }
              }
            );
          } else {
            if (type === 1 && re.creator) { setCreateName(true); setErrorManager(true); }
            if (re.dao_name) { setDaoName(true); setErrorDaoName(true); }
            if (re.dao_symbol) { setDaoSymbol(true); setErrorDaoSymbol(true); }
            closeTip(); showErrorTip(t('checkError'));
          }
        } else { showErrorTip(t('errorDataText')); closeTip(); }
      })
      .catch(error => { showErrorTip(t('errorDataText')); console.error(error); closeTip(); });
  };

  const delMember = (event: MouseEvent<HTMLButtonElement>) => {
    const _num = parseInt(event.currentTarget.getAttribute('data-key')!);
    for (let i = 0; i < addAr.length; i++) {
      if (addAr[i].index === _num) { addAr.splice(i, 1); setAddAr([...addAr]); }
    }
  };

  const addMember = () => {
    if (addAr.length) setAddAr([...addAr, { index: addAr[addAr.length - 1].index + 1, isErr1: false, isErr2: false }]);
    else setAddAr([{ index: 0, isErr1: false, isErr2: false }]);
  };

  const _desc = `<pre><code>// SPDX-License-Identifier: MIT 
    pragma solidity ^0.8.20;
    contract ThreeDapp {
        address public owner;
        constructor(){ owner = tx.origin; }
        function ownerOf() public view returns(address){ return owner; }
    }</code></pre>`;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtered = !typeData.data?[]: typeData.data.filter((item: any) => item.type_name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
  };

  const stylea: React.CSSProperties = {display: "inline-block",textAlign: "right", width: "100px"};
  
  const set1 = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.checked) setType(1); };
  const set2 = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.checked) setType(2); };
  const set3 = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.checked) setType(3); };

  return (<>
    <Form onSubmit={handleSubmit}>
      <div className='mb-2' >
        <Form.Check inline label="dapp类型" name="group1" type="radio" checked={type === 1} onChange={set1} id="inlineradio1" />
        <Form.Check inline label="EIP类型" name="group1" type="radio" checked={type === 2} onChange={set2} id="inlineradio2" />
        <Form.Check inline label="其它类型" name="group1" type="radio" checked={type === 3} onChange={set3} id="inlineradio3" />
      </div>

      {type === 1 && <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea} >{t('contractText')}</InputGroup.Text>
        <FormControl id='createdao_manager' isInvalid={errorManager} type="text" onFocus={() => { setErrorManager(false) }} placeholder="0x" defaultValue="" />
        <Form.Control.Feedback type="invalid">
          {createName ? <span>{t('alreadyMint')} </span> : errcontract ? <span>{t('invalidContract')}</span> : <span>{t('addressCheck')}</span>}
        </Form.Control.Feedback>
      </InputGroup>}

      {type === 3 && <>
        <InputGroup hasValidation className="mb-1 mt-1">
          <InputGroup.Text style={stylea} >{t('typeName')}</InputGroup.Text>
          <FormControl id='type_name' ref={typeNameRef} isInvalid={typeNameErr} type="text" placeholder={t('typeName')} onFocus={() => { setTypeNameErr(false); setFilteredData([]) }} onChange={handleInputChange} />
          <Form.Control.Feedback type="invalid">{t('noEmptyorlg8')}</Form.Control.Feedback>
        </InputGroup>
        {filteredData.length > 0 && (<div className={editStyle.autocompleteitems}>
          {filteredData.map((item, index) => (<div key={index} className={editStyle.autocompleteitem} onClick={() => { typeNameRef.current!.value = item.type_name; setFilteredData([]) }}>
            {item.type_name}{'  '}{item.type_desc}
          </div>))}
        </div>)}
        <InputGroup hasValidation className="mt-2 mb-2">
          <InputGroup.Text style={stylea} >{t('typeDesc')}</InputGroup.Text>
          <FormControl id='type_desc' isInvalid={typeDescErr} type="text" placeholder={t('typeDesc')} onFocus={() => { setTypeDescErr(false) }} />
          <Form.Control.Feedback type="invalid">{t('noEmpty')}</Form.Control.Feedback>
        </InputGroup>
      </>}

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea}>{t('nameText')}</InputGroup.Text>
        <FormControl id='createdao_name' isInvalid={errorDaoName} type="text" onFocus={() => { setErrorDaoName(false) }} placeholder={t('nameText')} defaultValue='' />
        <Form.Control.Feedback type="invalid">{daoName ? <span>{t('alreadyUsed')} </span> : <span>{t('nameCheck')}</span>}</Form.Control.Feedback>
      </InputGroup>

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea}>{t('tokenSymbol')}</InputGroup.Text>
        <FormControl id='createdao_sysmobl' isInvalid={errorDaoSymbol} type="text" onFocus={() => { setErrorDaoSymbol(false) }} placeholder={t('tokenSymbol')} defaultValue='' />
        <Form.Control.Feedback type="invalid">{daoSymbol ? <span>{t('tokenUsed')} </span> : <span>{t('nameCheck')}</span>}</Form.Control.Feedback>
      </InputGroup>

      <InputGroup hasValidation className="mb-0">
        <InputGroup.Text style={stylea} >{t('memberText')}</InputGroup.Text>
        <FormControl id='org_firstName' isInvalid={errorFirrstName} type="text" placeholder="0x" onFocus={() => { setErrorFirrstName(false) }} defaultValue={user.account} />
        <Form.Control.Feedback type="invalid">{t('addressCheck')}</Form.Control.Feedback>
      </InputGroup>

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea} >{t('voteText')}</InputGroup.Text>
        <FormControl id='org_firstvote' isInvalid={errorFirrstVote} type="text" placeholder="" onFocus={() => { setErrorFirrstVote(false) }} defaultValue="10" />
        <Button variant="primary" onClick={addMember}>{t('addMember')}</Button>
        <Form.Control.Feedback type="invalid">{t('voteValue')}</Form.Control.Feedback>
      </InputGroup>

      {addAr.map((placement) => (<div key={'org_' + placement.index} >
        <InputGroup hasValidation className="mb-0">
          <InputGroup.Text style={stylea} >{t('memberText')}</InputGroup.Text>
          <FormControl id={'org_firstName' + placement.index} isInvalid={placement.isErr1} onFocus={() => { placement.isErr1 = false; setAddAr([...addAr]) }} type="text" placeholder="0x" defaultValue="" />
          <Form.Control.Feedback type="invalid">{t('addressCheck')}</Form.Control.Feedback>
        </InputGroup>
        <InputGroup hasValidation className="mb-2">
          <InputGroup.Text style={stylea}>{t('voteText')}</InputGroup.Text>
          <FormControl id={'org_firstvote' + placement.index} isInvalid={placement.isErr2} type="text" onFocus={() => { placement.isErr2 = false; setAddAr([...addAr]) }} placeholder="" defaultValue="10" />
          <Button variant="warning" data-key={placement.index} onClick={delMember}>{t('delMember')}</Button>
          <Form.Control.Feedback type="invalid">{t('voteValue')}</Form.Control.Feedback>
        </InputGroup>
      </div>))}

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea} >{t('proPassText')}</InputGroup.Text>
        <FormControl id='org_s' isInvalid={errorS} type="text" placeholder="" onFocus={() => { setErrorS(false) }} defaultValue="50" />
        <InputGroup.Text >%</InputGroup.Text>
        <Form.Control.Feedback type="invalid">{t('errorS')}</Form.Control.Feedback>
      </InputGroup>

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea} >{t('proLifeText')}</InputGroup.Text>
        <FormControl id='org_life' isInvalid={errorLife} type="text" placeholder="" onFocus={() => { setErrorLife(false) }} defaultValue="3" />
        <InputGroup.Text >{t('dayText')}</InputGroup.Text>
        <Form.Control.Feedback type="invalid">{t('errorDay')}</Form.Control.Feedback>
      </InputGroup>

      <InputGroup hasValidation className="mb-2">
        <InputGroup.Text style={stylea} >{t('proCoolText')}</InputGroup.Text>
        <FormControl id='org_cool' isInvalid={errorCool} type="text" placeholder="" onFocus={() => { setErrorCool(false) }} defaultValue="3" />
        <InputGroup.Text >{t('dayText')}</InputGroup.Text>
        <Form.Control.Feedback type="invalid">{t('errorDay')}</Form.Control.Feedback>
      </InputGroup>

      <DaismImg ref={imgRef} title='logo' maxSize={10240} fileTypes={['svg']} />

      <FloatingLabel className="mb-2" controlId="createdao_dsc" label={t('desctext')}>
        <Form.Control as="textarea" placeholder={t('desctext')} style={{ height: '160px' }} />
      </FloatingLabel>

      <Form.Check className='mt-2' type="switch" id="batch-switch" checked={batch} onChange={e => { setBatch(e.currentTarget.checked) }} label={t('batchText')} />

      {batch && <> <InputGroup hasValidation className="mb-2 mt-3">
        <InputGroup.Text style={{ width: "240px" }} >{t('mintNumberText')}</InputGroup.Text>
        <FormControl id='per_number' isInvalid={errorPerNumber} type="text" placeholder="1" onFocus={() => { setErrorPerNumber(false) }} defaultValue="1" />
        <Form.Control.Feedback type="invalid"> {t('mintValue')} </Form.Control.Feedback>
      </InputGroup></>}

      <Accordion style={{ boxShadow: 'none !important' }} className='mt-2' >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{padding:0,margin:0}}>mint smart commom {t('mintDescText')}</Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>{t('logoAlertText')};</li><li>{t('mintdesc1')}</li><li>{t('montdesc2')}</li><li>{t('smarcommondesc2')}</li><li>{t('smarcommondesc3')}</li><li> {t('smarcommondesc4')}</li><li>{t('voteDesc')}</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion style={{ boxShadow: 'none !important' }} className='mt-2' >
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{padding:0,margin:0}} > {t('hoorDescText')}</Accordion.Header>
          <Accordion.Body>
            <div className='mb-2'>daismRegistrar: {process.env.NEXT_PUBLIC_SCREGISTRAR}</div>
            <div className='mb-2'>daismHonorTokens: {process.env.NEXT_PUBLIC_DAISMSINGLENFT}</div>
            <div dangerouslySetInnerHTML={{ __html: _desc }} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-grid gap-2 mt-3">
        <Button type="submit">mint {t('smartcommon')}</Button>
      </div>
    </Form>
    <LoginButton command={true} ref={loginRef} />
  </>);
}