import { useState,useRef,useEffect,forwardRef,useImperativeHandle } from 'react';
import { Popover,Button,OverlayTrigger } from 'react-bootstrap';
import { client } from '../../lib/api/client';
import {DeleteSvg } from '../../lib/jssvg/SvgCollection'

  const TagShow = forwardRef(({cid,type}, ref) => {
  
    const oData=[{ id: 1, name: '原创' },{ id: 2, name: '转发' }];
    const [tags, setTags] = useState(oData);
    const [selectTag, setSelectTag] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const inputRef=useRef();

  useImperativeHandle(ref, () => ({
    getData: ()=>{return selectTag},
  }));

  useEffect(()=>{
    const fetchData = async () => {
        try {
            const res = await client.get(`/api/getData?cid=${cid}&type=${type}`,'getMessTag');
            console.log(res)
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
    console.log(newTag);
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
        <div>添加标签</div>
        <Button style={{margin:0,padding:0}} 
          variant="link"
          onClick={() => setShowPopover(false)}
        >
          &times;
        </Button>
      </Popover.Header>
      <Popover.Body  >
        <input ref={inputRef} className="form-control" placeholder="Enter键可添加自定义标签"
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
    <div className="tag-container">
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
            <Button variant="link" onClick={() => setShowPopover(!showPopover)}> 添加标签 </Button>
        </OverlayTrigger>

    </div>
  );
});

export default TagShow;