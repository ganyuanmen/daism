import { useState } from 'react';
import { Col, Row,Button,Modal } from 'react-bootstrap';
import { EventsSvg  } from "../../lib/jssvg/SvgCollection"
import useProDetail from '../../hooks/useProDetail';
// import { client } from '../../lib/api/client';



export default function ProDetail({obj,t}){
    const cssType={display:'inline-block',padding:'4px'}
    const [show,setShow]=useState(false)
    const daoMember=useProDetail({daoId:obj.dao_id,delegator:obj.delegator,createTime:obj.createTime})

    return <> <Button size="sm" variant="primary" onClick={e=>{setShow(true)}} ><EventsSvg size={16} /> {t('detail')} </Button> 
             <Modal className='daism-title'  size="lg" show={show} onHide={(e) => {setShow(false)}} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
            
               <Row  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                    <Col>  <img height={32} width={32} alt='' src={obj.dao_logo?obj.dao_logo:'/logo.svg'} style={{borderRadius:'50%'}} />{'  '}
                        <b>{obj.dao_name}({obj.dao_symbol})</b>
                    </Col>                   
                </Row>
                <Row  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                    <Col>{obj.daodesc}</Col>
                </Row>

                <Row  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col><span style={cssType}>{t('proText')}</span>:<b style={cssType}>{t('proNameText').split(',')[obj.pro_type]}</b></Col>
                        <Col><span style={cssType}>{t('totalText')}</span>:<b> {obj.total_vote} </b> ({t('rights')}:<b>{obj.rights}</b> {t('antirights')}:<b>{obj.antirights}</b>)</Col>
                </Row>

                <Row  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col><span style={cssType}>{t('lifetime')}</span>:<b>{obj.lifetime>0?`${obj.lifetime}${t('days')}`:t('alreadydays')}</b></Col>
                        <Col><span style={cssType}>{t('strategy')}</span>:<b>{obj.strategy}</b>% </Col>
                </Row>
               
                {daoMember.map((obj,idx)=>(
                    <Row key={idx} className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col className='Col-auto me-auto' >{obj.member_address}{'--->'}{obj.member_votes}</Col>
                        <Col className='col-auto' >{t('rights')}:<b>{obj.rights>obj.member_votes?obj.member_votes:obj.rights}</b>{'   '} {t('antirights')}
                        :<b>{obj.antirights>obj.member_votes?obj.member_votes:obj.antirights}</b></Col>
                    </Row>
                ))
                }
                <br/>
                <h4>{t('proContent')}：</h4>
                <Logs obj={obj} t={t} />
            </Modal.Body>
            </Modal>
           </>

}

function Logs({obj,t})
{
   
    if(obj.pro_type===0)
        return <div>{t('delMember')} :{obj.account}</div>
    // else if(obj.pro_type===1)
        // return <div><img width={32} height={32} src={ologo?ologo:'/logo.svg'} alt=''/> <span style={{display:'inline-block',padding:"4px 12px"}} >-to-</span> <img width={32} height={32} src={clogo} alt='' /></div>
    else if(obj.pro_type===2)
        return <div>{obj.dao_desc}</div>
    else if(obj.pro_type===3)
        return <div>{t('newManagerText')} :{obj.account}</div>
    else if(obj.pro_type===4)
        return <div>{t('changeStrategyText')}({t('strategy')}) :{parseInt(obj.dividendRights/65535*100)} %</div>
    else if(obj.pro_type===5)
        return (<>
        <div>{t('memberAdd')} :{' '} {obj.account}</div>
        <div>{t('memberVoteText')} :{' '}{obj.dividendRights}</div>
        </>)
    else if(obj.pro_type===6)
        return (<>
         <div>{t('memberEdit')} :{obj.account}</div>
         <div>{t('memberVoteText')} :{' '}{obj.dividendRights}</div>
         </>)
}