'use client'
import {Button, Card } from 'react-bootstrap'
import UpBox from '@/components/iadd/UpBox'
import DownBox from '@/components/iadd/DownBox';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Contract, ethers, type FeeData } from 'ethers';
import SubmitButton from '@/components/iadd/SubmitButton';
import StatusBar from '@/components/iadd/StatusBar';
import usePrice from "@/hooks/usePrice";
import ShowErrorBar from "@/components/ShowErrorBar";
import { useTranslations } from 'next-intl'
import {type RootState} from '@/store/store';
import Image from 'next/image';
import {type tipType } from '@/components/iadd/TipWin';
import {type StatusBarState }  from '@/components/iadd/StatusBar';
import { getDaismContract } from '@/lib/globalStore';

export default function IADD() {
    const t = useTranslations('iadd');
    const tc = useTranslations('Common');
    const [gasPrice,setGasPrice]=useState(0)  //gas基本费用
    const [priorty,setPriority]=useState(0)  //矿工费用

    //上层和下层选择的token
    const [inObj, setInObj] = useState<DaismToken>({dao_id:-2,dao_logo:'/eth.png',dao_name:'ETH',dao_symbol:'ETH',delegator:'',token_cost:0,token_id:-2});
    const [outObj, setOutObj] = useState<DaismToken>({dao_id:0,dao_logo:'',dao_name:'',dao_symbol:t('selectTokenText'),delegator:'',token_cost:0,token_id:0});
    const [tokenValue, setTokenValue] = useState(0); //上层输入的兑换值
    const [toValue, setToValue] = useState(0); //下层输出值 -1 为loading
    const [tipValue, setTipValue] = useState<tipType>({
      isShowTip:false, //不显示打赏窗口
      value:0,  //打赏金额
      isTip:false, //是否要打赏
      isBurn:false, //是否要锻造
      isNft:false, //是否mint NFT
      selectToken:true //当token->token时，选择哪个, true 为下层，false 为上层
    });  //打赏输入值
    const [upTokenPrice, setUpTokenPrice] = useState("");  //选择token的单价，在右侧 
    const [downTokenPrice, setDownTokenPrice] = useState("");  //选择token的单价，在右侧 
    const ethBalance = useSelector((state:RootState) => state.valueData.ethBalance);
    const utoBalance = useSelector((state:RootState) => state.valueData.utoBalance);
    const [upVita, setUpVita] = useState("0");  //上层vita 在左侧，根据录入值计算
    const [downVita, setDownVita] = useState("0");  //下层vita 在左侧，根据录入值计算
    const [upBalance, setUpBalance] = useState(ethBalance);  //上层余额
    const [downBalance, setDownBalance] = useState("0");  //下层余额
    const [inputError, setInputError] = useState('');//录入错误
    const [showButton,setShowButton]=useState(false);
    const [unitToken,setUnitToken]=useState<Contract | undefined>(undefined)
    const [status, setStatus] = useState<StatusBarState>({ratio:'',gas: '',price: '',minValue: '',exValue: ''
      ,slippage:0.3 // 滑点值 0.3%
    });
    const price=usePrice()  //历史gas 费用  
    const user = useSelector((state:RootState) => state.valueData.user) as DaismUserInfo;

    const inObjRef = useRef<DaismToken>(inObj);
    const outObjRef = useRef<DaismToken>(outObj);
    const upBalanceRef=useRef<string>(upBalance);

    let daismObj=getDaismContract();
    const NOSELECTTOKEN={dao_id:0,dao_logo:'',dao_name:'',dao_symbol:t('selectTokenText'),delegator:'',token_cost:0,token_id:0};

    useEffect(()=>{upBalanceRef.current=upBalance; },[upBalance])

       
    useEffect(() => {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_HTTPS_URL);
      setUnitToken(new Contract(
        process.env.NEXT_PUBLIC_UNITTOKEN as string,
        ["function getOutputAmount(uint256) view returns(uint256,uint256,uint256)"],
        provider));

      const getPrice = async () => {
        try {
          const feeData: FeeData = await provider.getFeeData();
          if (feeData.gasPrice) setGasPrice(parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei')));
          if (feeData.maxPriorityFeePerGas)
            setPriority(parseFloat(ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')));
        } catch (err) {
          console.error(err);
        }
      };
  
      getPrice(); // 立即获取一次
      const interval = setInterval(getPrice, 30_000); // 每 30 秒获取一次
      return () => clearInterval(interval);
    }, []);




    useEffect(()=>{ if(inObjRef.current.token_id===-2) setUpBalance(ethBalance);},[ethBalance])
    useEffect(()=>{ 
      if(inObjRef.current.token_id===-1) setUpBalance(utoBalance);
      if(outObjRef.current.token_id===-1) setDownBalance(utoBalance);
    },[utoBalance])

    useEffect(()=>{
    if(user.connected===1) {
      daismObj=getDaismContract();
      if(inObjRef.current.token_id===-2) setUpBalance(ethBalance);
      else if(inObjRef.current.token_id===-1) setUpBalance(utoBalance);

      if(outObjRef.current.token_id===-1) setDownBalance(utoBalance);
    }
    else {
      daismObj=undefined; 
      setUpVita('');setDownVita('');
      if(inObjRef.current.token_id===-2) setUpBalance('0');
      else if(inObjRef.current.token_id===-1) setUpBalance('0');

      if(outObjRef.current.token_id===-1) setDownBalance('0');
      

    }
    },[user])
   
 

    const setShowValue=(upVita:number,downVita:number,value:number)=>{ 
      if(value>0){  
          let ratio=Math.round((downVita-upVita)/upVita*10000)/100
          setDownVita(`${downVita.toFixed(6)} (${ratio}%)`);
          setToValue(Math.round(value*1000000)/1000000)
      } else {
          setDownVita('');
          setToValue(value); //-1//-1 是loading
      }
     
    }

    let requestInputChangeId=0;
    //兑换值或打赏值变动触发计算
    const calcStatus=async (value:number, tip_valu:number,in_id:number,out_id:number)=>{
      if(value<=0){
        setUpVita('');setDownVita('');setToValue(0); setInputError(t('enter an amount')); 
        setStatus(pre=>({...pre,minValue:'',exValue:''}));
        return;
      }
      if(in_id===0 || out_id===0) {
        setDownVita(''); setToValue(0);setInputError(t('selectTokenText')); 
        setStatus(pre=>({...pre,minValue:'',exValue:''}));
        return;

      }

      setToValue(-1);
      setUpVita('loading');
      setInputError('');
    
      if (!daismObj) daismObj = getDaismContract();
      const id = ++requestInputChangeId;
      // 获取路径key并执行对应的处理函数
      const key =(in_id === -2 ? "eth" : in_id === -1 ? "uto" : "token") +
      "_" +(out_id === -1 ? "uto" : out_id > 0 ? "token" : out_id);

      const handler = inputValueListenHandlers[key];
      if (handler) {await handler( value,tip_valu,id);}

    
      if(value>parseFloat(upBalanceRef.current)) setInputError(t('Insufficient balance'));
       

    }
    //兑换后清空数据 需要传入tipValue, 是因为的tip 在触发事件中，setTipVlaue   是异步的，没能实时保存到tipValue
    const clearStutes = (upBalace:string, downBalance:string) => {
      setUpBalance(parseFloat(upBalace).toFixed(6))
      setDownBalance(parseFloat(downBalance).toFixed(6))
      setTokenValue(0);
      setToValue(0);
      setUpVita('');
      setDownVita('');
    }
    
    function getEther(v:string|number|bigint){return ethers.parseEther(v+'')}
    function getUtoEther(v:string|number|bigint){return ethers.parseUnits(v+'',8)}
    function fromEther(v:string|number|bigint){return  ethers.formatEther(v+'')}
    function fromUtoken(v:string|number|bigint){return  ethers.formatUnits(v+'',8)}

      // 1. 定义路径处理函数（映射表的值）
    const inputValueListenHandlers:Record<string,(value:number,tip_value:number,id:number) => Promise<void>>  = {
      'eth_uto': async (value,tip_value,id) => { //没有打赏功能，但有锻造NFT选择
        console.info(tip_value)
        const contractObj=daismObj?daismObj.UnitToken:unitToken;
        const e = await contractObj?.getOutputAmount(getEther(value));
        if(!e || !e[0]) return;
        const _upvita = parseFloat(fromUtoken(e[0]));
        setUpVita(_upvita.toFixed(6));
        setShowButton(value>parseFloat(upBalanceRef.current));
        if(id===requestInputChangeId) {
          setShowValue(_upvita, _upvita, _upvita);
          setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.e2u / 1000000000).toFixed(8),
            exValue: _upvita.toFixed(6),price: '', minValue: ''
           }))
        }
      },

      'eth_token': async (value,tip_value,id) => { //有打赏，锻造nft，打赏nft
        const ethToutokenPrice = await daismObj?.UnitToken.getOutputAmount(getEther(value));
        if(!ethToutokenPrice || !ethToutokenPrice[0]) return;
        const _upvita = parseFloat(fromUtoken(ethToutokenPrice[0]));
        setUpVita(_upvita.toFixed(6));
        const e = await daismObj?.Commulate.unitTokenToDaoToken(ethToutokenPrice[0], outObjRef.current.token_id);
        if(!e) return;
        let toValue = parseFloat(fromEther(e));
        // 处理打赏
        if (tip_value > 0) {
          const re = await daismObj?.Commulate.unitTokenToDaoToken(getUtoEther(tip_value), outObjRef.current.token_id);
          if (re) toValue = toValue - parseFloat(fromEther(re));
        }
        setShowButton(value>parseFloat(upBalanceRef.current) || toValue<=0);
        const e1 = await daismObj?.IADD.getPool(outObjRef.current.token_id);
        if(!e1) return;
        const _price = e1.utoken / e1.token;        
        if(id===requestInputChangeId) {
          if(toValue<=0)  setInputError(t('notTipText')); 
          setShowValue(_upvita, toValue * _price, toValue);
          setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.e2t / 1000000000).toFixed(8),
            price: ((_price - (e1.utoken + _upvita) / (e1.token - toValue)) / _price * 100).toFixed(2) + '%',
            minValue:toValue>0? (toValue * (1 - status.slippage / 100)).toFixed(6):'0',
            exValue:toValue>0?toValue.toFixed(6):'0'
            }))
        }
        
      },

      'uto_token': async (value,tip_value,id) => { //有打赏，打赏nft
        const _upvita = value;
        let _tipToValue=0;
        setUpVita(_upvita.toFixed(6));
        //处理打赏
        if(tip_value > 0) {
          const ew = await daismObj?.Commulate.unitTokenToDaoToken(getUtoEther(tip_value), outObjRef.current.token_id);
          if(ew)  _tipToValue = parseFloat(fromEther(ew));
        }
      
        const e = await daismObj?.Commulate.unitTokenToDaoToken(getUtoEther(value), outObjRef.current.token_id);
        if(!e) return;
        const toValue = parseFloat(fromEther(e))-_tipToValue;
        const e1 = await daismObj?.IADD.getPool(outObjRef.current.token_id);
        if(!e1) return;
        const _price = e1.utoken / e1.token;        
        if(id===requestInputChangeId) {
          setShowValue(_upvita, toValue * _price, toValue);
          if(toValue<=0) setInputError(t('notTipText')); 
          setShowButton(value>parseFloat(upBalanceRef.current) || toValue<=0);
          setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.u2t / 1000000000).toFixed(8),
            price: ((_price - (e1.utoken + _upvita) / (e1.token - toValue)) / _price * 100).toFixed(2) + '%',
            minValue:toValue>0? (toValue * (1 - status.slippage / 100)).toFixed(6):'0',
            exValue:toValue>0? toValue.toFixed(6):'0',
          }));
         
          
        }       
      },

      'token_uto': async (value,tip_value,id) => {
        const e0 = await daismObj?.IADD.getPool(inObjRef.current.token_id);
        if(!e0) return;
        const _price = e0.utoken / e0.token;
        const _upvita = value * _price;
        setUpVita(_upvita.toFixed(6));
        
        const e = await daismObj?.Commulate.daoTokenToUnitToken(getEther(value), inObjRef.current.token_id);
        if(!e)  return;
        let _downVita = parseFloat(fromUtoken(e));
        let toValue = _downVita;
        
        // 处理打赏
        if (tip_value > 0) {toValue = toValue - tip_value;}
        
        setShowButton(value>parseFloat(upBalanceRef.current) || toValue<=0);

        if(id===requestInputChangeId){
          setShowValue(_upvita, _downVita, toValue);
          if(toValue<=0)  setInputError(t('notTipText')); 
          setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.t2u / 1000000000).toFixed(8),
            price: ((_price - (e0.utoken - _upvita) / (e0.token + value)) / _price * 100).toFixed(2) + '%',
            minValue:toValue>0?(_downVita * (1 - status.slippage / 100)).toFixed(6):'0',
            exValue:toValue>0? _downVita.toFixed(6):'0',
            }));
        } 
      },

      'token_token': async (value,tip_value,id) => {
        const e0 = await daismObj?.IADD.getPool(inObjRef.current.token_id);
        if(!e0) return;
        const _price = e0.utoken / e0.token;
        const _upvita = value * _price;
        setUpVita(_upvita.toFixed(6));
        const e = await daismObj?.Commulate.daoTokenToUnitToken(getEther(value), inObjRef.current.token_id);
        if(!e) return;
        let _uto = 0;
        if (tip_value > 0) _uto = tip_value;
        
        const _amout = parseFloat(fromUtoken(e)) - _uto;
        
        if (_amout > 0) {
          const e4 = await daismObj?.Commulate.unitTokenToDaoToken(getUtoEther(_amout.toFixed(6)), outObjRef.current.token_id);
          if(!e4) return;
          const toValue = parseFloat(fromEther(e4));
          setShowButton(value>parseFloat(upBalanceRef.current) || _amout <=30);
          if(id===requestInputChangeId){
            setShowValue(_upvita, toValue * _price, toValue);
            setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.t2t / 1000000000).toFixed(8),
              price: ((_price - (e0.utoken - _upvita) / (e0.token + value)) / _price * 100).toFixed(2) + '%',
              minValue: (toValue * (1 - status.slippage / 100)).toFixed(6),
              exValue: toValue.toFixed(6),
             }))
          }
         
        } else {
          setInputError(t('notTipText'));
          setShowButton(false);
          if(id===requestInputChangeId){
            setToValue(0);
            setDownVita('');
            setStatus(prevStatus => ({ ...prevStatus, gas: ((gasPrice + priorty) * price.t2t / 1000000000).toFixed(8),
              price: ((_price - (e0.utoken - _upvita) / (e0.token + value)) / _price * 100).toFixed(2) + '%',
              minValue: '0',
              exValue: '0',
             }))
          }
        }
      }
    };

    const tokenSelectHandlers: Record<string,( id:number) => Promise<void>> = {
    "eth_uto": async (id) => {
      const ethToutokenPrice = await daismObj?.UnitToken.getOutputAmount(getEther(1));
      if(!ethToutokenPrice) return;
      if(id===requestSelectId) 
        setStatus(prevStatus => ({ ...prevStatus, ratio:`1 ETH = ${fromUtoken(ethToutokenPrice[0])} UTO` }))
      
    },
    "eth_token": async (id) => {
      const ethToutokenPrice = await daismObj?.UnitToken.getOutputAmount(getEther(1));
      if(!ethToutokenPrice) return;
      const e = await daismObj?.Commulate.unitTokenToDaoToken(ethToutokenPrice[0], outObjRef.current.token_id);
      if(!e) return;
      if(id===requestSelectId)
        setStatus(prevStatus => ({ ...prevStatus, ratio:`1 ETH = ${fromEther(e)} ${outObjRef.current.dao_symbol}`}));
     
    },

    "uto_token": async (id) => {
      const e = await daismObj?.Commulate.unitTokenToDaoToken(getUtoEther(1), outObjRef.current.token_id);
      if(!e) return;
      if(id===requestSelectId)
        setStatus(prevStatus => ({ ...prevStatus, ratio:`1 UTO = ${fromEther(e)} ${outObjRef.current.dao_symbol}`}));
      
    },

    "token_uto": async (id) => {
      const e = await daismObj?.Commulate.daoTokenToUnitToken(getEther(1), inObjRef.current.token_id);
      if(!e) return;
      if(id===requestSelectId)
        setStatus(prevStatus => ({ ...prevStatus, ratio:`1 ${inObjRef.current.dao_symbol} = ${fromUtoken(e)} UTO`}));
      
    },
    "token_token": async (id) => {
      const e = await daismObj?.Commulate.DaoTokenToDaoToken(getEther(1), inObjRef.current.token_id, outObjRef.current.token_id);
      if(!e) return;
      if(id===requestSelectId)
        setStatus(prevStatus => ({ ...prevStatus, ratio:`1 ${inObjRef.current.dao_symbol} = ${fromEther(e[0])} ${outObjRef.current.dao_symbol}`}))
    },
    };

    const handNoSelect=(flag:'up'|'down')=>{
      
      setTipValue(pre=>({...pre,isShowTip:false,isTip:false,value:0}));
      setStatus(pre=>({...pre,ratio:''}));
      setShowButton(false);
      setInputError(t('selectTokenText'));
      setToValue(0);
      if(flag==='up') {
        setOutObj(NOSELECTTOKEN);
        outObjRef.current=NOSELECTTOKEN;
        setDownTokenPrice('');
        setDownBalance('0');
        setDownTokenPrice('');
        setDownVita('');
      }else {
        setInObj(NOSELECTTOKEN);
        inObjRef.current=NOSELECTTOKEN;
        setUpTokenPrice('');
        setUpBalance('0');
        setUpTokenPrice('');
        setUpVita('');
      }
   
    }
    let requestBalanceId = 0; //只保证最后一个请求更新界面
    let requestPriceId = 0; //只保证最后一个请求更新界面

    //计算token 单价
    const getPrice=async (id:number,flag:'up'|'down')=>{
      const ex_id = ++requestBalanceId; // 当前请求的编号
      const re=await daismObj?.IADD.getPool(id);
      if (ex_id === requestBalanceId){ // 只更新最新请求的结果
        if(re)
          { 
            if(flag==='up')
              setUpTokenPrice(re.price>0?re.price.toFixed(6):'0');
            else 
              setDownTokenPrice(re.price>0?re.price.toFixed(6):'0');
          }
      }
    }
  
    //计算余额
    const getBalance=async (id:number,flag:'up'|'down')=>{
      const ex_id = ++requestPriceId; // 当前请求的编号
      const re=await daismObj?.DaoToken.balanceOf(id,user.account);
      if (ex_id === requestPriceId){ // 只更新最新请求的结果
        if(re) {
          const v=+re.token;
          if(flag==='up') upBalanceRef.current=v>0?v.toFixed(6):'0';
          else setDownBalance(v>0?v.toFixed(6):'0');
  
        }
      }
    }

    let requestSelectId=0;
    //选择token 触发
    const slectToken=async (obj:DaismToken,flag:'up'|'down')=>{
      if(!daismObj) daismObj=getDaismContract();
      //重复选择
      let selectToken=flag==='up'?inObj:outObj;
      if(obj.token_id===selectToken.token_id) return; 

      let otherToken=flag==='up'?outObj:inObj;
      if(obj.token_id===otherToken.token_id) handNoSelect(flag); //上下选择相同

      //单价
      if (obj.token_id<0) {if(flag==='up') setUpTokenPrice(''); else setDownTokenPrice('');} //eth 和utoken
      else if(obj.token_id>0) await getPrice(obj.token_id,flag) //token 
      
      //token 余额
      if(obj.token_id===-2) upBalanceRef.current=ethBalance;
      else if(obj.token_id===-1) {if(flag==='up') upBalanceRef.current=utoBalance; else setDownBalance(utoBalance);}
      else if(obj.token_id>0) await getBalance(obj.token_id,flag);

      if(flag==='up') { 
        setUpBalance(upBalanceRef.current);
        setInObj(obj);
        inObjRef.current=obj;
      }else 
      {
        outObjRef.current=obj;
        setOutObj(obj);
       } 

      //计算比率： 1UTO=333.22 token
      const key =(inObjRef.current.token_id === -2 ? "eth" : inObjRef.current.token_id === -1 ? "uto" : "token") +
      "_" +(outObjRef.current.token_id === -1 ? "uto" : outObjRef.current.token_id > 0 ? "token" : outObjRef.current.token_id);
    
      const handler = tokenSelectHandlers[key];
      if (handler) {
        const id=++requestSelectId;
        handler(id);
        //计算输出值
        if(tokenValue>0){setToValue(-1); calcStatus(tokenValue, tipValue.value,inObjRef.current.token_id,outObjRef.current.token_id); }
      }
      
    }

    return (
        < >
            <div style={{maxWidth:'800px',margin:'20px auto'}}  > 
                <Card  className='daism-title' >
                    <Card.Header className='d-flex justify-content-between' >
                        <div>{t('transactionText')} </div>
                        <div>GasPrice: <span style={{color:'red',fontSize:'16px',fontWeight:'bold'}} >{gasPrice.toFixed(8)}</span>  gwei</div> 
                    </Card.Header>
                    <Card.Body>   
                        <UpBox upTokenPrice={upTokenPrice} upBalance={upBalance} tokenValue={tokenValue}
                         tipValue={tipValue} inObj={inObj} outObj={outObj} upVita={upVita} inputError={inputError}
                            setTokenValue={setTokenValue}
                            setTipValue={setTipValue}
                            setInputError={setInputError}
                            slectToken={slectToken} 
                            calcStatus={calcStatus}  />
                        <div style={{textAlign:'center'}}><Image height={24} width={24}  alt='' src='/split.svg' /></div>
                        <DownBox downTokenPrice={downTokenPrice} downBalance={downBalance} toValue={toValue}
                            outObj={outObj}  downVita={downVita}
                            slectToken={slectToken}
                            />
                        <StatusBar status={status} setStatus={setStatus} inputError={inputError}  />
                        <div style={{textAlign:'center'}} >
                        <SubmitButton showButton={showButton} inputError={inputError}  inObj={inObj} outObj={outObj} 
                        status={status} tokenValue={tokenValue} tipValue={tipValue} setInputError={setInputError}
                        setStatus={setStatus} upBalance={upBalance} clearStutes={clearStutes} />
                        </div> 
                    {user.connected<1 && <ShowErrorBar errStr={tc('noConnectText')} />}
                    </Card.Body>
                </Card>
               
            </div>
        </>
    )
    }
  