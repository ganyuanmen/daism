
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
import {getEnv} from '../lib/utils/getEnv'

const commulate_abi=require('../lib/contract/data/commulate.json')
const uToken_abi=require('../lib/contract/data/unitToken.json')
const iadd_abi=require('../lib/contract/data/iadd.json')

/**
 * IADD兑换
 */
export default function IADD({locale,env}) {
    const [gasPrice,setGasePrice]=useState(0)  //gas基本费用
    const [priorty,setPriorty]=useState(0)  //矿工费用
    const [isTip, setIsTip] = useState(false); //是否显示打赏
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const [comulate,setComulate]=useState()
    const [utoken,setUtoken]=useState()
    const [utokenBalance,setUtokenBalance]=useState('0')
    const [iadd,setIadd]=useState()
     
    const t = useTranslations('iadd')
    const tc = useTranslations('Common')
    const downRef=useRef()
    const upRef=useRef()
    const tipRef=useRef()  //打赏窗口
    const statusRef=useRef()
    const submitRef=useRef()
    const providerRef=useRef(new ethers.JsonRpcProvider(env.node_url))
    const price=usePrice()
    const ratioRef=useRef(0.3)   // 滑点值 0.3%
   
    const [outobj, setOutobj] = useState({ btext: t('selectTokenText'), blogo: '', token_id: 0 }) //下选择对象，输出对象
  
    useEffect(()=>{
        if(user.connected===1 && window.daismDaoapi){
            window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})
        }

        let timeObj
        if(env?.Commulate) {
           if(user.connected===1 && window.loginProvider){
            setComulate(new ethers.Contract(env['Commulate'], commulate_abi, window.loginProvider))
            setUtoken(new ethers.Contract(env['UnitToken'], uToken_abi, window.loginProvider))
            setIadd(new ethers.Contract(env['_IADD'], iadd_abi, window.loginProvider))
           }
           else {
            setComulate(new ethers.Contract(env['Commulate'], commulate_abi, providerRef.current))
            setUtoken(new ethers.Contract(env['UnitToken'], uToken_abi, providerRef.current))
            setIadd(new ethers.Contract(env['_IADD'], iadd_abi, providerRef.current))
           }

            function getPrice()
            {
                // setnetName(env.networkName);    
                providerRef.current.getFeeData().then(feeData=>{
                    setGasePrice(parseFloat(ethers.formatUnits(feeData.gasPrice,'gwei')))
                    setPriorty(parseFloat(ethers.formatUnits(feeData.maxPriorityFeePerGas,'gwei')))
                },err=>{
                    console.error(err)
                })
            }

            timeObj=setInterval(() => { getPrice()}, 30*1000);
            
            getPrice()
        }

        return ()=>{ clearInterval(timeObj) }
    },[env,user])

    return (
        <PageLayout env={env} >
            <div style={{maxWidth:'800px',margin:'20px auto'}}  > 
                <Card  className='daism-title' >
                    <Card.Header className='d-flex justify-content-between' >
                        <div>{t('transactionText')} </div>
                        <div>GasPrice: <span style={{color:'red',fontSize:'16px',fontWeight:'bold'}} >{gasPrice.toFixed(8)}</span>  gwei</div> 
                    </Card.Header>
                    <Card.Body>    {/* 此处outObj 用于tipWin */}
                        <UpBox ref={upRef} outobj={outobj} downRef={downRef} statusRef={statusRef} submitRef={submitRef} user={user} gasPrice={gasPrice} priorty={priorty}
                        comulate={comulate} utoken={utoken} iadd={iadd} price={price} ratioRef={ratioRef}  tipRef={tipRef}
                        setUtokenBalance={setUtokenBalance} utokenBalance={utokenBalance} isTip={isTip} setIsTip={setIsTip}
                        />
                        <div style={{textAlign:'center'}}  >
                            <img height={24} width={24}  alt='' src='/split.svg' />
                        </div>
                        <DownBox ref={downRef} outobj={outobj} setOutobj={setOutobj}  upRef={upRef} statusRef={statusRef} submitRef={submitRef} user={user} comulate={comulate} utoken={utoken} iadd={iadd}
                        setUtokenBalance={setUtokenBalance}  utokenBalance={utokenBalance} isTip={isTip} setIsTip={setIsTip} />
                        <StatusBar ref={statusRef} ratioRef={ratioRef} />
                    <div style={{textAlign:'center'}} >
                    <SubmitButton ref={submitRef}  utoken={utoken} comulate={comulate} isTip={isTip} tipRef={tipRef} upRef={upRef} setUtokenBalance={setUtokenBalance} downRef={downRef} statusRef={statusRef} user={user} ratioRef={ratioRef}  />
                    </div>
                    {user.connected<1 && <ShowErrorBar errStr={tc('noConnectText')} />}
                    </Card.Body>
                </Card>
            </div>
        </PageLayout>
    )
    }

    
export const getStaticProps  = async ({locale }) => {
    // export const getServerSideProps  = async ({locale }) => {
    // const messages = await import(`../messages/shared/${locale}.json`);

    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            ...require(`../messages/iadd/${locale}.json`),
            },locale
            ,env:getEnv()
            }
        }
    }
  

  

  