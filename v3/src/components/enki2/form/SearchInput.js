import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import {client} from '../../../lib/api/client'
import { useDispatch} from 'react-redux';
import {setTipText} from '../../../data/valueData'

const SearchInput = ({t,setSearObj,actor,setFindErr}) => {
  const [query, setQuery] = useState('');

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
