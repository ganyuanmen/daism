
import Loadding from '../../components/Loadding';
import { Card, Col, Row,Button,Form } from 'react-bootstrap';
import ShowErrorBar from '../../components/ShowErrorBar';
import getMynft from '../../hooks/useMynft';
import { useState } from 'react';
import Nftmint from './Nftmint';
import Preview from './Preview';
import {FindSvg} from '../../lib/jssvg/SvgCollection'


export default function Mynft({user,t,tc,showError,closeTip,showTip}) {
    const mynftData =getMynft(user.account) 

    return ( <>
            <Nftmint showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} user={user} />
            {mynftData.data.length?<Nftlist mynftData={mynftData} showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} />
            :mynftData.status==='failed'?<ShowErrorBar errStr={mynftData.error} />
            :mynftData.status==='succeeded' && !mynftData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}


function Nftlist({mynftData,closeTip,showTip,showError,t,tc})
{
    const [show, setShow] = useState(false); //预览 窗口
    const [nftText,setNftText]=useState('')  //nft 内容

    const [previewType,setPreviewType]=useState(true)


    
    return ( 
            <>  
            <Form className='mt-2' >
                <Form.Check inline label={t('listTest')} name="group1" type='radio' defaultChecked={previewType} onClick={e=>{setPreviewType(true)}}  id='inline-1' />
                <Form.Check inline label={t('nftText')} name="group1" type='radio' defaultChecked={!previewType} onClick={e=>setPreviewType(false)}  id='inline-2' />
            </Form>

                {previewType?
                <Card className='daism-title mt-2 '>
                <Card.Header>{t('myNftText')}</Card.Header>
                <Card.Body>
                    {mynftData.data.map((obj,idx)=>(
                        <Row key={idx}  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col className='col-auto me-auto' >
                                <img style={{borderRadius:'50%'}}  alt="" width={32} height={32} src={obj.dao_logo?obj.dao_logo:'/logo.svg'} />
                                {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
                            </Col>
                            <Col className='col-auto' ><b>{obj._time}</b></Col>
                            <Col className='col-auto' ><b>ID: {obj.token_id}</b></Col>
                            <Col className='col-auto' > <Button  size="sm" variant="info" onClick={e=>{setNftText(obj.tokensvg);setShow(true);}} ><FindSvg size={24} /> {t('previewText')} </Button> </Col>
                        </Row>
                    ))
                    }
                </Card.Body>
                </Card>
                :<div className='d-flex flex-wrap justify-content-start align-items-center' style={{width:'100%'}}  >
                     {mynftData.data.map((obj,idx)=>(
                           <Card key={`c_${idx}`}  style={{margin:'10px'}}> 
                          
                           <Card.Body>
                           <div className='d-flex justify-content-center align-items-center' style={{width:"260px",height:"260px"}}  dangerouslySetInnerHTML={{__html: obj.tokensvg}}></div>
                          
                           <div style={{width:"260px",paddingTop:"10px"}}>
                           <img style={{borderRadius:'50%'}}  alt="" width={32} height={32} src={obj.dao_logo?obj.dao_logo:'/logo.svg'} />
                                {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
                           </div>
                           </Card.Body>
                           </Card>
                        ))
                        }

                 
                </div>
                }
                <Preview show={show} setShow={setShow} nftText={nftText} t={t} />
           </>
    )

}
