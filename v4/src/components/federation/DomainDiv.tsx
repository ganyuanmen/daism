import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from "next-intl";
import { EditSvg } from "@/lib/jssvg/SvgCollection";
import ConfirmWin from "./ConfirmWin";
import { type RootState, setTipText, setErrText, setDaoActor } from '@/store/store';
import ShowErrorBar from "../ShowErrorBar";
import { fetchJson } from "@/lib/utils/fetcher";
import { type UserRegister } from "@/lib/mysql/daism";
import { getDaismContract } from "@/lib/globalStore";

interface DomainDivProps {
  record: DaismDao;
  daoActor: DaismDao[];
}
interface UserLogin{
  daoActor:DaismDao[],
  actor:DaismActor;
}

const DomainDiv: React.FC<DomainDivProps> = ({ record, daoActor }) => {  
  const t = useTranslations('ff');
  const tc = useTranslations('Common');
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  
  const domain = process.env.NEXT_PUBLIC_DOMAIN || '';

  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));
  const showClipError = (str: string) => dispatch(setErrText(str));

  const handleSubmit = async () => {
    setShow(false);
    showTip(t('submittingText'));
    
    try {

      const resData = await fetchJson<UserRegister>('/api/getData?account=',{ headers: { 'x-method': 'getSelfAccount' }});
      if(!resData) return;
      if (resData.allTotal > Number(process.env.SMART_COMMONS_COUNT as string)) {
        closeTip();
        showClipError(t('exceedAmount'));
        return;
      }
      const daismObj=getDaismContract();
      const domainResult = await daismObj?.Domain.daoId2Domain(record.dao_id);
      if (domainResult && domainResult === process.env.NEXT_PUBLIC_DOMAIN) { 
        showClipError(t('domainbindText'));
        closeTip();
        return;
      }
     
      await daismObj?.Domain.record(record.dao_id, process.env.NEXT_PUBLIC_DOMAIN as string);
      
      setTimeout(async () => {
        try {
          const res = await fetchJson<UserLogin>('/api/siwe/getdaoactor?t=' + new Date().getTime());
          if(!res) return;  
          if (res.daoActor.length) {
            dispatch(setDaoActor(res.daoActor));
          }
          
          // if (record.actor_account) {
          //   // 重新注册，恢复资料
          //   await fetch(`/api/admin/recover`, {
          //     method: 'POST',
          //     headers: {'Content-Type': 'application/json'},
          //     body: JSON.stringify({
          //       actorName: record.dao_symbol,
          //       domain: process.env.NEXT_PUBLIC_DOMAIN,
          //       oldAccount: record.actor_account,
          //       sctype: 'sc',
          //       daoid: record.dao_id
          //     })
          //   });
          // }
          // window.location.reload();
          
        } catch (error) {
          console.error('Error in timeout:', error);
        }
      }, 2000);
    } catch (err: any) {
      console.error(err); 
      showClipError(tc('errorText') + (err.message ? err.message : String(err)));
    }
    finally{
      closeTip();
    }
  };

  const checkDao = (): boolean => { 
    return daoActor.some(obj => obj.dao_id === record.dao_id);
  };

  return (
    <> 
      <Card className='mb-2 daism-title mt-2'>
        <Card.Header>{t('companyText')}</Card.Header>
        <Card.Body>
          <div className="mb-1 d-flex justify-content-between align-items-center">
            <div> {record?.actor_account &&<>
              <strong>{t('alredyDomainText')}</strong>:
              <strong style={{display: 'inline-block', paddingLeft: '12px'}}>
                {record?.actor_account }
              </strong>
              <br/></>}
              <strong>{t('localDomainText')}</strong>:
              <strong style={{display: 'inline-block', paddingLeft: '12px'}}>
                {domain}
              </strong>
            </div>
            <div>
              {loginsiwe ? (
                checkDao() && domain !== record.domain && (
                  <Button onClick={() => { setShow(true); }}>
                    <EditSvg size={18} /> 
                    {record.domain ? t('editText') : t('bindText')}
                  </Button>
                )
              ) : (
                <ShowErrorBar errStr={tc('notLoginText')} />
              )}
            </div>
          </div>
          <div className="mb-1">{t('DomainDescText')}</div>
        </Card.Body>
      </Card>
      
      <ConfirmWin  
        show={show} 
        setShow={setShow} 
        question={record.domain ? t('confirmEditText') : t('confirmBindText')} 
        callBack={handleSubmit} 
      />
    </>
  );
};

export default DomainDiv;