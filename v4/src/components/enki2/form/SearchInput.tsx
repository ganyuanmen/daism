'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch, setTipText } from '@/store/store';
import { useTranslations } from 'next-intl';
import { fetchJson } from '@/lib/utils/fetcher';
interface SearchInputProps {
  setSearObj: (value: any | null) => void;
  setFindErr: (value: boolean) => void;
}


 
/**
 * 查找帐号进行关注，取关
 * @setSearObj 设置查找到的用户信息
 * @setFindErr 设置出错信息
 */
const SearchInput: React.FC<SearchInputProps> = ({ setSearObj, setFindErr }) => {
  const [query, setQuery] = useState<string>('');
  const actor = useSelector((state: RootState) => state.valueData.actor); // siwe登录信息
  const t = useTranslations('ff');
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(''));
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  };

  const performSearch = async () => {
    if(!query) return;

    showTip(t('submittingText'));

    const res = await fetchJson<ActorInfo>(`/api/getData?actor_account=${query.trim()}&user_account=${actor?.actor_account}`
    ,{headers:{'x-method':'fromAccount'}});
    if(!res) return;
    if(res.account){
      setSearObj(res);
      setFindErr(false);
    }
    else{
      setSearObj(null);
      setFindErr(true);
    }
    closeTip();
   
  };

  return (
    <InputGroup style={{ width: '100%' }}>
      <Form.Control
        type="text"
        placeholder={t('findandaddressText')}
        value={query}
        onClick={() => {
          setSearObj(null);
          setFindErr(false);
        }}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </InputGroup>
  );
};

export default SearchInput;
