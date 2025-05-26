import React, {useImperativeHandle,useRef, forwardRef, useState,useEffect } from "react";
import { PublicMess,LockSvg,SomeOne } from "../../lib/jssvg/SvgCollection";
import { InputGroup,Form,Row,Col } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl'

/**
 * 嗯文编辑时指定给特定的人选择
 * @currentObj 嗯文对象
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @children 留有一个插槽 用于放置 剩多少个文字， 把两个组件放在一行上
 */
const SCProperty = forwardRef(({children,currentObj,accountAr,isSC}, ref) => {
    const actor = useSelector((state) => state.valueData.actor)
    const t = useTranslations('ff')
    const div1Ref = useRef(null);  //属性选择窗口
    const div2Ref = useRef(null); //@用户窗口
    const selectRef=useRef() //@输入框
    const [showProperty,setShowProperty]=useState(false)  //属性选择窗口
    const [searInput,setSearInput]=useState(false)   //显示用户列表窗口
    //属性选择序号 1 公开，2 关注者， 3 @
    const [propertyIndex,setPropertyIndex]=useState(currentObj?.property_index?currentObj.property_index:1); 
    const [filterData,setFilterData]=useState(accountAr)  //过滤的用户
    const [selectUser,setSelectUser]=useState(currentObj?.account_at?JSON.parse(currentObj.account_at):[])  //选择的用户

    useImperativeHandle(ref, () => ({
      getData: ()=>{return propertyIndex},
      getAccount:()=>{ return (propertyIndex===3 && selectUser.length)?JSON.stringify(selectUser):''},
    }));

    const handleClickOutside = (event) => { //单击隐藏弹窗
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

    const onChange=(e)=>{
        let v=selectRef.current.value.toLowerCase().trim()
        if(v){
            const user = new Set(selectUser);
            let curData=accountAr.filter(o=>o.actor_name.toLowerCase().includes(v) && !user.has(o.actor_name) && o.actor_name.toLowerCase()!=actor?.actor_name?.toLowerCase());
            setFilterData(curData);
            if(curData.length) setSearInput(true); else setSearInput(false);
        }else setSearInput(false)
    }
    
    const handleSelect=(name)=>{
        setSelectUser([...selectUser,name]);
        setSearInput(false)
    }
    const handleCloseAlert=(idx)=>{
        selectUser.splice(idx, 1); 
        setSelectUser([...selectUser])
    }
    return (<>
      <Row >
         <Col>
         {!isSC && <button  className='btn btn-light'  onClick={e=>{setShowProperty(true)}}>
            {propertyIndex===1?
            <div className="d-flex align-items-center" ><PublicMess size={18} /> <span style={{display:'inline-block',paddingLeft:'4px'}} >{t('publicMess')}</span> </div>:propertyIndex===2?
            <div className="d-flex align-items-center" ><LockSvg size={24} /> <span>{t('followMess')}</span></div>:
            <div className="d-flex align-items-center" ><SomeOne size={24} /> <span>{t('someonrMess')}</span></div>
            }
        </button>}
         </Col>
         <Col className="col-auto" >{children}</Col>
         </Row>
        
       
         <div  style={{position:'relative'}}>
            {showProperty && <div ref={div2Ref} className="messpopup" style={{position:'absolute',zIndex:1300}} >
                <div className="messoption d-flex align-items-center" onClick ={e=>{setPropertyIndex(1);setShowProperty(false);}}> <PublicMess /> <div style={{paddingLeft:'8px'}} ><b>{t('publicMess')}</b><br/>{t('publicMess1')}</div></div>
                <div className="messoption d-flex align-items-center" onClick={e=>{setPropertyIndex(2);setShowProperty(false);}}> <LockSvg  /> <div style={{paddingLeft:'8px'}}><b>{t('followMess')}</b><br/>{t('followMess1')}</div></div>
                <div className="messoption d-flex align-items-center" onClick={e=>{setPropertyIndex(3);setShowProperty(false);}}> <SomeOne  /> <div style={{paddingLeft:'8px'}}><b>{t('someonrMess')}</b><br/>{t('someonrMess1')}</div></div>
            </div>
            }
          </div>
        {propertyIndex===3 && <>
            <InputGroup>
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control placeholder="Search user" ref={selectRef}  onKeyUp={onChange} onClick={e=>{onChange()}} />
            </InputGroup>
            <div  style={{position:'relative'}}>
            {searInput && <div ref={div1Ref}  className="messpopup" style={{position:'absolute',zIndex:1300}} >
              {filterData.map((obj,idx) => (
                  <div key={idx} className="messoption d-flex align-items-center" onClick ={e=>handleSelect(obj.actor_name,idx)}>
                    <img src={obj.avatar?obj.avatar:'/user.svg'} alt='' width={24} height={24} />
                    <span>{obj.actor_name}</span>
                    </div>
              ))}
              </div>
            }
          </div>
            {selectUser.map((namestr,idx) => (
                    <span key={idx} style={{display:'inline-block',paddingLeft:'10px'}} >
                    <b>{namestr}</b>{' '}
                    <svg onClick={e=>{handleCloseAlert(idx)}}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                        <path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                    </svg>
                    </span>
                ))
            }
            <hr/>
            </>
        }
      
    </>
    );
});

export default React.memo(SCProperty);
