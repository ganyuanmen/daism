import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import {client} from '../../../lib/api/client'
import { useDispatch} from 'react-redux';
import {setTipText} from '../../../data/valueData'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';
/**
 * 查找帐号进行关注，取关
 * @setSearObj 设置查找到的用户信息
 * @setFindErr 设置出错信息 
 */
const SearchInput = ({setSearObj,setFindErr}) => {
  const [query, setQuery] = useState('');
  const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
  const t = useTranslations('ff')
  const dispatch = useDispatch();
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  // function showClipError(str){dispatch(setMessageText(str))}

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  };

  const performSearch = (e) => {
    showTip(t('submittingText'))   
    client.get(`/api/getData?actor_account=${query.trim()}&user_account=${actor?.actor_account}`,'fromAccount').then(res =>{ 
      if(res.status===200) {
        if(res.data.account){ //找到帐号
          setSearObj(res.data);
          setFindErr("");
        }else { //没找到
          setSearObj(null);
          setFindErr(true);
        }
      }
      else console.error(res.statusText)
      closeTip()
  })
  };

  return (
    <InputGroup style={{width:'100%'}}>
      <Form.Control 
        type="text"
        placeholder={t('findandaddressText')}
        value={query}
        onClick={e=>{setSearObj(null);setFindErr(false)}}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </InputGroup>
  );
};

export default SearchInput;
