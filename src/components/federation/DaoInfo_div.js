import { Card } from "react-bootstrap";
import ShowAddress from '../ShowAddress';
/**
 * dao 信息展示
 */
export default function DaoInfo_div({record,t}) {  
   
    return (
        <Card className='mb-2 daism-title' >
        <Card.Header>Smart Commons {t('infoText')}</Card.Header>
        <Card.Body>
        <div className='row mb-3 ' >
            <div className='col-auto me-auto d-flex align-items-center ' >
                <img alt={record.dao_name} width={48} height={48} style={{borderRadius:'50%'}}  
                 src={!record.dao_logo || record.dao_logo.length<12?'/logo.svg':record.dao_logo} />
                <div style={{paddingLeft:'10px'}} >
                    <div>{record.dao_name}</div>
                    <div>{record.dao_symbol}</div>
                </div>
            </div>
            <div className='col-auto' >
               <div>{t('daoManagerText')}:</div>
               <ShowAddress address={record.dao_manager} ></ShowAddress>
            </div>
        </div>
        <hr/>
        <div>
            <div style={{textIndent:'2em'}} >{record.dao_desc}</div>
        </div>
        </Card.Body>
        </Card>
    );
}




