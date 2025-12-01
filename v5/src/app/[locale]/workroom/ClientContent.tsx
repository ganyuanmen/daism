"use client";

import {Container,Row,Col,Card} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ShowErrorBar from '@/components/ShowErrorBar';
import { SwapSvg,TokenSvg,DaoSvg,AppSvg } from '@/lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import { useState } from 'react';
import Logs from './Logs'
import Tokens from './Tokens'
import Daos from './Daos'
import Proposal from './Pro';
import { useEffect } from 'react';
import {type RootState} from '@/store/store'
import { useLayout } from '@/contexts/LayoutContext';
import Loading from '@/components/Loadding';


/**
 * 工作室
 */
export default function ClientContentWorkHome() {
    const t = useTranslations('my')
    const tc = useTranslations('Common')
    const imgAr = [
        <TokenSvg key="token" />,
        <SwapSvg key="swap" />,
        <DaoSvg key="dao" />,
        <AppSvg key="app" />
      ]; //菜单logo
    const myMenu=[t('tokens'),t('records'),t('daos'),t('pro')] //菜单
    const user = useSelector((state:RootState) => state.valueData.user) //钱包用户信息
    const ethBalance = useSelector((state:RootState) => state.valueData.ethBalance)
    const utoBalance = useSelector((state:RootState) => state.valueData.utoBalance)
    const {isShowBtn} =useLayout();
    const [activeTab, setActiveTab] = useState(0);
   
      useEffect(() => {
        const hash = window.location.hash.substring(1); // string
        setActiveTab(parseInt(hash || "0", 10)); // 默认用 "0"
      
      }, []);
    
      const cStyle: React.CSSProperties = { fontWeight: 'bold', textAlign: 'center' };
    return ( 
    <>
    { isShowBtn?
        <>
            {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
            :<>
                <Container>
                    <Row className='justify-content-between mt-3 mb-3' style={{marginTop:'0.5rem'}} >
                        <Col style={cStyle} >{ethBalance}&nbsp;ETH</Col>
                        <Col style={cStyle}>{utoBalance}&nbsp;UTO</Col>
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
                    {activeTab === 0 && <Tokens  />}
                    {activeTab === 1 && <Logs user={user}  />}
                    {activeTab === 2 && <Daos />}
                    {activeTab === 3 && <Proposal />}
                </Container>
            </>
            }  

        </>:<Loading />
    }
    </>
    );
}


