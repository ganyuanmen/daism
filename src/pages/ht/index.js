import {Container,Row,Col,Card} from 'react-bootstrap';
import { useSelector,useDispatch } from 'react-redux';
import ShowErrorBar from '../../components/ShowErrorBar';
import { SwapSvg,TokenSvg,Honor } from '../../lib/jssvg/SvgCollection';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react';
import Mynft from '../../components/nft/mynft'
import Mytemplate from '../../components/nft/mytemplate';
import Templates from '../../components/nft/templates';
import {setTipText,setMessageText} from '../../data/valueData'
import Wecome from '../../components/federation/Wecome';

export default function NFT() {
    const t = useTranslations('nft')
    const tc = useTranslations('Common')
    const imgAr = [<Honor/>,<SwapSvg/>,<SwapSvg/>] //菜单logo
    const myMenu=[t('mynft'),t('mytemplate'),t('publicTemplate')] //菜单
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    useEffect(()=>{
        let a=window.location.hash.substring(1)
        setActiveTab(parseInt(a?a:0))
    },[setActiveTab])
    
  
    const cStyle={fontWeight:'bold',textAlign:'center'}
    return (
        <PageLayout>
        {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
        :!loginsiwe? <Wecome />
        :<>
            <Container>
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
                {activeTab === 0 && <Mynft user={user} t={t} tc={tc} showError={showError} closeTip={closeTip} showTip={showTip} />}
                {activeTab === 1 && <Mytemplate user={user} t={t} tc={tc} showError={showError} closeTip={closeTip} showTip={showTip}  />}
                {activeTab === 2 && <Templates user={user}  t={t} tc={tc} showError={showError} closeTip={closeTip} showTip={showTip} />}
            </Container>
        </>
        }  
        </PageLayout>
    );
}



export const getStaticProps = ({ req, res,locale }) => {  
    
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/nft/${locale}.json`),
          ...require(`../../messages/federation/${locale}.json`),
        }
      }
    }
  }

    
