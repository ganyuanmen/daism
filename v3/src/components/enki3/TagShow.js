import { useState,useRef,useEffect,forwardRef,useImperativeHandle } from 'react';
import { Popover,Button,OverlayTrigger } from 'react-bootstrap';
import { client } from '../../lib/api/client';
import {DeleteSvg } from '../../lib/jssvg/SvgCollection'
import ErrorBar from '../form/ErrorBar';

  const TagShow = forwardRef(({cid,type,t}, ref) => {
  
    const oData=[{ id: 1, name: t('originalText') },{ id: 2, name: t('forwardText') }];
    const [tags, setTags] = useState(oData);
    const [selectTag, setSelectTag] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const inputRef=useRef();
    const divRef=useRef();

  useImperativeHandle(ref, () => ({
    getData: ()=>{return selectTag},
  }));

  useEffect(()=>{
    const fetchData = async () => {
        try {
            const res = await client.get(`/api/getData?cid=${cid}&type=${type}`,'getMessTag');
            if(res.status===200)
            
                if(Array.isArray(res.data)) setSelectTag(res.data)
        } catch (error) {
            console.error(error);
        } 
    };

    if(cid) fetchData();

},[cid,type]) 


useEffect(()=>{
  const fetchData = async () => {
      try {
          const res = await client.get(`/api/getData`,'getTag');
          if(res.status===200)
              if(Array.isArray(res.data)) setTags([...oData,...res.data])
      } catch (error) {
          console.error(error);
      } 
  };

 fetchData();

},[]) 

  // 添加新标签
  const addTag = (newTag) => {
    if(selectTag.length>=3) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    let temp = selectTag.find(obj => obj.name === newTag);
    if(temp) return;
    let _id=new Date().getTime();
    temp = tags.find(obj => obj.name === newTag);
    if(temp) _id=temp.id;
    const tag = {
      id: _id, // 使用时间戳作为唯一ID
      name: newTag
    };
    setSelectTag([...selectTag, tag]);
    setShowPopover(false);
  };

   // 单击添加新标签
   const addTag1 = (newTag) => {
    if(selectTag.length>=3) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    
    let temp = selectTag.find(obj => obj.id === newTag.id);
    if (!temp) setSelectTag([...selectTag,newTag]);
   
  };
  // 删除标签
  const deleteTag = (id) => {
    setSelectTag(selectTag.filter(tag => tag.id !== id));
  };
  const popover = (
    <Popover style={{width:'500px'}} >
      <Popover.Header as="div" className="d-flex justify-content-between align-items-center">
        <div>{t('addTagText')}</div>
        <Button style={{margin:0,padding:0}} 
          variant="link"
          onClick={() => setShowPopover(false)}
        >
          &times;
        </Button>
      </Popover.Header>
      <Popover.Body  >
        <input ref={inputRef} className="form-control" placeholder={t('enterText')}
                onKeyDown={(e) => {if (e.key === "Enter") {if(e.target.value.trim()) addTag(e.target.value.trim()) }}}>
        </input>
      <div className='mt-3' >
      {tags.map(tag => (
        <Button variant="light" key={tag.id} onClick={e=>{addTag1(tag);}} className="tag-item">{tag.name}</Button>
      ))}
      </div>
      </Popover.Body>
    </Popover>
  );
  return (
    <>
    <div ref={divRef} className="tag-container">
      {/* 已存在的标签 */}
      {selectTag.map(tag => (
        <div key={tag.id} className="tag-item">
          <span>{tag.name}</span>
          <button 
            className="delete-btn"
            onClick={() => deleteTag(tag.id)}
          ><DeleteSvg size={16} /></button>
        </div>
      ))}
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover} show={showPopover} onToggle={(show) => setShowPopover(show)}>
            <Button variant="link" onClick={() => setShowPopover(!showPopover)}> {t('addTagText')} </Button>
        </OverlayTrigger>

    </div>
    <ErrorBar show={showError} target={divRef} placement='top' invalidText={t('mostThreeText')} />
    </>
  );
});

export default TagShow;