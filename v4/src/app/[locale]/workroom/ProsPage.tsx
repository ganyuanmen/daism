import { useState } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { EditSvg } from "@/lib/jssvg/SvgCollection";
import { useDispatch, useSelector } from 'react-redux';
import { getDaismContract } from '@/lib/globalStore';

// import useMyPro from '../../hooks/useMyPro';
import ShowErrorBar from '@/components/ShowErrorBar';
import Loadding from '@/components/Loadding';
import ProDetail from './ProDetail';

import { useTranslations } from 'next-intl';
import { type RootState,type AppDispatch,setTipText, setErrText } from '@/store/store';
import { useFetch } from '@/hooks/useFetch';
import { fetchJson } from '@/lib/utils/fetcher';


// ---------------- 类型定义 ----------------

interface ProItem {
  dao_id: number;
  delegator: string;
  pro_type: number;
  total_vote: number;
  rights: number;
  antirights: number;
  yvote: string;
  lifetime: number;
  // 如果有其它字段也会返回，可以扩展
  [key: string]: any;
}

// ---------------- 组件 ----------------

export default function ProsPage() {
  const t = useTranslations('my');
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user);
  

  const [refresh, setRefresh] = useState<boolean>(true);

  const prosData = useMyPro(user.account,refresh);

  return (
    <>
      {prosData?.data?.length ? (
        <ProsList prosData={prosData.data} setRefresh={setRefresh} />
      ) : prosData.status === 'failed' ? (
        <ShowErrorBar errStr={prosData.error??'get Data error'} />
      ) : prosData.status === 'succeeded' ? (
        <ShowErrorBar errStr={tc('noDataText')} />
      ) : (
        <Loadding />
      )}
    </>
  );
}

interface LastProType{
  lifetime:number|string;
}

interface ProsListProps {
  prosData: ProItem[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProsList({ prosData, setRefresh }: ProsListProps) {
  const t = useTranslations('my');
  const tc = useTranslations('Common');
  const user = useSelector((state: RootState) => state.valueData.user);
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(''));
  }
  function showError(str: string) {
    dispatch(setErrText(str));
  }
  let daismObj=getDaismContract();

  // 投票
  const vote = async (dao_id: number, delegator: string, flag: boolean) => {
    if(!daismObj) daismObj=getDaismContract();
    try {
      
      const res = await fetchJson<LastProType[]>(`/api/getData?daoid=${dao_id}&did=${user.account}`,{headers:{'x-method':'getLastPro'}});
      if(!res) return;
      if (res.length) {
        if (Number(res[0].lifetime) < 0) {
          showError(t('passlifeTime'));
        } else {
          if (dao_id > 3) {
            // 第2次升级增加的功能
            let is_vis = await daismObj?.Dao.isVotable(delegator);
            if (!is_vis) {
              showError(t('noVoteText'));
              return;
            }
          }
          showTip(t('submitVoteText'));
          await daismObj?.Dao.vote(delegator, flag);
          setRefresh(prev => !prev);
        }
      } else {
        showTip(tc('dataHandleErrorText'));
      }
    } catch (err: any) {
      console.error(err);
      showError(tc('errorText') + (err.message ? err.message : String(err)));
    } finally {
      closeTip();
    }
  };

  const cssType: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px',
  };

  return (
    <Card className="mt-1 daism-title">
      <Card.Header>{t('myProText')}</Card.Header>
      <Card.Body>
        {prosData.map((obj, idx) => (
          <Row
            key={idx}
            className="mb-3 p-1"
            style={{ borderBottom: '1px solid gray' }}
          >
            <Col>
              <span style={cssType}>{t('proText')}</span>:
              <b style={cssType}>
                {t('proNameText').split(',')[obj.pro_type]}
              </b>
            </Col>
            <Col>
              <span style={cssType}>{t('totalText')}</span>:
              <b> {obj.total_vote} </b> ({t('rights')}:<b>{obj.rights}</b>{' '}
              {t('antirights')}:<b>{obj.antirights}</b>)
            </Col>
            <Col>
              {Number(obj.yvote) !== 0 ? (
                <span style={cssType}>{t('votedText')}</span> // 已投票
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => {
                      vote(obj.dao_id, obj.delegator, false);
                    }}
                  >
                    <EditSvg size={16} /> {t('rights')}
                  </Button>{' '}
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      vote(obj.dao_id, obj.delegator, true);
                    }}
                  >
                    <EditSvg size={16} /> {t('antirights')}
                  </Button>
                </>
              )}
              <ProDetail obj={obj} />
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
}

export function useMyPro(account: string,refresh:boolean) {
  return useFetch<ProItem[]>(`/api/getData?did=${account}` ,'getMyPros',[refresh]);
}
