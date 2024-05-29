import PageItem from "../PageItem";
import Link from 'next/link'
import ShowAddress from "../ShowAddress";
import {Card,Row,Col} from "react-bootstrap";
import TopSearch from "./TopSearch";
import { useTranslations } from 'next-intl'
import { useRouter } from "next/router";

export default function DaosPage({daosData,currentPageNum,setCurrentPageNum,orderType,setOrderType,setOrderField,setSearchText,postStatus,orderIndex, setOrderIndex})
{   
    const t = useTranslations('dao')
    const { locale } = useRouter()
return <> 
            <TopSearch orderType={orderType} orderIndex={orderIndex} setOrderIndex={setOrderIndex}  setOrderType={setOrderType} setOrderField={setOrderField} setCurrentPageNum={setCurrentPageNum}  setSearchText={setSearchText} postStatus={postStatus} />
            {daosData.rows.map((record, idx) => 
                    <Card key={idx} className="mb-2 daism-title ">
                    <Card.Header className="daism-title" >
                    <h4>{record.dao_name}(Valuation Token: {record.dao_symbol})</h4>
                    </Card.Header>
                    <Card.Body >
                        <Row className="mb-2" >
                            <Col className="Col-auto me-auto"  > {t('managerText')}{' '}:{' '}<ShowAddress address={record.dao_manager} /></Col>
                            <Col className="col-auto" >{t('execText')}{' '}:{' '}<ShowAddress address={record.creator} /></Col>
                        </Row>
                        <Row className="mb-3" >
                            
                        <Col className='col-auto d-flex align-items-center'> 
                        <Link className='daism-a' href={`/${locale}/my/[id]`} as={`/${locale}/my/${record.dao_id}`}>
                            <img alt="" style={{borderRadius:'50%'}} width={64} height={64} src={!record.dao_logo || record.dao_logo.length<12?'/logo.svg':record.dao_logo} />
                            </Link>
                        </Col>
                       
                        <Col className='Col-auto me-auto' >
                        <style jsx>{`
                            .daismdaodesctext {
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 3;
                                overflow: hidden;
                                padding-right:0;
                            } 
                            `}</style>
                          <div className="daismdaodesctext" >  {record.dao_desc}</div>
                            </Col>
                        </Row>
                        <Row style={{fontSize:'0.8rem'}} >
                            <Col style={{textAlign:'left'}} className='col-auto' >{t('createTimeText')}： {record.block_num}</Col>
                            <Col style={{textAlign:'center'}}  className='Col-auto me-auto' >{t('coinPriceText')}： {record.utoken_cost} Vita</Col>
                            <Col style={{textAlign:'right'}} className='col-auto' >{t('rankingText')}： {record.dao_ranking}</Col>
                        </Row>
                    </Card.Body>
                  </Card>
                )
            }
                <PageItem  records={daosData.total} pages={daosData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={postStatus} />
      
        </>

}