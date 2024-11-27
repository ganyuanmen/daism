
import { Alert, Button } from 'react-bootstrap'


import { useDispatch,useSelector} from 'react-redux';
import PageLayout from '../components/PageLayout';
import {getEnv} from '../lib/utils/getEnv'
import Head from 'next/head';
import Wallet from '../components/Wallet';
import {setTipText,setMessageText} from '../data/valueData'
import { getJsonArray } from '../lib/mysql/common';


/**
 * IADD兑换
 */
export default function Honor({locale,env,accountAr,total,nftTotal}) {
  //  console.log("nftTotal",nftTotal)

    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
   
  const click=async ()=>{
    if(!accountAr[user.account.toLowerCase()]){
      if(!nftTotal.minttime || nftTotal.minttime<180)  return  showError(`非白名单地址，待3小时后才能mint, 还差${180-(nftTotal.minttime?nftTotal.minttime:0)}分钟`);
    }
   
    showTip('正在创建荣誉通证，请稍候...')
    try {
      await window.daismDaoapi.Unft.mint();
      showError('荣誉通证创建成功_*_');
    } catch (err) {
      showError("错误："+(err.message ? err.message : err));
    }finally{
      closeTip()
    }
  }
   
    return (<>
      <Head>
            <title>中本聪 荣誉通证</title>
        </Head>
    
    
      <PageLayout env={env} >
        <h3>已经mint: {total.total}, 剩余：{50-total.total} </h3>
   
        <div style={{textAlign:'center'}} className='mt-3' >
          <Wallet env={env} />
          <br/>
         <Button onClick={click} disabled={true}  >中本聪 荣誉通证</Button>
        
        </div>
        <Alert className='mt-3' >
            <ul>
              <li>连接钱包</li>
              <li>单击“中本聪 荣誉通证”按钮</li>
            </ul>

            每个地址只能mint 一次，mint 需要消耗0.02ETH 和当时的gas 费用。
        </Alert>

      </PageLayout>
      </>
    )
}

    
export const getServerSideProps  = async ({locale }) => {
    // const messages = await import(`../messages/shared/${locale}.json`);
    const accountAr=require('../lib/utils/aa.json')
    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            ...require(`../messages/iadd/${locale}.json`),
            },locale,nftTotal:await getJsonArray("minttime",[],true)
            ,env:getEnv(),accountAr, total:await getJsonArray("getnft",[],true),
            }
        }
    }
  

  

  