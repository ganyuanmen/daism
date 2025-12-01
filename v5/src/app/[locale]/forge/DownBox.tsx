import {useState} from "react";
import {Card, Col,Row,Button } from "react-bootstrap";
import RecordItem from "./RecordItem";
import Spinner from 'react-bootstrap/Spinner';
import { useTranslations } from 'next-intl'
import SwapWindow from "./SwapWindow";
import iaddStyle from "@/styles/iadd.module.css";
import ImageWithFallback from "@/components/ImageWithFallback";

 interface DownBoxProps{
  toValue:number;
  outObj:DaismToken;
  downVita:string;
  downBalance:string;
  downTokenPrice:string;
  slectToken:(obj:DaismToken,flag:'up'|'down')=>void;
}

export default function DownBox({slectToken, downTokenPrice,toValue,outObj,downBalance,downVita}:DownBoxProps) {

    const [show, setShow] = useState(false);
    const t = useTranslations('iadd')

    const selectToken=async (obj:DaismToken)=>{slectToken(obj,'down');}
    return (
        <> 
        <Card className='mb-2 mt-2' >
            <Card.Body style={{backgroundColor:'#F5F6FC'}}>
              <RecordItem title={t("outputText")} balance={downBalance} />
                <Row className="align-items-center" >
                    <Col className="Col-auto me-auto" >
                        {toValue===-1?<Spinner animation="border"  variant="primary" />:
                        <input readOnly style={{backgroundColor:'transparent',color:toValue>0?'#0D111C':'red', fontSize: '2rem', border: 0,outline:'none',width:'100%',minWidth:'120px'}} 
                         placeholder ='0.0' value={toValue} />}
                    </Col>
                    <Col className="col-auto" >
                    <Button className={iaddStyle.iadd_btn} variant="outline-secondary" onClick={() => setShow(true)} size="lg">
                        {outObj.dao_logo && <ImageWithFallback alt="" width={24} height={24} src={outObj.dao_logo} />}
                        <span style={{ display: "inline-block", padding: "0 4px", fontSize: "20px", color: "#0D111C" }}>
                            {outObj.dao_symbol}</span>
                        <ImageWithFallback alt="" width={24} height={24} src="/down.svg" />
                    </Button>
                    </Col>
                </Row>
                <Row > 
                <Col className='Col-auto me-auto' >
                    <div style={{color:'#7780A0',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                    <div style={{paddingRight:'4px'}} >jeedd</div>
                    <div style={{paddingTop:'2px'}} ><span>{downVita}</span></div>
                    </div>
                </Col> 
                <Col  className="col-auto" >
                     <div style={{color:'#984c0c',fontSize:'14px',display:'flex',alignItems:'center'}}  >
                    <div style={{paddingRight:'4px'}}>jeedd</div>
                    <div style={{paddingTop:'2px',marginRight:'8px'}} ><span>{downTokenPrice}</span></div>
                    </div>
                </Col>
                </Row>
            </Card.Body>
            </Card>
            <SwapWindow workspace="down" show={show} setShow={setShow} selectToken={selectToken} />
            </> 
    )
}





