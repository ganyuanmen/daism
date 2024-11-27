
import Loadding from '../../components/Loadding';
import { Card, Col, Row } from 'react-bootstrap';
import ShowErrorBar from '../../components/ShowErrorBar';
import useMyDaoData from '../../hooks/useMyDaoData';
import Link from 'next/link'
import { useRouter } from "next/router";
import CreateDao from './CreateDao';
import { useState } from 'react';
/**
 * 我的smart common
 */
export default function Daos({user,t,tc,env}) {
    const [refresh,setRefresh]=useState(true)

    const daosData =useMyDaoData(user.account,refresh,setRefresh)
   
    return ( <>
            <CreateDao env={env}  setRefresh={setRefresh}/>
            {daosData.data.length?<DaosPage daosData={daosData} user={user} t={t} tc={tc} />
            :daosData.status==='failed'?<ShowErrorBar errStr={daosData.error} />
            :daosData.status==='succeeded' && !daosData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}


function DaosPage({daosData,user,t,tc})
{
    const { locale } = useRouter()
    return <>
    

     <Card className='daism-title'>
            <Card.Header>{t('daos')}</Card.Header>
            <Card.Body>
                {daosData.data.map((obj,idx)=>(

                    <Link key={idx} className='daism-a' href={`/${locale}/workroom/[id]`} as={`/${locale}/workroom/${obj.dao_id}`}>
                
                    <Row  className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col className='col-auto me-auto' >
                            <img style={{borderRadius:'50%'}}  alt="" width={32} height={32} src={obj.dao_logo?obj.dao_logo:'/logo.svg'} />
                            {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
                        </Col>
                        <Col className='col-auto' ><b>{obj.dao_time}(UTC-8)</b></Col>
                        <Col className='col-auto' ><b>ID: {obj.dao_id}</b></Col>
                        <Col className='col-auto' ><b> {obj.dao_manager.toLowerCase()===user.account.toLowerCase()? t('managerText'): t('originalText')}</b></Col>
                    </Row>
                </Link>
                ))
                }
            </Card.Body>
        </Card>
        </>

}


