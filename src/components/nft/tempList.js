


import { Card, Col, Row,Button,Form } from 'react-bootstrap';
import {FindSvg} from '../../lib/jssvg/SvgCollection'
import { useState } from 'react';
import Preview from './Preview';
import Tempmint from './tempmint';

export default function TempList({tempData,user,t,tc,showError,closeTip,showTip})
{
   
    const [show, setShow] = useState(false); //preview nft 窗口
    const [nftText,setNftText]=useState('')  //nft 内容
    const [previewType,setPreviewType]=useState(true)

   



    return ( 
        <>
          <Form className='mt-2' >
                <Form.Check inline label={t('listTest')} name="group1" type='radio' defaultChecked={previewType} onClick={e=>{setPreviewType(true)}}  id='inline-1' />
                <Form.Check inline label={t('nftText')} name="group1" type='radio' defaultChecked={!previewType} onClick={e=>setPreviewType(false)}  id='inline-2' />
            </Form>
            {previewType?
            <Card className='daism-title'>
                <Card.Header>{t('mynfttemp')}</Card.Header>
                <Card.Body>
                {tempData.map((obj,idx)=>(
                    <Row key={idx} className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                       <Col className='col-auto me-auto' >
                            <img style={{borderRadius:'50%'}}  alt="" width={32} height={32} src={obj.dao_logo?obj.dao_logo:'/logo.svg'} />
                            {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
                        </Col>
                        <Col className='col-auto' ><b>{obj._time}(UTC+8)</b></Col>
                        <Col className='col-auto' style={{width:'140px'}} ><b>ID: {obj.template_id}</b>{obj.is_public?'(public)':'(private)'}</Col>
                        <Col className='col-auto' > <Button  size="sm" variant="info" onClick={e=>{setNftText(JSON.parse(obj.templatesvg)[0].join(''));setShow(true); }}  >
                            <FindSvg size={24} />  {t('previewText')} </Button> </Col>
                        
                       
                        <Col className='col-auto' style={{width:'130px'}} >  <Tempmint obj={obj} showError={showError} 
                        closeTip={closeTip} showTip={showTip} t={t} tc={tc} user={user} /></Col>
                        
                        
                        </Row>
                
                ))
                }
            </Card.Body>
           </Card>
           :<div className='d-flex flex-wrap justify-content-start align-items-center' style={{width:'100%'}}  >
                     {tempData.map((obj,idx)=>(
                           <Card key={`c_${idx}`}  style={{margin:'10px'}}> 
                          
                           <Card.Body>
                           <div className='d-flex justify-content-center align-items-center' style={{width:"260px",height:"260px"}}  dangerouslySetInnerHTML={{__html: JSON.parse(obj.templatesvg)[0].join('')}}></div>
                          
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
           <Preview  show={show} setShow={setShow} nftText={nftText} t={t} />
        </>
    )

}
