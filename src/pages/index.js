
import { Card } from 'react-bootstrap'
import UpBox from '../components/iadd/UpBox'
import DownBox from '../components/iadd/DownBox';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import SubmitButton from '../components/iadd/SubmitButton';
import StatusBar from '../components/iadd/StatusBar';
import usePrice from "../hooks/usePrice";
import ShowErrorBar from "../components/ShowErrorBar";
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';


const commulate_abi=require('../lib/contract/data/commulate.json')
const uToken_abi=require('../lib/contract/data/unitToken.json')
const iadd_abi=require('../lib/contract/data/iadd.json')


/**
 * IADD兑换
 */
export default function IADD() {
    const [gasPrice,setGasePrice]=useState(0)  //gas基本费用
    const [priorty,setPriorty]=useState(0)  //矿工费用
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const [comulate,setComulate]=useState()
    const [utoken,setUtoken]=useState()
    const [utokenBalance,setUtokenBalance]=useState('0')
    const [iadd,setIadd]=useState()
    const [netName,setnetName]=useState('')
    const t = useTranslations('iadd')
    const tc = useTranslations('Common')
    const downRef=useRef()
    const upRef=useRef()
    const statusRef=useRef()
    const submitRef=useRef()
    const providerRef=useRef(undefined)
    const price=usePrice()
    const ratioRef=useRef(0.3)   // 滑点值 0.3%
    //合约地址，节点地址node_url ，网络类型 networkName
    const daismAddress=useSelector((state) => state.valueData.daoAddress)
    providerRef.current=new ethers.JsonRpcProvider(daismAddress.node_url)

  
    useEffect(()=>{
        if(user.connected===1 && window.daismDaoapi)
        {
            window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})
        }

        let timeObj
        if(daismAddress?.Commulate) {
           if(user.connected===1 && window.loginProvider){
            setComulate(new ethers.Contract(daismAddress['Commulate'], commulate_abi, window.loginProvider))
            setUtoken(new ethers.Contract(daismAddress['UnitToken'], uToken_abi, window.loginProvider))
            setIadd(new ethers.Contract(daismAddress['_IADD'], iadd_abi, window.loginProvider))
           }
           else {
            setComulate(new ethers.Contract(daismAddress['Commulate'], commulate_abi, providerRef.current))
            setUtoken(new ethers.Contract(daismAddress['UnitToken'], uToken_abi, providerRef.current))
            setIadd(new ethers.Contract(daismAddress['_IADD'], iadd_abi, providerRef.current))
           }

            function getPrice()
            {
                setnetName(daismAddress.networkName);    
                providerRef.current.getFeeData().then(feeData=>{
                    setGasePrice(parseFloat(ethers.formatUnits(feeData.gasPrice,'gwei')))
                    setPriorty(parseFloat(ethers.formatUnits(feeData.maxPriorityFeePerGas,'gwei')))
                })
            }

            timeObj=setInterval(() => { getPrice()}, 30*1000);
            
            getPrice()
        }

        return ()=>{ clearInterval(timeObj) }
    },[daismAddress,user])

    return (
        <PageLayout>
            <div style={{maxWidth:'800px',margin:'8px auto'}} className='mt-1' > 
                <Card  className='daism-title' >
                    <Card.Header className='d-flex justify-content-between' >
                        <div>{t('transactionText')} </div>
                        <div>GasPrice: <span style={{color:'red',fontSize:'16px',fontWeight:'bold'}} >{gasPrice.toFixed(8)}</span>  gwei</div> 
                    </Card.Header>
                    <Card.Body>
                        <UpBox ref={upRef} downRef={downRef} statusRef={statusRef} submitRef={submitRef} user={user} gasPrice={gasPrice} priorty={priorty}
                        comulate={comulate} utoken={utoken} iadd={iadd} price={price} ratioRef={ratioRef} 
                        setUtokenBalance={setUtokenBalance} utokenBalance={utokenBalance}
                        />
                        <div style={{textAlign:'center'}}  >
                            <img height={24} width={24}  alt='' src='/split.svg' />
                        </div>
                        <DownBox ref={downRef} upRef={upRef} statusRef={statusRef} submitRef={submitRef} user={user} comulate={comulate} utoken={utoken} iadd={iadd}
                        setUtokenBalance={setUtokenBalance}  utokenBalance={utokenBalance}  />
                        <StatusBar ref={statusRef} ratioRef={ratioRef} />
                    <div style={{textAlign:'center'}} >
                    <SubmitButton ref={submitRef} upRef={upRef} setUtokenBalance={setUtokenBalance} downRef={downRef} statusRef={statusRef} user={user} ratioRef={ratioRef}  />
                    </div>
                    {user.connected<1 && <ShowErrorBar errStr={tc('noConnectText')} />}
                    </Card.Body>
                </Card>
            </div>
        </PageLayout>
    )
    }

    
export const getStaticProps  = ({ req, res,locale }) => {
    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            ...require(`../messages/iadd/${locale}.json`),
            }
            }
        }
    }
  

  

  