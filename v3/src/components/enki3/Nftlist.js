import { Card,Row,Col,Modal,Table  } from 'react-bootstrap';
import ShowAddress from '../../components/ShowAddress';
import { useState } from 'react';




export default function Nftlist({mynftData,t})
{

    const [show,setShow]=useState(false)
    const [nftObj,setNftObj]=useState({})
   
    const svgToBase=(svgCode)=> {
	    const utf8Bytes = new window.TextEncoder().encode(svgCode);
	    return 'data:image/svg+xml;base64,' +window.btoa(String.fromCharCode.apply(null, utf8Bytes));
	  }

    const geneTips=(tips)=>{
        if(tips && tips.startsWith('[')) {
            let _json= JSON.parse(tips)
            return _json[0]+'...'
        }
        return tips
    }
    
    const showwin=(obj)=>{
       setNftObj(obj)
       setShow(true)

    }
    let rows=[2,2,5]
    return ( 
            <>  
          <div className='d-flex flex-wrap justify-content-start align-items-center' style={{width:'100%'}}  >
                {mynftData.map((obj,idx)=>(
                <div key={`c_${idx}`} style={{width:'320px'}} >
                    <Card   style={{margin:'10px'}}> 
                    <Card.Body>
                    <img src={svgToBase(obj.tokensvg)} style={{width:'270px',height:'270px',borderRadius:'50%'}} />
                    <div className='daism-nowrap'>owner: <ShowAddress address={obj.to_address} isb={true} /> </div> 
                    <div  >
                    <Row>
                    <Col className="Col-auto me-auto"  > ID:<b> {obj.token_id}</b></Col>
                    <Col className="col-auto" > <a className='pull-right'  href='#' onClick={e=>showwin(obj)} >show more</a> </Col>
                    </Row>
                    </div> 
                    <div className='daism-nowrap'>blockNumber:<b>{obj.block_num}</b></div> 
                    <div className='daism-nowrap'>contract:<ShowAddress address={obj.contract_address} isb={true} /></div> 
                    <div className='daism-nowrap'>time:<b>{obj._time}(UTC+8)</b></div> 
                    <div className='daism-nowrap'>issue: <b>{obj._type!==0?obj.dao_name:'daism.io'}</b></div>
                    <div className='daism-nowrap'  >events: <b>{geneTips(obj.tips)}</b></div>
                    </Card.Body>
                    </Card>
                </div>
                ))
                }
            </div>
            <Modal className='daism-title'  size="lg" show={show} onHide={(e) => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Card   style={{margin:'10px'}}> 
                    <Card.Body>
                        <div style={{textAlign:'center'}} >
                         <img src={svgToBase(nftObj?.tokensvg)} style={{width:'270px',height:'270px',borderRadius:'50%'}} />
                        </div>
                        <Table striped bordered hover style={{width:'100%',marginTop:'4px'}} >
                        <tbody>
                        <tr><td style={{ textAlign: 'right' }} >owner</td><td><b>{nftObj?.to_address}</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }}>ID</td><td><b>{nftObj?.token_id}</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }}>blockNumber</td><td><b>{nftObj?.block_num}</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }}>contract address</td><td><b>{nftObj?.contract_address}</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }} >nft time</td><td><b>{nftObj?._time}(UTC+8)</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }} >issue</td><td><b>{nftObj._type!==0?nftObj.dao_name:'daism.io'}</b></td></tr>
                        <tr><td style={{ textAlign: 'right' }} >events</td><td>
                        <b>{nftObj?.tips}</b>
                        {/* {nftObj._type!==0?<b>{nftObj?.tips}</b>:
                        <ul>
                            {JSON.parse(nftObj?.tips).map((text,idx)=><li key={idx} >{text}</li>)}
                        </ul>
                        } */}
                        </td></tr>
                      
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
             
            </Modal.Body>
            </Modal>
                
               
           </>
    )

}
