
import React, {useImperativeHandle,useRef, forwardRef,useState, useEffect } from "react";
import { useTranslations } from 'next-intl'
import { ethers } from 'ethers';

//downRef 输出区域  statusRef 状态区域 submitRef 提交按钮区域 balanceRef余额 inobj 上选择内容 isallow 授权 setVita 设置输入框价值
const InputBox = forwardRef(({inobj,downRef,statusRef,balanceRef,submitRef,isallow,setVita,user,gasPrice,priorty,comulate,utoken,iadd,price,ratioRef}, ref) => {
    const [inputError, setInputError] = useState('');//录入错误
    const errRef=useRef(false);//录入错误 由于setInputError是异步，用errRef同步检查
    const editRef=useRef()  //输入框
    const valueRef=useRef('0')   //输入值
    const t = useTranslations('iadd')
    var indexRef=useRef(0)
    var procRef=useRef([])
    
   
    //发生录入错误时 触发状态区域更新
    useEffect(()=>{statusRef.current.setStatus({...statusRef.current.state,err:inputError})},[inputError,statusRef])

    const inputChange = (event) => { //录入事件
        setInputError('');
        errRef.current=false;
        
        let _preValue=valueRef.current; //保存的值
        let _curValue=event.currentTarget.value.trim() //当前值
        if(!_curValue) _preValue="";
        else if(_curValue.slice(0,1)==="0" && _curValue.slice(1,2)!==".") _preValue="0"; //0开头，第二位必须是小数点
        else if(!isNaN(parseFloat(_curValue)) && isFinite(_curValue)) _preValue=_curValue   //是数值，当前值保存     
       
        event.currentTarget.value=_preValue
        if(parseFloat(valueRef.current)===parseFloat(_preValue)) return
        valueRef.current=_preValue
      
        setOutput() 
    }

    const clear = () => {editRef.current.value='';valueRef.current='0';}

    const getValue = () => {return valueRef.current};


    function setOutput(){
        let inputValue=parseFloat(valueRef.current)
        if(!inputValue) { //清空计算结果
            setVita('');
             downRef.current.setShowValue(0,0,0);
             if(user.connected===1)  setInputError(t('enter an amount')); 
            errRef.current=true; 
            statusRef.current.setStatus({...statusRef.current.state,gas:'',price:'',minValue:'',exValue:''})

        }
        else { 

             if(inputValue>parseFloat(balanceRef.current.getBalance())) {
                 errRef.current=true;
                 if(user.connected===1) setInputError(t('Insufficient balance'));
            }
            
            calcRatio(inputValue,indexRef.current++)
        
        }  //计算
        
       
        if(!isallow) {setInputError(t('unauthorizedText'));errRef.current=true;}
    }

    function getEther(v){return ethers.parseEther(v+'')}
    function fromEther(v){return  ethers.formatEther(v+'')}

    
    function handleDown(upvita,downVita,toValue,_index)
    {
        let a=procRef.current[procRef.current.length-1]
        if(a===_index)  //最后的异步
        {
        if(parseFloat(valueRef.current))  //不为0.没有删除时操作
            downRef.current.setShowValue(upvita,downVita,toValue) 
        }
    }

    function noSelect()
    {
        downRef.current.setShowValue(0,0,0) 
        setInputError('notshow')
        setVita('')
    }

    function handleState(obj,_index)
    {
        let a=procRef.current[procRef.current.length-1]
        if(a===_index)  //最后的异步
        {
            if(parseFloat(valueRef.current))  //不为0.没有删除时操作
                statusRef.current.setStatus({...statusRef.current.state,...obj})
            else 
                statusRef.current.setStatus({...statusRef.current.state,gas:'',price:'',minValue:'',exValue:''})
        }
       

        
    }

    
    async function getPool(_id) {
        
        let result= await iadd['pools'](_id);
        let utoken=parseFloat(ethers.formatEther(result.unit_token_supply))
        let token=parseFloat(ethers.formatEther(result.eip3712_supply))
        let price=utoken/token-0.01
        return {utoken,token,price};

    }
   

    //计算
    function calcRatio(inputValue,_index)
    {
        procRef.current.push(_index)
        downRef.current.setShowValue(0,0,-1) //输出框初始化
        let outobj=downRef.current.getToken();
        setVita('loading')
        if (inobj.token_id === -2) { //上窗口eth
           utoken.getOutputAmount(getEther(inputValue)).then(ethToutokenPrice=>{
                let upvita=parseFloat(fromEther(ethToutokenPrice[0]))
                setVita(upvita.toFixed(4))//价值显示
                if (outobj.token_id === -1) { //eth to utoken  
                    handleDown(upvita,upvita,upvita,_index)
                    handleState({
                        gas:((gasPrice+priorty)*price.e2u/1000000000).toFixed(8),
                        exValue:upvita.toFixed(6),
                        price:'',
                        minValue:''},_index)                    
                } else {  // eth to token
                    if (outobj.token_id) { 
                        comulate.unitTokenToSCToken(ethToutokenPrice[0], outobj.token_id).then(e => {
                            let toValue=parseFloat(fromEther(e))
                            getPool(outobj.token_id).then(e1=>{
                                let _price=e1.utoken/e1.token                          
                                handleDown(upvita,toValue*_price,toValue,_index)
                                handleState({
                                    gas:((gasPrice+priorty)*price.e2t/1000000000).toFixed(8),
                                    exValue:toValue.toFixed(6),
                                    price:((_price-(e1.utoken+upvita)/(e1.token-toValue))/_price*100).toFixed(2)+'%',
                                    minValue:(toValue*(1-ratioRef.current/100)).toFixed(6),
                                },_index)
                            })
                        })
                    }else noSelect() //没选择
                }
            });
           
         } else if (inobj.token_id === -1) { //上窗口utoekn
            let upvita=inputValue
            setVita(upvita.toFixed(4)) //价值显示
            if (outobj.token_id) { //utoken ==>token
                 comulate.unitTokenToSCToken(getEther(inputValue), outobj.token_id).then(e => {
                    let toValue=parseFloat(fromEther(e))
                    getPool(outobj.token_id).then(e1=>{
                        let _price=e1.utoken/e1.token                               
                        handleDown(upvita,toValue*_price,toValue,_index)
                        handleState({
                            gas:((gasPrice+priorty)*price.u2t/1000000000).toFixed(8),
                            exValue:toValue.toFixed(6),
                            price:((_price-(e1.utoken+upvita)/(e1.token-toValue))/_price*100).toFixed(2)+'%',
                            minValue:(toValue*(1-ratioRef.current/100)).toFixed(6),
                        },_index)
                    })
                 })
             }else noSelect() //没选择
         } else if (inobj.token_id) { //上窗口toekn
            getPool(inobj.token_id).then(e0=>{
                let _price=e0.utoken/e0.token
                let upvita=inputValue*_price
                setVita(upvita.toFixed(4)) //价值显示 
                comulate.SCTokenToUnitToken(getEther(inputValue), inobj.token_id).then(e => {
                    if (outobj.token_id === -1) {  //token to utoken
                        let downVita=parseFloat(fromEther(e))
                        handleDown(upvita,downVita,downVita,_index)
                        handleState({
                            gas:((gasPrice+priorty)*price.t2u/1000000000).toFixed(8),
                            price:((_price-(e0.utoken-upvita)/(e0.token+inputValue))/_price*100).toFixed(2)+'%',
                            minValue:(downVita*(1-ratioRef.current/100)).toFixed(6),
                            exValue:downVita.toFixed(6),
                        },_index)                        
                                           
                    } else {  //token to token
                        if (outobj.token_id) {
                            comulate.unitTokenToSCToken(e, outobj.token_id).then(e4 => {
                                let toValue=parseFloat(fromEther(e4))
                                handleDown(upvita,toValue*_price,toValue,_index)
                                handleState({
                                    gas:((gasPrice+priorty)*price.t2t/1000000000).toFixed(8),
                                    price:((_price-(e0.utoken-upvita)/(e0.token+inputValue))/_price*100).toFixed(2)+'%',
                                    minValue:(toValue*(1-ratioRef.current/100)).toFixed(6),
                                    exValue:toValue.toFixed(6)
                                },_index)        
                            })
                        }else noSelect() //没选择
                    }
                })       
            })
               
        }else noSelect() //没选择
    }

    

    useImperativeHandle(ref, () => ({
        clear:clear,getValue:getValue,setInputError:setInputError,
        setOutput:setOutput,
        // setSubmitButton:setSubmitButton,
        inputError:function(){return inputError},
        setRatio:function(v){ratioRef.current=v}
    }));

    return <>
    <input ref={editRef} type="text" placeholder="0.0" 
        onChange={inputChange}
        onFocus={() => { setInputError('');errRef.current=false;}} 
        // onBlur={handleInput}
        // onKeyDown={(e) => {if (e.key === "Enter") {e.currentTarget.blur()}}}
        style={
        { 
            color: inputError ? 'red' : '#0D111C',
            fontSize: '2rem', 
            width:'100%',
            minWidth:'120px',
            border: 0,
            backgroundColor:'transparent',
            outline:'none'
        }} />
    </>

});

export default InputBox;

