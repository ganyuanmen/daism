import { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useDispatch} from 'react-redux';
import DaismImg from '../form/DaismImg';
import {setTipText,setMessageText} from '../../data/valueData'
import { Alert } from 'react-bootstrap';
/**
 * dao注册模块
 * user 用户信息
 */
export default function DaoForm({ user,setRefresh,t,tc,setShow}) {
    const [addAr, setAddAr] = useState([]); //dao 成员模块 DOM内容，包含名称和票权
    const [errorManager, setErrorManager] = useState(false) //合约地址错误标记
    const [errorDaoName, setErrorDaoName] = useState(false) //dao名称错误标记
    const [errorDaoSymbol, setErrorDaoSymbol] = useState(false) //代币符号错误标记
    const [errorFirrstName, setErrorFirrstName] = useState(false) //第一个成员名称错误标记
    const [errorFirrstVote, setErrorFirrstVote] = useState(false) //第一个成员票权错误标记
    const [createName,setCreateName]=useState(false)  //creator 已存在
    const [errcontract,setErrcontract]=useState(false)  //creator 非法合约地址
    const [daoName,setDaoName]=useState(false)  //dao_name 已存在
    const [daoSymbol,setDaoSymbol]=useState(false)  //dao_symbol 已存在

        const dispatch = useDispatch();
        function showTip(str){dispatch(setTipText(str))}
        function closeTip(){dispatch(setTipText(''))}
        function showErrorTip(str){dispatch(setMessageText(str))}

    const imgRef=useRef()
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

        _temp = form.createdao_manager.value.trim(); //合约地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; setErrorManager(true); setCreateName(false); setErrcontract(false); }

         _temp = form.org_firstName.value.trim(); //第一个成员地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; setErrorFirrstName(true); }

         _temp=form.org_firstvote.value.trim(); //第一个成员票权
        if(!_temp || !checkNum(_temp) || parseInt(_temp)<4 || parseInt(_temp)>10000 ) {_err=_err+1; setErrorFirrstVote(true);}

        //第二成员开始的地址和票权检测
        addAr.forEach(v=>{
            _temp=form['org_firstName' + v.index].value.trim();
            if(!_temp || !checkAddress(_temp) ) {_err=_err+1; v.isErr1=true;}
            _temp=form['org_firstvote' + v.index].value.trim();
            if(!_temp || !checkNum(_temp)|| parseInt(_temp)<4 || parseInt(_temp)>10000 ) {_err=_err+1; v.isErr2=true;}

        })
        return _err === 0;
    }

    
    //注册事件
    const handleSubmit = (event) => {
      
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
      
        if (!myCheck(form)) showErrorTip(t('checkError'));
        else {
            if(!imgRef.current.getBinary())
            {
                showErrorTip(t('noSelectImgText'))   
                return
            }
            showTip(tc("blockchainText3"))
            // 后台检测dao名称和符号是否有重名
            fetch(`/api/checkdao?daoName=${form.createdao_name.value.trim()}&daoSymbol=${form.createdao_sysmobl.value.trim()}&creator=${form.createdao_manager.value.trim()}&t=${(new Date()).getTime()}`)
            .then(async function (response) {
                if(response.status===200)
                {
                    let re=await response.json();
                    if(!re.creator && !re.dao_name && !re.dao_symbol){
                        //生成成员名称和票权的数组
                        let members = [form.org_firstName.value.trim()];
                        let votes = [form.org_firstvote.value.trim()];
                        addAr.forEach(v=>{
                            members.push(form['org_firstName' + v.index].value.trim());
                            votes.push(form['org_firstvote' + v.index].value.trim())
                        })
                        let daoinfo=[
                            form.createdao_name.value.trim(), 
                            form.createdao_sysmobl.value.trim(),
                            form.createdao_dsc.value.trim(),
                            form.createdao_manager.value.trim() ,
                            1
                        ]

                        window.daismDaoapi.Register.createSC(daoinfo,members,votes,imgRef.current.getBinary(), 
                        imgRef.current.getFileType()==='svg'?'zip':imgRef.current.getFileType()).then(re => {
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
                    } else 
                    {
                        if(re.creator){
                            setCreateName(true)
                            setErrorManager(true)
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
                }else showErrorTip(t('errorDataText'));

               
                }) //检查重名错误处理
            .catch(function (error) {
                showErrorTip(t('errorDataText'));
                console.error(error);
            })
        }

        
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
    
    const stylea={display:'inline-block',textAlign:'right',width:'140px'}

    return (
        <Form onSubmit={handleSubmit}>
           {/* 合约地址 */}
            <InputGroup hasValidation className="mb-2">
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
             <div>
                <ul>
                    <li>{t('mintdesc1')}</li>
                    <li>{t('montdesc2')}</li>
                </ul>
            </div>
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
            <DaismImg  ref={imgRef} title='logo'  maxSize={10480} fileTypes='svg,jpg,jpeg,png,gif,webp,zip' />
            <Alert>{t('logoAlertText')} </Alert>
           
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
            <div className='mb-2' >
            {t('voteDesc')}
            </div>
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

         
                {/* dao描述 */}
            <FloatingLabel className="mb-2" controlId="createdao_dsc" label={t('desctext')}>
                <Form.Control as="textarea"   
                    placeholder={t('desctext')}
                    style={{ height: '160px' }} />
            </FloatingLabel>
                <div className='mb-2' >
                   {t('smarcommondesc1')}：
                   <ul>
                    <li>{t('smarcommondesc2')}</li>
                    <li>{t('smarcommondesc3')}</li>
                   </ul>
                   {t('smarcommondesc4')}
                </div>

                
            <div className="d-grid gap-2">
                <Button type="submit">mint {t('smartcommon')}</Button>
            </div>
        </Form>
    );
}