import {Container,Row,Col,Card} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ShowErrorBar from '../../components/ShowErrorBar';
import { SwapSvg,TokenSvg,DaoSvg,AppSvg } from '../../lib/jssvg/SvgCollection';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import { useState } from 'react';
import Logs from '../../components/my/Logs'
import Tokens from '../../components/my/Tokens'
import Daos from '../../components/my/Daos'
import Proposal from '../../components/my/Pro';
import { useEffect } from 'react';
import {getEnv} from '../../lib/utils/getEnv'
import Head from 'next/head';

/**
 * 工作室
 */
export default function MyDao({locale,env}) {
    const t = useTranslations('my')
    const tc = useTranslations('Common')
    const imgAr = [<TokenSvg/>,<SwapSvg/>,<DaoSvg/>,<AppSvg/>] //菜单logo
    const myMenu=[t('tokens'),t('records'),t('daos'),t('pro')] //菜单
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const [utokenBalance,setUtokenBalance]=useState('0')
    const [activeTab, setActiveTab] = useState(0);
    
   
    useEffect(()=>{
        if(user.connected===1 && window.daismDaoapi)
        {
            window.daismDaoapi.UnitToken.balanceOf(user.account).then(utokenObj=>{setUtokenBalance(utokenObj.utoken)})
        }
            
    },[user])
    useEffect(()=>{
        let a=window.location.hash.substring(1)
        setActiveTab(parseInt(a?a:0))
    },[setActiveTab])
    
    const cStyle={fontWeight:'bold',textAlign:'center'}
    return ( <>
        <Head>
            <title>{tc('workTitle')}</title>
        </Head>
        <PageLayout env={env}>
        {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
        :<>
            <Container>
                <Row className='justify-content-between mt-3 mb-3' style={{marginTop:'0.5rem'}} >
                    <Col style={cStyle} >{ethBalance}&nbsp;ETH</Col>
                    <Col style={cStyle}>{utokenBalance}&nbsp;UTO</Col>
                </Row>
                <Card className='mb-3' > 
                    <Row className="justify-content-between">
                    {myMenu.map((placement, idx) => (
                        <Col key={idx} style={cStyle} >  
                            <a className={`daism-a ${activeTab===idx?'daism-mydao-menu-active':''}`} href={`#${idx}`} onClick={()=>{setActiveTab(idx)}} >
                               <div className='p-2' > 
                               <div className='daism-color' >{imgAr[idx]}</div>
                               {placement}</div>
                            </a>
                        </Col>
                    ))}
                    </Row>
                </Card>
            </Container>
            <Container>
                {activeTab === 0 && <Tokens user={user} t={t} tc={tc} />}
                {activeTab === 1 && <Logs user={user} tx_url={env.tx_url} t={t} tc={tc} />}
                {activeTab === 2 && <Daos env={env}  user={user} t={t} tc={tc} />}
                {activeTab === 3 && <Proposal user={user} tc={tc} />}
            </Container>
        </>
        }  
        </PageLayout>
        </>
    );
}



// export const getServerSideProps = ({ locale }) => {  
    export const getStaticProps = ({ locale }) => {  
    
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/my/${locale}.json`),
          ...require(`../../messages/dao/${locale}.json`),
        },locale
        ,env:getEnv()
      }
    }
  }

    
