import { useState } from "react";
import { Heart } from '@/lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "@/hooks/useMessageData";
import { useSelector, useDispatch } from 'react-redux';

import { type RootState, type AppDispatch, setTipText, setErrText } from "@/store/store";
import { useTranslations } from 'next-intl'
import Loadding from "@/components/Loadding";
import ShowErrorBar from "@/components/ShowErrorBar";

/**
 * 嗯文喜欢按钮
 * @currentObj 嗯文对象 
 * @isEdit 允许修改 
 */

interface EnKiHeartProps {
  currentObj: EnkiMessType;
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
    dispatch(setErrText(str));
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

  const resData = useGetHeartAndBook(actor?.actor_account,currentObj?.message_id,refresh,'heart',getSctype());

  const submit = async (flag: 0 | 1) => { // 0 取消点赞  1 点赞
    showTip(t('submittingText'));
    const upData= {
      account: actor?.actor_account,
      pid: currentObj?.message_id,
      flag,
      table: 'heart',
      sctype: getSctype()
    };

    const re= await fetch("/api/postwithsession", {
      method: 'POST',
      headers: { 'x-method': 'handleHeartAndBook' },
      body: JSON.stringify(upData)
    });
    if(re.ok){
       setRefresh(!refresh);
    }else{
      const reData=await re.json();
      showClipError(`${tc("dataHandleErrorText")}!\n ${reData?.errMsg}`);
    }
    closeTip();
  };

  const geneButton=()=>{
    return <button
      type="button"
      disabled={!isEdit}
      onClick={() => {
        submit( resData.data.pid ? 0 : 1);
      }}
      className="btn btn-light"
      data-bs-toggle="tooltip"
      data-bs-html="true"
      title={t('likeText')}
    >
      {resData.data.pid ? (
        <span style={{ color: 'red' }}>
          <Heart size={18} />
        </span>
      ) : (
        <Heart size={18} />
      )}
      {resData.data.total}
    </button>
  }
  return ( <>
    {
      resData.status==='loading'?<Loadding isImg={true} spinnerSize="sm" />
      :resData.status==='failed'? <ShowErrorBar errStr={resData.error??'get data err'} />
      :geneButton()
    }
  </>
   
  );
}
