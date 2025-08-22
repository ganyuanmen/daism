import { useState } from "react";
import { Heart } from '@/lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "@/hooks/useMessageData";
import { client } from "@/lib/api/client";
import { useSelector, useDispatch } from 'react-redux';

import { type RootState, type AppDispatch, setTipText, setMessageText } from "@/store/store";
import { useTranslations } from 'next-intl'

/**
 * 嗯文喜欢按钮
 * @currentObj 嗯文对象 
 * @isEdit 允许修改 
 */

interface HeartType {
  pid: number;
  total: number;
}

interface CurrentObj {
  message_id: number;
  dao_id?: number;
  [key: string]: any; // 允许扩展属性
}

interface EnKiHeartProps {
  currentObj: CurrentObj;
  isEdit: boolean;
  path: string;
}

export default function EnKiHeart({ currentObj, isEdit, path }: EnKiHeartProps) {
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(''));
  }
  function showClipError(str: string) {
    dispatch(setMessageText(str));
  }

  const actor = useSelector((state: RootState) => state.valueData.actor);
  const t = useTranslations('ff');
  const tc = useTranslations('Common');

  const getSctype = () => {
    return (path === 'enki' || path === 'SC')
      ? 'sc'
      : path === 'enkier'
        ? ''
        : currentObj?.dao_id && currentObj.dao_id > 0
          ? 'sc'
          : '';
  };

  const [refresh, setRefresh] = useState(false);

  const data = useGetHeartAndBook({
    account: actor?.actor_account,
    pid: currentObj?.message_id,
    refresh,
    table: 'heart',
    sctype: getSctype()
  }) as HeartType;

  const submit = async (flag: 0 | 1) => { // 0 取消点赞  1 点赞
    showTip(t('submittingText'));
    let res = await client.post(
      '/api/postwithsession',
      'handleHeartAndBook',
      {
        account: actor?.actor_account,
        pid: currentObj?.message_id,
        flag,
        table: 'heart',
        sctype: getSctype()
      }
    );
    if (res.status === 200) {
      setRefresh(!refresh);
    } else {
      showClipError(
        `${tc('dataHandleErrorText')}!${res.statusText}\n ${
          res.data.errMsg ? res.data.errMsg : ''
        }`
      );
    }
    closeTip();
  };

  return (
    <button
      type="button"
      disabled={!isEdit}
      onClick={() => {
        submit(data.pid ? 0 : 1);
      }}
      className="btn btn-light"
      data-bs-toggle="tooltip"
      data-bs-html="true"
      title={t('likeText')}
    >
      {data.pid ? (
        <span style={{ color: 'red' }}>
          <Heart size={18} />
        </span>
      ) : (
        <Heart size={18} />
      )}
      {data.total}
    </button>
  );
}
