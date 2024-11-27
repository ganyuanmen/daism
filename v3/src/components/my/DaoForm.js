import { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import DaismImg from '../form/DaismImg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { ethers } from 'ethers';
import { Accordion } from 'react-bootstrap';
import { useSelector} from 'react-redux';
import LoginButton from '../LoginButton';
import { client } from '../../lib/api/client';
import editStyle from '../../styles/editor.module.css'

export default function DaoForm({typeData,env,user,setRefresh,t,tc,setShow,closeTip,showErrorTip,showTip}) {
    const [addAr, setAddAr] = useState([]); //dao 成员模块 DOM内容，包含名称和票权
    const [errorManager, setErrorManager] = useState(false) //合约地址错误标记
    const [errorDaoName, setErrorDaoName] = useState(false) //dao名称错误标记
    const [errorDaoSymbol, setErrorDaoSymbol] = useState(false) //代币符号错误标记
    const [errorFirrstName, setErrorFirrstName] = useState(false) //第一个成员名称错误标记
    const [errorFirrstVote, setErrorFirrstVote] = useState(false) //第一个成员票权错误标记
    const [errorPerNumber, setErrorPerNumber] = useState(false) //每个成员mint数量 
    const [filteredData, setFilteredData] = useState([]);
    const [typeNameErr, setTypeNameErr] = useState(false) //
    const [typeDescErr, setTypeDescErr] = useState(false) //

    const [type,setType]=useState(1)
    // const editorRef=useRef()
    const typeNameRef=useRef()
    const [createName,setCreateName]=useState(false)  //creator 已存在
    const [errcontract,setErrcontract]=useState(false)  //creator 非法合约地址
    const [daoName,setDaoName]=useState(false)  //dao_name 已存在
    const [daoSymbol,setDaoSymbol]=useState(false)  //dao_symbol 已存在
    const [batch,setBatch]=useState(false) //是否同时mint NFT批量
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)  //siwe登录
 
    const imgRef=useRef()
    const loginRef=useRef()
        // const axios = require('axios');
    //地址检测 0x开头40位数字字母
    const checkAddress=(v)=>{return /^0x[A-Fa-f0-9]{40}$/.test(v);}
    //数字检测
    const checkNum=(v)=>{return /^[1-9][0-9]*$/.test(v);}
     //表单上数据合法性检测
    const myCheck = (form) => {
        let _err = 0;
        let _temp;

         _temp = form.createdao_name.value.trim(); //dao名称
        if (!_temp || _temp.length > 128) { _err = _err + 1; setErrorDaoName(true); setDaoName(false); }

        _temp = form.createdao_sysmobl.value.trim(); //dao符号
        if (!_temp || _temp.length > 128) { _err = _err + 1; setErrorDaoSymbol(true);  setDaoSymbol(false);}

        if(type===1) {
            _temp = form.createdao_manager.value.trim(); //合约地址
            if (!_temp || !checkAddress(_temp)) { _err = _err + 1; setErrorManager(true); setCreateName(false); setErrcontract(false); }
        }

         _temp = form.org_firstName.value.trim(); //第一个成员地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; setErrorFirrstName(true); }

         _temp=form.org_firstvote.value.trim(); //第一个成员票权
        if(!_temp || !checkNum(_temp) || parseInt(_temp)<0 || parseInt(_temp)>10000 ) {_err=_err+1; setErrorFirrstVote(true);}

        if(batch) {
        _temp=form.per_number.value.trim(); //每个mint 数量
        if(!_temp || !checkNum(_temp) || parseInt(_temp)>3 ) {_err=_err+1; setErrorPerNumber(true);}
        }

        

        //第二成员开始的地址和票权检测
        addAr.forEach(v=>{
            _temp=form['org_firstName' + v.index].value.trim();
            if(!_temp || !checkAddress(_temp) ) {_err=_err+1; v.isErr1=true;}
            _temp=form['org_firstvote' + v.index].value.trim();
            if(!_temp || !checkNum(_temp)|| parseInt(_temp)<0 || parseInt(_temp)>10000 ) {_err=_err+1; v.isErr2=true;}

        })
        return _err === 0;
    }

    const getType=(form)=>{

        let _mtype=form.type_name.value.trim()
        // app、apps、dapps
            if (!_mtype || _mtype.length>8 || _mtype==='app' || _mtype==='apps' || _mtype==='dapps') {
                setTypeNameErr(true)
                showErrorTip(t('checkError'));
                return undefined;
            }

            if (!form.type_desc.value.trim()) {
                setTypeDescErr(true)
                showErrorTip(t('checkError'));
                return undefined;
            }

            return {typeName:form.type_name.value.trim(),typeDesc:form.type_desc.value.trim()}
     

    }
    
    //注册事件
    const handleSubmit = (event) => {
      
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
      
        if (!myCheck(form)) {
            showErrorTip(t('checkError'));
            return;
        }

        let _type
        if(type===3) {
             _type=getType(form)
            if(_type===undefined) return; //检测不通过
        
    
            if(!loginsiwe){ //没有登录
                loginRef.current.siweLogin();
                return;
            }else { //保存到村地数据库
                client.post('/api/postwithsession','addEipType',{_type:_type.typeName,_desc:_type.typeDesc})
            }
        }

        const imgbase64=imgRef.current.getData()
        if(!imgbase64)
        {
            showErrorTip(t('noSelectImgText'))   
            return
        }
        showTip(tc("blockchainText3"))
        // 后台检测dao名称和符号是否有重名
        fetch(`/api/checkdao?daoName=${form.createdao_name.value.trim()}&daoSymbol=${form.createdao_sysmobl.value.trim().toUpperCase()}&creator=${type===1?form.createdao_manager.value.trim():'0x123'}&t=${(new Date()).getTime()}`)
        .then(async function (response) {
            if(response.status===200) {
                const imgstr =window.atob(imgbase64.split(',')[1]);
                let re=await response.json();
                if(!re.creator && !re.dao_name && !re.dao_symbol){
                    //生成成员名称和票权的数组
                    let members = [form.org_firstName.value.trim()];
                    let votes = [form.org_firstvote.value.trim()];
                    addAr.forEach(v=>{
                        members.push(form['org_firstName' + v.index].value.trim());
                        votes.push(form['org_firstvote' + v.index].value.trim())
                    })

                    let mintnftparas='0x'  //默认不mint NFT
                    
                    if(batch){  //同时mint nft
                        let abicoder=new ethers.AbiCoder()
                        let functionData=abicoder.encode(['address[]','uint256'],[members,form.per_number.value.trim()])
                        //打包
                        mintnftparas=abicoder.encode([ "address", "bytes" ], [env.DAismSingleNFT, functionData ]);
                    } 
                 
                    let daoinfo=[
                        form.createdao_name.value.trim(), 
                        form.createdao_sysmobl.value.trim().toUpperCase(), //+(_type?('.'+_type.typeName):''),
                        form.createdao_dsc.value.trim(),
                        type===1?form.createdao_manager.value.trim():user.account,
                        1,
                        type===1?'dapp':(type===2?'EIP':_type.typeName)
                    ]

                    window.daismDaoapi.Register.createSC(daoinfo,members,votes,imgstr,'svg',mintnftparas).then(re => {
                        setTimeout(() => {
                            closeTip()
                            setShow(false)  //关闭窗口
                            setRefresh(true)  //刷新dao列表
                        }, 1000);
                    }, err => {
                        closeTip();
                        if(err.message && (err.message.includes('bad address') || err.message.includes('sender must be contract')))
                        {
                            setErrcontract(true)
                            setCreateName(false)
                            setErrorManager(true)
                            showErrorTip("invalidAddress")
                        }
                        else {
                            console.error(err);
                            showErrorTip(tc('errorText') + (err.message ? err.message : err));
                        }
                    });

                } 
                else {  //重复
                    if(type===1) {
                        if(re.creator){
                            setCreateName(true)
                            setErrorManager(true)
                        }
                    }
                    if(re.dao_name){
                        setDaoName(true)
                        setErrorDaoName(true)
                    }
                    if(re.dao_symbol){
                        setDaoSymbol(true)
                        setErrorDaoSymbol(true)
                    }
                    closeTip()
                    showErrorTip(t('checkError'))
                }
            }else {
                showErrorTip(t('errorDataText'));
                closeTip()
        }

            
            }) //检查重名错误处理
        .catch(function (error) {
            showErrorTip(t('errorDataText'));
            console.error(error);
            closeTip()
        })
    

        
        event.preventDefault();
        event.stopPropagation();
    };
 
    //删除成员
    const delMember = (event) => {
        let _num = parseInt(event.currentTarget.getAttribute('data-key'));
        for (let i = 0; i < addAr.length; i++) {
            if (addAr[i].index === _num) {
                addAr.splice(i, 1);
                setAddAr([...addAr]);
            }
        }
    }
    
    //增加成员
    const addMember = (event) => {
        if (addAr.length)
            setAddAr([...addAr, {index:addAr[addAr.length-1].index+1,isErr1:false,isErr2:false}])
        else
            setAddAr([{index:0,isErr1:false,isErr2:false}])
    }

const _desc=`<pre><code>// SPDX-License-Identifier: MIT 
    pragma solidity ^0.8.20;
    contract ThreeDapp {
        address public owner;

        constructor(){
            owner = tx.origin;
        }
        
        function ownerOf() public view returns(address){
            return owner;
        }
    }
</code></pre>`

// 处理文本框输入变化
const handleInputChange = (e) => {
    const value = e.target.value;
    // setFilterText(value);
    // 根据输入值过滤数据
    const filtered = typeData.data.filter(item =>
      item.type_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };


    const stylea={display:'inline-block',textAlign:'right',width:'140px'}
    const set1=(e)=>{ 
        if(e.target.checked) setType(1)
    }
    const set2=(e)=>{ 
        if(e.target.checked) setType(2)
    }
    const set3=(e)=>{ 
        if(e.target.checked) setType(3)
    }
    return (<> 
        
        <Form onSubmit={handleSubmit}>
            <div className='mb-2' >
                <Form.Check inline label="dapp类型" name="group1" type="radio" checked={type===1} onChange={set1}  id="inlineradio1" />
                <Form.Check inline label="EIP类型" name="group1" type="radio"  checked={type===2} onChange={set2} id="inlineradio2" />
                <Form.Check inline label="其它类型" name="group1" type="radio"  checked={type===3} onChange={set3} id="inlineradio3" />
            </div>
        
       

           {/* 合约地址 */}
          {type===1 &&  <InputGroup hasValidation className="mb-2">
                <InputGroup.Text style={stylea} >{t('contractText')}</InputGroup.Text>
                <FormControl id='createdao_manager'    
                isInvalid={errorManager ? true : false} type="text" 
                onFocus={e => {setErrorManager(false)}} 
                placeholder="0x" defaultValue="" />
                <Form.Control.Feedback type="invalid">
                {createName?<span>{t('alreadyMint')} </span>:
                errcontract?<span>{t('invalidContract')}</span>:
                <span>{t('addressCheck')}</span>}
                </Form.Control.Feedback>
            </InputGroup>
            }

           { type===3 && <>
            <InputGroup hasValidation className="mb-1 mt-1">
                <InputGroup.Text style={stylea} >{t('typeName')}</InputGroup.Text>
                <FormControl id='type_name' ref={typeNameRef}  
                isInvalid={typeNameErr}  type="text" placeholder={t('typeName')} 
                onFocus={e=>{setTypeNameErr(false);setFilteredData([])}}   onChange={handleInputChange} />
                <Form.Control.Feedback type="invalid">{t('noEmptyorlg8')}</Form.Control.Feedback>
            </InputGroup>
            {filteredData.length > 0 && (
                <div className={editStyle.autocompleteitems}>
                    {filteredData.map((item, index) => (
                    <div key={index} className={editStyle.autocompleteitem} onClick={() =>{typeNameRef.current.value=item.type_name;setFilteredData([])} }>
                        {item.type_name}{'  '}{item.type_desc}
                    </div>
                    ))}
                </div>
            )}
            <InputGroup hasValidation className="mt-2 mb-2">
                <InputGroup.Text style={stylea} >{t('typeDesc')}</InputGroup.Text>
                <FormControl id='type_desc'   
                isInvalid={typeDescErr}  type="text" placeholder={t('typeDesc')}  
                onFocus={e=>{setTypeDescErr(false)}}   />
                <Form.Control.Feedback type="invalid">{t('noEmpty')}</Form.Control.Feedback>
            </InputGroup>
            </> }

          
             {/* 名称 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text style={stylea}>{t('nameText')}</InputGroup.Text>
                <FormControl id='createdao_name'    
                isInvalid={errorDaoName ? true : false} type="text" 
                onFocus={e => {setErrorDaoName(false)}} 
                placeholder={t('nameText')} defaultValue='' />
                <Form.Control.Feedback type="invalid">
                {daoName?<span>{t('alreadyUsed')} </span>:<span>{t('nameCheck')}</span>}
                </Form.Control.Feedback>
            </InputGroup>
            {/* 代币符号 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text style={stylea}>{t('tokenSymbol')}</InputGroup.Text>
                <FormControl id='createdao_sysmobl'   
                isInvalid={errorDaoSymbol ? true : false} type="text" 
                onFocus={e => {setErrorDaoSymbol(false)}} 
                placeholder={t('tokenSymbol')} defaultValue='' />
                <Form.Control.Feedback type="invalid">
                {daoSymbol?<span>{t('tokenUsed')} </span>:<span>{t('nameCheck')}</span>}
                </Form.Control.Feedback>
            </InputGroup> 



            {/* <Card className='mt-2 mb-2'>
                <Card.Body>
                <div className='mb-2' >{t('smartCommonType')}:</div>
                    <Form.Check inline label="eip" name="group1" onChange={e=>{setCustom(document.getElementById('customcheck').checked)}}  type='radio' id='eipcheck' />
                    <Form.Check inline label="ai" name="group1" onChange={e=>{setCustom(document.getElementById('customcheck').checked)}} type='radio' id='aicheck' />
                    <Form.Check inline label={t('customText')} checked={custom} onChange={e=>{setCustom(e.target.checked)}} name="group1" type='radio' id='customcheck' />
                    <Form.Check inline label={t('noneText')} name="group1" onChange={e=>{setCustom(document.getElementById('customcheck').checked)}} type='radio' id='nonecheck' />
                    {custom &&<>
                     
                    </>
                    }
                </Card.Body>
            </Card> */}
             
           
            {/* 第一个成员地址 */}
            <InputGroup hasValidation className="mb-0">
                <InputGroup.Text style={stylea} >{t('memberText')}</InputGroup.Text>
                <FormControl id='org_firstName'   
                isInvalid={errorFirrstName?true: false}  type="text" placeholder="0x"  
                onFocus={e=>{setErrorFirrstName(false)}} 
                 defaultValue={user.account} />
                <Form.Control.Feedback type="invalid">
                    {t('addressCheck')}
                </Form.Control.Feedback>
            </InputGroup>
            {/* 第一个成员票权 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text style={stylea} >{t('voteText')}</InputGroup.Text>
                <FormControl id='org_firstvote'   
                isInvalid={errorFirrstVote?true: false}  type="text" placeholder=""  
                onFocus={e=>{setErrorFirrstVote(false)}}  
                defaultValue="10" />
                <Button variant="primary"  
                onClick={addMember}>{t('addMember')}</Button>
                <Form.Control.Feedback type="invalid">
                    {t('voteValue')}
                </Form.Control.Feedback>
            </InputGroup>
          
            {/* 动态增加删除成员 */}
            {addAr.map((placement, idx) => (
                <div key={'org_'+idx} >
                    <InputGroup hasValidation className="mb-0">
                        <InputGroup.Text style={stylea} >{t('memberText')}</InputGroup.Text>
                        <FormControl id={'org_firstName' + placement.index}   
                        isInvalid={placement.isErr1?true: false} 
                        onFocus={e=>{placement.isErr1=false;setAddAr([...addAr])}}  type="text"
                        placeholder="0x" defaultValue="" />
                        <Form.Control.Feedback type="invalid">
                        {t('addressCheck')}
                         </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup hasValidation className="mb-2">
                        <InputGroup.Text style={stylea}>{t('voteText')}</InputGroup.Text>
                        <FormControl id={'org_firstvote' + placement.index}   
                        isInvalid={placement.isErr2?true: false} type="text"  
                        onFocus={e=>{placement.isErr2=false;setAddAr([...addAr])}} 
                         placeholder="" defaultValue="10" />
                        <Button variant="warning" data-key={placement.index} onClick={delMember}>{t('delMember')}</Button>
                        <Form.Control.Feedback type="invalid">
                        {t('voteValue')}
                         </Form.Control.Feedback>
                    </InputGroup>
                </div>
            ))}

        <DaismImg  ref={imgRef} title='logo'  maxSize={10240} fileTypes='svg' />
                {/* dao描述 */}
            <FloatingLabel className="mb-2" controlId="createdao_dsc" label={t('desctext')}>
                <Form.Control as="textarea"   
                    placeholder={t('desctext')}
                    style={{ height: '160px' }} />
            </FloatingLabel>
            {/* <RichTextEditor  defaultValue=''  title={t('desctext')}  editorRef={editorRef} /> */}


            <Form.Check className='mt-2' type="switch"  id="batch-switch" checked={batch} onChange={e=>{setBatch(e.currentTarget.checked)}} label={t('batchText')} />
           
           {batch && <> <InputGroup hasValidation className="mb-2 mt-3">
                        <InputGroup.Text style={{width:"240px"}} >{t('mintNumberText')}</InputGroup.Text>
                        <FormControl id='per_number'   
                        isInvalid={errorPerNumber?true: false}  type="text" placeholder="1"  
                        onFocus={e=>{setErrorPerNumber(false)}}     defaultValue="1" />
                        <Form.Control.Feedback type="invalid"> {t('mintValue')} </Form.Control.Feedback>
            </InputGroup>
          
            </>
            }


            <Accordion style={{boxShadow:'none !important'}} className='mt-2' >
                <Accordion.Item eventKey="0">
                    <Accordion.Header >mint smart commom {t('mintDescText')}</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li>{t('logoAlertText')};</li>
                            <li>{t('mintdesc1')}</li>
                            <li>{t('montdesc2')}</li>
                            <li>{t('smarcommondesc2')}</li>
                            <li>{t('smarcommondesc3')}</li>
                            <li> {t('smarcommondesc4')}</li>
                            <li>{t('voteDesc')}</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>  

            <Accordion style={{boxShadow:'none !important'}} className='mt-2' >
                <Accordion.Item eventKey="0">
                    <Accordion.Header > {t('hoorDescText')}</Accordion.Header>
                    <Accordion.Body>
                        <div className='mb-2'>daismRegistrar: {env.SCRegistrar}</div>
                        <div className='mb-2'>daismHonorTokens: {env.DAismSingleNFT}</div>
                        <div dangerouslySetInnerHTML={{ __html: _desc }} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>   

         
            <div className="d-grid gap-2 mt-3">
                <Button type="submit">mint {t('smartcommon')}</Button>
            </div>
        </Form><LoginButton command={true} ref={loginRef} /></>
    );
}