import React, {useImperativeHandle,useState,useRef, forwardRef, useEffect } from "react";
import {Form,Row,Col,InputGroup } from "react-bootstrap";
import editStyle from '../../../styles/editor.module.css'
import ImgUpload from "../../../pages/communities/enkier1/form/ImgUpload";
import ShowVideo from "./ShowVideo";
import VideoUpload from "../../../pages/communities/enkier1/form/VideoUpload";
import { PublicMess,LockSvg,SomeOne } from "../../../lib/jssvg/SvgCollection";

const Editor = forwardRef(({currentObj,nums,t,tc,accountAr}, ref) => {
  const delHtml=()=>{
    let temp=(currentObj?.content || '').replaceAll('</p><p>','\n')
    temp=temp.replaceAll('<p>','')
    temp=temp.replaceAll('</p>','')
    return temp
  }

  const geneType=()=>{
    if(currentObj?.top_img)
      {
        const ar=currentObj.top_img.split('.');
        return ar[ar.length-1]
      }else 
      {
        return '';
      }
  }
  const [filterData,setFilterData]=useState(accountAr)  //过滤的用户
  const [selectUser,setSelectUser]=useState(currentObj?.account_at?currentObj.account_at.split(','):[])  //选择的用户
  const [searInput,setSearInput]=useState(false)   //显示用户列表窗口
  const [inputValue, setInputValue] = useState(delHtml());  //文本框的值
  const [remainingChars, setRemainingChars] = useState(currentObj?.content? nums-currentObj.content.length:nums); //还余多少字符
  const [showProperty,setShowProperty]=useState(false)  //属性选择窗口
  const [propertyIndex,setPropertyIndex]=useState(currentObj?.property_index?currentObj.property_index:1); //属性选择序号 1 公开，2 关注者， 3 @
  const [fileStr,setFileStr]=useState(currentObj?.top_img?currentObj.top_img:'')  //选择图片
  const [videoUrl,setVideoUrl]=useState(currentObj?.vedio_url?currentObj.vedio_url:'')  //选择视频
  const [fileType,setFileType]=useState(geneType())
  const textareaRef = useRef(null);  //嗯文内容
  const selectRef=useRef() //@输入框
  const div1Ref = useRef(null);  //属性选择窗口
  const div2Ref = useRef(null); //@用户窗口
  const imgRef = useRef(null); //图片组件

  const handleClickOutside = (event) => {
    if (div1Ref.current && !div1Ref.current.contains(event.target)) {
      setSearInput(false)
    }
    if (div2Ref.current && !div2Ref.current.contains(event.target)) {
      setShowProperty(false)
    }
  };
  
   useEffect(() => {
      
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
   }, []);

  useImperativeHandle(ref, () => ({
    getData: ()=>{return inputValue},
    getImg:()=>{return fileStr?imgRef.current.getFile():null},
    getFileType:()=>{return fileType},
    getVedioUrl:()=>{return videoUrl},
    getProperty:()=>{return propertyIndex},
    getAccount:()=>{return propertyIndex===3?selectUser.join(','):''},
    notValid:(errorText)=>{setInvalidText(errorText);}
  }));

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight+6}px`;
  }, [inputValue]);

 
  //输入处理
  const onInput = (e) => {
    const value = e.target.value;
    if (value.length <= nums) {
      setRemainingChars(nums - value.length);
    } else 
    {
        setInputValue(value.slice(0, nums));
    }
  };

  const handleSelect=(name)=>{
   setSelectUser([...selectUser,name]);
   setSearInput(false)
  }
  const handleCloseAlert=(idx)=>{
    // setFilterData([...filterData,name]);
    selectUser.splice(idx, 1); 
    setSelectUser([...selectUser])
  }
  
  const onChange=(e)=>{
    // console.log(e.target)
    let v=selectRef.current.value.toLowerCase().trim()
    //(e.target.value || e.currentTarget.value).toLowerCase().trim()
    if(v){
        const user = new Set(selectUser);
        let curData=accountAr.filter(o=>o.actor_name.toLowerCase().includes(v) && !user.has(o.actor_name));
        setFilterData(curData);
        if(curData.length) setSearInput(true); else setSearInput(false);
    }else setSearInput(false)
  }
  return (
  <>
    <textarea className="form-control" ref={textareaRef} rows={5}   onInput={onInput}  value={inputValue}  onChange={(e) => setInputValue(e.target.value)} />
    <Row className="mt-1" style={{position:'relative'}} >
      <Col><div className={editStyle.charcount}>{t('remainingText')}: {remainingChars} </div></Col>
      <Col>
        <ImgUpload ref={imgRef} tc={tc} t={t} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'  fileStr={fileStr} setFileStr={setFileStr} setFileType={setFileType} />
        <VideoUpload tc={tc} t={t} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      </Col>
      <Col >
      <button className='btn btn-light btn-sm'  onClick={e=>{setShowProperty(true)}}>
        {propertyIndex===1?
          <div className="d-flex align-items-center" ><PublicMess size={24} /> <span>{t('publicMess')}</span> </div>:propertyIndex===2?
          <div className="d-flex align-items-center" ><LockSvg size={24} /> <span>{t('followMess')}</span></div>:
          <div className="d-flex align-items-center" ><SomeOne size={24} /> <span>{t('someonrMess')}</span></div>
        }
      </button>
      {showProperty && <div ref={div2Ref} className="messpopup" style={{position:'absolute',zIndex:1300,top:'40px',right:'2px'}} >
        <div className="messoption d-flex align-items-center" onClick ={e=>{setPropertyIndex(1);setShowProperty(false);}}><PublicMess  /> <div><b>{t('publicMess')}</b><br/>{t('publicMess1')}</div></div>
        <div className="messoption d-flex align-items-center" onClick={e=>{setPropertyIndex(2);setShowProperty(false);}}><LockSvg  /> <div><b>{t('followMess')}</b><br/>{t('followMess1')}</div></div>
        <div className="messoption d-flex align-items-center" onClick={e=>{setPropertyIndex(3);setShowProperty(false);}}><SomeOne  /> <div><b>{t('someonrMess')}</b><br/>{t('someonrMess1')}</div></div>
      </div>
      }
      {searInput && <div ref={div1Ref}  className="messpopup" style={{position:'absolute',zIndex:1300,top:'74px',left:'52px'}} >
        {filterData.map((obj,idx) => (
            <div key={idx} className="messoption d-flex align-items-center" onClick ={e=>handleSelect(obj.actor_name,idx)}>
              <img src={obj.avatar?obj.avatar:'/user.svg'} alt='' width={24} height={24} />
              <span>{obj.actor_name}</span>
              </div>
        ))}
        </div>
      }
      </Col>
    </Row>
    <div>
      {propertyIndex===3 && <>
      <InputGroup className="mb-3">
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control placeholder="Search user" ref={selectRef}  onKeyUp={onChange} onClick={e=>{onChange()}} />
      </InputGroup>
      {selectUser.map((namestr,idx) => (
            <span key={idx} style={{display:'inline-block',paddingLeft:'10px'}} >
              <b>{namestr}</b>{' '}
              <svg onClick={e=>{handleCloseAlert(namestr,idx)}}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                <path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
              </svg>
              </span>
        ))}
     
      </>

      }
      {fileStr &&
        <div className="mt-2 mb-2" style={{position:'relative'}} > 
            <img alt="" src={fileStr} style={{width:'100%'}} />
            <button style={{position:'absolute',top:'0px', right:'0px'}}  className='btn btn-light'  onClick={e=>{setFileStr('');setFileType('');}}>{tc('clearText')}</button>
        </div>
      }
      {videoUrl && 
      <div className="mb-2" style={{position:'relative'}}> 
        <ShowVideo videoUrl={videoUrl} title='' /> 
        <button style={{position:'absolute',top:'0px', right:'0px'}}  className='btn btn-light'  onClick={e=>{setVideoUrl('')}}>{tc('clearText')}</button>
      </div>
      }
    </div>
  </>
 
  );
});

export default React.memo(Editor);

