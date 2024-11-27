import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
// import { useTranslations } from 'next-intl'
import ProDetail from './ProDetail';
import useProData from '../../hooks/useProData';
import PageItem from '../PageItem';
import ShowErrorBar from '../ShowErrorBar';
import Loadding from '../Loadding';



export default function ProHistory({user,t,tc,st})
{
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const prosData = useProData({currentPageNum,did:user.account,st})  
    return (
        <>
        {prosData.rows.length?<>
                <ProPage prosData={prosData} t={t}/>
                <PageItem records={prosData.total} pages={prosData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={prosData.status} />
            </>
            :prosData.status==='failed'?<ShowErrorBar errStr={prosData.error} />
            :prosData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
            :<Loadding />
        }  
        </>
    );
    
}
function ProPage({prosData,t}){

  const cssType={display:'inline-block',padding:'4px'}

    return <Card className='mt-1 daism-title ' >
            <Card.Header>{t('myProText')}</Card.Header>
            <Card.Body>
                {prosData.rows.map((obj,idx)=>(
                    <Row key={idx} className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col><span style={cssType}>{t('proText')}</span>:<b style={cssType}>{t('proNameText').split(',')[obj.pro_type]}</b></Col>
                        <Col><span style={cssType}>{t('totalText')}</span>:<b> {obj.total_vote} </b> ({t('rights')}:<b>{obj.rights}</b> {t('antirights')}:<b>{obj.antirights}</b>)</Col>
                        <Col><ProDetail obj={obj}  t={t} /> </Col>
                    </Row>
                ))
                }
            </Card.Body>
           </Card>
}

