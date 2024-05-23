
import { Card } from 'react-bootstrap';
import MemberItem from './MemberItem';
import { useEffect, useState } from 'react';

export default function EventItem({record,t}) {
    const [isrc,setIsrc]=useState('/logo.svg')
    const months=t('monthText').split(',')
    const aStyle={
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }

    useEffect(()=>{
        if(record && record.top_img){
            if(record.top_img.endsWith('.svg')) {
                fetch(`/api/getimage?path=${record.top_img}`).then(async res=>{if(res.status===200) setIsrc(await res.text())})
            }else setIsrc(`/api/getimage?path=${record.top_img}`)
        }

    },[record])

    const getMonth=()=>{
        let m=new Date(record.start_time)
        return months[m.getMonth()]
    }
    const getDay=()=>{
        let m=new Date(record.start_time)
        return m.getDate()
    }

    const bStyle={
        width:'80px',
        position:'absolute',
        top:'0',
        left:'0',
        borderRadius:'0.3rem',
        backgroundColor:'white'
    }
    return (
        <Card className='m-2' style={{ width: '16rem' }}>
            <div style={{position:'relative'}}>
            <Card.Img  variant="top" style={{height:'10rem'}}  src={isrc} />
            <div className='border' style={bStyle} >
                <div style={{borderRadius:'0.3rem 0.3rem 0 0', backgroundColor:'red',height:'26px'}} ></div>
                <div className='fs-4' style={{textAlign:'center'}} ><strong>{getDay()}{t('dayText')}</strong></div>
                <div className='fs-7 mb-2' style={{textAlign:'center'}} ><strong>{getMonth()}</strong></div>
            </div>
            </div>
            <Card.Body style={{borderTop:'1px solid gray'}} >
               <Card.Title style={aStyle} >{record.title} </Card.Title>
               <MemberItem record={record} noLink={true} ></MemberItem>
            </Card.Body>
        </Card>

    );
}

// style={{width:'4rem',height:'4rem',position:'absolute',,top:'5.8rem',left:'0.2rem',borderRadius:'0.5rem'}}