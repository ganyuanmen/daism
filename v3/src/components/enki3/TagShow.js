import { useState,useRef,useEffect } from 'react';
import { Popover,Button,OverlayTrigger } from 'react-bootstrap';
import { client } from '../../lib/api/client';

  const TagShow = forwardRef(({cid,type}, ref) => {
  
    const oData=[{ id: 1, name: '原创' },{ id: 2, name: '转发' }];
    const [tags, setTags] = useState(oData);
    const [selectTag, setSelectTag] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const inputRef=useRef();

  useImperativeHandle(ref, () => ({
    getData: ()=>{return propertyIndex},
  }));

  useEffect(()=>{
    const fetchData = async () => {
        try {
            const res = await client.get(`/api/getData?cid=${cid}&type=${type}`,'getTag');
            if(res.status===200)
                if(Array.isArray(res.data)) setTags([...oData,...res.data])
        } catch (error) {
            console.error(error);
        } 
    };

    if(cid) fetchData();

},[cid,type]) 

  // 添加新标签
  const addTag = (newTag) => {
    const tag = {
      id: Date.now(), // 使用时间戳作为唯一ID
      name: newTag
    };
    setSelectTag([selectTag, tag]);
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
                onKeyDown={(e) => {if (e.key === "Enter") {addTag(e.target.value.trim()) }}}>
        </input>
      <div>
      {tags.map(tag => (
        <Button variant="light" key={tag.id} onClick={} className="tag-item">{tag.name}</Button>
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
          >×</button>
        </div>
      ))}
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover} show={showPopover} onToggle={(show) => setShowPopover(show)}>
            <Button variant="link" onClick={() => setShowPopover(!showPopover)}> 添加标签 </Button>
        </OverlayTrigger>

    </div>
  );
});

// CSS 样式
const styles = `
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
}

.delete-btn {
  border: none;
  background: none;
  color: #666;
  margin-left: 6px;
  cursor: pointer;
  padding: 0 4px;
}

.delete-btn:hover {
  color: #ff4444;
}

.add-btn {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  padding: 4px 8px;
}

.add-btn:hover {
  background: #f0faff;
}
`;

// 在文档中注入样式
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default TagShow;